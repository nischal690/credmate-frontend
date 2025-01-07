'use client';

import { motion } from 'framer-motion';
import { Select, MenuItem } from '@mui/material';

interface EMIFrequencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function EMIFrequencySelector({
  value,
  onChange,
}: EMIFrequencySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <label className='block mb-2 text-sm font-medium text-gray-700'>
        EMI Frequency
      </label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        <MenuItem value='daily'>Daily</MenuItem>
        <MenuItem value='weekly'>Weekly</MenuItem>
        <MenuItem value='monthly'>Monthly</MenuItem>
      </Select>
    </motion.div>
  );
}
