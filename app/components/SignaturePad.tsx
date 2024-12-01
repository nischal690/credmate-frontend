'use client'


import React, { useRef, useState, useCallback } from 'react'
import NavBar from "../components/NavBar";
import SignatureCanvas from 'react-signature-canvas'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Undo, Redo, X, Check } from 'lucide-react'

export default function SignaturePad() {
  const router = useRouter()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [history, setHistory] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [signature, setSignature] = useState<string | null>(null)

  const handleBegin = () => {
    setHistory([])
    setRedoStack([])
  }

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL()
      setHistory(prev => [...prev, dataURL])
      setRedoStack([])
      setSignature(dataURL)
    }
  }

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setSignature(null)
    }
  }

  const handleUndo = () => {
    if (history.length > 0) {
      const currentState = history[history.length - 1]
      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      setRedoStack(prev => [...prev, currentState])
      
      if (newHistory.length > 0) {
        signatureRef.current?.fromDataURL(newHistory[newHistory.length - 1])
        setSignature(newHistory[newHistory.length - 1])
      } else {
        signatureRef.current?.clear()
        setSignature(null)
      }
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setRedoStack(prev => prev.slice(0, -1))
      setHistory(prev => [...prev, nextState])
      signatureRef.current?.fromDataURL(nextState)
      setSignature(nextState)
    }
  }

  const handleConfirm = () => {
    if (signature) {
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
                aspectRatio: '9/16',
                touchAction: 'none'
              }
            }}
            onBegin={handleBegin}
            onEnd={handleEnd}
          />
        </div>
      </main>

      {/* Bottom Action Buttons - moved up more */}
      <div className="fixed bottom-24 left-0 right-0 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          <button
            onClick={handleUndo}
            disabled={history.length <= 0}
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
            disabled={!signature}
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

