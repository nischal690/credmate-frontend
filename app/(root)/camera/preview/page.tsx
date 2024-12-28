'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Search } from 'lucide-react'

export default function PreviewPage() {
  const router = useRouter()
  const [imageData, setImageData] = React.useState<string>('')

  React.useEffect(() => {
    // Get the image data from localStorage
    const savedImage = localStorage.getItem('capturedImage')
    if (savedImage) {
      setImageData(savedImage)
    }
  }, [])

  const handleRetake = () => {
    localStorage.removeItem('capturedImage')
    router.back()
  }

  const handleSearch = () => {
    // Here you can handle the search functionality
    // For now, we'll just navigate to the search page
    router.push('/search-profile')
  }

  if (!imageData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <p className="mb-4">No image available</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Take Photo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Preview Image */}
      <div className="flex-1 relative w-full h-full max-h-[calc(100vh-120px)] overflow-hidden">
        <img
          src={imageData}
          alt="Captured"
          className="w-full h-full object-contain"
          style={{
            maxHeight: 'calc(100vh - 120px)',
            objectFit: 'contain',
            margin: '0 auto'
          }}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/10 backdrop-blur-sm">
        <div className="max-w-md mx-auto space-y-3">
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white py-3 px-6 rounded-xl hover:bg-pink-600 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">Search</span>
          </button>

          {/* Retake Button */}
          <button
            onClick={handleRetake}
            className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-3 px-6 rounded-xl hover:bg-white/20 transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">Retake Photo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
