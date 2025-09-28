'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/BasicComponents';

export default function Home() {
  const features = [
    {
      icon: '🔍',
      title: 'OCR Technology',
      description: 'Upload health forms and let our AI extract information automatically',
      href: '/upload'
    },
    {
      icon: '📋',
      title: 'Health Assessment',
      description: 'Complete comprehensive health surveys with intelligent validation',
      href: '/assessment'
    },
    {
      icon: '🎯',
      title: 'Risk Analysis',
      description: 'Get detailed risk profiles based on evidence-based algorithms',
      href: '/results'
    },
    {
      icon: '💡',
      title: 'Personalized Recommendations',
      description: 'Receive tailored health advice and actionable insights',
      href: '/recommendations'
    }
  ];

  const benefits = [
    'Evidence-based risk assessment algorithms',
    'Advanced OCR for document processing',
    'Personalized health recommendations',
    'Secure and private data handling',
    'Professional-grade analysis',
    'Easy-to-understand results'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium">
                <span>🚀</span>
                <span>AI-Powered Health Technology</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Health Risk Profiler
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced health risk assessment using cutting-edge OCR technology and evidence-based algorithms. 
              Get personalized recommendations and comprehensive health insights in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/assessment"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Start Health Assessment
              </Link>
              <Link 
                href="/upload"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
              >
                Upload Health Form
              </Link>
            </div>

            <div className="mt-12 text-sm text-gray-400">
              <p>✅ HIPAA Compliant • ✅ Secure Processing • ✅ Evidence-Based</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Advanced Health Technology
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Combining artificial intelligence, OCR technology, and medical expertise 
              to provide comprehensive health risk assessments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer h-full">
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Our platform combines the latest in AI technology with medical expertise 
                to provide you with accurate, personalized health insights that you can trust.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link 
                  href="/about"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Learn more about our technology
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Real-time Analysis</h4>
                      <p className="text-gray-400 text-sm">Instant risk assessment results</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Privacy First</h4>
                      <p className="text-gray-400 text-sm">Your data never leaves your device</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Personalized Results</h4>
                      <p className="text-gray-400 text-sm">Tailored recommendations just for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Take control of your health with our comprehensive risk assessment. 
              Get started in just a few minutes and receive personalized insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/assessment"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Begin Assessment Now
              </Link>
              <Link 
                href="/upload"
                className="bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
              >
                Upload Document
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}