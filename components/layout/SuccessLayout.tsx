import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface SuccessStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SuccessLayoutProps {
  title: string;
  description: string;
  steps: SuccessStep[];
  actionText: string;
  onActionClick: () => void;
}

export const SuccessLayout: React.FC<SuccessLayoutProps> = ({
  title,
  description,
  steps,
  actionText,
  onActionClick,
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <div className='flex-1 overflow-y-auto'>
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col items-center justify-center min-h-full px-6 pt-10 pb-24'
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className='flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full'
        >
          <CheckCircleIcon className='w-12 h-12 text-green-600' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='text-center'
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-800'>{title}</h2>
          <p className='max-w-md mb-8 text-lg text-gray-600'>{description}</p>
        </motion.div>

        <div className='grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className='p-6 bg-white shadow-lg rounded-2xl'
            >
              <div className='flex items-center justify-center w-12 h-12 mb-4 bg-pink-100 rounded-full'>
                <div className='text-pink-600'>{step.icon}</div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-800'>
                {step.title}
              </h3>
              <p className='text-gray-600'>{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onActionClick}
          className='px-8 py-3 mt-8 font-medium text-white transition-colors duration-300 bg-pink-600 rounded-full hover:bg-pink-700'
        >
          {actionText}
        </motion.button>
      </motion.div>
    </div>
  );
};
