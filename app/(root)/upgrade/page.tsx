'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import { plans } from '@/constants';
import PrincingCard from '@/components/cards/PrincingCard';
import PricingFilter from '@/components/filters/PricingFilter';

export default function UpgradePage() {
  const [planType, setPlanType] = useState<'all' | 'individual' | 'business'>(
    'all'
  );
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const filteredPlans =
    planType === 'all' ? plans : plans.filter((plan) => plan.type === planType);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowExpertModal(false);
      }
    };

    if (showExpertModal) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showExpertModal]);

  const handlePayment = async (plan: Plan) => {
    try {
      console.log('Starting payment process for plan:', plan.name);

      // Convert price string to number (remove ₹ and comma)
      const amount =
        parseInt(plan.price.replace('₹', '').replace(',', '')) * 100; // Convert to paise
      console.log('Calculated amount:', amount);

      // Get Firebase user
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      // Call your payment API endpoint here
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/create`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          amount,
          planName: plan.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const paymentData = await response.json();

      if (paymentData?.success) {
        toast.success('Payment initiated successfully!');
        // Add additional logic here like updating user subscription status
      } else {
        throw new Error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleQRDownload = () => {
    const svg = document.querySelector('.qr-code-container svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'credmate-payment-qr.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className='min-h-screen overflow-y-auto bg-white'>
      <main className='flex-1'>
        <motion.div
          ref={containerRef}
          className='relative min-h-full'
          style={{
            backgroundImage:
              'radial-gradient(circle at top right, rgba(255, 215, 0, 0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(255, 165, 0, 0.15), transparent 60%)',
            backgroundSize: '100% 100%',
            y: backgroundY,
          }}
        >
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#A2195E]/20 to-transparent rounded-full blur-3xl transform rotate-12 animate-pulse' />
            <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#BA1C6C]/20 to-transparent rounded-full blur-3xl transform -rotate-12 animate-pulse' />
          </div>

          <div className='relative px-6 pt-16 pb-24'>
            <div className='max-w-md mx-auto'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className='relative mb-12 text-center'
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className='absolute transform -translate-x-1/2 -top-6 left-1/2'
                >
                  <AutoAwesomeIcon sx={{ fontSize: 40, color: '#A2195E' }} />
                </motion.div>
                <h1 className='mb-3 text-3xl font-bold text-gray-900'>
                  Upgrade Your Experience
                </h1>
                <p className='text-lg text-gray-600'>
                  Choose the perfect plan for your journey
                </p>
              </motion.div>
              {/* filter */}
              <div className='flex justify-center gap-4 mb-8'>
                <PricingFilter
                  currentType={planType}
                  onTypeChange={setPlanType}
                />
              </div>
              {/* cards */}
              <div className='grid grid-cols-1 gap-8 mx-auto max-w-7xl'>
                {filteredPlans.map((plan) => (
                  <PrincingCard
                    key={plan.name}
                    plan={plan}
                    onSelect={handlePlanSelect}
                  />
                ))}
              </div>

              <div className='mt-8 text-center'>
                <p className='mb-4 text-gray-600'>
                  Still confused about which plan to choose?
                </p>
                <button
                  onClick={() => setShowExpertModal(true)}
                  className='inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white border-2 border-[#A2195E] text-[#A2195E] hover:bg-[#A2195E] hover:text-white transition-all duration-300'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                  Talk to Our Expert
                </button>
              </div>

              {/* Expert Modal */}
              {showExpertModal && (
                <div
                  className='fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50'
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setShowExpertModal(false);
                    }
                  }}
                  role='dialog'
                  aria-modal='true'
                  aria-labelledby='modal-title'
                >
                  <div ref={modalRef}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className='w-full max-w-sm p-6 bg-white rounded-lg'
                    >
                      <button
                        onClick={() => setShowExpertModal(false)}
                        className='absolute text-gray-400 top-4 right-4 hover:text-gray-600'
                        aria-label='Close modal'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-6 h-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>

                      <div className='mb-6 text-center'>
                        <div className='w-16 h-16 bg-[#A2195E] rounded-full flex items-center justify-center mx-auto mb-4'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-8 h-8 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                            />
                          </svg>
                        </div>
                        <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                          Get Expert Guidance
                        </h3>
                        <p className='text-gray-600'>
                          Our experts are here to help you choose the perfect
                          plan for your needs.
                        </p>
                      </div>

                      <div className='space-y-4'>
                        <div className='flex items-center gap-4 p-4 rounded-lg bg-gray-50'>
                          <div className='flex-shrink-0'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-6 w-6 text-[#A2195E]'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              Schedule a Call
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Get personalized guidance from our experts
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-4 p-4 rounded-lg bg-gray-50'>
                          <div className='flex-shrink-0'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-6 w-6 text-[#A2195E]'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              Live Chat
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Chat with our support team instantly
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='mt-6 space-y-3'>
                        <button
                          onClick={() => {
                            // Add scheduling logic here
                            window.location.href = 'tel:+1234567890';
                          }}
                          className='w-full px-6 py-3 bg-[#A2195E] text-white rounded-lg font-medium hover:bg-[#8B1550] transition-colors duration-300'
                        >
                          Schedule a Call Now
                        </button>
                        <button
                          onClick={() => {
                            // Add chat logic here
                            setShowExpertModal(false);
                          }}
                          className='w-full px-6 py-3 bg-white border-2 border-[#A2195E] text-[#A2195E] rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300'
                        >
                          Start Live Chat
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='relative w-full max-w-md p-8 mx-4 bg-white rounded-2xl'
          >
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentConfirmed(false);
                setSelectedPlan(null);
              }}
              className='absolute z-10 text-white transition-colors top-4 right-4 hover:text-white/80'
            >
              <CloseIcon />
            </button>

            <div className='text-center'>
              {!paymentConfirmed ? (
                <>
                  <div className='bg-gradient-to-br from-[#A2195E] to-[#BA1C6C] text-white p-6 -mx-8 -mt-8 rounded-t-2xl mb-6'>
                    <h3 className='mb-2 text-2xl font-bold'>
                      Complete Payment
                    </h3>
                    <p className='opacity-90'>Scan QR code to proceed</p>
                  </div>

                  <div className='space-y-6'>
                    <div className='flex items-center justify-center gap-2 text-xl font-semibold text-gray-800'>
                      <span>Amount:</span>
                      <span className='text-[#A2195E]'>
                        {selectedPlan.price}
                      </span>
                    </div>

                    <div className='inline-block p-4 bg-white shadow-lg rounded-2xl'>
                      <div className='qr-code-container'>
                        <QRCodeSVG
                          value={`upi://pay?pa=your-upi-id@bank&pn=Credmate&am=${selectedPlan.price.replace('₹', '')}&cu=INR`}
                          size={200}
                          level='H'
                          imageSettings={{
                            src: '/images/logo 1 (6).png',
                            height: 40,
                            width: 40,
                            excavate: true,
                          }}
                        />
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <button
                        onClick={() => setPaymentConfirmed(true)}
                        className='w-full py-3.5 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-300 shadow-lg shadow-green-600/20'
                      >
                        I've Completed the Payment
                      </button>
                      <button
                        onClick={handleQRDownload}
                        className='w-full py-3.5 px-6 bg-white border-2 border-[#A2195E] text-[#A2195E] rounded-xl font-medium hover:bg-gray-50 transition-colors duration-300'
                      >
                        <DownloadIcon className='mr-2' />
                        Download QR Code
                      </button>
                      <p className='text-sm text-gray-500'>
                        Please ensure to complete the payment before confirming
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className='py-6 text-center'>
                  <div className='flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full'>
                    <AutoAwesomeIcon className='text-5xl text-blue-500' />
                  </div>
                  <h4 className='mb-3 text-2xl font-bold text-gray-800'>
                    Payment in Review
                  </h4>
                  <p className='mb-8 text-gray-600'>
                    Your payment is currently under review. Please allow up to
                    24 hours for your account to be upgraded. Our team is
                    preparing to serve you better!
                  </p>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentConfirmed(false);
                      setSelectedPlan(null);
                    }}
                    className='w-full py-3.5 px-6 bg-gradient-to-r from-[#A2195E] to-[#BA1C6C] text-white rounded-xl font-medium hover:from-[#8B1550] hover:to-[#A2195E] transition-all duration-300 shadow-lg shadow-[#A2195E]/20'
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
