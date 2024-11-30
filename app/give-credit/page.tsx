'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Radio, RadioGroup, FormControlLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import GiveCreditAppBar from '../components/GiveCreditAppBar';
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

interface NavBarProps {
  className?: string;
}

const GiveCreditPage = () => {
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
  const [selectedProtectionPlan, setSelectedProtectionPlan] = useState('free');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleProtectionPlanSelect = (plan: string) => {
    setSelectedProtectionPlan(plan);
    handleFinalSubmit();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
  };

  const handleFinalSubmit = () => {
    // Handle loan request submission logic here
    const submissionData = {
      loanAmount,
      interestRate,
      paymentType,
      emiFrequency,
      loanTerm,
      timeUnit,
      selectedLender,
      protectionPlan: selectedProtectionPlan,
    };
    console.log('Submitting loan request:', submissionData);
    setShowSuccessMessage(true);
    setIsSubmitting(false);
  };

  if (showSuccessMessage) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50">
        <GiveCreditAppBar 
          loanAmount={Number(loanAmount) || 0}
          onProtectionPlanSelect={handleProtectionPlanSelect}
          isSubmitting={isSubmitting}
        />
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
        <main className="flex-1 overflow-y-auto pt-14">
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
                Credit Offer Submitted Successfully! 🎉
              </h2>
              <p className="text-lg text-gray-600 max-w-md mb-8">
                Your P2P lending offer has been sent to the borrower.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                {
                  icon: <UserGroupIcon className="w-8 h-8" />,
                  title: "Matching Process",
                  description: "We're notifying the borrower of your offer"
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
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50">
      <GiveCreditAppBar 
        loanAmount={Number(loanAmount) || 0}
        onProtectionPlanSelect={handleProtectionPlanSelect}
        isSubmitting={isSubmitting}
      />
      <main className="flex-1 overflow-y-auto pt-14">
        <div className="max-w-4xl mx-auto w-full p-6 pb-24">
          {!showLoanForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Typography variant="h5" className="font-semibold mb-6 text-gray-800">
                  Select Borrower
                </Typography>
                <RadioGroup
                  value={requestType}
                  onChange={handleRequestTypeChange}
                  className="space-y-4"
                >
                  <FormControlLabel
                    value="saved"
                    control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />}
                    label="Choose from saved profiles"
                    className="border rounded-xl p-3 hover:bg-pink-50 transition-colors"
                  />
                  <FormControlLabel
                    value="new"
                    control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />}
                    label="Add new borrower"
                    className="border rounded-xl p-3 hover:bg-pink-50 transition-colors"
                  />
                </RadioGroup>

                {requestType === 'saved' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-4"
                  >
                    {savedProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        onClick={() => handleProfileSelect(profile.id)}
                        className={`flex items-center p-4 rounded-xl cursor-pointer transition-all
                          ${selectedProfile === profile.id 
                            ? 'bg-pink-50 border-2 border-pink-500' 
                            : 'bg-gray-50 border border-gray-200 hover:border-pink-300'}`}
                      >
                        <Image
                          src={profile.image}
                          alt={profile.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="ml-4 flex-1">
                          <Typography variant="subtitle1" className="font-medium">
                            {profile.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            {profile.mobile}
                          </Typography>
                        </div>
                        <Radio
                          checked={selectedProfile === profile.id}
                          sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}

                {requestType === 'new' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <StyledTextField
                      fullWidth
                      label="Mobile Number"
                      variant="outlined"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      InputProps={{
                        startAdornment: <span className="text-gray-500 mr-2">+91</span>,
                      }}
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleContinue}
                    disabled={(requestType === 'saved' && !selectedProfile) || 
                             (requestType === 'new' && mobileNumber.length !== 10)}
                    sx={{
                      backgroundColor: '#A2195E',
                      '&:hover': { backgroundColor: '#8B1550' },
                      borderRadius: '12px',
                      py: 1.5,
                    }}
                  >
                    Continue
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Typography variant="h5" className="font-semibold mb-6 text-gray-800">
                  Loan Details
                </Typography>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Loan Amount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        InputProps={{
                          startAdornment: <span className="text-gray-500 mr-2">₹</span>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Loan Term"
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                        fullWidth
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: '#F9F9F9',
                        }}
                      >
                        <MenuItem value="day">Days</MenuItem>
                        <MenuItem value="month">Months</MenuItem>
                        <MenuItem value="year">Years</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Interest Rate (%)"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        InputProps={{
                          endAdornment: <span className="text-gray-500 ml-2">%</span>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" className="mb-2 text-gray-700">
                        Payment Type
                      </Typography>
                      <RadioGroup
                        row
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="space-x-4"
                      >
                        <FormControlLabel
                          value="onetime"
                          control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />}
                          label="One-time Payment"
                        />
                        <FormControlLabel
                          value="emi"
                          control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />}
                          label="EMI"
                        />
                      </RadioGroup>
                    </Grid>
                    
                    {paymentType === 'emi' && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" className="mb-2 text-gray-700">
                          EMI Frequency
                        </Typography>
                        <RadioGroup
                          row
                          value={emiFrequency}
                          onChange={(e) => setEmiFrequency(e.target.value)}
                          className="space-x-4"
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
                      </Grid>
                    )}

                    {paymentType === 'emi' && emiAmount > 0 && (
                      <Grid item xs={12}>
                        <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                          <Typography variant="subtitle1" className="font-medium text-gray-800">
                            Calculated EMI Amount
                          </Typography>
                          <Typography variant="h6" className="text-pink-600">
                            ₹{emiAmount.toFixed(2)}
                          </Typography>
                        </div>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" className="mb-2 text-gray-700">
                        Protection Plan
                      </Typography>
                      <RadioGroup
                        row
                        value={selectedProtectionPlan}
                        onChange={(e) => handleProtectionPlanSelect(e.target.value)}
                        className="space-x-4"
                      >
                        <FormControlLabel
                          value="free"
                          control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />}
                          label="Free"
                        />
                        <FormControlLabel
                          value="premium"
                          control={<Radio sx={{ color: '#A2195E', '&.Mui-checked': { color: '#A2195E' } }} />}
                          label="Premium"
                        />
                      </RadioGroup>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: '#A2195E',
                          '&:hover': { backgroundColor: '#8B1550' },
                          borderRadius: '12px',
                          py: 1.5,
                        }}
                      >
                        Submit Credit Offer
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <NavBar className="fixed bottom-0 left-0 right-0 bg-white z-10" />
    </div>
  );
};

export default GiveCreditPage;
