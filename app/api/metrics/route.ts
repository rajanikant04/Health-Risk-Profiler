import { NextRequest, NextResponse } from 'next/server';
import { config, log } from '@/lib/config';

interface MetricData {
  metric: string;
  value: number;
  timestamp?: string;
  tags?: Record<string, string>;
}

interface SystemMetrics {
  timestamp: string;
  memory: {
    used_mb: number;
    total_mb: number;
    usage_percentage: number;
  };
  performance: {
    uptime_seconds: number;
    response_times: {
      avg_ms: number;
      samples: number;
    };
  };
  usage: {
    api_calls_total: number;
    ocr_processing_total: number;
    errors_total: number;
  };
  health: {
    status: string;
    last_error?: string;
  };
}

// Simple in-memory metrics storage (in production, use Redis or similar)
const metrics = {
  apiCalls: 0,
  ocrProcessing: 0,
  errors: 0,
  responseTimes: [] as number[],
  lastError: null as string | null,
};

export async function GET() {
  try {
    // Get current system metrics
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const usagePercentage = Math.round((memoryUsedMB / memoryTotalMB) * 100);

    // Calculate average response time
    const avgResponseTime = metrics.responseTimes.length > 0
      ? Math.round(metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length)
      : 0;

    const systemMetrics: SystemMetrics = {
      timestamp: new Date().toISOString(),
      memory: {
        used_mb: memoryUsedMB,
        total_mb: memoryTotalMB,
        usage_percentage: usagePercentage,
      },
      performance: {
        uptime_seconds: Math.round(process.uptime()),
        response_times: {
          avg_ms: avgResponseTime,
          samples: metrics.responseTimes.length,
        },
      },
      usage: {
        api_calls_total: metrics.apiCalls,
        ocr_processing_total: metrics.ocrProcessing,
        errors_total: metrics.errors,
      },
      health: {
        status: usagePercentage > 80 ? 'warning' : 'healthy',
        last_error: metrics.lastError || undefined,
      },
    };

    return NextResponse.json(systemMetrics);

  } catch (error) {
    console.error('Metrics endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MetricData = await request.json();
    const { metric, value, tags } = body;

    // Validate input
    if (!metric || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data. Required: metric (string), value (number)' },
        { status: 400 }
      );
    }

    // Update internal metrics
    switch (metric) {
      case 'api_call':
        metrics.apiCalls += value;
        break;
      case 'ocr_processing':
        metrics.ocrProcessing += value;
        break;
      case 'error':
        metrics.errors += value;
        if (tags?.message) {
          metrics.lastError = tags.message;
        }
        break;
      case 'response_time':
        metrics.responseTimes.push(value);
        // Keep only last 100 response times
        if (metrics.responseTimes.length > 100) {
          metrics.responseTimes = metrics.responseTimes.slice(-100);
        }
        break;
    }

    // Log metric in development
    if (config.development.enableDebugLogs) {
      log('info', `Metric recorded: ${metric} = ${value}`, tags);
    }

    // In production, you would send this to your monitoring service
    if (config.app.env === 'production' && config.monitoring.sentryDsn) {
      // Example: Send to monitoring service
      // await sendMetricToMonitoringService(metric, value, tags);
    }

    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      metric,
      value,
    });

  } catch (error) {
    console.error('Metrics recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    );
  }
}

// Handle CORS for all HTTP methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}