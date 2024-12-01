'use client';

export default function LoanApplication() {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-white rounded-xl shadow-md p-4 mb-4 relative overflow-hidden border border-pink-100 group hover:shadow-lg transition-all duration-300">
      {/* Decorative circles */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#A2195E] to-[#8B1550] rounded-full opacity-10" />
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-[#A2195E] to-[#8B1550] rounded-full opacity-5" />
      
      <div className="flex items-center justify-between relative">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#A2195E] animate-pulse" />
            <span className="text-xs font-medium text-[#A2195E] tracking-wide uppercase">Coming Soon</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-[#A2195E] transition-colors duration-300">
            Instant Loans up to ₹5L
          </h2>
          <div className="flex items-center flex-wrap gap-4">
            <button
              disabled
              className="bg-gradient-to-r from-[#A2195E] to-[#8B1550] text-white px-5 py-2 rounded-lg text-sm font-medium opacity-90 cursor-not-allowed flex items-center gap-2"
            >
              Coming Soon
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-gray-600 opacity-60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-xs text-gray-600">Quick Process</span>
              </div>
              <div className="h-3 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-gray-600 opacity-60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                </svg>
                <span className="text-xs text-gray-600">Stay Tuned</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-white flex items-center justify-center shadow-sm">
            <svg
              className="w-8 h-8 text-[#A2195E] opacity-80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#A2195E] flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
