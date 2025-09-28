import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  services: {
    api: 'healthy' | 'unhealthy';
    ocr: 'healthy' | 'unhealthy';
    memory: 'healthy' | 'warning' | 'critical';
    response_time: number;
  };
  environment: string;
  system: {
    memory: NodeJS.MemoryUsage;
    node_version: string;
    platform: string;
  };
  endpoints: {
    [key: string]: string;
  };
}

// Simple cache for health metrics
let healthCheckCache: { timestamp: number; data: HealthStatus } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Check cache first
    if (healthCheckCache && (Date.now() - healthCheckCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(healthCheckCache.data, { status: 200 });
    }

    // Check system memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    let memoryStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (memoryUsedMB > 400) memoryStatus = 'critical';
    else if (memoryUsedMB > 200) memoryStatus = 'warning';

    // Test OCR availability
    let ocrStatus: 'healthy' | 'unhealthy' = 'healthy';
    try {
      // Quick check if Tesseract.js is available
      await import('tesseract.js');
    } catch (error) {
      ocrStatus = 'unhealthy';
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (ocrStatus === 'unhealthy' || memoryStatus === 'critical') {
      overallStatus = 'unhealthy';
    } else if (memoryStatus === 'warning' || responseTime > 2000) {
      overallStatus = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'Health Risk Profiler API',
      version: config.app.version,
      uptime: process.uptime(),
      services: {
        api: 'healthy',
        ocr: ocrStatus,
        memory: memoryStatus,
        response_time: responseTime,
      },
      environment: config.app.env,
      system: {
        memory: memoryUsage,
        node_version: process.version,
        platform: process.platform,
      },
      endpoints: {
        'POST /api/analyze-text': 'Parse text or JSON survey responses',
        'POST /api/analyze-image': 'Extract text from images using OCR',
        'POST /api/risk-assessment': 'Calculate health risk scores',
        'POST /api/recommendations': 'Generate personalized recommendations',
        'GET /api/health-check': 'System health status'
      }
    };

    // Cache the result
    healthCheckCache = {
      timestamp: Date.now(),
      data: healthStatus,
    };

    // Return appropriate HTTP status
    const httpStatus = overallStatus === 'healthy' ? 200 
                     : overallStatus === 'degraded' ? 200 
                     : 503;

    return NextResponse.json(healthStatus, { status: httpStatus });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'Health Risk Profiler API',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// Handle CORS for all HTTP methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}