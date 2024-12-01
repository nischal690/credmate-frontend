interface PDFControlsProps {
  pageNumber: number
  numPages: number
  onPrevious: () => void
  onNext: () => void
}

export function PDFControls({ pageNumber, numPages, onPrevious, onNext }: PDFControlsProps) {
  return (
    <div className="p-4 border-t border-pink-100 flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={pageNumber <= 1}
        className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
      >
        Previous
      </button>
      <p className="text-sm text-neutral-600">
        Page {pageNumber} of {numPages}
      </p>
      <button
        onClick={onNext}
        disabled={pageNumber >= numPages}
        className="px-3 py-1 bg-pink-100 rounded-md text-pink-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
} 