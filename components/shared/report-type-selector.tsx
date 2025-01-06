'use client';

import { motion } from 'framer-motion';
import { Radio, RadioGroup, FormControlLabel, IconButton } from '@mui/material';
import { Shield, PhoneCall, Info } from 'lucide-react';

interface ReportTypeSelectorProps {
  value: 'report_only' | 'recovery_service';

  onChange: (value: 'report_only' | 'recovery_service') => void;

  onInfoClick: (type: 'report_only' | 'recovery_service') => void;
}

export function ReportTypeSelector({
  value,
  onChange,
  onInfoClick,
}: ReportTypeSelectorProps) {
  return (
    <div className='space-y-4'>
      <h3 className='font-semibold text-gray-700'>Choose Report Type</h3>
      <RadioGroup
        value={value}
        onChange={(e) =>
          onChange(e.target.value as 'report_only' | 'recovery_service')
        }
        className='space-y-3'
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative rounded-xl border-2 transition-all cursor-pointer
            ${
              value === 'report_only'
                ? 'border-[#A2195E] bg-pink-50'
                : 'border-gray-200 bg-white'
            }`}
        >
          <FormControlLabel
            value='report_only'
            control={
              <Radio
                sx={{
                  color: '#A2195E',
                  '&.Mui-checked': {
                    color: '#A2195E',
                  },
                }}
              />
            }
            label={
              <div className='py-2'>
                <div className='flex items-center gap-3'>
                  <Shield className='w-5 h-5 text-[#A2195E]' />
                  <span className='font-semibold text-gray-800'>
                    Report Only
                  </span>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onInfoClick('report_only');
                    }}
                    size='small'
                    sx={{ color: '#A2195E' }}
                  >
                    <Info className='w-4 h-4' />
                  </IconButton>
                </div>
                <p className='mt-1 ml-8 text-sm text-gray-600'>
                  Report defaulter to protect others. This information will be
                  used to warn other lenders.
                </p>
                <div className='ml-8 mt-2 text-sm font-medium text-[#A2195E]'>
                  Free
                </div>
              </div>
            }
            className='w-full p-3 m-0'
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative rounded-xl border-2 transition-all cursor-pointer
            ${
              value === 'recovery_service'
                ? 'border-[#A2195E] bg-pink-50'
                : 'border-gray-200 bg-white'
            }`}
        >
          <FormControlLabel
            value='recovery_service'
            control={
              <Radio
                sx={{
                  color: '#A2195E',
                  '&.Mui-checked': {
                    color: '#A2195E',
                  },
                }}
              />
            }
            label={
              <div className='py-2'>
                <div className='flex items-center gap-3'>
                  <PhoneCall className='w-5 h-5 text-[#A2195E]' />
                  <span className='font-semibold text-gray-800'>
                    Assistance Service
                  </span>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onInfoClick('recovery_service');
                    }}
                    size='small'
                    sx={{ color: '#A2195E' }}
                  >
                    <Info className='w-4 h-4' />
                  </IconButton>
                </div>
                <p className='mt-1 ml-8 text-sm text-gray-600'>
                  We are here to assist you with recovering your money through
                  our dedicated and professional recovery services.
                </p>
              </div>
            }
            className='w-full p-3 m-0'
          />
        </motion.div>
      </RadioGroup>
    </div>
  );
}
