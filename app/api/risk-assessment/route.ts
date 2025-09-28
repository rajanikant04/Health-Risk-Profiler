import { NextRequest, NextResponse } from 'next/server';
import { RiskAssessmentRequestSchema } from '@/lib/validation';
import { calculateRiskScore, generateDetailedRiskAssessment } from '@/utils/riskCalculator';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = RiskAssessmentRequestSchema.safeParse(body);
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

    const { answers, include_factors } = validation.data;

    // Calculate risk assessment
    let riskAssessment;
    if (include_factors) {
      riskAssessment = generateDetailedRiskAssessment(answers);
    } else {
      riskAssessment = calculateRiskScore(answers);
    }

    // Return successful assessment
    return NextResponse.json({
      status: 'success',
      data: riskAssessment
    });

  } catch (error) {
    console.error('Risk assessment error:', error);
    
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