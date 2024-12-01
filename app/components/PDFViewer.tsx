
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

// Using a reliable sample PDF URL
const PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf'

export default function PDFViewer() {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully:', numPages);
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error)
    setError('Failed to load PDF. Please try again later.')
    setIsLoading(false)
  }

  const handleSignClick = () => {
    router.push('/signature')
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
          <h1 className="text-lg font-semibold text-neutral-800">PDF Viewer</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 pb-24 max-w-md mx-auto w-full">
        {/* PDF Viewer */}
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm">
          <div className="h-[70vh] overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <p>Loading PDF...</p>
              </div>
            )}
            {error ? (
              <div className="flex items-center justify-center h-full text-red-500 px-4 text-center">
                {error}
              </div>
            ) : (
              <Document
                file={PDF_URL}
                onLoadSuccess={(data) => {
                  console.log('Document loaded:', data);
                  onDocumentLoadSuccess(data);
                }}
                onLoadError={(error) => {
                  console.error('Document load error:', error);
                  onDocumentLoadError(error);
                }}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <p>Loading PDF...</p>
                  </div>
                }
                className="flex flex-col items-center"
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={300}
                  loading={
                    <div className="flex items-center justify-center h-[200px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                      <p>Loading page...</p>
                    </div>
                  }
                />
              </Document>
            )}
          </div>
          {!error && numPages && (
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
                onClick={() => setPageNumber(page => Math.min(page + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
              >
                Next
              </button>
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
          <button className="flex flex-col items-center gap-1">
            <Image src="/images/searchprofileicons/home.svg" alt="Home" width={24} height={24} />
            <span className="text-xs text-neutral-600">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Image src="/images/searchprofileicons/loans.svg" alt="Loans" width={24} height={24} />
            <span className="text-xs text-neutral-600">Loans</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Image src="/images/searchprofileicons/history.svg" alt="History" width={24} height={24} />
            <span className="text-xs text-neutral-600">History</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Image src="/images/searchprofileicons/profile.svg" alt="Profile" width={24} height={24} />
            <span className="text-xs text-neutral-600">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

