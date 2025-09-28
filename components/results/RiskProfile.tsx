'use client';

import { RiskAssessment } from '@/types';
import { Card, Alert } from '@/components/ui/BasicComponents';
import { CHART_COLORS, MEDICAL_DISCLAIMER } from '@/lib/constants';

interface RiskProfileProps {
  assessment: RiskAssessment;
  showDetails?: boolean;
}

export function RiskProfile({ assessment, showDetails = true }: RiskProfileProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return CHART_COLORS.LOW_RISK;
      case 'moderate': return CHART_COLORS.MODERATE_RISK;
      case 'high': return CHART_COLORS.HIGH_RISK;
      default: return CHART_COLORS.SECONDARY;
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return '✅';
      case 'moderate': return '⚠️';
      case 'high': return '🚨';
      default: return '❓';
    }
  };

  const getRiskDescription = (level: string) => {
    switch (level) {
      case 'low':
        return 'Your current lifestyle choices support good health outcomes. Continue maintaining these healthy habits.';
      case 'moderate':
        return 'Some lifestyle factors may increase your health risks over time. Consider making gradual improvements.';
      case 'high':
        return 'Multiple factors significantly increase your risk of health complications. Prioritize immediate lifestyle changes and consult healthcare professionals.';
      default:
        return 'Unable to determine risk level.';
    }
  };

  const confidencePercentage = Math.round(assessment.confidence * 100);

  return (
    <div className="space-y-6">
      {/* Main Risk Score */}
      <Card>
        <div className="text-center">
          <div className="mb-4">
            <div 
              className="mx-auto w-32 h-32 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: getRiskColor(assessment.risk_level) }}
            >
              <div>
                <div className="text-4xl mb-1">{assessment.score}</div>
                <div className="text-sm">Risk Score</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{getRiskIcon(assessment.risk_level)}</span>
              <h2 className="text-2xl font-bold capitalize" style={{ color: getRiskColor(assessment.risk_level) }}>
                {assessment.risk_level} Risk
              </h2>
            </div>
            
            <p className="text-gray-600 max-w-lg mx-auto">
              {getRiskDescription(assessment.risk_level)}
            </p>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Assessment Confidence: {confidencePercentage}%
          </div>
        </div>
      </Card>

      {/* Risk Factors Breakdown */}
      {showDetails && assessment.contributing_factors && assessment.contributing_factors.length > 0 && (
        <Card title="Contributing Risk Factors">
          <div className="space-y-4">
            {assessment.contributing_factors.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        factor.severity === 'high' ? 'bg-red-100 text-red-800' :
                        factor.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {factor.severity} severity
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Category: {factor.category}</span>
                      <span>Impact: {factor.points} points</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: getRiskColor(factor.severity) }}>
                      {factor.points}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Risk Categories Explanation */}
      <Card title="Risk Level Guide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <h4 className="font-semibold text-green-800 mb-2">Low Risk (0-30)</h4>
            <p className="text-sm text-green-700">
              Excellent health habits. Continue current lifestyle with minor optimizations.
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">⚠️</div>
            <h4 className="font-semibold text-yellow-800 mb-2">Moderate Risk (31-60)</h4>
            <p className="text-sm text-yellow-700">
              Some areas for improvement. Gradual lifestyle changes recommended.
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl mb-2">🚨</div>
            <h4 className="font-semibold text-red-800 mb-2">High Risk (61+)</h4>
            <p className="text-sm text-red-700">
              Multiple risk factors present. Immediate action and medical consultation advised.
            </p>
          </div>
        </div>
      </Card>

      {/* Medical Disclaimer */}
      <Alert type="warning">
        <div className="text-sm">
          <strong>Important Medical Disclaimer:</strong>
          <p className="mt-1">
            {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </Alert>
    </div>
  );
}