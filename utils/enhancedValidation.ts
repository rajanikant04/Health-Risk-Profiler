import { z } from 'zod';
import { ErrorHandler, ValidationError } from './errorHandling';

// Enhanced validation schemas with better error messages
export const createEnhancedSurveySchema = () => z.object({
  age: z.number({
    message: "Age is required and must be a number"
  }).min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
  
  smoker: z.enum(['yes', 'no', 'former'], {
    message: "Smoking status is required"
  }),
  
  exercise: z.string({
    message: "Exercise information is required"
  }).min(1, "Please provide exercise information"),
  
  diet: z.string({
    message: "Diet information is required"
  }).min(1, "Please provide diet information"),
  
  weight: z.number({
    message: "Weight must be a number"
  }).min(20, "Weight seems too low").max(500, "Weight seems too high").optional(),
  
  height: z.number({
    message: "Height must be a number"
  }).min(50, "Height seems too low").max(300, "Height seems too high").optional(),
  
  alcohol: z.string().optional(),
  stress: z.string().optional(),
  sleep: z.string().optional(),
  medicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  bloodPressure: z.string().optional(),
  cholesterol: z.string().optional(),
  diabetes: z.string().optional(),
}).refine((data) => {
  // Cross-field validation
  if (data.weight && data.height) {
    const bmi = data.weight / ((data.height / 100) ** 2);
    return bmi >= 10 && bmi <= 50; // Reasonable BMI range
  }
  return true;
}, {
  message: "Height and weight combination seems invalid",
  path: ["weight", "height"]
});

export const EnhancedSurveySchema = createEnhancedSurveySchema();

// File upload validation schema
export const FileUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'].includes(type),
    "File type must be JPEG, PNG, GIF, or PDF"
  )
});

// API request validation schemas
export const AnalyzeTextRequestSchema = z.object({
  text: z.string({
    message: "Text is required"
  }).min(10, "Text must be at least 10 characters long").max(10000, "Text is too long"),
  
  format: z.enum(['json', 'text'], {
    message: "Format must be either 'json' or 'text'"
  }).optional().default('text')
});

export const AnalyzeImageRequestSchema = z.object({
  imageData: z.string({
    message: "Image data is required"
  }).min(100, "Invalid image data"),
  
  filename: z.string({
    message: "Filename is required"
  }).min(1, "Filename cannot be empty"),
  
  mimeType: z.string({
    message: "MIME type is required"
  }).refine(
    (type) => type.startsWith('image/'),
    "File must be an image"
  )
});

