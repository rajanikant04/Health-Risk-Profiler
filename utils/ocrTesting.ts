/**
 * OCR Testing Utility
 * 
 * This utility can be used to test the OCR functionality
 * directly from the browser console or as a standalone test.
 */

import { performEnhancedOCR, validateOCRResults } from './ocrProcessor';

/**
 * Test OCR with a sample image (base64 encoded)
 */
export async function testOCR() {
  // Sample health form text as base64 image (you would replace this with actual image data)
  const sampleImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  
  console.log('🔍 Starting OCR test...');
  
  try {
    const startTime = Date.now();
    
    // Extract base64 data
    const base64Data = sampleImageData.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    
    // Perform OCR
    const ocrResult = await performEnhancedOCR(base64Data, 'test-form.png');
    
    const processingTime = Date.now() - startTime;
    
    console.log('📊 OCR Results:', {
      success: ocrResult.success,
      confidence: `${Math.round(ocrResult.confidence * 100)}%`,
      processingTime: `${processingTime}ms`,
      extractedTextLength: ocrResult.extractedText.length,
      attempts: ocrResult.attempts
    });
    
    if (ocrResult.success) {
      console.log('📝 Extracted Text:', ocrResult.extractedText);
      
      // Validate the results
      const validation = validateOCRResults(ocrResult);
      console.log('✅ Validation Results:', {
        isValid: validation.isValid,
        confidence: `${Math.round(validation.confidence * 100)}%`,
        suggestionsCount: validation.suggestions.length,
        extractedFieldsCount: Object.keys(validation.extractedFields).length
      });
      
      if (validation.suggestions.length > 0) {
        console.log('💡 Suggestions:', validation.suggestions);
      }
      
      if (Object.keys(validation.extractedFields).length > 0) {
        console.log('🏥 Extracted Health Data:', validation.extractedFields);
      }
    } else {
      console.error('❌ OCR Failed:', ocrResult.error);
    }
    
    return ocrResult;
    
  } catch (error) {
    console.error('💥 OCR Test Error:', error);
    throw error;
  }
}

/**
 * Test OCR preprocessing visualization
 */
export function testPreprocessing() {
  console.log('🎨 Testing OCR preprocessing...');
  
  // Create a test canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('❌ Canvas context not available');
    return;
  }
  
  // Create sample image data (black text on white background)
  canvas.width = 200;
  canvas.height = 100;
  
  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add some sample text in black
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Age: 35', 20, 30);
  ctx.fillText('Smoker: No', 20, 50);
  ctx.fillText('Exercise: Yes', 20, 70);
  
  // Get image data before preprocessing
  const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Apply preprocessing
  import('./ocrProcessor').then(({ preprocessImageForOCR }) => {
    const processedCanvas = preprocessImageForOCR(canvas);
    
    // Display results
    document.body.appendChild(processedCanvas);
    processedCanvas.style.border = '2px solid #333';
    processedCanvas.style.margin = '10px';
    
    console.log('✅ Preprocessing test complete. Check the canvas element added to the page.');
    console.log('📊 Canvas dimensions:', `${canvas.width}x${canvas.height}`);
  });
}

/**
 * Performance benchmark for OCR
 */
export async function benchmarkOCR(iterations = 3) {
  console.log(`🏃‍♂️ Running OCR benchmark with ${iterations} iterations...`);
  
  const results = [];
  const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  const base64Data = sampleImage.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  
  for (let i = 0; i < iterations; i++) {
    console.log(`🔄 Running iteration ${i + 1}/${iterations}...`);
    
    const startTime = Date.now();
    const result = await performEnhancedOCR(base64Data, `benchmark-${i}.png`);
    const totalTime = Date.now() - startTime;
    
    results.push({
      iteration: i + 1,
      success: result.success,
      confidence: result.confidence,
      processingTime: result.processing_time,
      totalTime,
      attempts: result.attempts
    });
  }
  
  // Calculate statistics
  const successfulRuns = results.filter(r => r.success);
  const avgProcessingTime = successfulRuns.reduce((sum, r) => sum + r.processingTime, 0) / successfulRuns.length;
  const avgTotalTime = successfulRuns.reduce((sum, r) => sum + r.totalTime, 0) / successfulRuns.length;
  const avgConfidence = successfulRuns.reduce((sum, r) => sum + r.confidence, 0) / successfulRuns.length;
  
  console.log('📈 Benchmark Results:', {
    totalRuns: iterations,
    successfulRuns: successfulRuns.length,
    successRate: `${Math.round((successfulRuns.length / iterations) * 100)}%`,
    avgProcessingTime: `${Math.round(avgProcessingTime)}ms`,
    avgTotalTime: `${Math.round(avgTotalTime)}ms`,
    avgConfidence: `${Math.round(avgConfidence * 100)}%`
  });
  
  return results;
}

// Browser console helpers
if (typeof window !== 'undefined') {
  // Make functions available in browser console
  (window as any).testOCR = testOCR;
  (window as any).testPreprocessing = testPreprocessing;
  (window as any).benchmarkOCR = benchmarkOCR;
  
  console.log('🧪 OCR Testing utilities loaded!');
  console.log('Available functions:');
  console.log('  - testOCR() - Test OCR with sample data');
  console.log('  - testPreprocessing() - Test image preprocessing');
  console.log('  - benchmarkOCR(iterations) - Performance benchmark');
}