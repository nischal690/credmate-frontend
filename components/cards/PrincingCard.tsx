'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { cn } from '@/lib/utils';

interface PrincingCardProps {
  plan: Plan;

  onSelect: (plan: Plan) => void;
}

const PrincingCard = ({ plan, onSelect }: PrincingCardProps) => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const { name, price, period, icon, features, isPriority } = plan;
  return (
    <motion.div
      key={name}
      className={`relative rounded-2xl p-6 ${
        isPriority
          ? 'border-4 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)] transform scale-105'
          : 'border border-gray-200'
      } bg-white overflow-hidden`}
      whileHover={{
        scale: plan.isPriority ? 1.05 : 1.02,
        transition: { duration: 0.2 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isPriority && (
        <div className='absolute top-0 right-0 z-50'>
          <div className='bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-8 py-1 transform rotate-45 translate-x-6 translate-y-3'>
            Priority
          </div>
        </div>
      )}
      <motion.div
        className='relative overflow-hidden transition-all duration-500 shadow-lg rounded-3xl bg-white/80 backdrop-blur-lg hover:shadow-2xl'
        animate={{
          scale: hoveredPlan === name ? 1.02 : 1,
          y: hoveredPlan === name ? -5 : 0,
        }}
      >
        <div
          className={`bg-gradient-to-r ${isPriority ? 'from-[#FFD700] to-[#FFA500]' : 'from-[#A2195E] to-[#BA1C6C]'} p-8 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />
          <div className='relative'>
            <div className='flex items-center gap-4 mb-6'>
              <motion.div
                className='flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-lg ring-2 ring-white/20'
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              >
                {icon}
              </motion.div>
              <div>
                <h3 className='mb-1 text-xl font-bold text-white'>{name}</h3>
                <div className='flex items-baseline gap-1'>
                  <span className='text-3xl font-bold text-white'>{price}</span>
                  <span className='text-sm text-white/70'>{plan.period}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='p-8'>
          <ul className='space-y-4'>
            {features.map((feature: string, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className='flex items-center gap-3 text-gray-700'
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircleIcon sx={{ fontSize: 24, color: '#A2195E' }} />
                </motion.div>
                <span className='font-medium'>{feature}</span>
              </motion.li>
            ))}
          </ul>
          <div className='mt-8'>
            <button
              onClick={() => onSelect(plan)}
              className={cn(
                'w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 hover:bg-gradient-to-r hover:from-[#8B1550] hover:to-[#A2195E] hover:text-white',
                isPriority
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white '
                  : 'bg-white border-2 border-[#A2195E] text-[#A2195E] '
              )}
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrincingCard;
