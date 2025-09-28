'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SurveyResponse } from '@/types';
import { SurveyForm } from '@/components/forms/SurveyForm';
import { Card, Button } from '@/components/ui/BasicComponents';

export default function AssessmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSurveySubmit = async (data: SurveyResponse) => {
    setIsSubmitting(true);
    
    try {
      // Store survey data in sessionStorage for now
      sessionStorage.setItem('surveyData', JSON.stringify(data));
      
      // Navigate to results with processing
      router.push('/results?source=survey');
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium mb-4">
            <span>📋</span>
            <span>Health Assessment</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Complete Your Health Survey
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Please fill out this comprehensive health questionnaire. Your responses will be used to 
            calculate your personalized health risk profile and generate tailored recommendations.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                1
              </div>
              <span>Survey</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-700"></div>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-medium">
                2
              </div>
              <span>Analysis</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-700"></div>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-medium">
                3
              </div>
              <span>Results</span>
            </div>
          </div>
        </div>

        {/* Survey Form */}
        <Card className="bg-gray-800/50 border-gray-700">
          <div className="p-6">
            <SurveyForm 
              onSubmit={handleSurveySubmit}
              isLoading={isSubmitting}
            />
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <Card className="bg-gray-800/30 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                If you have questions about any of the survey fields, our AI assistant can help you understand what information to provide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="secondary" size="sm">
                  View Help Guide
                </Button>
                <Button variant="secondary" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            🔒 Your health information is processed securely and privately. 
            We do not store your personal health data on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}