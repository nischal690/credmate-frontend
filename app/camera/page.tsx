'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchProfileAppBar from '../components/SearchProfileAppBar';
import NavBar from '../components/NavBar';

const CameraPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setError('');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please ensure you have given camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const photoData = canvas.toDataURL('image/jpeg');
      
      // Here you can handle the captured photo data
      console.log('Photo captured');
      
      // Stop all tracks after capturing
      const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks();
      tracks?.forEach(track => track.stop());
      
      // Navigate back or handle the photo as needed
      router.back();
    }
  };

  return (
    <div className="mobile-container">
      <div className="content-container">
        <SearchProfileAppBar />
        <div className="main-content">
          <div className="camera-container">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {hasPermission && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-preview"
                />
                <button 
                  onClick={capturePhoto}
                  className="capture-button"
                >
                  Capture Photo
                </button>
              </>
            )}
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default CameraPage;
