import React from 'react';

interface PlanTypeFilterProps {
  currentType: 'all' | 'individual' | 'business';
  onTypeChange: (type: 'all' | 'individual' | 'business') => void;
}

const PricingFilter = ({ currentType, onTypeChange }: PlanTypeFilterProps) => {
  return (
    <div className='flex justify-center gap-4 mb-8'>
      {['all', 'individual', 'business'].map((type) => (
        <button
          key={type}
          onClick={() =>
            onTypeChange(type as 'all' | 'individual' | 'business')
          }
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            currentType === type
              ? 'bg-[#A2195E] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}{' '}
          {type === 'all' ? 'Plans' : ''}
        </button>
      ))}
    </div>
  );
};

export default PricingFilter;
