'use client';

import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface WarningMessageProps {
  message: string;
  isSuccess?: boolean;
}

export function WarningMessage({
  message,
  isSuccess = false,
}: WarningMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center p-4 mb-4 rounded-lg ${
        isSuccess
          ? 'bg-green-50 text-green-800'
          : 'bg-yellow-50 text-yellow-800'
      }`}
    >
      {isSuccess ? (
        <CheckCircleIcon className='w-5 h-5 mr-2 text-green-600' />
      ) : (
        <InformationCircleIcon className='w-5 h-5 mr-2 text-yellow-600' />
      )}
      <span className='text-sm'>{message}</span>
    </motion.div>
  );
}
