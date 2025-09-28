'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RiskProfile } from '@/components/results/RiskProfile';
import { Card, Button } from '@/components/ui/BasicComponents';
import { RiskAssessment, SurveyResponse, HealthFactor, Recommendation } from '@/types';

// Function to generate personalized recommendations
function generateRecommendations(surveyData: SurveyResponse, riskLevel: string): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Exercise recommendations
  if (!surveyData.exercise || surveyData.exercise === 'never' || surveyData.exercise === 'rarely') {
    recommendations.push({
      id: 'exercise-increase',
      category: 'exercise',
      priority: riskLevel === 'high' ? 'high' : 'medium',
      title: 'Increase Physical Activity',
      description: 'Regular physical activity is crucial for reducing health risks and improving overall well-being.',
      action_items: [
        'Start with 20-30 minutes of brisk walking daily',
        'Gradually increase to 150 minutes of moderate exercise per week',
        'Include strength training exercises 2-3 times per week',
        'Consider joining a fitness class or finding an exercise buddy'
      ],
      timeline: 'Start immediately, build up over 4-6 weeks',
      evidence_level: 'Strong scientific evidence'
    });
  }

  // Diet recommendations
  if (!surveyData.diet || surveyData.diet === 'poor' || surveyData.diet === 'fair') {
    recommendations.push({
      id: 'diet-improve',
      category: 'diet',
      priority: riskLevel === 'high' ? 'high' : 'medium',
      title: 'Improve Nutritional Intake',
      description: 'A balanced diet rich in nutrients can significantly reduce disease risk and improve energy levels.',
      action_items: [
        'Increase daily intake of fruits and vegetables to 5-7 servings',
        'Choose whole grains over refined carbohydrates',
        'Include lean proteins (fish, poultry, legumes) in meals',
        'Limit processed foods, sugary drinks, and excessive salt',
        'Stay hydrated with 8-10 glasses of water daily'
      ],
      timeline: 'Implement gradually over 2-4 weeks',
      evidence_level: 'Strong scientific evidence'
    });
  }

  // Smoking cessation
  if (surveyData.smoker === true) {
    recommendations.push({
      id: 'smoking-cessation',
      category: 'lifestyle',
      priority: 'high',
      title: 'Quit Smoking',
      description: 'Smoking cessation is the most important step you can take to improve your health and reduce disease risk.',
      action_items: [
        'Consult with healthcare provider about cessation programs',
        'Consider nicotine replacement therapy or prescription medications',
        'Join a smoking cessation support group',
        'Identify and avoid smoking triggers',
        'Replace smoking habits with healthy alternatives'
      ],
      timeline: 'Start immediately with professional support',
      evidence_level: 'Strong scientific evidence'
    });
  }

  // Sleep recommendations
  if (surveyData.sleep && (surveyData.sleep < 6 || surveyData.sleep > 9)) {
    recommendations.push({
      id: 'sleep-optimization',
      category: 'lifestyle',
      priority: 'medium',
      title: 'Optimize Sleep Quality',
      description: 'Quality sleep is essential for physical health, mental well-being, and disease prevention.',
      action_items: [
        'Maintain consistent sleep schedule (7-9 hours nightly)',
        'Create a relaxing bedtime routine',
        'Limit screen time 1 hour before bed',
        'Keep bedroom cool, dark, and quiet',
        'Avoid caffeine and large meals before bedtime'
      ],
      timeline: 'Implement sleep hygiene practices within 1-2 weeks',
      evidence_level: 'Strong scientific evidence'
    });
  }

  // Stress management
  if (surveyData.stress && (surveyData.stress === 'high' || surveyData.stress === 'very_high')) {
    recommendations.push({
      id: 'stress-management',
      category: 'lifestyle',
      priority: riskLevel === 'high' ? 'high' : 'medium',
      title: 'Develop Stress Management Strategies',
      description: 'Chronic stress can negatively impact physical and mental health. Learning to manage stress effectively is crucial.',
      action_items: [
        'Practice relaxation techniques (deep breathing, meditation)',
        'Regular physical exercise to reduce stress hormones',
        'Maintain social connections and seek support when needed',
        'Consider professional counseling if stress is overwhelming',
        'Identify and address sources of chronic stress'
      ],
      timeline: 'Start stress reduction techniques immediately',
      evidence_level: 'Strong scientific evidence'
    });
  }

  // Medical follow-up for high risk
  if (riskLevel === 'high') {
    recommendations.push({
      id: 'medical-consultation',
      category: 'medical',
      priority: 'high',
      title: 'Schedule Medical Consultation',
      description: 'Given your risk factors, it\'s important to work with healthcare professionals for comprehensive evaluation and monitoring.',
      action_items: [
        'Schedule appointment with primary care physician',
        'Discuss risk factors and get comprehensive health screening',
        'Consider referrals to specialists if needed',
        'Establish regular monitoring schedule',
        'Review and potentially adjust any current medications'
      ],
      timeline: 'Schedule within 2-4 weeks',
      evidence_level: 'Clinical guidelines recommendation'
    });
  }

  // Age-related recommendations
  if (surveyData.age && surveyData.age > 50) {
    recommendations.push({
      id: 'preventive-screening',
      category: 'medical',
      priority: 'medium',
      title: 'Stay Current with Preventive Screenings',
      description: 'Regular health screenings become increasingly important with age for early detection and prevention.',
      action_items: [
        'Annual blood pressure and cholesterol checks',
        'Regular cancer screening as recommended by age/gender',
        'Bone density screening (especially for women over 50)',
        'Eye and hearing examinations',
        'Vaccinations as recommended for your age group'
      ],
      timeline: 'Schedule overdue screenings within 1-3 months',
      evidence_level: 'Clinical guidelines recommendation'
    });
  }

  return recommendations;
}

