'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    title: 'Quick Credit Checks',
    description: 'Get instant credit reports and analysis at your fingertips',
    image: '/images/credit-check.svg',
    color: 'from-[#A2195E] to-[#8B1550]'
  },
  {
    title: 'Secure Transactions',
    description: 'Bank-grade security for all your financial data',
    image: '/images/security.svg',
    color: 'from-[#CC1E77] to-[#A2195E]'
  },
  {
    title: 'Easy Documentation',
    description: 'Hassle-free document upload and verification',
    image: '/images/documents.svg',
    color: 'from-[#D14B8F] to-[#CC1E77]'
  }
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    // Set cookie for one year
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    document.cookie = `hasSeenOnboarding=true; path=/; max-age=${oneYear}; SameSite=Lax`;
    router.push('/auth/phone');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#A2195E] to-[#8B1550] opacity-[0.03] blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[40%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#CC1E77] to-[#A2195E] opacity-[0.03] blur-3xl" />
      </div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between p-6 max-w-md mx-auto">
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mt-6"
        >
          <Image
            src="/images/logoR.svg"
            alt="Credmate Logo"
            width={36}
            height={36}
            className="mx-auto mb-8 opacity-90"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#A2195E] to-[#8B1550] bg-clip-text text-transparent leading-tight">
              Welcome to CredMate
            </h1>
            <p className="text-gray-600 mt-3 text-base font-medium">
              Your trusted credit companion
            </p>
          </motion.div>
        </motion.div>

        {/* Carousel */}
        <div className="w-full flex-1 flex items-center justify-center my-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="relative flex flex-col items-center">
                {/* Feature image with gradient background */}
                <div className={`relative w-64 h-64 mb-8 rounded-[32px] bg-gradient-to-br ${features[currentSlide].color} p-8 animate-float
                               shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-shadow duration-300`}>
                  <Image
                    src={features[currentSlide].image}
                    alt={features[currentSlide].title}
                    fill
                    className="object-contain p-6 drop-shadow-xl"
                  />
                </div>
                
                {/* Feature text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center px-6"
                >
                  <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#A2195E] to-[#8B1550] bg-clip-text text-transparent">
                    {features[currentSlide].title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {features[currentSlide].description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-3 mb-8">
          {features.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: currentSlide === index ? 1.2 : 1,
                backgroundColor: currentSlide === index ? '#A2195E' : '#F2D4E1'
              }}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300`}
            />
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs mb-8"
        >
          <button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-[#A2195E] to-[#8B1550] text-white py-4 px-8 rounded-2xl text-lg font-semibold 
                     shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-[1.02]
                     active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#A2195E] focus:ring-offset-2 focus:ring-offset-pink-50"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
}
