import { Card, Button } from '@/components/ui/BasicComponents';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium mb-4">
            <span>ℹ️</span>
            <span>About This Project</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            AI-Powered Health Risk Profiler
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced health risk assessment using artificial intelligence, 
            OCR technology, and evidence-based medical research.
          </p>
        </div>

        {/* Project Overview */}
        <div className="mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  The AI-Powered Health Risk Profiler is a comprehensive web application designed to assess 
                  health risks through multiple input methods. It combines modern web technologies with 
                  evidence-based medical research to provide personalized health insights.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="mr-2">🎯</span>
                      Key Features
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Interactive health survey with smart validation</li>
                      <li>• OCR-powered document processing</li>
                      <li>• Evidence-based risk scoring algorithms</li>
                      <li>• Personalized health recommendations</li>
                      <li>• Comprehensive data export capabilities</li>
                      <li>• Privacy-focused architecture</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="mr-2">🔧</span>
                      Technology Stack
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Next.js 15 with App Router</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• Tesseract.js for OCR processing</li>
                      <li>• Chart.js for data visualization</li>
                      <li>• Zod for data validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Assessment Methodology */}
        <div className="mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Assessment Methodology</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">📊</span>
                    Risk Calculation Algorithm
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Our risk assessment algorithm is based on established medical research and clinical guidelines. 
                    It evaluates multiple health factors including:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-white">
                      <h4 className="text-white font-medium mb-2">Lifestyle Factors</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Physical activity levels</li>
                        <li>• Smoking status</li>
                        <li>• Alcohol consumption</li>
                        <li>• Sleep patterns</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-white">
                      <h4 className="text-white font-medium mb-2">Clinical Indicators</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• BMI and weight status</li>
                        <li>• Blood pressure readings</li>
                        <li>• Cholesterol levels</li>
                        <li>• Blood sugar levels</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-white">
                      <h4 className="text-white font-medium mb-2">Demographic Data</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Age and gender</li>
                        <li>• Family medical history</li>
                        <li>• Current medications</li>
                        <li>• Existing conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">🤖</span>
                    OCR Technology
                  </h3>
                  <p className="text-gray-300">
                    The application uses advanced Optical Character Recognition (OCR) technology to extract 
                    information from uploaded health forms. The OCR system can process various document types 
                    including scanned forms, photographs, and digital documents, automatically parsing relevant 
                    health information for risk assessment.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Privacy & Security */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                <span className="mr-3">🔒</span>
                Privacy & Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Protection</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• No server-side data storage</li>
                    <li>• Client-side processing only</li>
                    <li>• Temporary session storage</li>
                    <li>• No tracking or analytics</li>
                    <li>• Secure HTTPS transmission</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">User Control</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Full data export capabilities</li>
                    <li>• Clear session data anytime</li>
                    <li>• No account registration required</li>
                    <li>• Transparent processing methods</li>
                    <li>• Open-source architecture</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Limitations & Disclaimers */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                <span className="mr-3">⚠️</span>
                Important Disclaimers
              </h2>
              
              <div className="space-y-4 text-yellow-300/90">
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">Medical Advice Limitation</h3>
                  <p className="text-sm">
                    This application provides educational health risk assessments only. It does not provide 
                    medical advice, diagnosis, or treatment recommendations. Always consult with qualified 
                    healthcare professionals for medical decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">Accuracy Considerations</h3>
                  <p className="text-sm">
                    Risk assessments are estimates based on population data and may not reflect individual 
                    circumstances. OCR accuracy depends on document quality and may require manual verification.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">Scope Limitations</h3>
                  <p className="text-sm">
                    This tool focuses on common health risk factors and may not account for rare conditions, 
                    genetic factors, or complex medical histories. It should complement, not replace, 
                    professional medical evaluation.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Details */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">Technical Implementation</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">🏗️</span>
                    Architecture
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Frontend:</strong> Next.js 15 with React Server Components
                    </div>
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Styling:</strong> Tailwind CSS with custom dark theme
                    </div>
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Type Safety:</strong> Full TypeScript implementation
                    </div>
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Data Processing:</strong> Client-side only for privacy
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">⚡</span>
                    Performance
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Loading:</strong> Optimized bundle with code splitting
                    </div>
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">OCR:</strong> Web Workers for non-blocking processing
                    </div>
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Caching:</strong> Intelligent asset caching strategies
                    </div>
                    <div className="bg-gray-700/30 border border-gray-600 rounded p-3">
                      <strong className="text-white">Responsive:</strong> Mobile-first responsive design
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-purple-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Assess Your Health Risks?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Choose your preferred method to begin your personalized health risk assessment. 
                Both options provide comprehensive analysis with actionable recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link href="/assessment">
                  <Button className="w-full">
                    Interactive Survey
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="secondary" className="w-full">
                    Upload Document
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}