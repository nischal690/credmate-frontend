'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Radio, RadioGroup, FormControlLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import RequestLoanAppBar from '../components/RequestLoanAppBar';
import NavBar from '../components/NavBar';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ChartBarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import ReactConfetti from 'react-confetti';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F9F9F9',
    '& fieldset': {
      borderColor: '#E5E5E5',
    },
    '&:hover fieldset': {
      borderColor: '#A2195E',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#A2195E',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#A2195E',
    },
  },
});

// Mock saved profiles data
const savedProfiles = [
  { id: 1, name: 'John Doe', mobile: '+91 9876543210', image: '/images/Profile.svg' },
  { id: 2, name: 'Jane Smith', mobile: '+91 9876543211', image: '/images/Profile.svg' },
];

const RequestLoanPage = () => {
  const [requestType, setRequestType] = useState('saved');
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [timeUnit, setTimeUnit] = useState('month');
  const [interestRate, setInterestRate] = useState('');
  const [paymentType, setPaymentType] = useState('onetime');
  const [emiFrequency, setEmiFrequency] = useState('monthly');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedLender, setSelectedLender] = useState('ABC Finance');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !loanTerm) return 0;

    const principal = parseFloat(loanAmount);
    const ratePerPeriod = (parseFloat(interestRate) / 100) / (emiFrequency === 'daily' ? 365 : 12);
    let numberOfPayments: number;

    if (timeUnit === 'year') {
      numberOfPayments = emiFrequency === 'daily' ? 365 * parseFloat(loanTerm) : 12 * parseFloat(loanTerm);
    } else if (timeUnit === 'month') {
      numberOfPayments = emiFrequency === 'daily' ? 30 * parseFloat(loanTerm) : parseFloat(loanTerm);
    } else { // days
      numberOfPayments = emiFrequency === 'daily' ? parseFloat(loanTerm) : parseFloat(loanTerm) / 30;
    }

    const emi = (principal * ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPayments)) / 
                (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);

    return isNaN(emi) ? 0 : emi;
  };

  const emiAmount = calculateEMI();

  const handleRequestTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestType(event.target.value);
    setSelectedProfile(null);
    setMobileNumber('');
  };

  const handleProfileSelect = (profileId: number) => {
    setSelectedProfile(profileId);
  };

  const handleContinue = () => {
    if (requestType === 'saved' && selectedProfile) {
      setShowLoanForm(true);
    } else if (requestType === 'new' && mobileNumber.length === 10) {
      setShowLoanForm(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle loan request submission logic here
    setShowSuccessMessage(true);
  };

  if (showSuccessMessage) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50">
        <RequestLoanAppBar />
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
        <main className="flex-1 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pt-10 pb-24 flex flex-col items-center justify-center min-h-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Request Submitted Successfully! 🎉
              </h2>
              <p className="text-lg text-gray-600 max-w-md mb-8">
                Your P2P lending request has been sent to potential lenders in our network.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                {
                  icon: <UserGroupIcon className="w-8 h-8" />,
                  title: "Matching Process",
                  description: "We're matching you with the best P2P lenders"
                },
                {
                  icon: <ClockIcon className="w-8 h-8" />,
                  title: "Quick Response",
                  description: "Expect responses within 24-48 hours"
                },
                {
                  icon: <ChartBarIcon className="w-8 h-8" />,
                  title: "Next Steps",
                  description: "Contract review and digital signing process"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <div className="text-pink-600">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => window.location.href = '/dashboard'}
              className="mt-8 px-8 py-3 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-700 transition-colors duration-300"
            >
              Go to Dashboard
            </motion.button>
          </motion.div>
        </main>
        <NavBar />
      </div>
    );
  }

  if (!showLoanForm) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <RequestLoanAppBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 pt-20 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
            <div className="max-w-md mx-auto">
              <Typography variant="h6" sx={{ mb: 2, color: '#333333' }}>
                Request loan from
              </Typography>

              <RadioGroup value={requestType} onChange={handleRequestTypeChange}>
                <FormControlLabel 
                  value="saved" 
                  control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />} 
                  label="Select from saved profiles" 
                />
                
                {requestType === 'saved' && (
                  <Box sx={{ ml: 4, mb: 3 }}>
                    {savedProfiles.map((profile) => (
                      <Box
                        key={profile.id}
                        onClick={() => handleProfileSelect(profile.id)}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: selectedProfile === profile.id ? '#A2195E' : '#E5E5E5',
                          backgroundColor: selectedProfile === profile.id ? '#FFF6F9' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                          <Image
                            src={profile.image}
                            alt={profile.name}
                            width={24}
                            height={24}
                          />
                        </div>
                        <div>
                          <Typography sx={{ fontWeight: 500 }}>{profile.name}</Typography>
                          <Typography variant="body2" sx={{ color: '#666666' }}>{profile.mobile}</Typography>
                        </div>
                      </Box>
                    ))}
                  </Box>
                )}

                <FormControlLabel 
                  value="new" 
                  control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />} 
                  label="Enter mobile number" 
                />

                {requestType === 'new' && (
                  <Box sx={{ ml: 4, mb: 3 }}>
                    <StyledTextField
                      fullWidth
                      label="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      type="tel"
                      InputProps={{
                        startAdornment: <span style={{ marginRight: 8, color: '#666666' }}>+91</span>,
                      }}
                    />
                  </Box>
                )}
              </RadioGroup>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={(requestType === 'saved' && !selectedProfile) || (requestType === 'new' && mobileNumber.length !== 10)}
                sx={{
                  mt: 2,
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: '#A2195E',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#8B1550',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#E5E5E5',
                  },
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </main>

        <NavBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <RequestLoanAppBar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-20 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          <div className="max-w-md mx-auto">
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#FFF6F9', borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#666666' }}>
                Requesting loan from:
              </Typography>
              <Typography variant="body1" sx={{ color: '#A2195E', fontWeight: 500 }}>
                {requestType === 'saved' 
                  ? savedProfiles.find(p => p.id === selectedProfile)?.name
                  : `+91 ${mobileNumber}`
                }
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#666666', fontSize: '0.875rem' }}>
                    How much would you like to borrow?
                  </Typography>
                  <StyledTextField
                    required
                    fullWidth
                    label="Loan Amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    InputProps={{ 
                      inputProps: { min: 0 },
                      startAdornment: <span style={{ marginRight: 8, color: '#666666' }}>₹</span>
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#666666', fontSize: '0.875rem' }}>
                    What interest rate are you willing to pay?
                  </Typography>
                  <StyledTextField
                    required
                    fullWidth
                    label="Interest Rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    InputProps={{ 
                      inputProps: { min: 0, max: 100, step: 0.1 },
                      endAdornment: <span style={{ marginLeft: 8, color: '#666666' }}>%</span>
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#666666', fontSize: '0.875rem' }}>
                    For how long?
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <StyledTextField
                        required
                        fullWidth
                        label="Loan Term"
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        InputProps={{ 
                          inputProps: { min: 1 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                        fullWidth
                        sx={{
                          height: '56px',
                          borderRadius: '12px',
                          backgroundColor: '#F9F9F9',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E5E5',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#A2195E',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#A2195E',
                          }
                        }}
                      >
                        <MenuItem value="day">Days</MenuItem>
                        <MenuItem value="month">Months</MenuItem>
                        <MenuItem value="year">Years</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#666666', fontSize: '0.875rem' }}>
                    How would you like to repay?
                  </Typography>
                  <RadioGroup
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    <FormControlLabel 
                      value="onetime" 
                      control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />} 
                      label="One-time payment" 
                    />
                    <FormControlLabel 
                      value="installment" 
                      control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />} 
                      label="Pay in installments (EMI)" 
                    />
                  </RadioGroup>

                  {paymentType === 'installment' && (
                    <Box sx={{ ml: 4, mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#666666' }}>
                        Select EMI frequency:
                      </Typography>
                      <RadioGroup
                        value={emiFrequency}
                        onChange={(e) => setEmiFrequency(e.target.value)}
                      >
                        <FormControlLabel 
                          value="daily" 
                          control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />} 
                          label="Daily" 
                        />
                        <FormControlLabel 
                          value="monthly" 
                          control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />} 
                          label="Monthly" 
                        />
                      </RadioGroup>

                      {emiAmount > 0 && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#FFF6F9', borderRadius: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: '#A2195E', fontWeight: 500 }}>
                            Estimated {emiFrequency} EMI:
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#A2195E', fontWeight: 600 }}>
                            ₹{emiAmount.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            *This is an approximate calculation based on the provided interest rate
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#666666', fontSize: '0.875rem' }}>
                    What's this loan for?
                  </Typography>
                  <StyledTextField
                    required
                    fullWidth
                    label="Purpose of Loan"
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      height: '56px',
                      borderRadius: '12px',
                      backgroundColor: '#A2195E',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#8B1550',
                      },
                    }}
                  >
                    Submit Loan Request
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </main>

      <NavBar />
    </div>
  );
};

export default RequestLoanPage;
