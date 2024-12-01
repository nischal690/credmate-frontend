'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  console.log('Initializing PDF.js worker with version:', pdfjs.version)
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

// Change the PDF_URL to use the API endpoint
const PDF_URL = '/api/pdf'  // Changed from '/sample.pdf' to '/api/pdf'
console.log('PDF_URL:', PDF_URL)

export default function PDFViewer() {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Log initial state
  useEffect(() => {
    console.log('Component mounted')
    console.log('Checking if PDF file exists...')
    
    // Add more detailed error logging
    fetch(PDF_URL)
      .then(async response => {
        console.log('PDF fetch response:', response)
        console.log('Response headers:', Object.fromEntries(response.headers))
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        // Check content type
        const contentType = response.headers.get('content-type')
        console.log('Content-Type:', contentType)
        
        // Try to read the response
        const blob = await response.blob()
        console.log('Blob size:', blob.size)
        console.log('Blob type:', blob.type)
        
        console.log('PDF file is accessible')
      })
      .catch(error => {
        console.error('Error checking PDF file:', error)
      })
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with', numPages, 'pages')
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    setError('Failed to load PDF. Please check your internet connection and try again.')
    setIsLoading(false)
  }, [])

  const onDocumentLoadProgress = useCallback((progress: { loaded: number; total: number }) => {
    console.log('Loading progress:', {
      loaded: progress.loaded,
      total: progress.total,
      percentage: Math.round((progress.loaded / progress.total) * 100) + '%'
    })
  }, [])

  // Log state changes
  useEffect(() => {
    console.log('State updated:', {
      numPages,
      pageNumber,
      scale,
      isLoading,
      error
    })
  }, [numPages, pageNumber, scale, isLoading, error])

  const handleSignClick = useCallback(() => {
    router.push('/signature')
  }, [router])

  const handleBackClick = useCallback(() => {
    router.back()
  }, [router])

  const handleZoomIn = useCallback(() => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5))
  }, [])

  const handleNextPage = useCallback(() => {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages || prevPage))
  }, [numPages])

  const handlePrevPage = useCallback(() => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1))
  }, [])

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
          <h1 className="text-lg font-semibold text-neutral-800">PDF Viewer</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 pb-24 max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm">
          <div className="h-[70vh] overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500 mr-2" />
                <p>Loading PDF... {error && `(Error: ${error})`}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-red-500 text-center mb-4">{error}</p>
                <button
                  onClick={() => {
                    console.log('Retrying PDF load...')
                    window.location.reload()
                  }}
                  className="px-4 py-2 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <Document
                file={PDF_URL}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error('Document load error:', error)
                  console.error('Error details:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                  })
                  onDocumentLoadError(error)
                }}
                options={{
                  cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
                  cMapPacked: true,
                  standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/'
                }}
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  loading={
                    <div className="flex items-center justify-center h-[200px]">
                      <Loader2 className="w-8 h-8 animate-spin text-pink-500 mr-2" />
                      <p>Loading page {pageNumber}...</p>
                    </div>
                  }
                  onRenderSuccess={() => console.log(`Page ${pageNumber} rendered successfully`)}
                  onRenderError={(error) => console.error(`Error rendering page ${pageNumber}:`, error)}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            )}
          </div>
          {!error && numPages && (
            <div className="p-4 border-t border-pink-100">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={handlePrevPage}
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
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                  className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 2}
                  className="p-2 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Button */}
        <div className="mt-6">
          <button
            onClick={handleSignClick}
            className="w-full bg-gradient-to-r from-pink-700 to-pink-500 text-white py-3 px-6 rounded-xl font-medium
                     hover:from-pink-800 hover:to-pink-600 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Sign PDF
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

