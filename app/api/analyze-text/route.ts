import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeTextRequestSchema } from '@/lib/validation';
import { parseTextualInput, validateParsedData } from '@/utils/textParser';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = AnalyzeTextRequestSchema.safeParse(body);
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

    const { text, format } = validation.data;

    // Parse the text input
    const parsedData = parseTextualInput(text, format);
    
    // Validate the parsed data meets minimum requirements
    const validationResult = validateParsedData(parsedData);
    
    if (!validationResult.isValid) {
      return NextResponse.json({
        status: 'incomplete_profile',
        reason: validationResult.reason,
        suggestions: validationResult.suggestions,
        data: parsedData
      });
    }

    // Return successful parsing result
    return NextResponse.json({
      status: 'success',
      data: parsedData
    });

  } catch (error) {
    console.error('Text analysis error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('JSON parsing failed')) {
        return NextResponse.json(
          { 
            status: 'error', 
            error: ERROR_MESSAGES.INVALID_INPUT,
            details: error.message
          },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        status: 'error', 
        error: ERROR_MESSAGES.PROCESSING_ERROR 
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

// Add CORS headers to all responses
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}