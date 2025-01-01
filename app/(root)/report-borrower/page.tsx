'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Container,
  Radio,
  RadioGroup,
  Modal,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft,
  Phone,
  Calendar,
  IndianRupee,
  AlertCircle,
  Shield,
  PhoneCall,
  Info,
  X,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { auth } from '../../../lib/firebase';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ReportBorrower() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    borrowerPhone: '',
    unpaidAmount: '',
    dueDate: '',
    consent: false,
    reportType: 'report_only', // 'report_only', 'recovery_service'
  });

  const [openRecoveryModal, setOpenRecoveryModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if there's a warning message
    if (warningMessage) {
      console.log('Form submission blocked due to warning:', warningMessage);
      return;
    }

    try {
      console.log('Form submitted:', formData);
      const recoveryFee =
        formData.reportType === 'recovery_service'
          ? (parseFloat(formData.unpaidAmount) * 0.02).toFixed(2)
          : 0;
      console.log('Recovery fee:', recoveryFee);

      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated. Please login again.');
        return;
      }

      const idToken = await user.getIdToken(true);

      const requestBody = {
        mobileNumber: `+91${formData.borrowerPhone}`,
        unpaidAmount: parseFloat(formData.unpaidAmount),
        dueDate: new Date(formData.dueDate).toISOString(),
        recoveryMode: formData.reportType === 'recovery_service',
      };

      alert(
        `Making API Call to: ${baseURL}/borrower/report_borrower\n\nHeaders:\n${JSON.stringify(
          {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          null,
          2
        )}\n\nRequest Body:\n${JSON.stringify(requestBody, null, 2)}`
      );

      const response = await fetch(`${baseURL}/borrower/report_borrower`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(
          `API Error!\nStatus: ${response.status}\nResponse:\n${errorText}`
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(`API Response:\n${JSON.stringify(data, null, 2)}`);
      console.log('Report submitted successfully:', data);

      // Redirect to thank you page
      router.push('/report-success');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange =
    (field: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === 'borrowerPhone') {
        // Only allow digits and limit to 10 characters
        const cleanNumber = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
        setFormData({ ...formData, [field]: cleanNumber });

        // Make API call when 10 digits are entered
        if (cleanNumber.length === 10) {
          try {
            const user = auth.currentUser;
            if (!user) {
              console.error('User not authenticated. Please login again.');
              return;
            }

            console.log('Making API call for number:', cleanNumber);
            const idToken = await user.getIdToken(true);
            const formattedNumber = `+91${cleanNumber}`;

            const apiUrl = `${baseURL}/search/mobile/${formattedNumber}`;
            alert(
              `Making API Call to: ${apiUrl}\n\nHeaders:\n${JSON.stringify(
                {
                  Authorization: 'Bearer ' + idToken,
                  'Content-Type': 'application/json',
                },
                null,
                2
              )}`
            );

            const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              alert(
                `API Error!\nStatus: ${response.status}\nResponse:\n${errorText}`
              );
              console.error('API Error:', {
                status: response.status,
                statusText: response.statusText,
                url: apiUrl,
              });
              setWarningMessage(null);
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            alert(`API Response:\n${JSON.stringify(data, null, 2)}`);

            // Add detailed logging to debug
            console.log('Checking conditions:', {
              responseOk: response.ok,
              hasName: !!data.name,
              name: data.name,
              fullData: data,
            });

            // Adjusted condition to check direct properties
            if (response.ok && data.name) {
              console.log('Setting warning message for name:', data.name);
              setWarningMessage(
                `The phone number belongs to ${data.name} who is already a part of the Credmate community. Only those who are not part of Credmate community can be reported.`
              );
            } else {
              console.log('Clearing warning message');
              setWarningMessage(null);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      } else {
        setFormData({ ...formData, [field]: e.target.value });
      }
    };

  const calculateRecoveryFee = () => {
    if (!formData.unpaidAmount) return '0';
    return (parseFloat(formData.unpaidAmount) * 0.02).toFixed(2);
  };

  return (
    <div className='h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-purple-50'>
      {/* Header - Fixed */}
      <div className='bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-4'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => router.push('/')}
            className='text-white hover:opacity-80 transition-opacity'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <h1 className='text-xl font-semibold text-white'>Report Borrower</h1>
        </div>

        {/* Header Content */}
        <div className='mt-6 px-4 text-white'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold mb-2'>Report Unpaid Loan</h2>
                <p className='text-white/80'>
                  Help us maintain a healthy credit ecosystem
                </p>
              </div>
              <div className='relative w-20 h-20'>
                <Image
                  src='/images/Frame.svg'
                  alt='Report Icon'
                  width={80}
                  height={80}
                  className='brightness-0 invert opacity-90'
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <Container maxWidth='sm' className='py-6 px-4 pb-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='bg-white rounded-3xl shadow-xl p-6 relative mt-4'>
              {/* Info Box */}
              <motion.div
                className='bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-200'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex gap-3 items-start'>
                  <AlertCircle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
                  <p className='text-sm text-orange-700'>
                    Please ensure all information provided is accurate. False
                    reporting may lead to legal consequences.
                  </p>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Report Type Selection */}
                <div className='space-y-4'>
                  <Typography
                    variant='subtitle1'
                    className='font-semibold text-gray-700'
                  >
                    Choose Report Type
                  </Typography>
                  <RadioGroup
                    value={formData.reportType}
                    onChange={(e) =>
                      setFormData({ ...formData, reportType: e.target.value })
                    }
                    className='space-y-3'
                  >
                    {/* Report Only Option */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative rounded-xl border-2 transition-all cursor-pointer
                        ${
                          formData.reportType === 'report_only'
                            ? 'border-[#A2195E] bg-pink-50'
                            : 'border-gray-200 bg-white'
                        }`}
                    >
                      <FormControlLabel
                        value='report_only'
                        control={
                          <Radio
                            sx={{
                              color: '#A2195E',
                              '&.Mui-checked': {
                                color: '#A2195E',
                              },
                            }}
                          />
                        }
                        label={
                          <div className='py-2'>
                            <div className='flex items-center gap-3'>
                              <Shield className='w-5 h-5 text-[#A2195E]' />
                              <span className='font-semibold text-gray-800'>
                                Report Only
                              </span>
                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenReportModal(true);
                                }}
                                size='small'
                                sx={{ color: '#A2195E' }}
                              >
                                <Info className='w-4 h-4' />
                              </IconButton>
                            </div>
                            <p className='text-sm text-gray-600 mt-1 ml-8'>
                              Report defaulter to protect others. This
                              information will be used to warn other lenders.
                            </p>
                            <div className='ml-8 mt-2 text-sm font-medium text-[#A2195E]'>
                              Free
                            </div>
                          </div>
                        }
                        className='w-full m-0 p-3'
                      />
                    </motion.div>

                    {/* Recovery Service Option */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative rounded-xl border-2 transition-all cursor-pointer
                        ${
                          formData.reportType === 'recovery_service'
                            ? 'border-[#A2195E] bg-pink-50'
                            : 'border-gray-200 bg-white'
                        }`}
                    >
                      <FormControlLabel
                        value='recovery_service'
                        control={
                          <Radio
                            sx={{
                              color: '#A2195E',
                              '&.Mui-checked': {
                                color: '#A2195E',
                              },
                            }}
                          />
                        }
                        label={
                          <div className='py-2'>
                            <div className='flex items-center gap-3'>
                              <PhoneCall className='w-5 h-5 text-[#A2195E]' />
                              <span className='font-semibold text-gray-800'>
                                Assistance Service
                              </span>
                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenRecoveryModal(true);
                                }}
                                size='small'
                                sx={{ color: '#A2195E' }}
                              >
                                <Info className='w-4 h-4' />
                              </IconButton>
                            </div>
                            <p className='text-sm text-gray-600 mt-1 ml-8'>
                              We are here to assist you with recovering your
                              money through our dedicated and professional
                              recovery services.{' '}
                            </p>
                          </div>
                        }
                        className='w-full m-0 p-3'
                      />
                    </motion.div>
                  </RadioGroup>
                </div>

                {/* Phone Input */}
                <div className='relative'>
                  <Phone className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                  <TextField
                    fullWidth
                    label="Borrower's Phone Number"
                    variant='outlined'
                    value={formData.borrowerPhone}
                    onChange={handleInputChange('borrowerPhone')}
                    type='tel'
                    required
                    inputProps={{
                      pattern: '[0-9]{10}',
                      maxLength: 10,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        paddingLeft: '2.5rem', // Adds space for the icon
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#A2195E', // Hover border color
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A2195E', // Focused border color
                        },
                      },
                      '& .MuiInputLabel-root': {
                        transform: 'translate(2.5rem, 1rem) scale(1)', // Moved further to the right
                      },
                      '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled':
                        {
                          transform: 'translate(1rem, -0.5rem) scale(0.75)', // Shrinks and moves up
                        },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#A2195E', // Focused label color
                      },
                    }}
                  />
                </div>

                {warningMessage && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: '#FFF4E5',
                      borderRadius: 1,
                      border: '1px solid #FFB74D',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      width: '100%', // Added full width
                    }}
                  >
                    <AlertCircle size={20} className='text-orange-500 mt-0.5' />
                    <Typography color='warning.dark' sx={{ flex: 1 }}>
                      {warningMessage}
                    </Typography>
                  </Box>
                )}

                {/* Amount Input */}
                <div className='relative'>
                  <IndianRupee className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                  <TextField
                    fullWidth
                    label='Unpaid Amount'
                    variant='outlined'
                    value={formData.unpaidAmount}
                    onChange={handleInputChange('unpaidAmount')}
                    type='number'
                    required
                    inputProps={{
                      min: 0,
                      step: '0.01',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        paddingLeft: '2.5rem', // Adds space for the icon
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#A2195E', // Hover border color
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A2195E', // Focused border color
                        },
                      },
                      '& .MuiInputLabel-root': {
                        transform: 'translate(2.5rem, 1rem) scale(1)', // Moved further to the right
                      },
                      '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled':
                        {
                          transform: 'translate(1rem, -0.5rem) scale(0.75)', // Shrinks and moves up
                        },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#A2195E', // Focused label color
                      },
                    }}
                  />
                </div>

                {/* Date Input */}
                <div className='relative'>
                  <Calendar className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                  <TextField
                    fullWidth
                    label='Due Date'
                    type='date'
                    variant='outlined'
                    value={formData.dueDate}
                    onChange={handleInputChange('dueDate')}
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
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.consent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consent: e.target.checked,
                          })
                        }
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
                    disabled={!formData.consent || !!warningMessage}
                    sx={{
                      height: '56px',
                      background: 'linear-gradient(to right, #A2195E, #8B1550)',
                      '&:hover': {
                        background:
                          'linear-gradient(to right, #8B1550, #A2195E)',
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
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Report Only Modal */}
      <Modal
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        aria-labelledby='report-only-modal'
        aria-describedby='report-only-description'
      >
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
              Why Report a Defaulter?
            </Typography>
            <IconButton
              onClick={() => setOpenReportModal(false)}
              sx={{
                color: 'gray',
                '&:hover': { color: '#A2195E' },
              }}
            >
              <X className='w-5 h-5' />
            </IconButton>
          </div>

          {/* Important Notice */}
          <div className='bg-orange-50 rounded-xl p-3 mb-5 border border-orange-200'>
            <div className='flex gap-2'>
              <AlertCircle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
              <Typography
                variant='body2'
                sx={{
                  color: 'rgb(194,65,12)',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                }}
              >
                Has someone broken your trust by not returning borrowed money?
                Help protect others from experiencing the same by reporting the
                defaulter.
              </Typography>
            </div>
          </div>

          <div className='space-y-4'>
            {/* Benefits */}
            <div className='relative'>
              {/* Vertical Line */}
              <div className='absolute left-4 top-4 bottom-4 w-0.5 bg-pink-100'></div>

              {/* Points */}
              <div className='space-y-6'>
                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
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
                      Your report helps other lenders make informed decisions
                      before lending money. This creates a safer lending
                      environment for everyone.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
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
                      When someone checks a borrower's history, they'll see your
                      report as a warning sign, helping them avoid potential
                      defaults.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
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
                      Even if you choose to only report now, you can always opt
                      for our recovery service later if needed.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
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
                      Your report contributes to building a trusted lending
                      community. Together, we can make informal lending safer
                      for everyone.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setOpenReportModal(false)}
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

      {/* Recovery Service Process Modal */}
      <Modal
        open={openRecoveryModal}
        onClose={() => setOpenRecoveryModal(false)}
        aria-labelledby='recovery-process-modal'
        aria-describedby='recovery-process-description'
      >
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
              Recovery Service Process
            </Typography>
            <IconButton
              onClick={() => setOpenRecoveryModal(false)}
              sx={{
                color: 'gray',
                '&:hover': { color: '#A2195E' },
              }}
            >
              <X className='w-5 h-5' />
            </IconButton>
          </div>

          {/* Important Notice */}
          <div className='bg-orange-50 rounded-xl p-3 mb-5 border border-orange-200'>
            <div className='flex gap-2'>
              <AlertCircle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
              <Typography
                variant='body2'
                sx={{
                  color: 'rgb(194,65,12)',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                }}
              >
                We understand that informal lending is often based on trust.
                While having proof of lending (like messages, transactions, or
                documents) increases recovery chances, we'll still assist even
                without formal documentation.
              </Typography>
            </div>
          </div>

          <div className='space-y-4'>
            {/* Process Steps */}
            <div className='relative'>
              {/* Vertical Line */}
              <div className='absolute left-4 top-4 bottom-4 w-0.5 bg-pink-100'></div>

              {/* Steps */}
              <div className='space-y-6'>
                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
                    <span className='text-[#A2195E] font-semibold'>1</span>
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
                      Initial Verification
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      To prevent fraudulent reports, we first verify with the
                      borrower about receiving the loan. Their acknowledgment
                      serves as proof for proceeding with recovery. This step
                      protects both genuine lenders and borrowers.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
                    <span className='text-[#A2195E] font-semibold'>2</span>
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
                      Documentation Review
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      If you have any proof of lending (WhatsApp messages, UPI
                      transactions, written notes, etc.), you can provide them
                      to strengthen the recovery case. However, this is optional
                      and we'll proceed even without formal documentation.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
                    <span className='text-[#A2195E] font-semibold'>3</span>
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
                      Professional Communication
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      Once verified, our recovery experts initiate professional
                      communication with the borrower through calls and
                      messages. We maintain a respectful approach while
                      representing you.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
                    <span className='text-[#A2195E] font-semibold'>4</span>
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
                      Resolution & Recovery
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      We work to establish a repayment plan and facilitate the
                      recovery of your funds through a structured and
                      professional approach.
                    </Typography>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 relative z-10'>
                    <span className='text-[#A2195E] font-semibold'>5</span>
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
                      Progress Updates
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      You'll receive regular updates about the recovery progress
                      through our platform, keeping you informed at every step
                      of the process.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setOpenRecoveryModal(false)}
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
    </div>
  );
}
