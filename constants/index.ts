import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import React from 'react';

export const plans: Plan[] = [
  {
    name: 'Pro Individual',
    price: '₹199',
    period: 'one time',
    icon: React.createElement(WorkspacePremiumIcon, { sx: { fontSize: 28 } }),
    type: 'individual',
    features: [
      'Aadhar verification',
      'PAN verification',
      'Perfect for occasional lenders',
      'Ideal for friends and relatives lending',
      'Basic security features',
    ],
  },
  {
    name: 'Pro Business',
    price: '₹499',
    period: 'one time',
    icon: React.createElement(StarIcon, { sx: { fontSize: 28 } }),
    popular: true,
    type: 'business',
    features: [
      'Everything in Pro Individual',
      'Enhanced security protection',
      'Business lending features',
      'Credit management tools',
      'Ideal for business owners',
    ],
  },
  {
    name: 'Priority Business',
    price: '₹1,999',
    period: '/year',
    icon: React.createElement(DiamondIcon, {
      sx: { fontSize: 32, color: '#FFD700' },
    }),
    type: 'business',
    isPriority: true,
    features: [
      'Everything in Pro Business',
      'Dedicated account manager',
      'Advanced protection features',
      'Lower contract costs',
      'Annual subscription required',
    ],
  },
];
