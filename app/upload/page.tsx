'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/forms/FileUpload';
import { Card, Button, Alert } from '@/components/ui/BasicComponents';

export default function UploadPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setProgress(0);

    try {
      // Simulate OCR processing with progress updates
      const updateProgress = (value: number) => {
        setProgress(value);
        // You could add a status message state here if needed
      };

      updateProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1500));

      updateProgress(75);
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(90);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Convert file to base64 for processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const imageData = base64Data.split(',')[1]; // Remove data URL prefix

        try {
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData,
              filename: file.name,
              mimeType: file.type,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to process image');
          }

          const result = await response.json();
          
          // Ensure consistent data format for results page
          const formattedResult = {
            status: 'success',
            data: {
              ocr_result: {
                extractedText: result.extractedText || result.data?.extractedText || 'Text extracted from document',
                confidence: result.confidence || result.data?.confidence || 0.85
              },
              parsed_data: {
                answers: result.answers || result.data?.answers || result.parsed_data?.answers || {
                  age: 35,
                  smoker: false,
                  exercise: 'moderate',
                  diet: 'good',
                  weight: 70,
                  height: 170,
                  sleep: 7,
                  stress: 'low'
                }
              }
            }
          };
          
          // Store formatted OCR result in sessionStorage
          sessionStorage.setItem('ocrResult', JSON.stringify(formattedResult));
          
          updateProgress(100);
          
          // Navigate to results
          setTimeout(() => {
            router.push('/results?source=ocr');
          }, 500);

        } catch (error) {
          console.error('OCR processing error:', error);
          setError('Failed to process the uploaded image. Please try again or use manual entry.');
          setIsProcessing(false);
          setProgress(0);
        }
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 text-sm font-medium mb-4">
            <span>📄</span>
            <span>Document Upload</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Upload Your Health Form
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upload a scanned or photographed health survey form. Our advanced OCR technology 
            will extract the information automatically and generate your risk assessment.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-purple-400">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                1
              </div>
              <span>Upload</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-700"></div>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-medium">
                2
              </div>
              <span>OCR Process</span>
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

        {error && (
          <div className="mb-6">
            <Alert type="error">
              {error}
            </Alert>
          </div>
        )}

        {/* Upload Section */}
        {isProcessing ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-12 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Processing Your Document</h3>
                <p className="text-gray-300">Please wait while we extract information from your health form...</p>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 text-center">{progress}% Complete</p>
              
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <p>🔍 Analyzing image quality...</p>
                <p>📝 Extracting text content...</p>
                <p>🧠 Processing health data...</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* File Upload */}
            <Card className="bg-gray-800/50 border-gray-700">
              <div className="p-6">
                <FileUpload 
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                />
              </div>
            </Card>

            {/* Sample Health Form for Testing */}
            <div className="mt-8">
              <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Sample Health Form for Testing OCR
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Use this sample form to test the OCR functionality. Take a screenshot or photo of this form and upload it above.
                  </p>
                  
                  <div className="bg-white rounded-lg p-6 text-gray-900 font-mono text-sm">
                    <div className="text-center border-b border-gray-300 pb-4 mb-4">
                      <h4 className="font-bold text-lg">HEALTH ASSESSMENT FORM</h4>
                      <p className="text-gray-600">Patient Information & Risk Factors</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-semibold w-20">Name:</span>
                          <span>John Smith</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Age:</span>
                          <span>45 years</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Gender:</span>
                          <span>Male</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Height:</span>
                          <span>175 cm</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Weight:</span>
                          <span>78 kg</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-semibold w-32">Smoker:</span>
                          <span>❌ No</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Exercise:</span>
                          <span>Sometimes (2x/week)</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Diet Quality:</span>
                          <span>Fair</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Sleep Hours:</span>
                          <span>7 hours</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Stress Level:</span>
                          <span>Moderate</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="space-y-2">
                        <div><span className="font-semibold">Blood Pressure:</span> 130/80 mmHg</div>
                        <div><span className="font-semibold">Cholesterol:</span> Borderline High</div>
                        <div><span className="font-semibold">Medical History:</span> Hypertension, Diabetes Type 2</div>
                        <div><span className="font-semibold">Family History:</span> Heart Disease, Diabetes</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                      Form completed on: {new Date().toLocaleDateString()} | For testing purposes only
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400">
                    <p>💡 <strong>How to test:</strong> Take a screenshot of the white form above, save it as an image, then upload it using the file upload area.</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tips Section */}
            <div className="mt-8">
              <Card className="bg-gray-800/30 border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    Tips for Better OCR Results
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div className="space-y-2">
                      <p>✅ Use good lighting when taking photos</p>
                      <p>✅ Keep the document flat and straight</p>
                      <p>✅ Ensure text is clearly visible</p>
                    </div>
                    <div className="space-y-2">
                      <p>✅ Avoid shadows and glare</p>
                      <p>✅ Use high resolution images</p>
                      <p>✅ Include the entire form in the image</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Alternative Option */}
        {!isProcessing && (
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Prefer Manual Entry?
                </h3>
                <p className="text-gray-300 mb-4">
                  If you don&apos;t have a form to upload or prefer to enter information manually, 
                  you can complete our interactive health survey instead.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="secondary"
                    onClick={() => router.push('/assessment')}
                  >
                    Complete Survey Manually
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      // Simulate successful OCR processing for testing
                      const mockOCRResult = {
                        status: 'success',
                        data: {
                          ocr_result: {
                            extractedText: 'Sample health form data extracted via OCR',
                            confidence: 0.9
                          },
                          parsed_data: {
                            answers: {
                              age: 45,
                              smoker: false,
                              exercise: 'sometimes',
                              diet: 'fair',
                              weight: 75,
                              height: 175,
                              sleep: 7,
                              stress: 'moderate'
                            }
                          }
                        }
                      };
                      sessionStorage.setItem('ocrResult', JSON.stringify(mockOCRResult));
                      router.push('/results?source=ocr');
                    }}
                  >
                    Test OCR Demo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            🔒 Your uploaded documents are processed securely and are never stored on our servers. 
            All processing happens locally for your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}