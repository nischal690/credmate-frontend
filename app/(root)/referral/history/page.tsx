'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// This would come from your API
const mockReferrals = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "accepted",
    plan: "Pro Business",
    earned: "₹50",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    plan: "Pro Individual",
    earned: "₹0",
    date: "2024-01-20",
  },
];

export default function ReferralHistory() {
  const [filter, setFilter] = useState('all'); // 'all', 'accepted', 'pending'

  const filteredReferrals = mockReferrals.filter(referral => {
    if (filter === 'all') return true;
    return referral.status === filter;
  });

  const totalEarned = mockReferrals
    .filter(ref => ref.status === 'accepted')
    .reduce((sum, ref) => sum + parseInt(ref.earned.replace('₹', '')), 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/referral" className="p-2 rounded-lg hover:bg-white/5">
            <ArrowBackIcon />
          </Link>
          <h1 className="text-2xl font-bold">Referral History</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] p-4 rounded-xl"
          >
            <p className="text-sm text-white/60">Total Referrals</p>
            <p className="text-2xl font-bold">{mockReferrals.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] p-4 rounded-xl"
          >
            <p className="text-sm text-white/60">Accepted Referrals</p>
            <p className="text-2xl font-bold">
              {mockReferrals.filter(ref => ref.status === 'accepted').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] p-4 rounded-xl"
          >
            <p className="text-sm text-white/60">Total Earned</p>
            <p className="text-2xl font-bold">₹{totalEarned}</p>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-[#A2195E] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'accepted' ? 'bg-[#A2195E] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'pending' ? 'bg-[#A2195E] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Pending
          </button>
        </div>

        {/* Referrals List */}
        <div className="space-y-4">
          {filteredReferrals.map((referral) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{referral.name}</h3>
                    {referral.status === 'accepted' ? (
                      <CheckCircleIcon className="text-green-500 w-5 h-5" />
                    ) : (
                      <PendingIcon className="text-yellow-500 w-5 h-5" />
                    )}
                  </div>
                  <p className="text-sm text-white/60">{referral.email}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#A2195E]/20 text-[#A2195E] border border-[#A2195E]/30">
                      {referral.plan}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(referral.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-lg font-semibold">
                  <CurrencyRupeeIcon className="w-5 h-5" />
                  {referral.earned.replace('₹', '')}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredReferrals.length === 0 && (
            <div className="text-center py-8 text-white/40">
              No referrals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
