'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Users, ChevronLeft, Check, Award, PhoneCall, ArrowRight, X } from 'lucide-react';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ReportSuccess() {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Only block scroll when modal is open
    if (showPaymentModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPaymentModal]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100 flex flex-col items-center p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-pink-200 rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.div
        className="absolute top-4 left-4 z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => router.push('/report-borrower')}
          startIcon={<ChevronLeft className="w-5 h-5" />}
          sx={{ 
            color: '#A2195E',
            '&:hover': {
              backgroundColor: 'rgba(162, 25, 94, 0.1)'
            }
          }}
        >
          Back
        </Button>
      </motion.div>

      <div className="max-w-md mx-auto text-center relative z-10 px-4">
        {/* Success Check Animation */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <motion.div 
            className="relative inline-block"
            animate={pulseAnimation}
          >
            <div className="relative">
              <Shield className="w-28 h-28 text-[#A2195E]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Check className="w-14 h-14 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thank You for Taking Action!
          </h1>
          <p className="text-lg text-gray-600">
            Your report is making our lending community stronger and safer for everyone.
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 gap-4 mb-8"
        >
          {/* Community Impact Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100"
          >
            <div className="flex items-center justify-center mb-3">
              <Award className="w-8 h-8 text-[#A2195E]" />
            </div>
            <h3 className="text-[#A2195E] font-semibold mb-2">Community Guardian</h3>
            <p className="text-gray-600 text-sm">
              You've helped protect countless lenders from potential risks
            </p>
          </motion.div>

          {/* Premium Assistance Service Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-6 rounded-2xl shadow-lg text-white"
          >
            <div className="flex items-center justify-center mb-3">
              <PhoneCall className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Need Extra Help?</h3>
            <p className="text-sm text-gray-100 mb-4">
              Our dedicated team will make consistent follow-up calls for 30 days to maximize the chances of repayment.
            </p>
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 mb-4">
              <span className="text-sm">Service Fee</span>
              <span className="font-semibold">2% of unpaid amount</span>
            </div>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setShowPaymentModal(true)}
              endIcon={<ArrowRight className="w-4 h-4" />}
              sx={{
                backgroundColor: 'white',
                color: '#A2195E',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Get Professional Assistance
            </Button>
          </motion.div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          
        </motion.div>

        {/* Bottom Message */}
        <motion.p
          variants={itemVariants}
          className="text-sm text-gray-500 mt-6"
        >
          Together, we're building a more trustworthy financial future
        </motion.p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Professional Assistance</h3>
              <button onClick={() => setShowPaymentModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">What's included:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A2195E]" />
                    30 days of dedicated follow-up calls
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A2195E]" />
                    Professional negotiation team
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A2195E]" />
                    Regular status updates
                  </li>
                </ul>
              </div>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  // Handle payment flow
                  setShowPaymentModal(false);
                }}
                sx={{
                  backgroundColor: '#A2195E',
                  '&:hover': {
                    backgroundColor: '#8B1550',
                  },
                  padding: '12px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                Proceed to Payment
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
