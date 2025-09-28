import { z } from 'zod';

// Survey Response Validation Schema
export const SurveyResponseSchema = z.object({
  age: z.number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120')
    .optional(),
  smoker: z.boolean().optional(),
  exercise: z.enum(['never', 'rarely', 'sometimes', 'regularly', 'daily']).optional(),
  diet: z.enum(['poor', 'fair', 'good', 'excellent']).or(
    z.string().min(1, 'Diet information is required')
  ).optional(),
  alcohol: z.enum(['never', 'rarely', 'socially', 'regularly', 'daily']).optional(),
  sleep: z.number()
    .min(1, 'Sleep hours must be at least 1')
    .max(24, 'Sleep hours cannot exceed 24')
    .optional(),
  stress: z.enum(['low', 'moderate', 'high', 'very_high']).optional(),
  medicalHistory: z.array(z.string()).optional(),
  weight: z.number()
    .min(20, 'Weight must be at least 20 kg')
    .max(500, 'Weight must be less than 500 kg')
    .optional(),
  height: z.number()
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must be less than 300 cm')
    .optional(),
  bloodPressure: z.string().optional(),
  cholesterol: z.enum(['low', 'normal', 'borderline', 'high']).optional(),
  diabetes: z.boolean().optional(),
  familyHistory: z.array(z.string()).optional(),
});

// Parsed Answers Schema
export const ParsedAnswersSchema = z.object({
  answers: SurveyResponseSchema,
  missing_fields: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

// Health Factor Schema
export const HealthFactorSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['lifestyle', 'medical', 'demographic']),
  severity: z.enum(['low', 'moderate', 'high']),
  points: z.number().min(0),
  description: z.string().min(1),
});

// Risk Assessment Schema
export const RiskAssessmentSchema = z.object({
  risk_level: z.enum(['low', 'moderate', 'high']),
  score: z.number().min(0).max(100),
  rationale: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  contributing_factors: z.array(HealthFactorSchema),
});

// Recommendation Schema
export const RecommendationSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['diet', 'exercise', 'lifestyle', 'medical']),
  priority: z.enum(['high', 'medium', 'low']),
  title: z.string().min(1),
  description: z.string().min(1),
  action_items: z.array(z.string()),
  timeline: z.string().min(1),
  evidence_level: z.string().min(1),
});

// API Request Schemas
export const AnalyzeTextRequestSchema = z.object({
  text: z.string().min(1, 'Text input is required'),
  format: z.enum(['json', 'text']),
});

export const AnalyzeImageRequestSchema = z.object({
  imageData: z.string().min(1, 'Image data is required'),
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, 'Invalid image type'),
});

export const RiskAssessmentRequestSchema = z.object({
  answers: SurveyResponseSchema,
  include_factors: z.boolean().optional().default(true),
});

export const RecommendationsRequestSchema = z.object({
  risk_assessment: RiskAssessmentSchema,
  user_preferences: z.object({
    focus_areas: z.array(z.string()).optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    time_commitment: z.enum(['low', 'medium', 'high']).optional(),
  }).optional(),
});

// Configuration Schemas
export const RiskScoringConfigSchema = z.object({
  smoking_points: z.number().min(0).default(25),
  poor_diet_points: z.number().min(0).default(20),
  low_exercise_points: z.number().min(0).default(15),
  age_factor_threshold: z.number().min(0).default(40),
  age_points_per_year: z.number().min(0).default(1),
  interaction_multiplier: z.number().min(0).max(1).default(0.1),
});

export const ConfidenceThresholdsSchema = z.object({
  minimum_data_completeness: z.number().min(0).max(1).default(0.5),
  high_confidence_threshold: z.number().min(0).max(1).default(0.8),
  medium_confidence_threshold: z.number().min(0).max(1).default(0.6),
});

// Utility validation functions
export const validateSurveyCompleteness = (data: any): { isValid: boolean; completeness: number; missingFields: string[] } => {
  const coreFields = ['age', 'smoker', 'exercise', 'diet'];
  const totalFields = Object.keys(SurveyResponseSchema.shape);
  
  let presentFields = 0;
  const missingFields: string[] = [];
  
  for (const field of totalFields) {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      presentFields++;
    } else {
      missingFields.push(field);
    }
  }
  
  const completeness = presentFields / totalFields.length;
  const coreFieldsPresent = coreFields.every(field => 
    data[field] !== undefined && data[field] !== null && data[field] !== ''
  );
  
  return {
    isValid: completeness >= 0.5 && coreFieldsPresent,
    completeness,
    missingFields: missingFields.filter(field => coreFields.includes(field))
  };
};

export const calculateConfidenceScore = (data: any, extractionQuality: number = 1): number => {
  const { completeness } = validateSurveyCompleteness(data);
  
  // Base confidence from data completeness
  let confidence = completeness;
  
  // Adjust for extraction quality (OCR accuracy, text parsing quality)
  confidence *= extractionQuality;
  
  // Bonus for having critical health indicators
  const criticalFields = ['age', 'smoker', 'exercise', 'diet'];
  const criticalFieldsPresent = criticalFields.filter(field => 
    data[field] !== undefined && data[field] !== null
  ).length;
  
  if (criticalFieldsPresent === criticalFields.length) {
    confidence += 0.1; // 10% bonus for complete critical data
  }
  
  // Cap at 1.0
  return Math.min(confidence, 1.0);
};

// Type guards
export const isSurveyResponse = (data: any): data is z.infer<typeof SurveyResponseSchema> => {
  return SurveyResponseSchema.safeParse(data).success;
};

export const isRiskAssessment = (data: any): data is z.infer<typeof RiskAssessmentSchema> => {
  return RiskAssessmentSchema.safeParse(data).success;
};

export const isRecommendation = (data: any): data is z.infer<typeof RecommendationSchema> => {
  return RecommendationSchema.safeParse(data).success;
};

// Export schema types
export type SurveyResponseType = z.infer<typeof SurveyResponseSchema>;
export type ParsedAnswersType = z.infer<typeof ParsedAnswersSchema>;
export type HealthFactorType = z.infer<typeof HealthFactorSchema>;
export type RiskAssessmentType = z.infer<typeof RiskAssessmentSchema>;
export type RecommendationType = z.infer<typeof RecommendationSchema>;
export type RiskScoringConfigType = z.infer<typeof RiskScoringConfigSchema>;
export type ConfidenceThresholdsType = z.infer<typeof ConfidenceThresholdsSchema>;