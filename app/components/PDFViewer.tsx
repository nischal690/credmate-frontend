'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import SignatureUpload from './SignatureUpload'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    console.log('PDF.js worker initialized successfully')
  } catch (error) {
    console.error('Failed to initialize PDF.js worker:', error)
  }
}

interface PDFViewerProps {
  url?: string;
  currentPage?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  scale?: number;
  setScale?: React.Dispatch<React.SetStateAction<number>>;
  setTotalPages?: React.Dispatch<React.SetStateAction<number>>;
}

export default function PDFViewer({ 
  url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
  currentPage, 
  setCurrentPage, 
  scale = 0.5, 
  setScale, 
  setTotalPages 
}: PDFViewerProps) {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(currentPage || 1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string>('')
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 })
  const [signatureSize, setSignatureSize] = useState(100)
  const [isPlacingSignature, setIsPlacingSignature] = useState(false)
  const pdfContainerRef = useRef<HTMLDivElement>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
    if (setTotalPages) {
      setTotalPages(numPages)
    }
  }, [setTotalPages])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error)
    setError('Failed to load PDF. Please try again.')
    setIsLoading(false)
  }, [])

  const handleSignaturePlacement = (e: React.MouseEvent) => {
    if (!isPlacingSignature || !pdfContainerRef.current) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSignaturePosition({ x, y });
    setIsPlacingSignature(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-pink-50">
      <main className="flex-1 px-4 pb-24 max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm">
          <div 
            ref={pdfContainerRef}
            className="h-[70vh] overflow-auto relative"
            onClick={handleSignaturePlacement}
            style={{ cursor: isPlacingSignature ? 'crosshair' : 'default' }}
          >
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500 mr-2" />
                  <p>Loading PDF...</p>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <p className="text-red-500 text-center mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              }
            >
              {!error && (
                <div className="relative">
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    loading={
                      <div className="flex items-center justify-center h-[200px]">
                        <Loader2 className="w-8 h-8 animate-spin text-pink-500 mr-2" />
                        <p>Loading page {pageNumber}...</p>
                      </div>
                    }
                  />
                  {signature && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${signaturePosition.x}%`,
                        top: `${signaturePosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        maxWidth: `${signatureSize}%`,
                      }}
                    >
                      <img
                        src={signature}
                        alt="Signature"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </Document>
          </div>
          {!error && numPages && (
            <>
              <div className="p-4 border-t border-pink-100">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => {
                      if (setCurrentPage) {
                        setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
                      }
                      setPageNumber(prevPage => Math.max(prevPage - 1, 1))
                    }}
                    disabled={pageNumber <= 1}
                    className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <p className="text-sm text-neutral-600">
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    onClick={() => {
                      if (setCurrentPage) {
                        setCurrentPage(prevPage => Math.min(prevPage + 1, numPages || prevPage))
                      }
                      setPageNumber(prevPage => Math.min(prevPage + 1, numPages || prevPage))
                    }}
                    disabled={pageNumber >= numPages}
                    className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      if (setScale) {
                        setScale(0.5);
                      }
                    }}
                    className="p-2 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200"
                    aria-label="Reset zoom"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      if (setScale) {
                        setScale(prevScale => prevScale !== undefined ? Math.max(prevScale - 0.1, 0.5) : 0.5)
                      }
                    }}
                    disabled={scale !== undefined && scale <= 0.5}
                    className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (setScale) {
                        setScale(prevScale => prevScale !== undefined ? Math.min(prevScale + 0.1, 2) : 0.5)
                      }
                    }}
                    disabled={scale !== undefined && scale >= 2}
                    className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-pink-100">
                <SignatureUpload 
                  onSignatureUpload={setSignature}
                  onSizeChange={setSignatureSize}
                />
                {signature && (
                  <button
                    onClick={() => setIsPlacingSignature(true)}
                    className="mt-4 w-full py-2 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200 transition-colors"
                  >
                    {isPlacingSignature ? 'Click on PDF to place signature' : 'Place Signature'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sign Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/signature')}
            className="w-full bg-gradient-to-r from-pink-700 to-pink-500 text-white py-3 px-6 rounded-xl font-medium
                     hover:from-pink-800 hover:to-pink-600 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Sign Contract
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 px-6 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <NavButton icon="home" label="Home" />
          <NavButton icon="loans" label="Loans" />
          <NavButton icon="history" label="History" />
          <NavButton icon="profile" label="Profile" />
        </div>
      </nav>
    </div>
  )
}

function NavButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1">
      <Image src={`/images/searchprofileicons/${icon}.svg`} alt={label} width={24} height={24} />
      <span className="text-xs text-neutral-600">{label}</span>
    </button>
  )
}
