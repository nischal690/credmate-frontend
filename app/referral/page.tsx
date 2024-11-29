'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'CRED100'; // This should come from your backend
  const referralLink = `https://credmate.com/refer/${referralCode}`; // Replace with your actual domain

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
    <div className="min-h-screen bg-neutral-950 text-white pt-20 px-4">
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
            <div className="flex items-center gap-3 p-4 rounded-xl bg-black/20">
              <div className="w-10 h-10 rounded-xl bg-[#A2195E]/10 flex items-center justify-center">
                <CurrencyRupeeIcon sx={{ fontSize: 20, color: '#A2195E' }} />
              </div>
              <div>
                <p className="text-sm text-white/60">Your Reward</p>
                <p className="text-xl font-bold">₹100 per referral</p>
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
  );
}
