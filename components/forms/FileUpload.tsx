'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploadProps } from '@/types';
import { Button, Card, Alert, LoadingSpinner } from '@/components/ui/BasicComponents';
import { FILE_UPLOAD_CONFIG } from '@/lib/constants';
import { preprocessImageForOCR } from '@/utils/ocrProcessor';

export function FileUpload({ 
  onFileUpload, 
  acceptedTypes = [...FILE_UPLOAD_CONFIG.ACCEPTED_TYPES],
  maxFileSize = FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
  isProcessing = false 
}: FileUploadProps) {
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preprocessingEnabled, setPreprocessingEnabled] = useState(true);
  const [showPreprocessingPreview, setShowPreprocessingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createPreprocessingPreview = useCallback((file: File) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image (scaled down if too large)
      const maxWidth = 400;
      const maxHeight = 300;
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Apply preprocessing if enabled
      if (preprocessingEnabled) {
        preprocessImageForOCR(canvas);
      }
    };
    
    img.src = URL.createObjectURL(file);
  }, [preprocessingEnabled]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        setUploadError(`File is too large. Maximum size is ${Math.round(maxFileSize / (1024 * 1024))}MB`);
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        setUploadError('Invalid file type. Please upload PNG, JPG, or PDF files only.');
      } else {
        setUploadError('File upload failed. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      // Generate preview if it's an image
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        
        // Create preview canvas for preprocessing demo
        if (showPreprocessingPreview) {
          createPreprocessingPreview(file);
        }
      }
      
      onFileUpload(file);
    }
  }, [onFileUpload, maxFileSize, showPreprocessingPreview, createPreprocessingPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: maxFileSize,
    maxFiles: 1,
    disabled: isProcessing
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError('');
    setShowPreprocessingPreview(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  return (
    <Card title="Upload Health Survey Form">
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          <p>Upload a scanned or photographed health survey form. We'll extract the information automatically using OCR technology.</p>
          <p className="mt-2">
            <strong>Supported formats:</strong> PNG, JPG, GIF, WebP, PDF<br />
            <strong>Maximum file size:</strong> {Math.round(maxFileSize / (1024 * 1024))}MB
          </p>
        </div>

        {uploadError && (
          <Alert type="error">
            {uploadError}
          </Alert>
        )}

        {!uploadedFile && !isProcessing && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="text-6xl">📄</div>
              {isDragActive ? (
                <p className="text-lg text-blue-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drag & drop your survey form here
                  </p>
                  <p className="text-gray-600">or</p>
                  <Button variant="secondary" type="button">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {uploadedFile && !isProcessing && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {uploadedFile.type.startsWith('image/') ? '🖼️' : '📄'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={removeFile}
                type="button"
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="border rounded-lg p-8 bg-blue-50">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <div>
                <p className="text-lg font-medium text-blue-900">Processing your document...</p>
                <p className="text-blue-700">
                  We're extracting text from your uploaded file. This may take a moment.
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadedFile && uploadedFile.type.startsWith('image/') && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preprocessingEnabled}
                    onChange={(e) => setPreprocessingEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-blue-900">
                    Enable OCR preprocessing (improves text recognition)
                  </span>
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreprocessingPreview(!showPreprocessingPreview)}
                  type="button"
                >
                  {showPreprocessingPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
              
              {showPreprocessingPreview && (
                <div className="space-y-2">
                  <p className="text-sm text-blue-700">
                    Preprocessing converts the image to grayscale and increases contrast for better OCR results.
                  </p>
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto border border-blue-200 rounded"
                    style={{ display: showPreprocessingPreview ? 'block' : 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Tips for better OCR results:</h3>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Ensure the document is well-lit and clearly visible</li>
                <li>Avoid shadows, glare, or blurry images</li>
                <li>Make sure text is horizontal and not rotated</li>
                <li>Use high resolution images when possible</li>
                <li>Ensure the entire form is visible in the image</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Your uploaded files are processed securely and are not stored on our servers.
        </div>
      </div>
    </Card>
  );
}