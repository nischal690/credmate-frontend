'use client';

import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function ReportBorrowerAppBar() {
  const router = useRouter();

  return (
    <div className='bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-4'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => router.push('/')}
          className='text-white transition-opacity hover:opacity-80'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <h1 className='text-xl font-semibold text-white'>Report Borrower</h1>
      </div>

      <div className='px-4 mt-6 text-white'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='mb-2 text-2xl font-bold'>Report Unpaid Loan</h2>
              <p className='text-white/80'>
                Help us maintain a healthy credit ecosystem
              </p>
            </div>
            <div className='relative w-20 h-20'>
              <Image
                src='/images/Frame.svg'
                alt='Report Icon'
                width={80}
                height={80}
                className='brightness-0 invert opacity-90'
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
