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
  const [selectedItem, setSelectedItem] = React.useState<number | null>(null);

  const getStatusColor = (status: string): { bg: string; text: string; icon: string } => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          icon: '/images/historyicons/completed.svg'
        };
      case 'approved':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          icon: '/images/historyicons/approved.svg'
        };
      case 'requested':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          icon: '/images/historyicons/requested.svg'
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: '/images/historyicons/rejected.svg'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: '/images/historyicons/default.svg'
        };
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <HistoryAppBar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-2 xs:px-3 sm:px-6 pt-12 xs:pt-14 pb-20 sm:pt-16 sm:pb-24 max-w-2xl mx-auto">
          {/* Title Section */}
          <div className="mb-4 xs:mb-6 sm:mb-8 animate-fade-in">
            <h1 className="text-lg xs:text-xl sm:text-3xl font-bold mb-0.5 xs:mb-1 sm:mb-2 bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-sm xs:text-base text-neutral-600">
              Track your credit journey
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-4 xs:mb-6 sm:mb-8 space-y-3 xs:space-y-4 sm:space-y-6 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-y-0 left-2 xs:left-3 sm:left-4 flex items-center pointer-events-none">
                <Image
                  src="/images/searchprofileicons/search.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  className="text-gray-400 w-3.5 xs:w-4 sm:w-[18px]"
                />
              </div>
              <input
                type="text"
                placeholder="Search by lender or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 xs:pl-9 sm:pl-12 pr-2 xs:pr-3 sm:pr-4 py-2 xs:py-2.5 sm:py-4 bg-white/80 backdrop-blur-lg rounded-lg sm:rounded-2xl border border-neutral-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all outline-none text-xs xs:text-sm sm:text-base text-neutral-700 placeholder-neutral-400 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Filter Pills */}
            <div className="space-y-2 sm:space-y-4">
              {/* Credit Type Filter */}
              <div className="flex gap-1 xs:gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-2 xs:-mx-3 px-2 xs:px-3 sm:mx-0 sm:px-0 scrollbar-hide">
                {(['all', 'one-time', 'emi'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCreditType(type)}
                    className={`px-2 xs:px-3 sm:px-6 py-1 xs:py-1.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl text-[10px] xs:text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      creditType === type
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25 scale-105'
                        : 'bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-pink-50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type === 'emi' ? 'EMI' : 'One Time'}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-1 xs:gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-2 xs:-mx-3 px-2 xs:px-3 sm:mx-0 sm:px-0 scrollbar-hide">
                {(['all', 'requested', 'approved', 'rejected', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 xs:px-3 sm:px-6 py-1 xs:py-1.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl text-[10px] xs:text-xs sm:text-sm font-medium capitalize transition-all whitespace-nowrap flex-shrink-0 ${
                      statusFilter === status
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25 scale-105'
                        : 'bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-pink-50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 xs:py-12 sm:py-16 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-3xl border border-neutral-100 shadow-sm animate-fade-in">
                <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 mx-auto mb-3 xs:mb-4 sm:mb-6 rounded-full bg-pink-50 flex items-center justify-center">
                  <Image
                    src="/images/searchprofileicons/search.svg"
                    alt="No results"
                    width={16}
                    height={16}
                    className="opacity-50 w-4 xs:w-6 sm:w-8"
                  />
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-neutral-800 mb-1 xs:mb-2 sm:mb-3">No transactions found</h3>
                <p className="text-xs xs:text-sm sm:text-base text-neutral-600 max-w-[200px] xs:max-w-[250px] sm:max-w-sm mx-auto">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const statusStyle = getStatusColor(item.status);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    className={`bg-white/80 backdrop-blur-lg rounded-lg sm:rounded-3xl p-2.5 xs:p-3 sm:p-6 shadow-sm hover:shadow-md border border-neutral-100 hover:border-pink-100 transition-all cursor-pointer animate-slide-up ${
                      selectedItem === item.id ? 'ring-2 ring-pink-500/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 mb-1 xs:mb-1.5 sm:mb-2 flex-wrap">
                          <h3 className="font-semibold text-xs xs:text-sm sm:text-lg text-neutral-800 truncate">{item.lender}</h3>
                          <div className={`px-1.5 xs:px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1 sm:gap-2`}>
                            <Image
                              src={statusStyle.icon}
                              alt={item.status}
                              width={8}
                              height={8}
                              className="w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                            />
                            <span className="capitalize">{item.status}</span>
                          </div>
                        </div>
                        <p className="text-[10px] xs:text-xs sm:text-sm text-neutral-500 mb-2 xs:mb-3">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                        <div className="flex flex-wrap gap-2 xs:gap-2.5 sm:gap-4">
                          <div>
                            <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">Amount</p>
                            <p className="font-semibold text-[10px] xs:text-xs sm:text-base text-neutral-800">{formatAmount(item.amount)}</p>
                          </div>
                          {item.type === 'emi' && (
                            <>
                              <div className="hidden sm:block w-px h-8 bg-neutral-200" />
                              <div>
                                <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">EMI</p>
                                <p className="font-semibold text-[10px] xs:text-xs sm:text-base text-neutral-800">{formatAmount(item.emiAmount || 0)}</p>
                              </div>
                              <div className="hidden sm:block w-px h-8 bg-neutral-200" />
                              <div>
                                <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">Left</p>
                                <p className="font-semibold text-[10px] xs:text-xs sm:text-base text-neutral-800">{item.remainingEmis}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full ${item.type === 'emi' ? 'bg-blue-50' : 'bg-emerald-50'} flex items-center justify-center flex-shrink-0`}>
                        <Image
                          src={item.type === 'emi' ? '/images/historyicons/emi.svg' : '/images/historyicons/one-time.svg'}
                          alt={item.type}
                          width={12}
                          height={12}
                          className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                    </div>
                    
                    {selectedItem === item.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-100 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3 xs:gap-4">
                          <div>
                            <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">Transaction ID</p>
                            <p className="font-medium text-[10px] xs:text-xs sm:text-sm text-neutral-700">#{item.id.toString().padStart(6, '0')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">Type</p>
                            <p className="font-medium text-[10px] xs:text-xs sm:text-sm text-neutral-700 capitalize">{item.type}</p>
                          </div>
                          {item.type === 'emi' && (
                            <>
                              <div>
                                <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">Tenure</p>
                                <p className="font-medium text-[10px] xs:text-xs sm:text-sm text-neutral-700">{item.tenure} months</p>
                              </div>
                              <div>
                                <p className="text-[10px] xs:text-xs text-neutral-500 mb-0.5">Progress</p>
                                <div className="w-full h-1.5 sm:h-2 bg-neutral-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-pink-500 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${((item.tenure || 0) - (item.remainingEmis || 0)) / (item.tenure || 1) * 100}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  );
};

export default HistoryPage;
