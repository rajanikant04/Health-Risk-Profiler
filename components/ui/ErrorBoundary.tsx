'use client';

import React, { Component, ReactNode } from 'react';
import { Alert, Button } from './EnhancedComponents';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service
    this.logErrorToService(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: any) => {
    // In production, send to error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Example: Send to error reporting service
    // errorReportingService.captureException(error, {
    //   extra: errorInfo,
    //   tags: {
    //     component: 'ErrorBoundary'
    //   }
    // });
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
          <div className="max-w-md w-full">
            <Alert type="error" title="Something went wrong">
              <div className="space-y-4">
                <p>
                  We're sorry, but something unexpected happened. This error has been logged and we'll work to fix it.
                </p>
                
                {this.props.showDetails && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">
                      Technical Details
                    </summary>
                    <div className="mt-2 p-3 bg-secondary-100 rounded text-xs font-mono overflow-auto max-h-32">
                      <div className="text-danger-600">
                        {this.state.error.name}: {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <pre className="mt-2 text-secondary-600 whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex space-x-3">
                  <Button onClick={this.handleRetry} size="sm">
                    Try Again
                  </Button>
                  <Button onClick={this.handleReload} variant="secondary" size="sm">
                    Reload Page
                  </Button>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API Error Boundary for API-specific errors
interface APIErrorBoundaryProps extends ErrorBoundaryProps {
  onRetry?: () => void;
  retryButtonText?: string;
}

export function APIErrorBoundary({ 
  children, 
  onRetry, 
  retryButtonText = "Retry Request",
  ...props 
}: APIErrorBoundaryProps) {
  return (
    <ErrorBoundary
      {...props}
      fallback={
        <Alert type="error" title="API Error">
          <div className="space-y-3">
            <p>Failed to load data. Please check your connection and try again.</p>
            {onRetry && (
              <Button onClick={onRetry} size="sm">
                {retryButtonText}
              </Button>
            )}
          </div>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// OCR Error Boundary for OCR-specific errors
export function OCRErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  return (
    <ErrorBoundary
      {...props}
      fallback={
        <Alert type="error" title="OCR Processing Error">
          <div className="space-y-3">
            <p>Failed to process the uploaded image. This could be due to:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Poor image quality or low resolution</li>
              <li>Unsupported file format</li>
              <li>Network connectivity issues</li>
              <li>Processing timeout</li>
            </ul>
            <p className="text-sm">
              Please try uploading a clearer image or use manual entry instead.
            </p>
          </div>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Form Error Boundary for form-specific errors
export function FormErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  return (
    <ErrorBoundary
      {...props}
      fallback={
        <Alert type="warning" title="Form Error">
          <div className="space-y-3">
            <p>There was an issue with the form. Please refresh the page and try again.</p>
            <p className="text-sm">
              If the problem persists, you can try clearing your browser cache or contacting support.
            </p>
          </div>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
}