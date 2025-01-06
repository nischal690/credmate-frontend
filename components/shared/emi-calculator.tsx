'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { type LoanFormData } from '@/types/loan';

interface EMICalculatorProps {
  formData: LoanFormData;
}

export function EMICalculator({ formData }: EMICalculatorProps) {
  const calculateEMI = () => {
    if (!formData.loanAmount || !formData.interestRate || !formData.loanTerm)
      return 0;

    const principal = parseFloat(formData.loanAmount);
    const ratePerPeriod =
      parseFloat(formData.interestRate) /
      100 /
      (formData.emiFrequency === 'daily' ? 365 : 12);
    let numberOfPayments: number;

    if (formData.timeUnit === 'year') {
      numberOfPayments =
        formData.emiFrequency === 'daily'
          ? 365 * parseFloat(formData.loanTerm)
          : 12 * parseFloat(formData.loanTerm);
    } else if (formData.timeUnit === 'month') {
      numberOfPayments =
        formData.emiFrequency === 'daily'
          ? 30 * parseFloat(formData.loanTerm)
          : parseFloat(formData.loanTerm);
    } else {
      numberOfPayments =
        formData.emiFrequency === 'daily'
          ? parseFloat(formData.loanTerm)
          : parseFloat(formData.loanTerm) / 30;
    }

    const emi =
      (principal *
        ratePerPeriod *
        Math.pow(1 + ratePerPeriod, numberOfPayments)) /
      (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);

    return isNaN(emi) ? 0 : emi;
  };

  const emiAmount = calculateEMI();

  if (emiAmount <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl'
    >
      <h3 className='mb-2 text-lg font-semibold'>EMI Calculator</h3>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm opacity-90'>
            {formData.type === 'give' ? 'Expected' : 'Estimated'} EMI Amount
          </p>
          <p className='text-2xl font-bold'>₹{emiAmount.toFixed(2)}</p>
        </div>
        <div className='flex items-center justify-center w-12 h-12 rounded-full bg-white/20'>
          <Image
            src='/images/calculator.svg'
            alt='Calculator'
            width={24}
            height={24}
          />
        </div>
      </div>
    </motion.div>
  );
}
