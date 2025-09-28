import React from 'react';
import { ZodError } from 'zod';

// Error types enum
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  API = 'API',
  OCR = 'OCR',
  NETWORK = 'NETWORK',
  FILE_UPLOAD = 'FILE_UPLOAD',
  PROCESSING = 'PROCESSING',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.VALIDATION, 400, true, details);
    this.name = 'ValidationError';
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message, ErrorType.API, statusCode, true, details);
    this.name = 'APIError';
  }
}

export class OCRError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.OCR, 422, true, details);
    this.name = 'OCRError';
  }
}

export class FileUploadError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.FILE_UPLOAD, 400, true, details);
    this.name = 'FileUploadError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed') {
    super(message, ErrorType.NETWORK, 0, true);
    this.name = 'NetworkError';
  }
}

// Error handler utility functions
export class ErrorHandler {
  // Handle API response errors
  static handleAPIResponse(response: Response, data?: any): void {
    if (!response.ok) {
      let message = 'An error occurred';
      let details = data;

      switch (response.status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Authentication required.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 422:
          message = 'Unable to process the request. Please check your data.';
          break;
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          message = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          message = `Request failed with status ${response.status}`;
      }

      throw new APIError(message, response.status, details);
    }
  }

  // Handle fetch errors
  static async handleFetch(
    url: string, 
    options?: RequestInit
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network connection failed. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Handle Zod validation errors
  static handleZodError(error: ZodError): ValidationError {
    const errorMessages = error.issues.map((err: any) => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    });

    return new ValidationError(
      'Validation failed',
      {
        fields: errorMessages,
        zodError: error.issues
      }
    );
  }

  // Handle file upload errors
  static validateFileUpload(file: File, config: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): void {
    const { maxSize, allowedTypes, allowedExtensions } = config;

    if (maxSize && file.size > maxSize) {
      throw new FileUploadError(
        `File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`,
        { fileSize: file.size, maxSize }
      );
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new FileUploadError(
        `File type '${file.type}' is not supported. Allowed types: ${allowedTypes.join(', ')}`,
        { fileType: file.type, allowedTypes }
      );
    }

    if (allowedExtensions) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new FileUploadError(
          `File extension '.${fileExtension}' is not supported. Allowed extensions: ${allowedExtensions.join(', ')}`,
          { fileExtension, allowedExtensions }
        );
      }
    }
  }

  // Handle OCR errors
  static handleOCRError(error: any, context?: any): OCRError {
    let message = 'OCR processing failed';
    let details = context;

    if (error.message) {
      if (error.message.includes('confidence')) {
        message = 'OCR confidence too low. Please try a clearer image.';
      } else if (error.message.includes('timeout')) {
        message = 'OCR processing timed out. Please try a smaller image.';
      } else if (error.message.includes('memory')) {
        message = 'Image too large for processing. Please use a smaller image.';
      } else {
        message = `OCR Error: ${error.message}`;
      }
    }

    return new OCRError(message, { ...details, originalError: error.message });
  }

  // Get user-friendly error message
  static getUserFriendlyMessage(error: any): string {
    if (error instanceof AppError) {
      return error.message;
    }

    if (error instanceof ZodError) {
      return 'Please check your input and try again.';
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network connection failed. Please check your internet connection.';
    }

    // Generic fallback
    return 'An unexpected error occurred. Please try again.';
  }

  // Log errors (for debugging and monitoring)
  static logError(error: any, context?: any): void {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: error instanceof AppError ? error.type : 'UNKNOWN'
      },
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };

    console.error('Application Error:', errorInfo);

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(error, errorInfo);
    }
  }

  // Create retry handler
  static createRetryHandler<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): () => Promise<T> {
    return async (): Promise<T> => {
      let lastError: any;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          
          // Don't retry on certain error types
          if (error instanceof ValidationError || error instanceof FileUploadError) {
            throw error;
          }

          if (attempt === maxRetries) {
            break;
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }

      throw lastError;
    };
  }
}

// React hook for error handling
export function useErrorHandler() {
  const handleError = (error: any, context?: any) => {
    ErrorHandler.logError(error, context);
    
    // You can add toast notifications here
    // toast.error(ErrorHandler.getUserFriendlyMessage(error));
    
    return ErrorHandler.getUserFriendlyMessage(error);
  };

  const validateAndHandleFile = (file: File, config: Parameters<typeof ErrorHandler.validateFileUpload>[1]) => {
    try {
      ErrorHandler.validateFileUpload(file, config);
      return { success: true };
    } catch (error) {
      const message = handleError(error, { fileName: file.name, fileSize: file.size });
      return { success: false, error: message };
    }
  };

  const handleAPICall = async <T>(
    apiCall: () => Promise<T>,
    options?: {
      retries?: number;
      context?: any;
    }
  ): Promise<{ data?: T; error?: string; success: boolean }> => {
    try {
      const operation = options?.retries 
        ? ErrorHandler.createRetryHandler(apiCall, options.retries)
        : apiCall;
      
      const data = await operation();
      return { data, success: true };
    } catch (error) {
      const message = handleError(error, options?.context);
      return { error: message, success: false };
    }
  };

  return {
    handleError,
    validateAndHandleFile,
    handleAPICall
  };
}

// Error boundary helpers
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: any
) => {
  return (props: P) => {
    const { ErrorBoundary } = require('./ErrorBoundary');
    return React.createElement(
      ErrorBoundary,
      errorBoundaryProps,
      React.createElement(Component, props)
    );
  };
};