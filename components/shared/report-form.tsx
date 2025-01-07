'use client';

import { motion } from 'framer-motion';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
} from '@mui/material';
import { Phone, Calendar, IndianRupee, AlertCircle } from 'lucide-react';
import { type LoanFormData } from '@/types/loan';

interface ReportFormProps {
  formData: LoanFormData;
  warningMessage: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string | boolean) => void;
}

export function ReportForm({
  formData,
  warningMessage,
  onSubmit,
  onChange,
}: ReportFormProps) {
  return (
    <form onSubmit={onSubmit} className='mt-4 space-y-6'>
      {/* Phone Input */}
      <div className='relative'>
        <Phone className='absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2' />
        <TextField
          fullWidth
          label="Borrower's Phone Number"
          variant='outlined'
          value={formData.borrowerPhone}
          onChange={(e) => onChange('borrowerPhone', e.target.value)}
          type='tel'
          required
          inputProps={{
            pattern: '[0-9]{10}',
            maxLength: 10,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingLeft: '2.5rem',
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#A2195E',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#A2195E',
              },
            },
            '& .MuiInputLabel-root': {
              transform: 'translate(2.5rem, 1rem) scale(1)',
            },
            '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled':
              {
                transform: 'translate(1rem, -0.5rem) scale(0.75)',
              },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#A2195E',
            },
          }}
        />
      </div>

      {warningMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-center p-4 border border-orange-200 rounded-lg bg-orange-50'
        >
          <AlertCircle className='flex-shrink-0 w-5 h-5 mr-2 text-orange-500' />
          <Typography className='text-orange-700'>{warningMessage}</Typography>
        </motion.div>
      )}

      {/* Amount Input */}
      <div className='relative'>
        <IndianRupee className='absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2' />
        <TextField
          fullWidth
          label='Unpaid Amount'
          variant='outlined'
          value={formData.loanAmount}
          onChange={(e) => onChange('loanAmount', e.target.value)}
          type='number'
          required
          inputProps={{
            min: 0,
            step: '0.01',
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingLeft: '2.5rem',
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#A2195E',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#A2195E',
              },
            },
            '& .MuiInputLabel-root': {
              transform: 'translate(2.5rem, 1rem) scale(1)',
            },
            '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled':
              {
                transform: 'translate(1rem, -0.5rem) scale(0.75)',
              },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#A2195E',
            },
          }}
        />
      </div>

      {/* Date Input */}
      <div className='relative'>
        <Calendar className='absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2' />
        <TextField
          fullWidth
          label='Due Date'
          type='date'
          variant='outlined'
          value={formData.dueDate}
          onChange={(e) => onChange('dueDate', e.target.value)}
          required
          inputProps={{
            max: new Date().toISOString().split('T')[0],
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingLeft: '2.5rem',
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#A2195E',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#A2195E',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#A2195E',
            },
          }}
        />
      </div>

      {/* Consent Section */}
      <div className='p-4 border border-gray-100 bg-gray-50 rounded-xl'>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consent}
              onChange={(e) => onChange('consent', e.target.checked)}
              required
              sx={{
                color: '#A2195E',
                '&.Mui-checked': {
                  color: '#A2195E',
                },
              }}
            />
          }
          label={
            <Typography variant='body2' className='text-gray-700'>
              {formData.reportType === 'recovery_service'
                ? 'I hereby give consent to make recovery calls on my behalf and agree to the recovery process'
                : 'I hereby confirm that the information provided is accurate and can be used to warn other lenders'}
            </Typography>
          }
        />
      </div>

      {/* Submit Button */}
      <motion.div whileTap={{ scale: 0.98 }} className='pt-4'>
        <Button
          type='submit'
          variant='contained'
          fullWidth
          size='large'
          disabled={!formData.consent || !warningMessage}
          sx={{
            height: '56px',
            background: 'linear-gradient(to right, #A2195E, #8B1550)',
            '&:hover': {
              background: 'linear-gradient(to right, #8B1550, #A2195E)',
            },
            '&:disabled': {
              background: '#e0e0e0',
              opacity: 0.7,
              cursor: 'not-allowed',
            },
            borderRadius: '14px',
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow:
              '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          {formData.reportType === 'recovery_service'
            ? 'Submit Report & Start Recovery'
            : 'Submit Report'}
        </Button>
      </motion.div>
    </form>
  );
}
