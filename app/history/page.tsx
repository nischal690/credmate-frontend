'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import HistoryAppBar from '../components/HistoryAppBar';
import NavBar from '../components/NavBar';

interface HistoryItem {
  id: number;
  type: 'one-time' | 'emi';
  status: 'requested' | 'approved' | 'rejected' | 'completed';
  amount: number;
  date: string;
  lender: string;
  tenure?: number; // Only for EMI
  emiAmount?: number; // Only for EMI
  remainingEmis?: number; // Only for EMI
}

const mockHistoryData: HistoryItem[] = [
  {
    id: 1,
    type: 'one-time',
    status: 'completed',
    amount: 25000,
    date: '2024-01-15',
    lender: 'ABC Finance',
  },
  {
    id: 2,
    type: 'emi',
    status: 'approved',
    amount: 50000,
    date: '2024-01-10',
    lender: 'XYZ Bank',
    tenure: 12,
    emiAmount: 4500,
    remainingEmis: 10,
  },
  {
    id: 3,
    type: 'one-time',
    status: 'requested',
    amount: 15000,
    date: '2024-01-05',
    lender: 'PQR Finance',
  },
  {
    id: 4,
    type: 'emi',
    status: 'completed',
    amount: 100000,
    date: '2023-12-15',
    lender: 'LMN Bank',
    tenure: 24,
    emiAmount: 4800,
    remainingEmis: 0,
  },
];

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [creditType, setCreditType] = React.useState<'all' | 'one-time' | 'emi'>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'requested' | 'approved' | 'rejected' | 'completed'>('all');

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = mockHistoryData.filter(item => {
    const matchesSearch = 
      item.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm);
    
    const matchesType = creditType === 'all' || item.type === creditType;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HistoryAppBar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-800 mb-2 bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-neutral-600">
              View and track all your credit transactions
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Image
                  src="/images/searchprofileicons/search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="text-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Search by lender or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all outline-none text-neutral-600 placeholder-neutral-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {/* Credit Type Filter */}
              <div className="flex gap-2">
                {(['all', 'one-time', 'emi'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCreditType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      creditType === type
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                        : 'bg-white text-neutral-600 hover:bg-pink-50'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type === 'emi' ? 'EMI' : 'One Time'}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'requested', 'approved', 'rejected', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                      statusFilter === status
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                        : 'bg-white text-neutral-600 hover:bg-pink-50'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <Image
                    src="/images/searchprofileicons/search.svg"
                    alt="No results"
                    width={24}
                    height={24}
                    className="opacity-50"
                  />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">No transactions found</h3>
                <p className="text-neutral-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:border-pink-100 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-800">{item.lender}</h3>
                      <p className="text-sm text-neutral-500">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Amount</p>
                      <p className="font-semibold text-neutral-800">{formatAmount(item.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Type</p>
                      <p className="font-semibold text-neutral-800 capitalize">{item.type}</p>
                    </div>
                    {item.type === 'emi' && (
                      <>
                        <div>
                          <p className="text-sm text-neutral-500 mb-1">EMI Amount</p>
                          <p className="font-semibold text-neutral-800">{formatAmount(item.emiAmount!)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 mb-1">Remaining EMIs</p>
                          <p className="font-semibold text-neutral-800">{item.remainingEmis}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  );
};

export default HistoryPage;
