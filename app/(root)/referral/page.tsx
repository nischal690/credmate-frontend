'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LinkIcon from '@mui/icons-material/Link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CardMembershipIcon from '@mui/icons-material/CardMembership';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(0);
  const referralCode = 'CRED100'; // This should come from your backend
  const referralLink = `https://credmate.com/refer/${referralCode}`; // Replace with your actual domain

  const plans = [
    {
      name: 'Pro Individual',
      refereeReward: 20,
      discount: 20,
      finalPrice: 179
    },
    {
      name: 'Pro Business',
      refereeReward: 50,
      discount: 50,
      finalPrice: 449
    },
    {
      name: 'Priority Business',
      refereeReward: 200,
      discount: 200,
      finalPrice: 1799
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPlan((prev) => (prev + 1) % plans.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Join Credmate and get instant benefits! Use my referral code: ${referralCode}\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="h-screen bg-neutral-950 text-white overflow-hidden">
      <div className="h-full overflow-y-auto pt-20 px-4 pb-8">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#A2195E]/10 flex items-center justify-center">
                <ShareIcon sx={{ fontSize: 24, color: '#A2195E' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Refer & Earn</h1>
                <p className="text-white/60">Share with friends and earn rewards</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-black/40 to-[#A2195E]/10 backdrop-blur-xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#A2195E]/10 to-transparent opacity-40" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A2195E]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#A2195E]/10 rounded-full blur-3xl" />
                
                {/* Icon with glowing effect */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A2195E] to-pink-600 flex items-center justify-center z-10">
                    <div className="absolute inset-0 rounded-2xl bg-[#A2195E] blur-lg opacity-40" />
                    <CurrencyRupeeIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <motion.p 
                      className="text-sm font-medium text-white/80 uppercase tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Plan Rewards
                    </motion.p>
                    <div className="flex gap-1.5">
                      {plans.map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8 }}
                          animate={{ 
                            scale: currentPlan === index ? 1 : 0.8,
                            width: currentPlan === index ? '24px' : '8px'
                          }}
                          className={`h-2 rounded-full transition-all duration-500 cursor-pointer
                            ${currentPlan === index 
                              ? 'bg-gradient-to-r from-[#A2195E] to-pink-500' 
                              : 'bg-white/20 hover:bg-white/30'}`}
                          onClick={() => setCurrentPlan(index)}
                        />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPlan}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative"
                    >
                      <div className="space-y-4">
                        <motion.h3 
                          className="text-2xl font-bold"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="bg-gradient-to-r from-[#A2195E] via-pink-500 to-[#A2195E] bg-clip-text text-transparent bg-size-200 animate-gradient">
                            {plans[currentPlan].name}
                          </span>
                        </motion.h3>

                        <div className="space-y-3">
                          <motion.div 
                            className="group relative p-4 rounded-xl bg-gradient-to-br from-[#A2195E]/20 to-transparent hover:from-[#A2195E]/30 transition-all duration-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#A2195E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <div className="relative flex items-center gap-3">
                              <div className="w-1.5 h-12 bg-gradient-to-b from-[#A2195E] to-pink-500 rounded-full" />
                              <div>
                                <p className="text-xs text-white/60 uppercase tracking-wider">Your Reward</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                  ₹{plans[currentPlan].refereeReward}
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div 
                            className="group relative p-4 rounded-xl bg-gradient-to-br from-[#A2195E]/20 to-transparent hover:from-[#A2195E]/30 transition-all duration-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#A2195E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <div className="relative flex items-center gap-3">
                              <div className="w-1.5 h-12 bg-gradient-to-b from-[#A2195E] to-pink-500 rounded-full" />
                              <div>
                                <p className="text-xs text-white/60 uppercase tracking-wider">Friend's Discount</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                  ₹{plans[currentPlan].discount} off
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-black/20 text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2195E]/50"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/5"
                >
                  <ContentCopyIcon sx={{ fontSize: 20, color: copied ? '#4CAF50' : '#A2195E' }} />
                </button>
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:opacity-90 transition-opacity"
              >
                <WhatsAppIcon />
                Share via WhatsApp
              </button>
            </div>
          </motion.div>

          {/* How it Works Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-6"
          >
            <h2 className="text-xl font-bold mb-4 text-center">How it Works</h2>
            <div className="space-y-3">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] rounded-xl p-3 transform hover:scale-102 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A2195E]/10 flex items-center justify-center shrink-0">
                    <LinkIcon sx={{ fontSize: 20, color: '#A2195E' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">Share your referral link</h3>
                    <p className="text-white/70 text-xs">Share your unique referral link with friends and family.</p>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] rounded-xl p-3 transform hover:scale-102 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A2195E]/10 flex items-center justify-center shrink-0">
                    <CardMembershipIcon sx={{ fontSize: 20, color: '#A2195E' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">Friend subscribes to a plan</h3>
                    <p className="text-white/70 text-xs">When your friend signs up using your referral link.</p>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] rounded-xl p-3 transform hover:scale-102 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A2195E]/10 flex items-center justify-center shrink-0">
                    <CurrencyRupeeIcon sx={{ fontSize: 20, color: '#A2195E' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">You earn rewards</h3>
                    <p className="text-white/70 text-xs">Get exciting rewards for each successful referral.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] rounded-3xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Your Referrals</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/20">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-white/60">Total Referrals</p>
              </div>
              <div className="p-4 rounded-xl bg-black/20">
                <p className="text-2xl font-bold">₹0</p>
                <p className="text-sm text-white/60">Total Earned</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
