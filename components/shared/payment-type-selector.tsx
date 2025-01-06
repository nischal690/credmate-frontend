'use client';

import { motion } from 'framer-motion';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import Image from 'next/image';

interface PaymentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentTypeSelector({
  value,
  onChange,
}: PaymentTypeSelectorProps) {
  return (
    <div>
      <label className='block mb-4 text-sm font-medium text-gray-700'>
        Payment Type
      </label>
      <div className='grid grid-cols-2 gap-4'>
        <motion.div whileTap={{ scale: 0.98 }}>
          <FormControlLabel
            value='onetime'
            control={
              <Radio
                checked={value === 'onetime'}
                onChange={(e) => onChange(e.target.value)}
              />
            }
            label={
              <div
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all
                ${value === 'onetime' ? 'bg-pink-50' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <Image
                  src='/images/onetime-payment.svg'
                  alt='One-time Payment'
                  width={32}
                  height={32}
                  className='mb-2'
                />
                <span className='text-sm font-medium text-gray-800'>
                  One-time Payment
                </span>
              </div>
            }
            className='w-full m-0'
          />
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <FormControlLabel
            value='emi'
            control={
              <Radio
                checked={value === 'emi'}
                onChange={(e) => onChange(e.target.value)}
              />
            }
            label={
              <div
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all
                ${value === 'emi' ? 'bg-pink-50' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <Image
                  src='/images/emi-payment.svg'
                  alt='EMI'
                  width={32}
                  height={32}
                  className='mb-2'
                />
                <span className='text-sm font-medium text-gray-800'>EMI</span>
              </div>
            }
            className='w-full m-0'
          />
        </motion.div>
      </div>
    </div>
  );
}
