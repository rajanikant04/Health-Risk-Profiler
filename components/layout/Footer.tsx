'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏥</span>
              <h3 className="text-white font-bold text-lg">Health Risk Profiler</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Advanced AI-powered health risk assessment with personalized recommendations and OCR technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link href="/assessment" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Health Survey
              </Link>
              <Link href="/upload" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Upload Document
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors text-sm">
                About
              </Link>
            </nav>
          </div>

          {/* Features */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• OCR Technology</li>
              <li>• Risk Assessment</li>
              <li>• Health Recommendations</li>
              <li>• Data Export</li>
              <li>• Privacy Focused</li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Privacy & Legal</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                🔒 Your data stays on your device
              </p>
              <p className="text-gray-300">
                📋 No registration required
              </p>
              <p className="text-yellow-400 text-xs">
                ⚠️ For educational purposes only
              </p>
              <p className="text-yellow-400 text-xs">
                Not a substitute for medical advice
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} AI-Powered Health Risk Profiler. Built with Next.js & TypeScript.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <span>🚀</span>
                <span>Next.js 15</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>💙</span>
                <span>TypeScript</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🎨</span>
                <span>Tailwind CSS</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}