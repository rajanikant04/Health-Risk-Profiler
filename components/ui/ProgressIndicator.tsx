'use client';

import { ProcessingStatus } from '@/types';
import { Card, ProgressBar, LoadingSpinner } from '@/components/ui/BasicComponents';

interface ProgressIndicatorProps {
  status: ProcessingStatus;
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ status, steps, currentStep }: ProgressIndicatorProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (stepIndex: number) => {
    const stepStatus = getStepStatus(stepIndex);
    switch (stepStatus) {
      case 'completed': return '✅';
      case 'current': return '⏳';
      case 'pending': return '⭕';
      default: return '❓';
    }
  };

  const getStepColor = (stepIndex: number) => {
    const stepStatus = getStepStatus(stepIndex);
    switch (stepStatus) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'current': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-400 bg-gray-50';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  return (
    <Card title="Processing Your Health Assessment">
      <div className="space-y-6">
        {/* Current Status */}
        <div className="text-center">
          <div className="mb-4">
            {status.error ? (
              <div className="text-red-600">
                <div className="text-4xl mb-2">❌</div>
                <p className="font-semibold">Processing Error</p>
              </div>
            ) : status.stage === 'complete' ? (
              <div className="text-green-600">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-semibold">Analysis Complete!</p>
              </div>
            ) : (
              <div>
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="font-semibold text-gray-900">{status.message}</p>
              </div>
            )}
          </div>
          
          <ProgressBar 
            progress={status.progress} 
            label="Overall Progress"
            className="max-w-md mx-auto"
          />
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Processing Steps:</h4>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${getStepColor(index)}`}
              >
                <div className="text-xl">
                  {getStepIcon(index)}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    getStepStatus(index) === 'current' ? 'text-blue-900' :
                    getStepStatus(index) === 'completed' ? 'text-green-900' :
                    'text-gray-500'
                  }`}>
                    {step}
                  </p>
                  {getStepStatus(index) === 'current' && (
                    <p className="text-sm text-blue-700 mt-1">
                      {status.message}
                    </p>
                  )}
                </div>
                {getStepStatus(index) === 'current' && (
                  <LoadingSpinner size="sm" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Details */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
            <p className="text-sm text-red-700">{status.error}</p>
            <div className="mt-3">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Analysis
              </button>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {!status.error && status.stage !== 'complete' && (
          <div className="text-center text-sm text-gray-600">
            <p>Estimated time remaining: {Math.max(1, Math.ceil((100 - status.progress) / 20))} minute(s)</p>
            <p className="mt-1">Please keep this page open while we process your information.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

// Helper component for step-by-step processing display
export function ProcessingSteps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl mb-2">📝</div>
        <h4 className="font-semibold text-blue-900 mb-1">Data Parsing</h4>
        <p className="text-sm text-blue-700">Extracting survey information</p>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-2xl mb-2">🔍</div>
        <h4 className="font-semibold text-purple-900 mb-1">Factor Analysis</h4>
        <p className="text-sm text-purple-700">Identifying health factors</p>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="text-2xl mb-2">📊</div>
        <h4 className="font-semibold text-orange-900 mb-1">Risk Calculation</h4>
        <p className="text-sm text-orange-700">Computing risk assessment</p>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl mb-2">💡</div>
        <h4 className="font-semibold text-green-900 mb-1">Recommendations</h4>
        <p className="text-sm text-green-700">Generating personalized advice</p>
      </div>
    </div>
  );
}