'use client';

import { useEffect, useState } from 'react';
import SearchProfileAppBar from '../components/SearchProfileAppBar'

const UploadGallery: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if the device is mobile
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('File(s) selected:', files);
      // Process the selected files
    }
  };

  const handleMobileGalleryOpen = () => {
    // Mobile-specific gallery handling
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*'; // Allow only images
  
    inputElement.onchange = (event) => {
      const target = event.target as HTMLInputElement; // Type assertion
      const files = target.files;
      if (files && files.length > 0) {
        console.log('File(s) selected:', files);
        // Process the selected files
      }
    };
  
    inputElement.click();
  };
  

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SearchProfileAppBar />

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload from Gallery</h1>

      {isMobile ? (
        <button
          onClick={handleMobileGalleryOpen}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-all"
        >
          Open Gallery
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <label
            htmlFor="fileInput"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 cursor-pointer transition-all"
          >
            Choose File
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
    </div>
  );
};

export default UploadGallery;
