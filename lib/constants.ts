// Configuration constants for the Health Risk Profiler

export const RISK_SCORING_CONFIG = {
  // Point values for different risk factors
  SMOKING_POINTS: 25,
  POOR_DIET_POINTS: 20,
  LOW_EXERCISE_POINTS: 15,
  HIGH_ALCOHOL_POINTS: 10,
  HIGH_STRESS_POINTS: 12,
  POOR_SLEEP_POINTS: 8,
  
  // Age-based scoring
  AGE_FACTOR_THRESHOLD: 40,
  AGE_POINTS_PER_YEAR: 1,
  
  // Risk interaction multiplier
  INTERACTION_MULTIPLIER: 0.1,
  
  // Risk level thresholds
  RISK_THRESHOLDS: {
    LOW: { min: 0, max: 30 },
    MODERATE: { min: 31, max: 60 },
    HIGH: { min: 61, max: 100 }
  }
} as const;

export const CONFIDENCE_THRESHOLDS = {
  MINIMUM_DATA_COMPLETENESS: 0.5,
  HIGH_CONFIDENCE: 0.8,
  MEDIUM_CONFIDENCE: 0.6,
  LOW_CONFIDENCE: 0.0
} as const;

export const CORE_SURVEY_FIELDS = [
  'age',
  'smoker',
  'exercise',
  'diet'
] as const;

export const OPTIONAL_SURVEY_FIELDS = [
  'alcohol',
  'sleep',
  'stress',
  'medicalHistory',
  'weight',
  'height',
  'bloodPressure',
  'cholesterol',
  'diabetes',
  'familyHistory'
] as const;

export const EXERCISE_LEVELS = {
  'never': { points: 15, description: 'No regular physical activity' },
  'rarely': { points: 12, description: 'Light activity less than once per week' },
  'sometimes': { points: 8, description: 'Moderate activity 1-2 times per week' },
  'regularly': { points: 4, description: 'Regular activity 3-4 times per week' },
  'daily': { points: 0, description: 'Daily physical activity' }
} as const;

export const DIET_QUALITY = {
  'poor': { points: 20, description: 'High processed foods, low fruits/vegetables' },
  'fair': { points: 15, description: 'Some processed foods, moderate nutrition' },
  'good': { points: 8, description: 'Balanced diet with regular fruits/vegetables' },
  'excellent': { points: 0, description: 'Optimal nutrition with minimal processed foods' }
} as const;

export const ALCOHOL_CONSUMPTION = {
  'never': { points: 0, description: 'No alcohol consumption' },
  'rarely': { points: 2, description: 'Occasional social drinking' },
  'socially': { points: 5, description: 'Regular social drinking' },
  'regularly': { points: 8, description: 'Regular weekly consumption' },
  'daily': { points: 12, description: 'Daily alcohol consumption' }
} as const;

export const STRESS_LEVELS = {
  'low': { points: 0, description: 'Well-managed stress levels' },
  'moderate': { points: 5, description: 'Manageable stress with occasional peaks' },
  'high': { points: 10, description: 'Frequently high stress levels' },
  'very_high': { points: 15, description: 'Chronic high stress affecting daily life' }
} as const;

export const MEDICAL_DISCLAIMER = `
This health risk assessment is for informational and wellness purposes only. 
It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
Always seek the advice of your physician or other qualified health provider with any questions 
you may have regarding a medical condition. Never disregard professional medical advice or 
delay in seeking it because of something you have read in this assessment.
` as const;

export const RECOMMENDATION_CATEGORIES = {
  DIET: {
    name: 'Nutrition',
    icon: '🥗',
    color: '#10B981',
    description: 'Dietary and nutritional improvements'
  },
  EXERCISE: {
    name: 'Physical Activity',
    icon: '🏃‍♂️',
    color: '#3B82F6',
    description: 'Exercise and movement recommendations'
  },
  LIFESTYLE: {
    name: 'Lifestyle',
    icon: '🧘‍♀️',
    color: '#8B5CF6',
    description: 'General lifestyle and wellness improvements'
  },
  MEDICAL: {
    name: 'Medical Consultation',
    icon: '👩‍⚕️',
    color: '#EF4444',
    description: 'Professional medical advice and screening'
  }
} as const;

export const PROCESSING_STAGES = {
  PARSING: 'Parsing survey data...',
  FACTOR_EXTRACTION: 'Extracting health factors...',  
  RISK_CALCULATION: 'Calculating risk assessment...',
  RECOMMENDATIONS: 'Generating recommendations...',
  COMPLETE: 'Analysis complete!'
} as const;

export const ERROR_MESSAGES = {
  INSUFFICIENT_DATA: 'Insufficient data provided. Please ensure at least 50% of core fields are completed.',
  INVALID_INPUT: 'Invalid input format. Please check your data and try again.',
  OCR_FAILED: 'Unable to extract text from the uploaded image. Please try a clearer image or enter data manually.',
  PROCESSING_ERROR: 'An error occurred during processing. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  FILE_TOO_LARGE: 'File size too large. Please upload an image smaller than 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a PNG, JPG, or PDF file.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment before trying again.'
} as const;

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf'],
  MAX_FILES: 1
} as const;

export const API_ENDPOINTS = {
  ANALYZE_TEXT: '/api/analyze-text',
  ANALYZE_IMAGE: '/api/analyze-image', 
  RISK_ASSESSMENT: '/api/risk-assessment',
  RECOMMENDATIONS: '/api/recommendations',
  HEALTH_CHECK: '/api/health-check'
} as const;

export const CHART_COLORS = {
  LOW_RISK: '#10B981',     // Green
  MODERATE_RISK: '#F59E0B', // Amber  
  HIGH_RISK: '#EF4444',    // Red
  PRIMARY: '#3B82F6',      // Blue
  SECONDARY: '#6B7280',    // Gray
  SUCCESS: '#10B981',      // Green
  WARNING: '#F59E0B',      // Amber
  DANGER: '#EF4444'        // Red
} as const;