'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Rnd } from 'react-rnd'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import toast from 'react-hot-toast'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PlaceSignatureProps {
  pdfUrl?: string;
  onConfirm?: (data: { position: { x: number; y: number }; size: { width: number; height: number }; rotation: number }) => void;
  redirectPath?: string;
}

export default function PlaceSignature({ 
  pdfUrl = '/sample.pdf',
  onConfirm,
  redirectPath = '/request-loan/confirmation'
}: PlaceSignatureProps) {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [signature, setSignature] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 200, height: 100 })
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfDimensions, setPdfDimensions] = useState({ width: 600, height: 800 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only get signature from localStorage, PDF is now hardcoded
    const storedSignature = localStorage.getItem('signature')
    if (storedSignature) setSignature(storedSignature)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error)
    setError('Failed to load PDF document. Please try again.')
    setIsLoading(false)
  }

  const handleConfirm = () => {
    if (!signature) {
      toast.error('No signature found. Please draw your signature first.')
      return
    }

    const signatureData = { position, size, rotation }
    
    if (onConfirm) {
      onConfirm(signatureData)
    } else {
      console.log('Signature placed:', signatureData)
      router.push(redirectPath)
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-lg font-semibold text-gray-800">Place Your Signature</h1>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="relative" ref={containerRef}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="flex flex-col items-center"
          >
            {isLoading && (
              <div className="flex items-center justify-center h-[300px]">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-neutral-600">Loading PDF...</span>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center h-[300px] p-4">
                <p className="text-red-500 text-center mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
            {!isLoading && !error && <Page pageNumber={pageNumber} width={300} />}
          </Document>

          {/* Signature Sticker */}
          {signature && (
            <Rnd
              bounds="parent"
              default={{
                x: pdfDimensions.width / 2 - 50,
                y: pdfDimensions.height / 2 - 50,
                width: 100,
                height: 50,
              }}
              position={position}
              size={size}
              onDragStart={() => setIsDragging(true)}
              onDragStop={(e, d) => {
                setPosition({ x: d.x, y: d.y });
                setIsDragging(false);
              }}
              onResizeStart={() => setIsResizing(true)}
              onResizeStop={(e, direction, ref, delta, position) => {
                setSize({
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                });
                setPosition(position);
                setIsResizing(false);
              }}
              className="absolute cursor-move"
            >
              <img
                src={signature}
                alt="Signature"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  transform: `rotate(${rotation}deg)`
                }}
              />
            </Rnd>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-white shadow-lg p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-neutral-600">
              Page {pageNumber} of {numPages}
            </p>
            <button
              onClick={() => setPageNumber((page) => Math.min(page + 1, numPages || 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <Check size={16} /> Confirm
          </button>
        </div>
      </footer>
    </div>
  )
}