// Function to process survey data into risk assessment
function processSurveyData(surveyData: SurveyResponse): RiskAssessment {
  let score = 0;
  const contributingFactors: HealthFactor[] = [];
  const rationale: string[] = [];

  // Age factor
  if (surveyData.age) {
    if (surveyData.age > 65) {
      score += 15;
      contributingFactors.push({
        name: 'Advanced Age',
        category: 'demographic',
        severity: 'moderate',
        points: 15,
        description: 'Age over 65 increases various health risks'
      });
      rationale.push('Advanced age (>65) contributes to increased health risks');
    } else if (surveyData.age > 45) {
      score += 8;
      contributingFactors.push({
        name: 'Middle Age',
        category: 'demographic',
        severity: 'low',
        points: 8,
        description: 'Age 45-65 has moderate health risk factors'
      });
      rationale.push('Middle age (45-65) has some associated health risks');
    }
  }

  // Smoking factor
  if (surveyData.smoker === true) {
    score += 25;
    contributingFactors.push({
      name: 'Smoking',
      category: 'lifestyle',
      severity: 'high',
      points: 25,
      description: 'Smoking significantly increases cardiovascular and cancer risks'
    });
    rationale.push('Smoking is a major risk factor for multiple health conditions');
  }

  // Exercise factor
  if (surveyData.exercise) {
    switch (surveyData.exercise) {
      case 'never':
        score += 15;
        contributingFactors.push({
          name: 'Sedentary Lifestyle',
          category: 'lifestyle',
          severity: 'moderate',
          points: 15,
          description: 'Lack of physical activity increases health risks'
        });
        rationale.push('Sedentary lifestyle contributes to various health issues');
        break;
      case 'rarely':
        score += 10;
        contributingFactors.push({
          name: 'Low Physical Activity',
          category: 'lifestyle',
          severity: 'moderate',
          points: 10,
          description: 'Insufficient physical activity'
        });
        rationale.push('Low physical activity levels increase health risks');
        break;
      case 'regularly':
      case 'daily':
        // Good exercise habits - reduce score
        score = Math.max(0, score - 5);
        rationale.push('Regular physical activity helps reduce health risks');
        break;
    }
  }

  // Diet factor
  if (surveyData.diet) {
    switch (surveyData.diet) {
      case 'poor':
        score += 12;
        contributingFactors.push({
          name: 'Poor Diet Quality',
          category: 'lifestyle',
          severity: 'moderate',
          points: 12,
          description: 'Poor nutrition increases disease risk'
        });
        rationale.push('Poor diet quality contributes to health risks');
        break;
      case 'fair':
        score += 5;
        contributingFactors.push({
          name: 'Fair Diet Quality',
          category: 'lifestyle',
          severity: 'low',
          points: 5,
          description: 'Diet could be improved for better health'
        });
        rationale.push('Diet quality has room for improvement');
        break;
      case 'excellent':
        // Good diet - reduce score
        score = Math.max(0, score - 3);
        rationale.push('Excellent nutrition helps maintain good health');
        break;
    }
  }

  // Determine risk level based on score (following Risk Level Guide)
  let riskLevel: 'low' | 'moderate' | 'high';
  if (score <= 30) {
    riskLevel = 'low';
  } else if (score <= 60) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }

  return {
    risk_level: riskLevel,
    score: Math.min(100, score), // Cap at 100
    rationale: rationale.length > 0 ? rationale : ['Assessment based on provided health information'],
    confidence: 0.85, // Default confidence level
    contributing_factors: contributingFactors,
  };
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [source, setSource] = useState<'survey' | 'ocr'>('survey');

  useEffect(() => {
    const loadResults = () => {
      try {
        // Determine source from URL params
        const sourceParam = searchParams.get('source');
        if (sourceParam === 'ocr') {
          setSource('ocr');
          
          // Load OCR results from sessionStorage
          const ocrResult = sessionStorage.getItem('ocrResult');
          if (ocrResult) {
            const parsedResult = JSON.parse(ocrResult);
            
            // Check if we have a processed assessment or raw data
            if (parsedResult.assessment) {
              setRiskAssessment(parsedResult.assessment);
            } else if (parsedResult.data && parsedResult.data.parsed_data) {
              // Process OCR extracted data into risk assessment
              const extractedData = parsedResult.data.parsed_data.answers;
              const processedAssessment = processSurveyData(extractedData);
              const generatedRecommendations = generateRecommendations(extractedData, processedAssessment.risk_level);
              setRiskAssessment(processedAssessment);
              setRecommendations(generatedRecommendations);
            } else if (parsedResult.status === 'success' && parsedResult.data) {
              // Handle API response format
              const extractedData = parsedResult.data.parsed_data?.answers || {};
              const processedAssessment = processSurveyData(extractedData);
              const generatedRecommendations = generateRecommendations(extractedData, processedAssessment.risk_level);
              setRiskAssessment(processedAssessment);
              setRecommendations(generatedRecommendations);
            } else {
              setError('OCR processing incomplete. Please try uploading the document again.');
            }
          } else {
            setError('No OCR results found. Please upload a document first.');
          }
        } else {
          // Load survey results from sessionStorage
          const surveyResult = sessionStorage.getItem('surveyResult');
          const surveyData = sessionStorage.getItem('surveyData');
          
          if (surveyResult) {
            const parsedResult = JSON.parse(surveyResult);
            setRiskAssessment(parsedResult);
            // Try to get survey data to generate recommendations
            const surveyData = sessionStorage.getItem('surveyData');
            if (surveyData) {
              const parsedData = JSON.parse(surveyData);
              const generatedRecommendations = generateRecommendations(parsedData, parsedResult.risk_level);
              setRecommendations(generatedRecommendations);
            }
          } else if (surveyData) {
            // Process raw survey data into risk assessment
            const parsedData = JSON.parse(surveyData);
            const processedAssessment = processSurveyData(parsedData);
            const generatedRecommendations = generateRecommendations(parsedData, processedAssessment.risk_level);
            setRiskAssessment(processedAssessment);
            setRecommendations(generatedRecommendations);
          } else {
            setError('No assessment results found. Please complete a health survey first.');
          }
        }
      } catch (error) {
        console.error('Error loading results:', error);
        setError('Failed to load assessment results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading Results</h3>
            <p className="text-gray-300">Please wait while we prepare your health risk assessment...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
                <p className="text-gray-400 mb-6">{error}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push('/assessment')}>
                  Complete Health Survey
                </Button>
                <Button variant="secondary" onClick={() => router.push('/upload')}>
                  Upload Document
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!riskAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">No Assessment Data</h2>
              <p className="text-gray-400 mb-6">
                We couldn&apos;t find any assessment data to display results.
              </p>
              <Button onClick={() => router.push('/assessment')}>
                Start New Assessment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-400 text-sm font-medium mb-4">
            <span>✅</span>
            <span>Assessment Complete</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Health Risk Assessment
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Based on {source === 'ocr' ? 'your uploaded health form' : 'your survey responses'}, 
            here&apos;s your personalized health risk profile and recommendations.
          </p>
        </div>

        {/* Data Source Info */}
        <div className="mb-6">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-full">
                  {source === 'ocr' ? (
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-blue-400 font-medium">
                    Assessment Source: {source === 'ocr' ? 'Document Upload (OCR)' : 'Manual Survey'}
                  </p>
                  <p className="text-blue-300/70 text-sm">
                    {source === 'ocr' 
                      ? 'Data extracted automatically from your uploaded health form'
                      : 'Data collected from your interactive health survey responses'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Risk Assessment Results */}
        <div className="mb-8">
          <RiskProfile assessment={riskAssessment} />
        </div>

        {/* Recommendations - We'll display these separately since they come from a different data structure */}
        {/* For now, let's show the contributing factors as recommendations */}
        <div className="mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Contributing Risk Factors
              </h3>
              <div className="space-y-3">
                {riskAssessment.contributing_factors.map((factor, index) => (
                  <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        factor.severity === 'high' ? 'bg-red-500' :
                        factor.severity === 'moderate' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{factor.name}</h4>
                        <p className="text-gray-300 text-sm mt-1">{factor.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="text-gray-500">Category: {factor.category}</span>
                          <span className="text-gray-500">Severity: {factor.severity}</span>
                          <span className="text-gray-500">Points: {factor.points}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Personalized Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                  <span className="mr-2">💡</span>
                  Personalized Health Recommendations
                </h3>
                <p className="text-gray-300 mb-6 text-sm">
                  Based on your assessment, here are evidence-based recommendations to help improve your health and reduce risk factors.
                </p>
                
                <div className="space-y-6">
                  {recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="bg-gray-800/30 border border-gray-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-semibold text-lg">{recommendation.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                              recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {recommendation.priority} priority
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{recommendation.description}</p>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                            recommendation.category === 'exercise' ? 'bg-blue-500/20 text-blue-400' :
                            recommendation.category === 'diet' ? 'bg-green-500/20 text-green-400' :
                            recommendation.category === 'lifestyle' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {recommendation.category === 'exercise' ? '🏃' :
                             recommendation.category === 'diet' ? '🥗' :
                             recommendation.category === 'lifestyle' ? '🧘' : '👨‍⚕️'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-white font-medium mb-2">Action Steps:</h5>
                          <ul className="space-y-1">
                            {recommendation.action_items.map((item, idx) => (
                              <li key={idx} className="text-gray-300 text-sm flex items-start">
                                <span className="text-green-400 mr-2 mt-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-700">
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Timeline:</span> {recommendation.timeline}
                          </div>
                          <div className="text-sm text-gray-400 mt-1 sm:mt-0">
                            <span className="font-medium">Evidence:</span> {recommendation.evidence_level}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 text-lg">⚠️</span>
                    <div>
                      <p className="text-yellow-400 font-medium text-sm">Important Note</p>
                      <p className="text-gray-300 text-sm mt-1">
                        These recommendations are for informational purposes only and should not replace professional medical advice. 
                        Always consult with qualified healthcare providers before making significant changes to your health routine.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Export Actions */}
        <div className="mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Export Your Results
              </h3>
              <p className="text-gray-300 mb-4">
                Download your health risk assessment results for your records or to share with healthcare providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    const dataStr = JSON.stringify(riskAssessment, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `health-risk-assessment-${new Date().toISOString().split('T')[0]}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                >
                  Download JSON
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    const content = `Health Risk Assessment Report
Generated: ${new Date().toLocaleDateString()}
Source: ${source === 'ocr' ? 'Document Upload (OCR)' : 'Manual Survey'}

Overall Risk Level: ${riskAssessment.risk_level}
Risk Score: ${riskAssessment.score}
Confidence Score: ${Math.round(riskAssessment.confidence * 100)}%

Contributing Factors:
${riskAssessment.contributing_factors.map((factor: HealthFactor) => `- ${factor.name}: ${factor.severity} (${factor.description})`).join('\n')}

Risk Rationale:
${riskAssessment.rationale.map((reason: string, i: number) => `${i + 1}. ${reason}`).join('\n')}

Disclaimer: This assessment is for informational purposes only and should not replace professional medical advice.`;
                    
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute('download', `health-risk-assessment-${new Date().toISOString().split('T')[0]}.txt`);
                    linkElement.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download Report
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gray-800/30 border-gray-700">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                Take Another Assessment
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Reassess your health risks with updated information or try a different method.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/assessment')}
                  className="flex-1"
                >
                  Manual Survey
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/upload')}
                  className="flex-1"
                >
                  Upload Document
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                Learn More
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Understand more about our health risk assessment methodology and recommendations.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => router.push('/about')}
              >
                About This Assessment
              </Button>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-yellow-500/20 rounded-full flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-yellow-400 font-medium text-sm">Medical Disclaimer</p>
                <p className="text-yellow-300/80 text-sm mt-1">
                  This assessment is for informational purposes only and should not replace professional medical advice. 
                  Please consult with healthcare professionals for personalized medical guidance and before making any 
                  health-related decisions based on these results.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Results</h3>
          <p className="text-gray-300">Preparing your assessment...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}