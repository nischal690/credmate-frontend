'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PDF_FILE = '/pdfs/sample.pdf'

export default function PlaceSignature() {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [signature, setSignature] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 200, height: 100 })
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const signatureParam = urlParams.get('signature')
    if (signatureParam) {
      setSignature(decodeURIComponent(signatureParam))
    }
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === signatureRef.current) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && containerRef.current && signatureRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const signatureRect = signatureRef.current.getBoundingClientRect()
      const newX = e.clientX - containerRect.left - signatureRect.width / 2
      const newY = e.clientY - containerRect.top - signatureRect.height / 2
      setPosition({ x: newX, y: newY })
    } else if (isResizing && containerRef.current && signatureRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const signatureRect = signatureRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left - signatureRect.left
      const newHeight = e.clientY - containerRect.top - signatureRect.top
      setSize({ width: newWidth, height: newHeight })
    } else if (isRotating && containerRef.current && signatureRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const signatureRect = signatureRef.current.getBoundingClientRect()
      const centerX = signatureRect.left + signatureRect.width / 2 - containerRect.left
      const centerY = signatureRect.top + signatureRect.height / 2 - containerRect.top
      const angle = Math.atan2(e.clientY - containerRect.top - centerY, e.clientX - containerRect.left - centerX)
      setRotation(angle * (180 / Math.PI))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setIsRotating(false)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
  }

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRotating(true)
  }

  const handleConfirm = () => {
    // Here you would typically save the signature position and apply it to all PDF pages
    console.log('Signature placed:', { position, size, rotation })
    router.push('/request-loan/confirmation')
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
          <h1 className="text-lg font-semibold text-neutral-800">Place Signature</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 pb-24 max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm">
          <div 
            className="h-[60vh] overflow-auto relative" 
            ref={containerRef} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Document
              file={PDF_FILE}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center"
            >
              <Page pageNumber={pageNumber} width={300} />
            </Document>
            {signature && (
              <div
                ref={signatureRef}
                style={{
                  position: 'absolute',
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${size.width}px`,
                  height: `${size.height}px`,
                  transform: `rotate(${rotation}deg)`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleMouseDown}
              >
                <img
                  src={signature}
                  alt="Signature"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  draggable={false}
                />
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 cursor-se-resize"
                  onMouseDown={handleResizeStart}
                />
                <div
                  className="absolute top-0 left-0 w-4 h-4 bg-pink-500 cursor-move rounded-full"
                  onMouseDown={handleRotateStart}
                />
              </div>
            )}
          </div>
          <div className="p-4 border-t border-pink-100 flex justify-between items-center">
            <button
              onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-neutral-600">
              Page {pageNumber} of {numPages}
            </p>
            <button
              onClick={() => setPageNumber(page => Math.min(page + 1, numPages || 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-pink-700 to-pink-500 text-white py-3 px-6 rounded-xl font-medium
                     hover:from-pink-800 hover:to-pink-600 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <Check className="inline-block mr-2" size={20} />
            Confirm Placement
          </button>
        </div>
      </main>
    </div>
  )
}

