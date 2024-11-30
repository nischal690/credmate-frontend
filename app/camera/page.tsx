'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, FlipHorizontal2Icon as FlipCameraIos } from 'lucide-react'
import SearchProfileAppBar from '../components/SearchProfileAppBar'
import NavBar from '../components/NavBar'
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
    <div className="min-h-screen bg-white flex flex-col">
      <SearchProfileAppBar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-[300px] object-cover rounded-lg ${
              state.facingMode === 'user' ? 'scale-x-[-1]' : ''
            }`}
          />
          
          {!state.isInitialized && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2" />
              <p className="text-sm text-gray-600">Initializing camera...</p>
            </div>
          )}

          {state.error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-50 px-4 py-2 rounded-lg">
              <p className="text-pink-500 text-center text-sm">{state.error}</p>
            </div>
          )}

          {state.isInitialized && !state.isProcessing && (
            <>
              <button
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>

              {'mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices && (
                <button
                  onClick={switchCamera}
                  className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white/90 transition-colors"
                >
                  <FlipCameraIos className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </>
          )}

          {state.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          )}
        </div>
      </main>
      
      <NavBar />
    </div>
  )
}




//The videoRef might not be correctly bound to the <video> element due to the usage of createRef.//The videoRef might not be correctly bound to the <video> element due to the usage of createRef.
//The <video> element might not be displayed due to CSS issues or conditional rendering logic preventing its visibility.
