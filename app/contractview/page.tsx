'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewer = dynamic(() => import('../components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-180px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2195E]"></div>
    </div>
  ),
});

export default function ContractViewPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const pdfUrl = '/testpdf.pdf'; // Replace with your PDF URL

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'contract.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Contract Document',
          text: 'Check out this contract',
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* PDF Viewer */}
      <div className="w-full md:max-w-3xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-3 sm:p-4 border-b border-neutral-100">
            {/* Back and Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center sm:justify-start text-gray-600 hover:text-gray-900 w-full sm:w-auto"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex justify-center sm:justify-end gap-2 sm:ml-auto">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Zoom Controls */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-br from-pink-50 to-white text-xs sm:text-sm font-medium text-pink-600 shadow-sm"
              >
                Zoom Out
              </button>
              <button
                onClick={() => setScale(1)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-br from-pink-50 to-white text-xs sm:text-sm font-medium text-pink-600 shadow-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-br from-pink-50 to-white text-xs sm:text-sm font-medium text-pink-600 shadow-sm"
              >
                Zoom In
              </button>
            </div>
          </div>
          
          <div className="bg-neutral-50 p-2 sm:p-4 overflow-auto h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)]">
            <PDFViewer 
              url={pdfUrl}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              scale={scale}
              setScale={setScale}
              setTotalPages={setTotalPages}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
