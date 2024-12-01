'use client'

import React, { useRef, useState, useEffect } from 'react'
import NavBar from "../components/NavBar";
import SignatureCanvas from 'react-signature-canvas'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Undo, Redo, X, Check } from 'lucide-react'

export default function SignaturePad() {
  const router = useRouter()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [strokes, setStrokes] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  // Resize canvas when the window size changes
  useEffect(() => {
    const handleResize = () => {
      if (signatureRef.current) {
        const canvas = signatureRef.current.getCanvas()
        const container = canvas.parentElement

        // Get the container width and height
        const width = container ? container.offsetWidth : window.innerWidth
        const height = container ? container.offsetHeight : window.innerHeight

        // Set the canvas size dynamically
        canvas.width = width
        canvas.height = height
      }
    }

    // Initial resize on mount
    handleResize()

    // Add event listener for resize
    window.addEventListener('resize', handleResize)

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const redrawCanvas = (strokeHistory: string[]) => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      const canvas = signatureRef.current.getCanvas()
      const ctx = canvas.getContext('2d')

      if (ctx) {
        strokeHistory.forEach(dataURL => {
          const img = document.createElement('img') as HTMLImageElement
          img.src = dataURL
          img.onload = () => {
            const scaleX = canvas.width / img.width
            const scaleY = canvas.height / img.height
            ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear before drawing
            ctx.drawImage(img, 0, 0, img.width * scaleX, img.height * scaleY) // Scale the image to fit the canvas
          }
        })
      }
    }
  }

  const handleBegin = () => {
    setRedoStack([]) // Clear redo stack on new input
  }

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL()
      setStrokes(prev => [...prev, dataURL]) // Save current stroke
    }
  }

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setStrokes([])
      setRedoStack([])
    }
  }

  const handleUndo = () => {
    if (strokes.length > 0) {
      const newHistory = strokes.slice(0, -1)
      setRedoStack(prev => [strokes[strokes.length - 1], ...prev]) // Save the last stroke to redo stack
      setStrokes(newHistory) // Update strokes
      redrawCanvas(newHistory) // Redraw canvas without the last stroke
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextStroke = redoStack[0]
      const newRedoStack = redoStack.slice(1)
      setRedoStack(newRedoStack) // Remove stroke from redo stack
      setStrokes(prev => [...prev, nextStroke]) // Add stroke back to strokes
      redrawCanvas([...strokes, nextStroke]) // Redraw canvas with redone stroke
    }
  }

  const handleConfirm = () => {
    if (strokes.length > 0) {
      const signature = strokes[strokes.length - 1] // Last stroke is the final signature
      localStorage.setItem('signature', signature)
      console.log('Signature saved to local storage')
      router.push('/place-signature')
    } else {
      console.error('No signature found')
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-pink-50">
      {/* App Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-pink-100 px-4 py-3 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={handleBackClick}
            className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/arrowbendleft.svg"
              alt="Back"
              width={24}
              height={24}
            />
          </button>
          <h1 className="text-lg font-semibold text-neutral-800">Sign Document</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-16 px-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm h-[75vh]">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-full border-b border-pink-100',
              style: {
                width: '100%',  // Ensure canvas takes full container width
                height: '100%', // Ensure canvas takes full container height
                touchAction: 'none',
              },
            }}
            onBegin={handleBegin}
            onEnd={handleEnd}
          />
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-24 left-0 right-0 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="w-11 h-11 bg-white rounded-full text-pink-700 disabled:opacity-50 hover:bg-pink-50 transition-colors shadow-md flex items-center justify-center"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="w-11 h-11 bg-white rounded-full text-pink-700 disabled:opacity-50 hover:bg-pink-50 transition-colors shadow-md flex items-center justify-center"
          >
            <Redo size={18} />
          </button>
          <button
            onClick={handleClear}
            className="w-11 h-11 bg-white rounded-full text-pink-700 hover:bg-pink-50 transition-colors shadow-md flex items-center justify-center"
          >
            <X size={18} />
          </button>
          <button
            onClick={handleConfirm}
            disabled={strokes.length === 0}
            className="w-11 h-11 bg-pink-600 rounded-full text-white disabled:opacity-50 hover:bg-pink-700 transition-colors shadow-md flex items-center justify-center"
          >
            <Check size={18} />
          </button>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