// Validation utilities
export class ValidationUtils {
  // Validate survey data with custom error handling
  static validateSurveyData(data: any): {
    success: boolean;
    data?: any;
    errors?: string[];
    fieldErrors?: Record<string, string>;
  } {
    try {
      const validatedData = EnhancedSurveySchema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        const errors: string[] = [];

        error.issues.forEach(issue => {
          const path = issue.path.join('.');
          const message = issue.message;
          
          if (path) {
            fieldErrors[path] = message;
          }
          errors.push(`${path}: ${message}`);
        });

        return { 
          success: false, 
          errors, 
          fieldErrors 
        };
      }
      
      return { 
        success: false, 
        errors: ['Validation failed'] 
      };
    }
  }

  // Validate text input for OCR processing
  static validateTextInput(text: string): {
    isValid: boolean;
    confidence: number;
    suggestions: string[];
    cleanedText: string;
  } {
    const suggestions: string[] = [];
    let confidence = 1.0;
    let cleanedText = text.trim();

    // Check text length
    if (cleanedText.length < 10) {
      suggestions.push("Text seems too short for meaningful analysis");
      confidence -= 0.3;
    }

    if (cleanedText.length > 5000) {
      suggestions.push("Text is very long and may affect processing speed");
      confidence -= 0.1;
    }

    // Check for health-related keywords
    const healthKeywords = [
      'age', 'smoker', 'smoking', 'exercise', 'diet', 'weight', 'height',
      'alcohol', 'stress', 'sleep', 'medical', 'health', 'blood pressure',
      'cholesterol', 'diabetes', 'family history'
    ];

    const foundKeywords = healthKeywords.filter(keyword => 
      cleanedText.toLowerCase().includes(keyword)
    ).length;

    if (foundKeywords < 3) {
      suggestions.push("Text doesn't contain many health-related terms");
      confidence -= 0.2;
    }

    // Check for common OCR artifacts
    const ocrArtifacts = [
      /[|]{2,}/g,  // Multiple pipes
      /[_]{3,}/g,  // Multiple underscores
      /\s{3,}/g,   // Multiple spaces
      /[^\w\s:.,;!?()\[\]{}\-+=/\n\r\t]/g  // Unusual characters
    ];

    ocrArtifacts.forEach(pattern => {
      if (pattern.test(cleanedText)) {
        suggestions.push("Text may contain OCR artifacts");
        confidence -= 0.1;
      }
    });

    // Clean common OCR mistakes
    cleanedText = this.cleanOCRText(cleanedText);

    return {
      isValid: confidence > 0.3 && cleanedText.length >= 5,
      confidence: Math.max(0, Math.min(1, confidence)),
      suggestions,
      cleanedText
    };
  }

  // Clean common OCR mistakes
  private static cleanOCRText(text: string): string {
    let cleaned = text;

    // Common character corrections
    const corrections = [
      [/[|](?=\s|$)/g, 'I'],           // | to I
      [/(?<=\s|^)[0O](?=\s|$)/g, 'O'], // 0 to O in words
      [/(?<=\s|^)[1l](?=\s|$)/g, 'I'], // 1/l to I in words
      [/rn/g, 'm'],                     // rn to m
      [/vv/g, 'w'],                     // vv to w
      [/\s+/g, ' '],                    // Multiple spaces to single
      [/\n\s*\n/g, '\n'],              // Multiple newlines to single
    ];

    corrections.forEach(([pattern, replacement]) => {
      cleaned = cleaned.replace(pattern, replacement as string);
    });

    return cleaned.trim();
  }

  // Validate risk assessment parameters
  static validateRiskAssessment(data: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.age || data.age < 1 || data.age > 120) {
      errors.push("Valid age is required (1-120)");
    }

    if (!data.smoker || !['yes', 'no', 'former'].includes(data.smoker)) {
      errors.push("Smoking status must be 'yes', 'no', or 'former'");
    }

    // Optional but important fields
    if (!data.exercise || data.exercise.trim().length < 2) {
      warnings.push("Exercise information is missing or incomplete");
    }

    if (!data.diet || data.diet.trim().length < 2) {
      warnings.push("Diet information is missing or incomplete");
    }

    // BMI validation if both weight and height are provided
    if (data.weight && data.height) {
      const bmi = data.weight / ((data.height / 100) ** 2);
      if (bmi < 10 || bmi > 50) {
        errors.push("BMI calculation seems invalid - please check height and weight");
      } else if (bmi < 16 || bmi > 35) {
        warnings.push("BMI indicates potential health concerns");
      }
    }

    // Age-specific warnings
    if (data.age < 18 && data.smoker === 'yes') {
      warnings.push("Smoking at a young age significantly increases health risks");
    }

    if (data.age > 65 && !data.medicalHistory) {
      warnings.push("Medical history information is particularly important for seniors");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Real-time form validation
  static createFieldValidator(schema: z.ZodObject<any>) {
    return (fieldName: string, value: any) => {
      try {
        const fieldSchema = schema.shape[fieldName];
        if (fieldSchema) {
          fieldSchema.parse(value);
          return { isValid: true };
        }
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            error: error.issues[0]?.message || 'Invalid value'
          };
        }
        return { isValid: false, error: 'Validation error' };
      }
    };
  }

  // Batch validation for multiple fields
  static validateFields(
    data: Record<string, any>,
    schema: z.ZodSchema
  ): Record<string, { isValid: boolean; error?: string }> {
    const results: Record<string, { isValid: boolean; error?: string }> = {};
    
    Object.keys(data).forEach(fieldName => {
      try {
        const fieldSchema = (schema as any).shape[fieldName];
        if (fieldSchema) {
          fieldSchema.parse(data[fieldName]);
          results[fieldName] = { isValid: true };
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          results[fieldName] = {
            isValid: false,
            error: error.issues[0]?.message || 'Invalid value'
          };
        }
      }
    });

    return results;
  }
}

// React hook for form validation
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validate = (data: any) => {
    try {
      schema.parse(data);
      setErrors({});
      setIsValid(true);
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const path = issue.path.join('.');
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
        setIsValid(false);
        return { success: false, errors: newErrors };
      }
      return { success: false, errors: { general: 'Validation failed' } };
    }
  };

  const validateField = (fieldName: string, value: any) => {
    try {
      const fieldSchema = (schema as any).shape[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return { isValid: true };
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues[0]?.message || 'Invalid value';
        setErrors(prev => ({ ...prev, [fieldName]: message }));
        return { isValid: false, error: message };
      }
    }
    return { isValid: false, error: 'Validation error' };
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors
  };
}

import React from 'react';