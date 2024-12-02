'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf' // react-pdf library for rendering PDFs
import { Rnd } from 'react-rnd' // react-rnd library for draggable/resizable elements
import { useRouter } from 'next/navigation'

export default function PlaceSignature() {
  const [signature, setSignature] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<string | null>('/sample.pdf')
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })
  const signatureRef = useRef<Rnd>(null)
  const router = useRouter()

  useEffect(() => {
    // Only get signature from localStorage, PDF is now hardcoded
    const storedSignature = localStorage.getItem('signature')
    if (storedSignature) setSignature(storedSignature)
  }, [])

  const handleSavePosition = () => {
    if (signatureRef.current) {
      // Get the wrapper div of the Rnd component
      const rndElement = signatureRef.current.resizableElement.current;
      
      if (rndElement) {
        const boundingRect = rndElement.getBoundingClientRect();
        const position = {
          x: boundingRect.left,
          y: boundingRect.top,
          width: boundingRect.width,
          height: boundingRect.height,
        }
        localStorage.setItem('signaturePosition', JSON.stringify(position))
        alert('Signature position saved!')
      }
    }
  }

  const handleConfirm = () => {
    // Here, you can process the final PDF with the signature embedded
    console.log('Final signature position saved')
    alert('Signature placement confirmed!')
    router.push('/dashboard') // Navigate to another page or perform actions
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-lg font-semibold text-gray-800">Place Your Signature</h1>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="relative">
          <Document
            file="/sample.pdf"
            onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
            className="border shadow"
          >
            <Page
              pageNumber={1}
              onRenderSuccess={({ width, height }) => setPdfDimensions({ width, height })}
            />
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
              ref={signatureRef}
              resizeHandleStyles={{}}
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
                }}
              />
            </Rnd>
          )}
        </div>
      </main>

      {/* Footer Buttons */}
      <footer className="bg-white shadow p-4 flex justify-between">
        <button
          onClick={handleSavePosition}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Save Position
        </button>
        <button
          onClick={handleConfirm}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Confirm
        </button>
      </footer>
    </div>
  )
}
