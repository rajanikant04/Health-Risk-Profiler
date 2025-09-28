/**
 * Next.js 15 compatible OCR processor
 * Uses mock OCR for development - can be replaced with real OCR service later
 */

import { OCRResult } from '@/types';

/**
 * Mock OCR processing for development compatibility
 */
export async function performOCR(
  imageBuffer: Buffer | string, 
  options: {
    language?: string;
    confidence_threshold?: number;
    preprocessing?: boolean;
  } = {}
): Promise<OCRResult> {
  const startTime = Date.now();
  
  const {
    confidence_threshold = 60,
    preprocessing = true
  } = options;

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

  // Generate realistic mock OCR data based on typical health forms
  const mockTexts = [
    `Age: 35
Smoker: No
Exercise: 3 times per week  
Diet: Balanced, mostly home-cooked meals
Weight: 75kg
Height: 175cm
Alcohol: Social drinking, 2-3 drinks per week
Sleep: 7-8 hours per night
Stress Level: Moderate work stress
Medical History: None significant
Family History: Father - heart disease at 65
Blood Pressure: 120/80 (normal)
Cholesterol: 210 mg/dL (slightly elevated)`,

    `Age: 42
Smoker: Former smoker (quit 2 years ago)
Exercise: Running 4x per week, gym 2x per week
Diet: Mediterranean diet with occasional treats
Weight: 68kg
Height: 165cm
Alcohol: Wine with dinner, 4-5 glasses per week
Sleep: 6-7 hours per night
Stress Level: Low to moderate
Medical History: Hypertension diagnosed last year
Family History: Mother - diabetes, Father - stroke
Blood Pressure: 135/85 (controlled with medication)
Cholesterol: 190 mg/dL (normal)`,

    `Age: 28
Smoker: Never
Exercise: Yoga 3x per week, walking daily
Diet: Vegetarian, high fiber
Weight: 60kg
Height: 160cm
Alcohol: Rarely, special occasions only
Sleep: 8-9 hours per night
Stress Level: Low
Medical History: None
Family History: Grandmother - breast cancer
Blood Pressure: 110/70 (normal)
Cholesterol: 170 mg/dL (optimal)`
  ];

  // Select a random mock text
  const mockText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
  
  // Simulate OCR confidence (higher for "better quality" images)
  const baseConfidence = 0.75 + Math.random() * 0.2; // 75-95%
  
  // Post-process extracted text if preprocessing is enabled
  let extractedText = mockText;
  if (preprocessing) {
    extractedText = postProcessOCRText(extractedText);
  }
  
  const processingTime = Date.now() - startTime;
  const confidence = baseConfidence;
  const success = confidence >= (confidence_threshold / 100) && extractedText.trim().length > 0;
  
  return {
    extractedText,
    confidence,
    processing_time: processingTime,
    success,
    error: success ? undefined : `OCR confidence (${Math.round(confidence * 100)}%) below threshold (${confidence_threshold}%)`
  };
}

/**
 * Post-process OCR text to improve quality
 */
function postProcessOCRText(text: string): string {
  let processed = text;
  
  // Remove excessive whitespace
  processed = processed.replace(/\s+/g, ' ');
  
  // Fix common OCR mistakes
  const corrections: Array<[RegExp, string]> = [
    // Common character misreads
    [/[|](?=\s|$)/g, 'I'], // | often mistaken for I
    [/(?<=\s|^)[0O](?=\s|$)/g, 'O'], // 0 and O confusion
    [/(?<=\s|^)[1l](?=\s|$)/g, 'I'], // 1 and l confusion
    [/(?<=\s|^)rn(?=\s|$)/g, 'm'], // rn often mistaken for m
    [/(?<=\s|^)vv(?=\s|$)/g, 'w'], // vv often mistaken for w
    
    // Common word corrections for health forms
    [/\b[Aa]ge[:\s]*(\d+)/g, 'Age: $1'],
    [/\b[Ss]mok(er?|ing)[:\s]*/g, 'Smoker: '],
    [/\b[Ee]xercise[:\s]*/g, 'Exercise: '],
    [/\b[Dd]iet[:\s]*/g, 'Diet: '],
    [/\b[Aa]lcohol[:\s]*/g, 'Alcohol: '],
    [/\b[Ss]leep[:\s]*/g, 'Sleep: '],
    [/\b[Ss]tress[:\s]*/g, 'Stress: '],
    [/\b[Ww]eight[:\s]*/g, 'Weight: '],
    [/\b[Hh]eight[:\s]*/g, 'Height: '],
    
    // Fix spacing around colons
    [/(\w)\s*:\s*/g, '$1: '],
    
    // Clean up line breaks and spacing
    [/\n\s*\n/g, '\n'],
    [/^\s+|\s+$/g, '']
  ];
  
  corrections.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement);
  });
  
  return processed.trim();
}

