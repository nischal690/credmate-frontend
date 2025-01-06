'use client';

import { motion } from 'framer-motion';
import { StyledTextField } from './styled-text-field';
import { Select, MenuItem } from '@mui/material';
import { IndianRupee, Calendar } from 'lucide-react';
import { PaymentTypeSelector } from './payment-type-selector';
import { EMIFrequencySelector } from './emi-frequency-selector';
import { EMICalculator } from './emi-calculator';
import { type LoanFormData } from '@/types/loan';

interface LoanFormProps {
  formData: LoanFormData;
  onChange: (data: Partial<LoanFormData>) => void;
  onSubmit: () => void;
  submitButtonText?: string;
  showEMICalculator?: boolean;
}

export function LoanForm({
  formData,
  onChange,
  onSubmit,
  submitButtonText = 'Submit',
  showEMICalculator = true,
}: LoanFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='p-6 bg-white shadow-lg rounded-3xl'>
        <h2 className='mb-6 text-2xl font-bold text-gray-800'>Loan Details</h2>

        <div className='space-y-6'>
          {/* Amount Input */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
              {formData.type === 'give' ? 'Amount to Lend' : 'Loan Amount'}
            </label>
            <div className='relative'>
              <IndianRupee className='absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2' />
              <StyledTextField
                fullWidth
                type='number'
                value={formData.loanAmount}
                onChange={(e) => onChange({ loanAmount: e.target.value })}
                placeholder='Enter amount'
                InputProps={{
                  startAdornment: <span className='mr-2 text-gray-500'>₹</span>,
                }}
                className='mb-1'
              />
            </div>
            <p className='mt-1 text-sm text-gray-500'>
              Min: ₹1,000 | Max: ₹10,00,000
            </p>
          </div>

          {/* Term and Unit Inputs */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                {formData.type === 'give' ? 'Lending Term' : 'Loan Term'}
              </label>
              <StyledTextField
                fullWidth
                type='number'
                value={formData.loanTerm}
                onChange={(e) => onChange({ loanTerm: e.target.value })}
                placeholder='Duration'
              />
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                Time Unit
              </label>
              <Select
                value={formData.timeUnit}
                onChange={(e) => onChange({ timeUnit: e.target.value })}
                className='w-full rounded-xl'
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E5E5',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#A2195E',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#A2195E',
                  },
                }}
              >
                <MenuItem value='month'>Months</MenuItem>
                <MenuItem value='year'>Years</MenuItem>
                <MenuItem value='day'>Days</MenuItem>
              </Select>
            </div>
          </div>

          {/* Interest Rate Input */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
              {formData.type === 'give'
                ? 'Expected Interest Rate'
                : 'Interest Rate'}{' '}
              (% per annum)
            </label>
            <StyledTextField
              fullWidth
              type='number'
              value={formData.interestRate}
              onChange={(e) => onChange({ interestRate: e.target.value })}
              placeholder='Enter interest rate'
              InputProps={{
                endAdornment: <span className='text-gray-500'>%</span>,
              }}
            />
          </div>

          {/* Payment Type Selection */}
          <PaymentTypeSelector
            value={formData.paymentType}
            onChange={(value) => onChange({ paymentType: value })}
          />

          {/* EMI Frequency Selection */}
          {formData.paymentType === 'emi' && (
            <EMIFrequencySelector
              value={formData.emiFrequency}
              onChange={(value) => onChange({ emiFrequency: value })}
            />
          )}
        </div>
      </div>

      {/* EMI Calculator */}
      {showEMICalculator && formData.paymentType === 'emi' && (
        <EMICalculator formData={formData} />
      )}

      {/* Submit Button */}
      <motion.button
        type='submit'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='w-full py-4 font-semibold text-white transition-colors bg-pink-600 rounded-xl hover:bg-pink-700'
      >
        {submitButtonText}
      </motion.button>
    </form>
  );
}
