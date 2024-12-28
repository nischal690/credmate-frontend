'use client'

import Image from 'next/image'

interface AppHeaderProps {
  title: string
  onBackClick: () => void
}

export function AppHeader({ title, onBackClick }: AppHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-pink-100 px-4 py-3 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={onBackClick}
          className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
        >
          <Image
            src="/images/searchprofileicons/arrowbendleft.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </button>
        <h1 className="text-lg font-semibold text-neutral-800">{title}</h1>
        <div className="w-10" />
      </div>
    </div>
  )
} 