/**
 * Preprocess image for better OCR results (client-side)
 */
export function preprocessImageForOCR(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    // Calculate grayscale value
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    
    // Increase contrast
    const contrast = 1.2;
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
    const contrasted = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
    
    // Apply threshold for better text recognition
    const threshold = contrasted > 128 ? 255 : 0;
    
    data[i] = threshold;     // Red
    data[i + 1] = threshold; // Green
    data[i + 2] = threshold; // Blue
    // Alpha channel remains unchanged
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Validate OCR results for health survey data
 */
export function validateOCRResults(ocrResult: OCRResult): {
  isValid: boolean;
  confidence: number;
  suggestions: string[];
  extractedFields: { [key: string]: any };
} {
  const suggestions: string[] = [];
  const extractedFields: { [key: string]: any } = {};
  
  if (!ocrResult.success) {
    return {
      isValid: false,
      confidence: 0,
      suggestions: [
        'Try uploading a clearer image',
        'Ensure the document is well-lit',
        'Make sure text is not rotated or skewed',
        'Consider manual entry instead'
      ],
      extractedFields
    };
  }
  
  const text = ocrResult.extractedText.toLowerCase();
  
  // Check for health-related keywords
  const healthKeywords = [
    'age', 'smoker', 'smoking', 'exercise', 'diet', 'weight', 'height',
    'alcohol', 'stress', 'sleep', 'medical', 'health', 'blood pressure',
    'cholesterol', 'diabetes'
  ];
  
  const foundKeywords = healthKeywords.filter(keyword => 
    text.includes(keyword)
  ).length;
  
  const keywordScore = foundKeywords / healthKeywords.length;
  const overallConfidence = (ocrResult.confidence + keywordScore) / 2;
  
  // Extract basic fields for preview
  const ageMatch = text.match(/age[:\s]*(\d+)/i);
  if (ageMatch) extractedFields.age = parseInt(ageMatch[1]);
  
  const smokerMatch = text.match(/smok(?:er?|ing)[:\s]*(\w+)/i);
  if (smokerMatch) extractedFields.smoker = smokerMatch[1];
  
  const exerciseMatch = text.match(/exercise[:\s]*([^\n,;.]+)/i);
  if (exerciseMatch) extractedFields.exercise = exerciseMatch[1].trim();
  
  const dietMatch = text.match(/diet[:\s]*([^\n,;.]+)/i);
  if (dietMatch) extractedFields.diet = dietMatch[1].trim();
  
  // Generate suggestions based on results
  if (overallConfidence < 0.7) {
    suggestions.push('OCR confidence is low - consider manual entry');
  }
  
  if (foundKeywords < 3) {
    suggestions.push('Few health-related terms detected - ensure this is a health survey form');
  }
  
  if (Object.keys(extractedFields).length < 2) {
    suggestions.push('Limited data extracted - try a higher quality image');
  }
  
  return {
    isValid: overallConfidence >= 0.5 && foundKeywords >= 2,
    confidence: overallConfidence,
    suggestions,
    extractedFields
  };
}

/**
 * Enhanced OCR with multiple attempts and preprocessing
 */
export async function performEnhancedOCR(
  imageData: string,
  filename: string
): Promise<OCRResult & { attempts: number; bestResult?: OCRResult }> {
  try {
    // For now, use single attempt with mock OCR
    const ocrResult = await performOCR(imageData, {
      language: 'eng',
      confidence_threshold: 60,
      preprocessing: true
    });
    
    // Validate the result
    const validation = validateOCRResults(ocrResult);
    
    return {
      ...ocrResult,
      success: validation.isValid,
      confidence: validation.confidence,
      attempts: 1,
      bestResult: ocrResult
    };
    
  } catch (error) {
    return {
      extractedText: '',
      confidence: 0,
      processing_time: 0,
      success: false,
      error: `Enhanced OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      attempts: 0
    };
  }
}