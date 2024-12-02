'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Checkbox, FormControlLabel, Typography, Box, Container, Radio, RadioGroup } from '@mui/material';
import { ChevronLeft, Phone, Calendar, IndianRupee, AlertCircle, Shield, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ReportBorrower() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    borrowerPhone: '',
    unpaidAmount: '',
    dueDate: '',
    consent: false,
    reportType: 'report_only', // 'report_only', 'recovery_service'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form submitted:', formData);
      const recoveryFee = formData.reportType === 'recovery_service' 
        ? (parseFloat(formData.unpaidAmount) * 0.02).toFixed(2) 
        : 0;
      console.log('Recovery fee:', recoveryFee);
      // TODO: Implement API call to submit the report
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const calculateRecoveryFee = () => {
    if (!formData.unpaidAmount) return '0';
    return (parseFloat(formData.unpaidAmount) * 0.02).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">Report Borrower</h1>
        </div>
        
        {/* Header Content */}
        <div className="mt-6 px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Report Unpaid Loan</h2>
                <p className="text-white/80">Help us maintain a healthy credit ecosystem</p>
              </div>
              <div className="relative w-20 h-20">
                <Image
                  src="/images/Frame.svg"
                  alt="Report Icon"
                  width={80}
                  height={80}
                  className="brightness-0 invert opacity-90"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <Container maxWidth="sm" className="py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 relative mt-4">
              {/* Info Box */}
              <motion.div 
                className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-700">
                    Please ensure all information provided is accurate. False reporting may lead to legal consequences.
                  </p>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type Selection */}
                <div className="space-y-4">
                  <Typography variant="subtitle1" className="font-semibold text-gray-700">
                    Choose Report Type
                  </Typography>
                  <RadioGroup
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="space-y-3"
                  >
                    {/* Report Only Option */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative rounded-xl border-2 transition-all cursor-pointer
                        ${formData.reportType === 'report_only' 
                          ? 'border-[#A2195E] bg-pink-50' 
                          : 'border-gray-200 bg-white'}`}
                    >
                      <FormControlLabel
                        value="report_only"
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
                          <div className="py-2">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-[#A2195E]" />
                              <span className="font-semibold text-gray-800">Report Only</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-8">
                              Report defaulter to protect others. This information will be used to warn other lenders.
                            </p>
                            <div className="ml-8 mt-2 text-sm font-medium text-[#A2195E]">Free</div>
                          </div>
                        }
                        className="w-full m-0 p-3"
                      />
                    </motion.div>

                    {/* Recovery Service Option */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative rounded-xl border-2 transition-all cursor-pointer
                        ${formData.reportType === 'recovery_service' 
                          ? 'border-[#A2195E] bg-pink-50' 
                          : 'border-gray-200 bg-white'}`}
                    >
                      <FormControlLabel
                        value="recovery_service"
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
                          <div className="py-2">
                            <div className="flex items-center gap-3">
                              <PhoneCall className="w-5 h-5 text-[#A2195E]" />
                              <span className="font-semibold text-gray-800">Recovery Service</span>
                              {formData.unpaidAmount && (
                                <span className="text-sm bg-[#A2195E] text-white px-2 py-1 rounded-full">
                                  ₹{calculateRecoveryFee()} fee
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-8">
                              We'll actively help recover your money through our professional recovery service.
                            </p>
                            <div className="ml-8 mt-2 text-sm font-medium text-[#A2195E]">2% of unpaid amount</div>
                          </div>
                        }
                        className="w-full m-0 p-3"
                      />
                    </motion.div>
                  </RadioGroup>
                </div>

                {/* Phone Input */}
<div className="relative">
  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
  <TextField
    fullWidth
    label="Borrower Phone Number"
    variant="outlined"
    value={formData.borrowerPhone}
    onChange={handleInputChange('borrowerPhone')}
    type="tel"
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
      '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled': {
        transform: 'translate(1rem, -0.5rem) scale(0.75)', // Shrinks and moves up
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#A2195E', // Focused label color
      },
    }}
  />
</div>

{/* Amount Input */}
<div className="relative">
  <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
  <TextField
    fullWidth
    label="Unpaid Amount"
    variant="outlined"
    value={formData.unpaidAmount}
    onChange={handleInputChange('unpaidAmount')}
    type="number"
    required
    inputProps={{
      min: 0,
      step: "0.01",
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
      '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled': {
        transform: 'translate(1rem, -0.5rem) scale(0.75)', // Shrinks and moves up
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#A2195E', // Focused label color
      },
    }}
  />
</div>




                {/* Date Input */}
                <div className="relative">
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    variant="outlined"
                    value={formData.dueDate}
                    onChange={handleInputChange('dueDate')}
                    required
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
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
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
                      <Typography variant="body2" className="text-gray-700">
                        {formData.reportType === 'recovery_service' 
                          ? "I hereby give consent to make recovery calls on my behalf and agree to pay 2% of the recovered amount as service fee"
                          : "I hereby confirm that the information provided is accurate and can be used to warn other lenders"}
                      </Typography>
                    }
                  />
                </div>

                {/* Submit Button */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!formData.consent}
                    sx={{
                      height: '56px',
                      background: 'linear-gradient(to right, #A2195E, #8B1550)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #8B1550, #A2195E)',
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                      },
                      borderRadius: '14px',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
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
    </div>
  );
}
