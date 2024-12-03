'use client'

import React, { useRef, useState, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Undo, Redo, X, Check, Minus, Plus, PenTool } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PenStyle {
  color: string
  thickness: number
}

export default function SignaturePad() {
  const router = useRouter()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [strokes, setStrokes] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [penStyle, setPenStyle] = useState<PenStyle>({ color: '#000000', thickness: 2 })
  const [isEmpty, setIsEmpty] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Resize canvas when the window size changes
  useEffect(() => {
    const handleResize = () => {
      if (signatureRef.current) {
        const canvas = signatureRef.current.getCanvas()
        const container = canvas.parentElement

        if (container) {
          const width = container.offsetWidth
          const height = container.offsetHeight
          
          // Set the canvas size with proper scaling
          const scale = window.devicePixelRatio || 1
          canvas.width = width * scale
          canvas.height = height * scale
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`
          
          // Scale the context for retina displays
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.scale(scale, scale)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
          }

          // Draw guide line
          drawGuideLine()
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update pen style when it changes
  useEffect(() => {
    if (signatureRef.current) {
      const canvas = signatureRef.current.getCanvas()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = penStyle.color
        ctx.lineWidth = penStyle.thickness
      }
    }
  }, [penStyle])

  const drawGuideLine = () => {
    if (signatureRef.current) {
      const canvas = signatureRef.current.getCanvas()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const y = canvas.height * 0.7
        ctx.save()
        ctx.setLineDash([5, 5])
        ctx.strokeStyle = '#E5E7EB'
        ctx.beginPath()
        ctx.moveTo(20, y)
        ctx.lineTo(canvas.width - 20, y)
        ctx.stroke()
        ctx.restore()
      }
    }
  }

  const redrawCanvas = (strokeHistory: string[]) => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      const canvas = signatureRef.current.getCanvas()
      const ctx = canvas.getContext('2d')

      if (ctx) {
        drawGuideLine()
        strokeHistory.forEach(dataURL => {
          const img = document.createElement('img')
          img.src = dataURL
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
        })
      }
    }
  }

  const handleBegin = () => {
    setRedoStack([])
    setIsEmpty(false)
  }

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL()
      setStrokes(prev => [...prev, dataURL])
    }
  }

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setStrokes([])
      setRedoStack([])
      setIsEmpty(true)
      drawGuideLine()
    }
  }

  const handleUndo = () => {
    if (strokes.length > 0) {
      const newHistory = strokes.slice(0, -1)
      setRedoStack(prev => [strokes[strokes.length - 1], ...prev])
      setStrokes(newHistory)
      setIsEmpty(newHistory.length === 0)
      redrawCanvas(newHistory)
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextStroke = redoStack[0]
      const newRedoStack = redoStack.slice(1)
      setRedoStack(newRedoStack)
      setStrokes(prev => [...prev, nextStroke])
      setIsEmpty(false)
      redrawCanvas([...strokes, nextStroke])
    }
  }

<<<<<<< HEAD
  const handleConfirm = () => {
    if (strokes.length > 0) {
      const signature = strokes[strokes.length - 1] // Last stroke is the final signature
      localStorage.setItem('signature', signature)
      console.log('Signature saved to local storage')
      // Ensure the router push happens after saving
      setTimeout(() => {
        router.push('/place-signature')
      }, 0);
    } else {
      console.error('No signature found')
=======
  const handleConfirm = async () => {
    if (isEmpty) {
      toast.error('Please draw your signature first')
      return
>>>>>>> cb1c7fbf4f5733b0dbb39e606e3378ccdf2034d2
    }

    try {
      setIsSaving(true)
      const signature = strokes[strokes.length - 1]
      localStorage.setItem('signature', signature)
      toast.success('Signature saved successfully')
      router.push('/place-signature')
    } catch (error) {
      toast.error('Failed to save signature')
    } finally {
      setIsSaving(false)
    }
  }

  const adjustThickness = (delta: number) => {
    setPenStyle(prev => ({
      ...prev,
      thickness: Math.max(1, Math.min(10, prev.thickness + delta))
    }))
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
      <main className="flex-1 pt-16 pb-24 px-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm h-[80vh] relative">
          {isEmpty && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-4">
              <div className="rotate-90 transform origin-center">
                <Image
                  src="/images/sign-here.svg"
                  alt="Sign here"
                  width={32}
                  height={32}
                  className="opacity-50"
                />
              </div>
              <p className="text-neutral-400 text-center px-4">
                Sign vertically in the box<br/>
                <span className="text-sm">For better signature, rotate your phone to landscape</span>
              </p>
            </div>
          )}
          <div className="w-full h-full rotate-90 transform origin-center scale-75">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: 'w-full h-full touch-none',
                style: {
                  width: '100%',
                  height: '100%',
                },
              }}
              onBegin={handleBegin}
              onEnd={handleEnd}
            />
          </div>
        </div>

        {/* Pen Controls */}
        <div className="mt-4 flex items-center justify-center gap-4 px-4">
          <input
            type="color"
            value={penStyle.color}
            onChange={(e) => setPenStyle(prev => ({ ...prev, color: e.target.value }))}
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
          />
          <button
            onClick={() => adjustThickness(-0.5)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
          >
            <Minus size={16} />
          </button>
          <div className="flex items-center gap-2">
            <PenTool size={16} />
            <span className="text-sm">{penStyle.thickness.toFixed(1)}</span>
          </div>
          <button
            onClick={() => adjustThickness(0.5)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="w-11 h-11 bg-white rounded-full text-pink-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors shadow-md flex items-center justify-center"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="w-11 h-11 bg-white rounded-full text-pink-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors shadow-md flex items-center justify-center"
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
            disabled={isEmpty || isSaving}
            className="w-11 h-11 bg-pink-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-700 transition-colors shadow-md flex items-center justify-center"
          >
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
