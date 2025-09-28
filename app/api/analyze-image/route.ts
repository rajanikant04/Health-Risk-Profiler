import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeImageRequestSchema } from '@/lib/validation';
import { processOCRResult } from '@/utils/textParser';
import { performEnhancedOCR } from '@/utils/ocrProcessor';
import { ERROR_MESSAGES, FILE_UPLOAD_CONFIG } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = AnalyzeImageRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: 'Invalid request format',
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { imageData, filename, mimeType } = validation.data;

    // Validate file type
    if (!FILE_UPLOAD_CONFIG.ACCEPTED_TYPES.includes(mimeType as (typeof FILE_UPLOAD_CONFIG.ACCEPTED_TYPES)[number])) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: ERROR_MESSAGES.INVALID_FILE_TYPE 
        },
        { status: 400 }
      );
    }

    // Estimate file size from base64 data
    const estimatedSize = (imageData.length * 3) / 4;
    if (estimatedSize > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: ERROR_MESSAGES.FILE_TOO_LARGE 
        },
        { status: 400 }
      );
    }

    // Perform OCR on the image using Tesseract.js
    const ocrResult = await performEnhancedOCR(imageData, filename);
    
    if (!ocrResult.success) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: ERROR_MESSAGES.OCR_FAILED,
          data: { 
            ocr_result: ocrResult,
            attempts: ocrResult.attempts,
            confidence: ocrResult.confidence
          }
        },
        { status: 422 }
      );
    }

    // Process OCR result to extract survey data
    const parsedData = processOCRResult(ocrResult);

    // Return results
    return NextResponse.json({
      status: 'success',
      data: {
        ocr_result: ocrResult,
        parsed_data: parsedData
      }
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Generic error response
    return NextResponse.json(
      { 
        status: 'error', 
        error: ERROR_MESSAGES.PROCESSING_ERROR,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}