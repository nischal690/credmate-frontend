'use client'

import React, { useRef, useState, useCallback } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Undo, Redo, X } from 'lucide-react'

export default function SignaturePad() {
  const router = useRouter()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [history, setHistory] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [signature, setSignature] = useState<string | null>(null)

  const saveSignature = useCallback(() => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL()
      setHistory(prev => [...prev, dataURL])
      setRedoStack([])
      setSignature(dataURL)
    }
  }, [])

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      saveSignature()
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

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL()
      setHistory(prev => [...prev, dataURL])
      setRedoStack([])
      setSignature(dataURL)
    }
  }

  const handleConfirm = () => {
    if (signature) {
      // Pass the signature as a query parameter
      router.push(`/place-signature?signature=${encodeURIComponent(signature)}`);
    } else {
      console.error('No signature found');
    }
  };
  

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
      <main className="flex-1 pt-16 px-4 pb-24 max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-[70vh] border-b border-pink-100',
            }}
            onEnd={handleEnd}
          />
          <div className="p-4 flex justify-between">
            <button
              onClick={handleUndo}
              disabled={history.length <= 0}
              className="p-2 bg-pink-100 rounded-full text-pink-700 disabled:opacity-50"
            >
              <Undo size={20} />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-2 bg-pink-100 rounded-full text-pink-700 disabled:opacity-50"
            >
              <Redo size={20} />
            </button>
            <button
              onClick={handleClear}
              className="p-2 bg-pink-100 rounded-full text-pink-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleConfirm}
            disabled={!signature}
            className="w-full bg-gradient-to-r from-pink-700 to-pink-500 text-white py-3 px-6 rounded-xl font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:from-pink-800 hover:to-pink-600 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Confirm Signature
          </button>
        </div>
      </main>
    </div>
  )
}

