'use client'

import Image from 'next/image'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 px-6 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {['home', 'loans', 'history', 'profile'].map((item) => (
          <button key={item} className="flex flex-col items-center gap-1">
            <Image 
              src={`/images/searchprofileicons/${item}.svg`} 
              alt={item.charAt(0).toUpperCase() + item.slice(1)} 
              width={24} 
              height={24} 
            />
            <span className="text-xs text-neutral-600 capitalize">{item}</span>
          </button>
        ))}
      </div>
    </nav>
  )
} 