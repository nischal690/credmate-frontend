'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import HistoryAppBar from '../../../components/HistoryAppBar';
import NavBar from '../../../components/NavBar';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
  const [creditType, setCreditType] = React.useState<
    'all' | 'one-time' | 'emi'
  >('all');
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'requested' | 'approved' | 'rejected' | 'completed'
  >('all');
  const [selectedItem, setSelectedItem] = React.useState<number | null>(null);

  const getStatusColor = (
    status: string
  ): { bg: string; text: string; icon: string } => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          icon: '/images/historyicons/completed.svg',
        };
      case 'approved':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          icon: '/images/historyicons/approved.svg',
        };
      case 'requested':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          icon: '/images/historyicons/requested.svg',
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: '/images/historyicons/rejected.svg',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: '/images/historyicons/default.svg',
        };
    }
  };

  const filteredHistory = mockHistoryData.filter((item) => {
    const matchesSearch =
      item.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm);

    const matchesType = creditType === 'all' || item.type === creditType;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const FilterDropdown = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: any) => void;
  }) => (
    <Menu as='div' className='relative'>
      <Menu.Button className='w-full flex items-center justify-between h-11 px-4 text-left bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-xl border border-rose-100/20 hover:border-[#a2195e]/30 focus:ring-2 focus:ring-[#a2195e]/20 transition-all outline-none text-sm group'>
        <span className='flex items-center space-x-2'>
          <span className='text-neutral-400'>{label}</span>
          <span className='text-neutral-900 dark:text-white capitalize font-medium'>
            {options.find((opt) => opt.value === value)?.label}
          </span>
        </span>
        <div className='w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center transition-transform group-hover:bg-[#a2195e]/10'>
          <Image
            src='/images/arrowbendright.svg'
            alt='arrow'
            width={12}
            height={12}
            className='opacity-40 rotate-90 transition-transform group-hover:opacity-60'
          />
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='transform opacity-0 scale-95 translate-y-2'
        enterTo='transform opacity-100 scale-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='transform opacity-100 scale-100 translate-y-0'
        leaveTo='transform opacity-0 scale-95 translate-y-2'
      >
        <Menu.Items className='absolute z-10 mt-2 w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg shadow-black/[0.08] border border-rose-100/20 focus:outline-none overflow-hidden'>
          <div className='p-1.5'>
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onChange(option.value)}
                    className={`
                      ${
                        active
                          ? 'bg-gradient-to-r from-[#a2195e] to-[#ff2b8f] text-white'
                          : value === option.value
                            ? 'bg-rose-50 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                      } 
                      group flex w-full items-center rounded-lg px-3 py-2.5 text-sm capitalize transition-colors
                    `}
                  >
                    <span className='flex-1'>{option.label}</span>
                    {value === option.value && (
                      <span className='ml-2'>
                        <Image
                          src='/images/check.svg'
                          alt='Selected'
                          width={14}
                          height={14}
                          className={`${active ? 'opacity-100' : 'opacity-60'}`}
                        />
                      </span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const filterSection = (
    <div className='space-y-3 mb-6 min-w-[280px]'>
      <FilterDropdown
        label='Type'
        value={creditType}
        onChange={setCreditType}
        options={[
          { value: 'all', label: 'All Types' },
          { value: 'one-time', label: 'One Time' },
          { value: 'emi', label: 'EMI' },
        ]}
      />

      <FilterDropdown
        label='Status'
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'requested', label: 'Requested' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'completed', label: 'Completed' },
        ]}
      />
    </div>
  );

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-neutral-900 dark:to-neutral-900'>
      <HistoryAppBar />
      <main className='flex-1 overflow-y-auto overscroll-y-contain'>
        <div className='container min-h-full w-full px-4 pt-20 pb-24 mx-auto max-w-[480px] min-w-[320px]'>
          {/* Search Section */}
          <div className='relative mb-6 min-w-[280px]'>
            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
              <Image
                src='/images/searchprofileicons/search.svg'
                alt='Search'
                width={16}
                height={16}
                className='w-4 opacity-40'
              />
            </div>
            <input
              type='text'
              placeholder='Search transactions...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 h-11 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-xl border border-rose-100/20 focus:ring-2 focus:ring-[#a2195e]/20 transition-all outline-none text-sm placeholder:text-neutral-400'
            />
          </div>

          {/* Replace the Filter Pills section with the new filterSection */}
          {filterSection}

          {/* History List */}
          <div className='space-y-3 min-w-[280px]'>
            {filteredHistory.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16'>
                <div className='w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-[#a2195e]/10 to-[#ff2b8f]/10 flex items-center justify-center'>
                  <Image
                    src='/images/searchprofileicons/search.svg'
                    alt='No results'
                    width={24}
                    height={24}
                    className='opacity-30'
                  />
                </div>
                <h3 className='text-base font-semibold text-neutral-900 dark:text-white mb-1'>
                  No results found
                </h3>
                <p className='text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-[250px]'>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const statusStyle = getStatusColor(item.status);
                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      setSelectedItem(selectedItem === item.id ? null : item.id)
                    }
                    className={`relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-2xl p-4 transition-all active:scale-[0.98] border border-rose-100/20 ${
                      selectedItem === item.id ? 'ring-2 ring-[#a2195e]' : ''
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      {/* Status Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl ${statusStyle.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Image
                          src={statusStyle.icon}
                          alt={item.status}
                          width={20}
                          height={20}
                          className='w-5 h-5'
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <h3 className='font-medium text-sm text-neutral-900 dark:text-white truncate'>
                            {item.lender}
                          </h3>
                          <span
                            className={`text-[10px] font-medium capitalize px-2.5 py-1 rounded-lg ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className='text-[10px] text-neutral-500 dark:text-neutral-400 mb-3'>
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </p>

                        <div className='flex flex-wrap gap-4'>
                          <div>
                            <p className='text-[10px] text-neutral-500 dark:text-neutral-400 mb-0.5'>
                              Amount
                            </p>
                            <p className='font-medium text-sm text-neutral-900 dark:text-white'>
                              {formatAmount(item.amount)}
                            </p>
                          </div>

                          {item.type === 'emi' && (
                            <>
                              <div>
                                <p className='text-[10px] text-neutral-500 dark:text-neutral-400 mb-0.5'>
                                  EMI
                                </p>
                                <p className='font-medium text-sm text-neutral-900 dark:text-white'>
                                  {formatAmount(item.emiAmount || 0)}
                                </p>
                              </div>

                              {/* EMI Progress */}
                              <div className='w-full mt-2'>
                                <div className='flex justify-between items-center mb-1.5'>
                                  <p className='text-[10px] text-neutral-500 dark:text-neutral-400'>
                                    EMI Progress
                                  </p>
                                  <p className='text-[10px] font-medium text-neutral-900 dark:text-white'>
                                    {item.tenure! - item.remainingEmis!}/
                                    {item.tenure} paid
                                  </p>
                                </div>
                                <div className='h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden'>
                                  <div
                                    className='h-full bg-gradient-to-r from-[#a2195e] to-[#ff2b8f] rounded-full transition-all duration-500'
                                    style={{
                                      width: `${(((item.tenure || 0) - (item.remainingEmis || 0)) / (item.tenure || 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
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
