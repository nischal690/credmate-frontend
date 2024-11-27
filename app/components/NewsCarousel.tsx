'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LightbulbIcon, ChevronRightIcon } from 'lucide-react'

const newsItems = [
  "Always close a loan by asking for the OTP from the lender at the time of fulfillment",
  "Latest News: Check out our new offerings",
  "Announcement: System maintenance scheduled"
]

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-pink-50 rounded-2xl p-3 relative">
        <div className="flex items-start gap-2">
          <LightbulbIcon className="w-4 h-4 text-[#A2195E] mt-0.5 flex-shrink-0" />
          <p className="text-[#A2195E] text-xs flex-1 pr-4">
            {newsItems[currentIndex]}
          </p>
          <ChevronRightIcon className="w-4 h-4 text-[#A2195E] flex-shrink-0" />
        </div>
        
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className={`h-1.5 rounded-full ${
                  currentIndex === index ? 'bg-[#A2195E]' : 'bg-[#A3A3A3]'
                }`}
                animate={{
                  width: currentIndex === index ? '16px' : '6px',
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  originX: 0
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

