import { NextRequest, NextResponse } from 'next/server';
import { RecommendationsRequestSchema } from '@/lib/validation';
import { generateRecommendations, generateRecommendationSummary } from '@/utils/recommendationEngine';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = RecommendationsRequestSchema.safeParse(body);
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

    const { risk_assessment, user_preferences } = validation.data;

    // Generate personalized recommendations
    const recommendations = generateRecommendations(risk_assessment, user_preferences);
    
    // Generate summary for quick overview
    const summary = generateRecommendationSummary(recommendations.recommendations);

    // Return successful recommendations
    return NextResponse.json({
      status: 'success',
      data: {
        ...recommendations,
        summary
      }
    });

  } catch (error) {
    console.error('Recommendations generation error:', error);
    
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