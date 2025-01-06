'use client';

import { AlertCircle, X } from 'lucide-react';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function InfoModal({
  open,
  onClose,
  title,
  description,
  children,
}: InfoModalProps) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={title}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '20px',
          boxShadow:
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          p: { xs: 3, sm: 4 },
          maxHeight: { xs: '85vh', sm: '90vh' },
          overflow: 'auto',
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <div className='flex items-center justify-between mb-4'>
          <Typography
            variant='h6'
            component='h2'
            sx={{
              color: '#A2195E',
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'gray',
              '&:hover': { color: '#A2195E' },
            }}
          >
            <X className='w-5 h-5' />
          </IconButton>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-3 mb-5 border border-orange-200 bg-orange-50 rounded-xl'
        >
          <div className='flex gap-2'>
            <AlertCircle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
            <Typography
              variant='body2'
              sx={{
                color: 'rgb(194,65,12)',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {description}
            </Typography>
          </div>
        </motion.div>

        <div className='space-y-4'>{children}</div>

        <Button
          onClick={onClose}
          fullWidth
          variant='contained'
          sx={{
            mt: 4,
            height: { xs: '44px', sm: '48px' },
            background: 'linear-gradient(to right, #A2195E, #8B1550)',
            '&:hover': {
              background: 'linear-gradient(to right, #8B1550, #A2195E)',
            },
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: { xs: '0.9375rem', sm: '1rem' },
            fontWeight: '600',
          }}
        >
          Got it
        </Button>
      </Box>
    </Modal>
  );
}
