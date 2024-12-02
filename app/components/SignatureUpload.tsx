'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface SignatureUploadProps {
  onSignatureUpload: (signature: string) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: number) => void;
}

export default function SignatureUpload({ 
  onSignatureUpload, 
  onPositionChange, 
  onSizeChange 
}: SignatureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [size, setSize] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG or JPG file');
      return false;
    }
    
    if (file.size > maxSize) {
      setError('File size must be less than 2MB');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onSignatureUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    onSizeChange?.(newSize);
  };

  const clearSignature = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onSignatureUpload('');
  };

  return (
    <div className="p-4 border border-pink-100 rounded-lg bg-white">
      <div className="flex flex-col items-center gap-3">
        <label
          htmlFor="signature-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-colors relative"
        >
          {previewUrl ? (
            <div className="relative w-full h-full p-2">
              <img
                src={previewUrl}
                alt="Signature preview"
                className="w-full h-full object-contain"
                style={{ maxWidth: `${size}%` }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  clearSignature();
                }}
                className="absolute top-1 right-1 p-1 bg-pink-100 rounded-full hover:bg-pink-200"
              >
                <X className="w-4 h-4 text-pink-700" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-pink-400 mb-2" />
              <p className="text-sm text-gray-600">Upload your signature</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="signature-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}

        {previewUrl && (
          <div className="w-full space-y-2">
            <label className="text-sm text-gray-600 block">Signature Size</label>
            <input
              type="range"
              min="20"
              max="100"
              value={size}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
