import { SurveyResponse, ParsedAnswers, OCRResult } from '@/types';
import { 
  SurveyResponseSchema, 
  validateSurveyCompleteness, 
  calculateConfidenceScore 
} from '@/lib/validation';
import { CORE_SURVEY_FIELDS, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Parse structured JSON input from survey responses
 */
export function parseJsonInput(jsonString: string): ParsedAnswers {
  try {
    const data = JSON.parse(jsonString);
    const validation = SurveyResponseSchema.safeParse(data);
    
    if (!validation.success) {
      throw new Error('Invalid JSON structure');
    }
    
    const { isValid, completeness, missingFields } = validateSurveyCompleteness(data);
    const confidence = calculateConfidenceScore(data, 1.0); // Perfect extraction quality for JSON
    
    if (!isValid) {
      return {
        answers: {},
        missing_fields: missingFields,
        confidence: 0
      };
    }
    
    return {
      answers: validation.data,
      missing_fields: missingFields,
      confidence
    };
  } catch (error) {
    throw new Error(`JSON parsing failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

/**
 * Parse unstructured text input using pattern matching and fuzzy logic
 */
export function parseTextInput(text: string): ParsedAnswers {
  const answers: Partial<SurveyResponse> = {};
  const extractionQuality = 0.8; // Slightly lower for text parsing
  
  // Clean and normalize text
  const normalizedText = text.toLowerCase().trim();
  
  // Age extraction
  const ageMatches = normalizedText.match(/(?:age[:\s]*|I am |aged? )\s*(\d{1,3})/i);
  if (ageMatches) {
    const age = parseInt(ageMatches[1]);
    if (age >= 1 && age <= 120) {
      answers.age = age;
    }
  }
  
  // Smoking status
  const smokingPatterns = [
    /(?:smok|cigarette|tobacco)[a-z]*[:\s]*(?:yes|true|smoke|smoker)/i,
    /(?:I|do)\s+(?:am\s+a\s+)?smok/i,
    /(?:yes|true).*smok/i
  ];
  const nonSmokingPatterns = [
    /(?:smok|cigarette|tobacco)[a-z]*[:\s]*(?:no|false|never|non)/i,
    /(?:don't|do not|never)\s+smok/i,
    /(?:no|false|never).*smok/i,
    /non[\s-]?smok/i
  ];
  
  if (smokingPatterns.some(pattern => pattern.test(normalizedText))) {
    answers.smoker = true;
  } else if (nonSmokingPatterns.some(pattern => pattern.test(normalizedText))) {
    answers.smoker = false;
  }
  
  // Exercise frequency
  const exerciseKeywords = {
    'never': /(?:exercise|physical activity|workout)[:\s]*(?:never|no|none)/i,
    'rarely': /(?:exercise|physical activity|workout)[:\s]*(?:rarely|seldom|hardly)/i,
    'sometimes': /(?:exercise|physical activity|workout)[:\s]*(?:sometimes|occasionally|2-3|two|three)/i,
    'regularly': /(?:exercise|physical activity|workout)[:\s]*(?:regularly|often|frequent|3-4|four|five)/i,
    'daily': /(?:exercise|physical activity|workout)[:\s]*(?:daily|every day|everyday|7)/i
  };
  
  for (const [level, pattern] of Object.entries(exerciseKeywords)) {
    if (pattern.test(normalizedText)) {
      answers.exercise = level as SurveyResponse['exercise'];
      break;
    }
  }
  
  // Diet quality
  const dietKeywords = {
    'poor': /(?:diet|eating|food)[:\s]*(?:poor|bad|unhealthy|junk|fast food|processed)/i,
    'fair': /(?:diet|eating|food)[:\s]*(?:fair|okay|average|moderate)/i,
    'good': /(?:diet|eating|food)[:\s]*(?:good|healthy|balanced|nutritious)/i,
    'excellent': /(?:diet|eating|food)[:\s]*(?:excellent|great|very good|optimal|perfect)/i
  };
  
  for (const [quality, pattern] of Object.entries(dietKeywords)) {
    if (pattern.test(normalizedText)) {
      answers.diet = quality as SurveyResponse['diet'];
      break;
    }
  }
  
  // Alternative diet parsing for high sugar, high fat descriptions
  if (!answers.diet) {
    if (/high sugar|sweet|candy|soda|processed food/i.test(normalizedText)) {
      answers.diet = 'poor';
    } else if (/vegetables|fruits|whole grain|lean protein/i.test(normalizedText)) {
      answers.diet = 'good';
    }
  }
  
  // Alcohol consumption
  const alcoholKeywords = {
    'never': /(?:alcohol|drink|beer|wine)[:\s]*(?:never|no|none|don't)/i,
    'rarely': /(?:alcohol|drink)[:\s]*(?:rarely|seldom|occasionally)/i,
    'socially': /(?:alcohol|drink)[:\s]*(?:socially|social|parties|weekends)/i,
    'regularly': /(?:alcohol|drink)[:\s]*(?:regularly|weekly|often)/i,
    'daily': /(?:alcohol|drink)[:\s]*(?:daily|every day|everyday)/i
  };
  
  for (const [frequency, pattern] of Object.entries(alcoholKeywords)) {
    if (pattern.test(normalizedText)) {
      answers.alcohol = frequency as SurveyResponse['alcohol'];
      break;
    }
  }
  
  // Sleep hours
  const sleepMatches = normalizedText.match(/(?:sleep[:\s]*|get\s+)\s*(\d{1,2})\s*(?:hours?|hrs?)/i);
  if (sleepMatches) {
    const sleep = parseInt(sleepMatches[1]);
    if (sleep >= 1 && sleep <= 24) {
      answers.sleep = sleep;
    }
  }
  
  // Stress levels
  const stressKeywords = {
    'low': /stress[:\s]*(?:low|minimal|little|no)/i,
    'moderate': /stress[:\s]*(?:moderate|medium|some|manageable)/i,
    'high': /stress[:\s]*(?:high|significant|a lot)/i,
    'very_high': /stress[:\s]*(?:very high|extreme|overwhelming|chronic)/i
  };
  
  for (const [level, pattern] of Object.entries(stressKeywords)) {
    if (pattern.test(normalizedText)) {
      answers.stress = level as SurveyResponse['stress'];
      break;
    }
  }
  
  // Weight extraction
  const weightMatches = normalizedText.match(/(?:weight[:\s]*|weigh\s+)\s*(\d{1,3})\s*(?:kg|kilograms?|lbs?|pounds?)?/i);
  if (weightMatches) {
    let weight = parseInt(weightMatches[1]);
    const unit = weightMatches[2]?.toLowerCase();
    
    // Convert pounds to kg if necessary
    if (unit && (unit.includes('lb') || unit.includes('pound'))) {
      weight = Math.round(weight * 0.453592);
    }
    
    if (weight >= 20 && weight <= 500) {
      answers.weight = weight;
    }
  }
  
  // Height extraction
  const heightMatches = normalizedText.match(/(?:height[:\s]*|tall\s+)\s*(\d{1,3})\s*(?:cm|centimeters?|ft|feet|inches?|in)?/i);
  if (heightMatches) {
    let height = parseInt(heightMatches[1]);
    const unit = heightMatches[2]?.toLowerCase();
    
    // Convert feet to cm if necessary (assuming format like 5 or 6 for feet)
    if (unit && (unit.includes('ft') || unit.includes('feet')) && height <= 8) {
      height = Math.round(height * 30.48);
    }
    
    if (height >= 50 && height <= 300) {
      answers.height = height;
    }
  }
  
  // Medical conditions - simple keyword detection
  const medicalConditions: string[] = [];
  const medicalKeywords = [
    'diabetes', 'hypertension', 'heart disease', 'high blood pressure',
    'high cholesterol', 'obesity', 'asthma', 'depression', 'anxiety'
  ];
  
  medicalKeywords.forEach(condition => {
    if (new RegExp(condition, 'i').test(normalizedText)) {
      medicalConditions.push(condition);
    }
  });
  
  if (medicalConditions.length > 0) {
    answers.medicalHistory = medicalConditions;
  }
  
  // Validate completeness and calculate confidence
  const { isValid, completeness, missingFields } = validateSurveyCompleteness(answers);
  const confidence = calculateConfidenceScore(answers, extractionQuality);
  
  return {
    answers: answers as SurveyResponse,
    missing_fields: missingFields,
    confidence
  };
}

/**
 * Process OCR result and extract survey data
 */
export function processOCRResult(ocrResult: OCRResult): ParsedAnswers {
  if (!ocrResult.success || !ocrResult.extractedText) {
    return {
      answers: {},
      missing_fields: [...CORE_SURVEY_FIELDS],
      confidence: 0
    };
  }
  
  // Use OCR confidence to adjust extraction quality
  const extractionQuality = ocrResult.confidence * 0.8; // OCR adds some uncertainty
  const textParseResult = parseTextInput(ocrResult.extractedText);
  
  // Adjust confidence based on OCR quality
  const adjustedConfidence = textParseResult.confidence * extractionQuality;
  
  return {
    ...textParseResult,
    confidence: adjustedConfidence
  };
}

/**
 * Smart field mapping for common variations and typos
 */
function normalizeFieldName(fieldName: string): string | null {
  const fieldMappings: { [key: string]: string } = {
    // Age variations
    'age': 'age',
    'years': 'age',
    'yrs': 'age',
    'old': 'age',
    
    // Smoking variations
    'smoke': 'smoker',
    'smoking': 'smoker',
    'smoker': 'smoker',
    'cigarettes': 'smoker',
    'tobacco': 'smoker',
    
    // Exercise variations
    'exercise': 'exercise',
    'workout': 'exercise',
    'physical activity': 'exercise',
    'activity': 'exercise',
    'fitness': 'exercise',
    
    // Diet variations
    'diet': 'diet',
    'eating': 'diet',
    'food': 'diet',
    'nutrition': 'diet',
    
    // Alcohol variations
    'alcohol': 'alcohol',
    'drinking': 'alcohol',
    'drinks': 'alcohol',
    'beer': 'alcohol',
    'wine': 'alcohol',
    
    // Sleep variations
    'sleep': 'sleep',
    'rest': 'sleep',
    'sleeping': 'sleep',
    
    // Stress variations
    'stress': 'stress',
    'anxiety': 'stress',
    'pressure': 'stress'
  };
  
  const normalized = fieldName.toLowerCase().trim();
  return fieldMappings[normalized] || null;
}

/**
 * Extract key-value pairs from unstructured text
 */
function extractKeyValuePairs(text: string): { [key: string]: string } {
  const pairs: { [key: string]: string } = {};
  
  // Split text into lines and process each
  const lines = text.split(/[\n\r]+/);
  
  for (const line of lines) {
    // Look for patterns like "key: value" or "key = value"
    const colonMatch = line.match(/^([^:]+):\s*(.+)$/);
    const equalMatch = line.match(/^([^=]+)=\s*(.+)$/);
    
    if (colonMatch) {
      const key = normalizeFieldName(colonMatch[1]);
      if (key) {
        pairs[key] = colonMatch[2].trim();
      }
    } else if (equalMatch) {
      const key = normalizeFieldName(equalMatch[1]);
      if (key) {
        pairs[key] = equalMatch[2].trim();
      }
    }
  }
  
  return pairs;
}

/**
 * Main text parsing function that handles both structured and unstructured input
 */
export function parseTextualInput(input: string, format: 'json' | 'text' = 'text'): ParsedAnswers {
  try {
    if (format === 'json') {
      return parseJsonInput(input);
    } else {
      return parseTextInput(input);
    }
  } catch (error) {
    throw new Error(`Text parsing failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

/**
 * Validate if the parsed data meets minimum requirements
 */
export function validateParsedData(parsedData: ParsedAnswers): { 
  isValid: boolean; 
  reason?: string;
  suggestions?: string[];
} {
  const { confidence, missing_fields } = parsedData;
  
  // Check minimum confidence threshold
  if (confidence < 0.3) {
    return {
      isValid: false,
      reason: 'Data quality is too low for reliable assessment',
      suggestions: [
        'Provide clearer information',
        'Use structured format (JSON)',
        'Upload a higher quality image if using OCR'
      ]
    };
  }
  
  // Check for critical missing fields
  const criticalMissing = missing_fields.filter((field: string) => 
    CORE_SURVEY_FIELDS.includes(field as any)
  );
  
  if (criticalMissing.length > 2) {
    return {
      isValid: false,
      reason: ERROR_MESSAGES.INSUFFICIENT_DATA,
      suggestions: [
        `Please provide information for: ${criticalMissing.join(', ')}`,
        'At least 3 of the 4 core fields (age, smoking, exercise, diet) are required'
      ]
    };
  }
  
  return { isValid: true };
}