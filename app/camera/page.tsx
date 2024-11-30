'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, FlipHorizontal2Icon as FlipCameraIos } from 'lucide-react'
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
      console.error('Camera access error:', err)
      setState(prev => ({ 
        ...prev, 
        error: 'Unable to access camera. Please check permissions.'
      }))
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  const switchCamera = () => {
    stopCamera()
    setState(prev => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user'
    }))
  }

  const capturePhoto = async () => {
    if (!videoRef.current || state.isProcessing) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      
      const context = canvas.getContext('2d')
      if (context) {
        // Flip horizontally if using front camera
        if (state.facingMode === 'user') {
          context.scale(-1, 1)
          context.translate(-canvas.width, 0)
        }
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        
        const photoData = canvas.toDataURL('image/jpeg')
        
        // Validate face in the photo
        const hasSingleFace = await detectSingleFace(photoData)
        
        if (hasSingleFace) {
          savePhotoToStorage(photoData)
          stopCamera()
          router.back()
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'Please ensure a clear photo of a single face',
            isProcessing: false
          }))
        }
      }
    } catch (err) {
      console.error('Error capturing photo:', err)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to capture photo',
        isProcessing: false
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md relative">
          {/* Camera frame with better styling */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-[500px] object-cover bg-black ${
                state.facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />
            
            {/* Overlay for visual feedback */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-white/20 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 border-2 border-pink-500/50 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {!state.isInitialized && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm rounded-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4" />
              <p className="text-white/80 text-lg font-medium">Initializing camera...</p>
            </div>
          )}

          {state.error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/10 backdrop-blur-sm px-6 py-3 rounded-full border border-red-500/20">
              <p className="text-red-400 text-center text-sm font-medium">{state.error}</p>
            </div>
          )}

          {state.isInitialized && !state.isProcessing && (
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center space-x-6">
              {'mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices && (
                <button
                  onClick={switchCamera}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                >
                  <FlipCameraIos className="w-6 h-6 text-white" />
                </button>
              )}

              <button
                onClick={capturePhoto}
                className="bg-pink-500 text-white p-6 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-20"></div>
                  <Camera className="w-8 h-8" />
                </div>
              </button>
            </div>
          )}

          {state.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4" />
                <p className="text-white/80 text-lg font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
