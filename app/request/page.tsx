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

interface Profile {
  id: string;
  name: string;
  mobile: string;
  image: string;
}

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

const RequestLoanPage = () => {
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
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
    const profiles = localStorage.getItem('savedProfiles');
    if (profiles) {
      const parsedProfiles = JSON.parse(profiles);
      // Ensure each profile has an image, if not set a default one
      const profilesWithImages = parsedProfiles.map((profile: any) => ({
        ...profile,
        image: profile.image || '/images/saved-profiles.svg'
      }));
      setSavedProfiles(profilesWithImages);
    }
  }, []);

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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50">
        <RequestLoanAppBar />
        <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Request a Loan</h2>
              
              
              <RadioGroup
                value={requestType}
                onChange={handleRequestTypeChange}
                className="mb-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <FormControlLabel
                      value="saved"
                      control={<Radio />}
                      label={
                        <div className="flex flex-col items-center p-4 bg-pink-50 rounded-xl cursor-pointer transition-all hover:bg-pink-100">
                          <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center flex-shrink-0">
                            <Image
                              src="/images/savedborrowers.svg"
                              alt="Saved Profiles"
                              width={32}
                              height={32}
                              className="mb-2 mt-2"
                            />
                          </div>
                          <span className="font-medium text-gray-800">Saved Borrowers</span>
                        </div>
                      }
                      className="m-0 w-full"
                    />
                  </motion.div>
                  
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <FormControlLabel
                      value="new"
                      control={<Radio />}
                      label={
                        <div className="flex flex-col items-center p-4 bg-pink-50 rounded-xl cursor-pointer transition-all hover:bg-pink-100">
                          <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center flex-shrink-0">
                            <Image
                              src="/images/newborrower.svg"
                              alt="New Profile"
                              width={32}
                              height={32}
                              className="mb-2 mt-1"
                            />
                          </div>
                          <span className="font-medium text-gray-800">New Borrower</span>
                        </div>
                      }
                      className="m-0 w-full"
                    />
                  </motion.div>
                </div>
              </RadioGroup>

              <AnimatePresence mode="wait">
                {requestType === 'saved' ? (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="space-y-4">
                      {savedProfiles.map((profile) => (
                        <motion.div
                          key={profile.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProfileSelect(profile.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedProfile === profile.id
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-200'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                              <Image
                                src={profile.image}
                                alt={profile.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                              <p className="text-sm text-gray-500">{profile.mobile}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <StyledTextField
                      fullWidth
                      label="Mobile Number"
                      variant="outlined"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit number"
                      inputProps={{ maxLength: 10 }}
                      className="mb-4"
                    />
                    <div className="bg-blue-50 rounded-xl p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Image
                            src="/images/info-icon.svg"
                            alt="Info"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">New to Credmate?</h4>
                          <p className="text-sm text-blue-600">We'll create a new profile for you after verification</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                disabled={!(requestType === 'saved' && selectedProfile) && !(requestType === 'new' && mobileNumber.length === 10)}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all
                  ${(requestType === 'saved' && selectedProfile) || (requestType === 'new' && mobileNumber.length === 10)
                    ? 'bg-pink-600 hover:bg-pink-700'
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                Continue
              </motion.button>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Why Choose Credmate?</h3>
              <div className="space-y-4">
                {[
                  { title: 'Quick Approval', desc: 'Get loan approval within 24 hours' },
                  { title: 'Competitive Rates', desc: 'Best-in-class interest rates from verified lenders' },
                  { title: 'Secure Process', desc: 'End-to-end encrypted loan processing' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-700 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50">
      <RequestLoanAppBar />
      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <StyledTextField
                      fullWidth
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="Enter amount"
                      InputProps={{
                        startAdornment: <span className="text-gray-500 mr-2">₹</span>,
                      }}
                      className="mb-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Min: ₹1,000 | Max: ₹10,00,000</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Term
                    </label>
                    <StyledTextField
                      fullWidth
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      placeholder="Duration"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Unit
                    </label>
                    <Select
                      value={timeUnit}
                      onChange={(e) => setTimeUnit(e.target.value)}
                      className="w-full rounded-xl"
                      sx={{
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E5E5E5',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#A2195E',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#A2195E',
                        },
                      }}
                    >
                      <MenuItem value="month">Months</MenuItem>
                      <MenuItem value="year">Years</MenuItem>
                      <MenuItem value="day">Days</MenuItem>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <StyledTextField
                    fullWidth
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Enter interest rate"
                    InputProps={{
                      endAdornment: <span className="text-gray-500">%</span>,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Payment Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <FormControlLabel
                        value="onetime"
                        control={
                          <Radio
                            checked={paymentType === 'onetime'}
                            onChange={(e) => setPaymentType(e.target.value)}
                          />
                        }
                        label={
                          <div className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all
                            ${paymentType === 'onetime' ? 'bg-pink-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                          >
                            <Image
                              src="/images/onetime-payment.svg"
                              alt="One-time Payment"
                              width={32}
                              height={32}
                              className="mb-2"
                            />
                            <span className="font-medium text-sm text-gray-800">One-time Payment</span>
                          </div>
                        }
                        className="m-0 w-full"
                      />
                    </motion.div>

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <FormControlLabel
                        value="emi"
                        control={
                          <Radio
                            checked={paymentType === 'emi'}
                            onChange={(e) => setPaymentType(e.target.value)}
                          />
                        }
                        label={
                          <div className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all
                            ${paymentType === 'emi' ? 'bg-pink-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                          >
                            <Image
                              src="/images/emi-payment.svg"
                              alt="EMI"
                              width={32}
                              height={32}
                              className="mb-2"
                            />
                            <span className="font-medium text-sm text-gray-800">EMI</span>
                          </div>
                        }
                        className="m-0 w-full"
                      />
                    </motion.div>
                  </div>
                </div>

                {paymentType === 'emi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EMI Frequency
                    </label>
                    <Select
                      value={emiFrequency}
                      onChange={(e) => setEmiFrequency(e.target.value as string)}
                      className="w-full rounded-xl"
                      sx={{
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E5E5E5',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#A2195E',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#A2195E',
                        },
                      }}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </motion.div>
                )}
              </div>
            </div>

            {/* EMI Calculator Result */}
            {paymentType === 'emi' && emiAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-6 text-white"
              >
                <h3 className="text-lg font-semibold mb-2">EMI Calculator</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Estimated EMI Amount</p>
                    <p className="text-2xl font-bold">₹{emiAmount.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Image
                      src="/images/calculator.svg"
                      alt="Calculator"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors"
            >
              Submit Request
            </motion.button>
          </form>
        </motion.div>
      </main>
      <NavBar />
    </div>
  );
};

export default RequestLoanPage;
