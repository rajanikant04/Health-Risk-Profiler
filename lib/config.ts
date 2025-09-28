// Environment configuration for production deployment
export const config = {
  app: {
    name: process.env.APP_NAME || 'Health Risk Profiler',
    version: process.env.APP_VERSION || '1.0.0',
    url: process.env.APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
  
  ocr: {
    processingTimeout: parseInt(process.env.OCR_PROCESSING_TIMEOUT || '30000'),
    maxFileSize: parseInt(process.env.OCR_MAX_FILE_SIZE || '10485760'), // 10MB
    confidenceThreshold: parseFloat(process.env.OCR_CONFIDENCE_THRESHOLD || '0.75'),
  },
  
  security: {
    secureHeaders: process.env.SECURE_HEADERS === 'true',
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED === 'true',
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  },
  
  performance: {
    enableCompression: process.env.ENABLE_COMPRESSION === 'true',
    enableStaticOptimization: process.env.ENABLE_STATIC_OPTIMIZATION === 'true',
  },
  
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    analyticsId: process.env.ANALYTICS_ID,
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  },
  
  development: {
    enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
    enableOcrTesting: process.env.ENABLE_OCR_TESTING === 'true',
  },
  
  // Feature flags
  features: {
    ocrProcessing: true,
    riskAssessment: true,
    recommendations: true,
    fileUpload: true,
    analytics: process.env.NODE_ENV === 'production',
  },
};

// Validate required environment variables
export function validateEnvironment() {
  const required = ['NODE_ENV'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Development helpers
export const isDevelopment = config.app.env === 'development';
export const isProduction = config.app.env === 'production';
export const isTest = config.app.env === 'test';

// Logging helper
export function log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  if (isDevelopment || config.development.enableDebugLogs) {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
  }
}