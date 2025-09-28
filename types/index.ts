// Core TypeScript interfaces for the Health Risk Profiler System

export interface SurveyResponse {
  age?: number;
  smoker?: boolean;
  exercise?: string;
  diet?: string;
  alcohol?: string;
  sleep?: number;
  stress?: string;
  medicalHistory?: string[];
  weight?: number;
  height?: number;
  bloodPressure?: string;
  cholesterol?: string;
  diabetes?: boolean;
  familyHistory?: string[];
}

export interface ParsedAnswers {
  answers: SurveyResponse;
  missing_fields: string[];
  confidence: number;
}

export interface HealthFactor {
  name: string;
  category: 'lifestyle' | 'medical' | 'demographic';
  severity: 'low' | 'moderate' | 'high';
  points: number;
  description: string;
}

export interface ExtractedFactors {
  factors: string[];
  confidence: number;
  detailed_factors: HealthFactor[];
}

export interface RiskAssessment {
  risk_level: 'low' | 'moderate' | 'high';
  score: number;
  rationale: string[];
  confidence: number;
  contributing_factors: HealthFactor[];
}

export interface Recommendation {
  id: string;
  category: 'diet' | 'exercise' | 'lifestyle' | 'medical';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action_items: string[];
  timeline: string;
  evidence_level: string;
}

export interface FinalRecommendations {
  risk_level: 'low' | 'moderate' | 'high';
  factors: string[];
  recommendations: Recommendation[];
  status: 'ok' | 'incomplete_profile' | 'error';
  disclaimer?: string;
}

export interface OCRResult {
  extractedText: string;
  confidence: number;
  processing_time: number;
  success: boolean;
  error?: string;
}

// API Request/Response types
export interface AnalyzeTextRequest {
  text: string;
  format: 'json' | 'text';
}

export interface AnalyzeTextResponse {
  status: 'success' | 'incomplete_profile' | 'error';
  data?: ParsedAnswers;
  reason?: string;
  error?: string;
}

export interface AnalyzeImageRequest {
  imageData: string; // base64 encoded
  filename: string;
  mimeType: string;
}

export interface AnalyzeImageResponse {
  status: 'success' | 'error';
  data?: {
    ocr_result: OCRResult;
    parsed_data?: ParsedAnswers;
  };
  error?: string;
}

export interface RiskAssessmentRequest {
  answers: SurveyResponse;
  include_factors?: boolean;
}

export interface RiskAssessmentResponse {
  status: 'success' | 'error';
  data?: RiskAssessment;
  error?: string;
}

export interface RecommendationsRequest {
  risk_assessment: RiskAssessment;
  user_preferences?: {
    focus_areas?: string[];
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    time_commitment?: 'low' | 'medium' | 'high';
  };
}

export interface RecommendationsResponse {
  status: 'success' | 'error';
  data?: FinalRecommendations;
  error?: string;
}

// Utility types
export interface ProcessingStatus {
  stage: 'parsing' | 'factor_extraction' | 'risk_calculation' | 'recommendations' | 'complete';
  progress: number;
  message: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Configuration types
export interface RiskScoringConfig {
  smoking_points: number;
  poor_diet_points: number;
  low_exercise_points: number;
  age_factor_threshold: number;
  age_points_per_year: number;
  interaction_multiplier: number;
}

export interface ConfidenceThresholds {
  minimum_data_completeness: number;
  high_confidence_threshold: number;
  medium_confidence_threshold: number;
}

// Component Props types
export interface SurveyFormProps {
  onSubmit: (data: SurveyResponse) => void;
  initialData?: Partial<SurveyResponse>;
  isLoading?: boolean;
}

export interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  isProcessing?: boolean;
}

export interface RiskProfileProps {
  assessment: RiskAssessment;
  showDetails?: boolean;
}

export interface RecommendationListProps {
  recommendations: Recommendation[];
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

export interface ProgressIndicatorProps {
  status: ProcessingStatus;
  steps: string[];
  currentStep: number;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface RiskChartData {
  overall_score: number;
  factor_breakdown: ChartDataPoint[];
  risk_categories: {
    low: { min: number; max: number; color: string };
    moderate: { min: number; max: number; color: string };
    high: { min: number; max: number; color: string };
  };
}