'use client';

import { Shield, AlertCircle, PhoneCall, Users } from 'lucide-react';
import { Typography } from '@mui/material';

export function ReportModalContent() {
  return (
    <div className='relative'>
      <div className='absolute left-4 top-4 bottom-4 w-0.5 bg-pink-100'></div>
      <div className='space-y-6'>
        <div className='flex gap-3'>
          <div className='relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full'>
            <Shield className='w-4 h-4 text-[#A2195E]' />
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
              Protect the Community
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              Your report helps other lenders make informed decisions before
              lending money. This creates a safer lending environment for
              everyone.
            </Typography>
          </div>
        </div>

        <div className='flex gap-3'>
          <div className='relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full'>
            <AlertCircle className='w-4 h-4 text-[#A2195E]' />
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
              Early Warning System
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              When someone checks a borrower's history, they'll see your report
              as a warning sign, helping them avoid potential defaults.
            </Typography>
          </div>
        </div>

        <div className='flex gap-3'>
          <div className='relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full'>
            <PhoneCall className='w-4 h-4 text-[#A2195E]' />
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
              Future Recovery Options
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              Even if you choose to only report now, you can always opt for our
              recovery service later if needed.
            </Typography>
          </div>
        </div>

        <div className='flex gap-3'>
          <div className='relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full'>
            <Users className='w-4 h-4 text-[#A2195E]' />
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
              Build Trust
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              Your report contributes to building a trusted lending community.
              Together, we can make informal lending safer for everyone.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
