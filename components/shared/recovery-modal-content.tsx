'use client';

import { Typography } from '@mui/material';

export function RecoveryModalContent() {
  const steps = [
    {
      step: 1,
      title: 'Initial Verification',
      description:
        'To prevent fraudulent reports, we first verify with the borrower about receiving the loan. Their acknowledgment serves as proof for proceeding with recovery. This step protects both genuine lenders and borrowers.',
    },
    {
      step: 2,
      title: 'Documentation Review',
      description:
        "If you have any proof of lending (WhatsApp messages, UPI transactions, written notes, etc.), you can provide them to strengthen the recovery case. However, this is optional and we'll proceed even without formal documentation.",
    },
    {
      step: 3,
      title: 'Professional Communication',
      description:
        'Once verified, our recovery experts initiate professional communication with the borrower through calls and messages. We maintain a respectful approach while representing you.',
    },
    {
      step: 4,
      title: 'Resolution & Recovery',
      description:
        'We work to establish a repayment plan and facilitate the recovery of your funds through a structured and professional approach.',
    },
    {
      step: 5,
      title: 'Progress Updates',
      description:
        "You'll receive regular updates about the recovery progress through our platform, keeping you informed at every step of the process.",
    },
  ];

  return (
    <div className='relative'>
      <div className='absolute left-4 top-4 bottom-4 w-0.5 bg-pink-100'></div>
      <div className='space-y-6'>
        {steps.map(({ step, title, description }) => (
          <div key={step} className='flex gap-3'>
            <div className='relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full'>
              <span className='text-[#A2195E] font-semibold'>{step}</span>
            </div>
            <div className='flex-1'>
              <Typography
                variant='subtitle1'
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: '0.9375rem', sm: '1rem' },
                }}
              >
                {title}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                }}
              >
                {description}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
