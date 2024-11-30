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
    <div className="w-full mx-auto p-4">
      <motion.div 
        className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-pink-200 p-2 rounded-lg">
            <LightbulbIcon className="w-5 h-5 text-[#A2195E]" />
          </div>
          <motion.p 
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[#A2195E] text-sm md:text-base font-medium flex-1 pr-4 leading-relaxed"
          >
            {newsItems[currentIndex]}
          </motion.p>
          <div className="bg-pink-200 p-2 rounded-lg cursor-pointer hover:bg-pink-300 transition-colors duration-200"
               onClick={() => setCurrentIndex((prevIndex) => prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1)}>
            <ChevronRightIcon className="w-5 h-5 text-[#A2195E]" />
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-2 mt-3">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className={`h-2 rounded-full ${
                  currentIndex === index ? 'bg-[#A2195E]' : 'bg-pink-200'
                }`}
                animate={{
                  width: currentIndex === index ? '20px' : '8px',
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
      </motion.div>
    </div>
  )
}
