'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, FlipHorizontal2Icon as FlipCameraIos, X } from 'lucide-react'
import { loadFaceDetectionModels, detectSingleFace } from '../utils/face-detection'
import { savePhotoToStorage } from '../utils/storage'
import type { CameraState } from '../types/camera'

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<CameraState>({
    isInitialized: false,
    facingMode: 'user',
    error: '',
    isProcessing: false
  })
  const router = useRouter()

  // Load face detection models on mount
  useEffect(() => {
    loadFaceDetectionModels().catch(error => {
      setState(prev => ({ ...prev, error: 'Failed to load face detection' }))
    })
  }, [])

  // Initialize camera after component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera()
    }, 100)

    return () => {
      clearTimeout(timer)
      stopCamera()
    }
  }, [state.facingMode])

  const startCamera = async () => {
    try {
      if (!videoRef.current) {
        console.error('Video element not mounted yet')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: state.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setState(prev => ({ ...prev, isInitialized: true, error: '' }))
    } catch (err) {
      console.error('Error starting camera:', err)
      setState(prev => ({ ...prev, error: 'Failed to start camera' }))
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const switchCamera = () => {
    setState(prev => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user',
      isInitialized: false
    }))
  }

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      // Create a canvas element to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw the current frame from video to canvas
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Convert to base64 string
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Save to localStorage (you might want to use a more robust solution in production)
      localStorage.setItem('capturedImage', imageData);
      
      // Navigate to preview page
      router.push('/camera/preview');
    } catch (error) {
      console.error('Error capturing photo:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to capture photo',
        isProcessing: false 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="rounded-full p-2 bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="text-white text-sm font-medium">Take Photo</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Camera View */}
      <div className="relative h-screen flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${state.facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          playsInline
          autoPlay
          muted
        />

        {/* Camera Frame Guide (subtle) */}
        <div className="absolute inset-0">
          <div className="absolute inset-[10%] border border-white/20 rounded-lg"></div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
            {state.error}
          </div>
        )}

        {/* Loading State */}
        {!state.isInitialized && !state.error && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="animate-pulse text-white">Initializing camera...</div>
          </div>
        )}

        {/* Controls */}
        {state.isInitialized && !state.isProcessing && (
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex justify-between items-center max-w-md mx-auto">
              {/* Switch Camera Button */}
              {'mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices && (
                <button
                  onClick={switchCamera}
                  className="rounded-full p-3 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all"
                >
                  <FlipCameraIos className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={state.isProcessing || !!state.error}
                className="relative group"
              >
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-md group-hover:bg-pink-500/30 transition-all"></div>
                <div className="relative bg-white/90 rounded-full p-5 transform transition-transform group-hover:scale-95">
                  <div className="bg-pink-500 rounded-full p-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </button>

              {/* Spacer for alignment */}
              <div className="w-14"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
