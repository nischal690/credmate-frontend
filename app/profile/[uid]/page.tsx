'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Divider,
  Paper,
  Chip,
  styled,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Button,
  Snackbar,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { Activity, CreditCard, Clock, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CreditScoreContainer from '../../components/CreditScoreContainer';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 237, 243, 0.9) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(162, 25, 94, 0.1)',
  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.08)',
  marginTop: '24px',
  overflow: 'visible',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(162, 25, 94, 0.12)'
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px',
  padding: '16px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 237, 243, 0.6) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(162, 25, 94, 0.1)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 237, 243, 0.8) 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(162, 25, 94, 0.08)'
  }
}));

const ScoreDetailCard = styled(Paper)(({ theme }) => ({
  padding: '28px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 237, 243, 0.9) 100%)',
  backdropFilter: 'blur(20px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(162, 25, 94, 0.1)',
  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(162, 25, 94, 0.12)'
  }
}));

const GradientBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, #ffffff 0%, #F9EDF3 50%, #F5E6ED 100%)',
  zIndex: -1
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 140,
  height: 140,
  border: '4px solid rgba(162, 25, 94, 0.1)',
  background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
  boxShadow: '0 12px 36px rgba(162, 25, 94, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05) rotate(5deg)',
    boxShadow: '0 16px 48px rgba(162, 25, 94, 0.2)'
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 8px',
  fontWeight: 600,
  fontSize: '0.9rem',
  background: 'linear-gradient(135deg, rgba(162, 25, 94, 0.1) 0%, rgba(212, 68, 124, 0.1) 100%)',
  color: '#A2195E',
  border: '1px solid rgba(162, 25, 94, 0.2)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 4px 12px rgba(162, 25, 94, 0.12)',
    background: 'linear-gradient(135deg, rgba(162, 25, 94, 0.15) 0%, rgba(212, 68, 124, 0.15) 100%)'
  }
}));

const AnimatedTab = styled(Tab)({
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '12px',
  margin: '0 8px',
  minHeight: '48px',
  fontWeight: 600,
  color: '#666',
  '&:hover': {
    backgroundColor: 'rgba(162, 25, 94, 0.05)',
    color: '#A2195E',
    transform: 'translateY(-2px)'
  },
  '&.Mui-selected': {
    background: 'linear-gradient(135deg, rgba(162, 25, 94, 0.1) 0%, rgba(212, 68, 124, 0.1) 100%)',
    color: '#A2195E',
    boxShadow: '0 4px 12px rgba(162, 25, 94, 0.08)'
  }
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

interface ProfileData {
  name: string;
  phoneNumber: string;
  email: string;
  aadhaarNumber: string;
  panNumber: string;
  profileImage: string;
  occupation: string;
  company: string;
  location: string;
  creditScore: number;
  creditDetails: Array<{
    title: string;
    score: number;
    description: string;
    color: string;
    icon: any;
    details: Array<{
      label: string;
      value: string;
    }>;
  }>;
  recentChanges: Array<{
    date: string;
    change: string;
    description: string;
    impact: string;
    details: string;
  }>;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  interestRate?: number;
  duration?: string;
}

// Dummy data
const dummyProfileData: ProfileData = {
  name: "John Doe",
  phoneNumber: "+91 9876543210",
  email: "john.doe@example.com",
  aadhaarNumber: "XXXX-XXXX-1234",
  panNumber: "ABCDE1234F",
  profileImage: "https://i.pravatar.cc/300",
  occupation: "Software Engineer",
  company: "Tech Solutions Ltd",
  location: "Mumbai, Maharashtra",
  creditScore: 750,
  creditDetails: [
    {
      title: "Payment History",
      score: 85,
      description: "Your payment history shows consistent on-time payments",
      color: "#32BE39",
      icon: Activity,
      details: [
        { label: "On-time Payments", value: "95%" },
        { label: "Late Payments", value: "2" },
        { label: "Missed Payments", value: "0" }
      ]
    },
    {
      title: "Credit Utilization",
      score: 65,
      description: "You're using 35% of your available credit",
      color: "#A5C52A",
      icon: CreditCard,
      details: [
        { label: "Total Credit", value: "₹5,00,000" },
        { label: "Used Credit", value: "₹1,75,000" },
        { label: "Available Credit", value: "₹3,25,000" }
      ]
    },
    {
      title: "Credit Age",
      score: 45,
      description: "Average age of your credit accounts is 2 years",
      color: "#FFCB1F",
      icon: Clock,
      details: [
        { label: "Oldest Account", value: "4 years" },
        { label: "Newest Account", value: "6 months" },
        { label: "Average Age", value: "2 years" }
      ]
    },
    {
      title: "Total Accounts",
      score: 70,
      description: "You have a good mix of credit accounts",
      color: "#32BE39",
      icon: Wallet,
      details: [
        { label: "Credit Cards", value: "2" },
        { label: "Personal Loans", value: "1" },
        { label: "Other Accounts", value: "1" }
      ]
    }
  ],
  recentChanges: [
    {
      date: "2024-01-15",
      change: "+5",
      description: "Credit card payment recorded",
      impact: "Positive",
      details: "On-time payment of ₹25,000 to HDFC Credit Card"
    },
    {
      date: "2024-01-01",
      change: "-2",
      description: "New credit inquiry",
      impact: "Negative",
      details: "Hard inquiry from ABC Bank for Personal Loan"
    }
  ]
};

const dummyTransactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    amount: 50000,
    date: '2024-01-15',
    status: 'completed',
    description: 'Personal Loan',
    interestRate: 12,
    duration: '12 months'
  },
  {
    id: '2',
    type: 'debit',
    amount: 5000,
    date: '2024-02-01',
    status: 'completed',
    description: 'EMI Payment',
  },
  {
    id: '3',
    type: 'credit',
    amount: 25000,
    date: '2024-02-15',
    status: 'pending',
    description: 'Business Loan',
    interestRate: 15,
    duration: '6 months'
  },
  {
    id: '4',
    type: 'debit',
    amount: 4200,
    date: '2024-02-20',
    status: 'failed',
    description: 'EMI Payment',
  }
];

export default function UserProfile() {
  const params = useParams();
  const [profileData, setProfileData] = useState<ProfileData>(dummyProfileData);
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [transactions] = useState<Transaction[]>(dummyTransactions);
  const [isSaved, setIsSaved] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return '#4CAF50';
    if (score >= 650) return '#FFA726';
    return '#F44336';
  };

  const handleDetailClick = (title: string) => {
    setExpandedDetail(expandedDetail === title ? null : title);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFA726';
      case 'failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#E8F5E9';
      case 'pending':
        return '#FFF3E0';
      case 'failed':
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveProfile = () => {
    setIsSaved(!isSaved);
    setOpenSnackbar(true);
    // Here you would typically make an API call to save the profile
    // For now, we'll just toggle the state
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={dummyProfileData.profileImage}
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="h4" gutterBottom>
                  {dummyProfileData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {dummyProfileData.occupation} at {dummyProfileData.company}
                </Typography>
              </Box>
            </Box>
            <Button
              variant={isSaved ? "contained" : "outlined"}
              onClick={handleSaveProfile}
              startIcon={isSaved ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                background: isSaved 
                  ? 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)'
                  : 'transparent',
                borderColor: '#A2195E',
                color: isSaved ? 'white' : '#A2195E',
                '&:hover': {
                  background: isSaved 
                    ? 'linear-gradient(135deg, #8a1650 0%, #c13d6f 100%)'
                    : 'rgba(162, 25, 94, 0.04)',
                  borderColor: '#A2195E',
                },
                boxShadow: isSaved ? '0 4px 12px rgba(162, 25, 94, 0.2)' : 'none',
              }}
            >
              {isSaved ? 'Saved' : 'Save Profile'}
            </Button>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#A2195E',
                }
              }}
            >
              <AnimatedTab label="Profile Details" />
              <AnimatedTab label="Transactions" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Credit Score Section */}
            <Box sx={{ mb: 4 }}>
              <CreditScoreContainer />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Contact Information */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
                  <InfoItem>
                    <PhoneIcon color="primary" />
                    <Typography>{profileData.phoneNumber}</Typography>
                  </InfoItem>
                  <InfoItem>
                    <EmailIcon color="primary" />
                    <Typography>{profileData.email}</Typography>
                  </InfoItem>
                  <InfoItem>
                    <BusinessIcon color="primary" />
                    <Typography>{profileData.company}</Typography>
                  </InfoItem>
                  <InfoItem>
                    <LocationOnIcon color="primary" />
                    <Typography>{profileData.location}</Typography>
                  </InfoItem>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>ID Information</Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Aadhaar Number
                    </Typography>
                    <Typography variant="body1">{profileData.aadhaarNumber}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      PAN Number
                    </Typography>
                    <Typography variant="body1">{profileData.panNumber}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Credit Score Details */}
            <Typography variant="h6" gutterBottom>Credit Score Analysis</Typography>
            <Grid container spacing={2}>
              {profileData.creditDetails.map((detail) => {
                const Icon = detail.icon;
                const isExpanded = expandedDetail === detail.title;

                return (
                  <Grid item xs={12} sm={6} key={detail.title}>
                    <ScoreDetailCard 
                      onClick={() => handleDetailClick(detail.title)}
                      sx={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        mb: 2 
                      }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: '12px', 
                          background: `${detail.color}15`
                        }}>
                          <Icon color={detail.color} size={24} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {detail.title}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {detail.description}
                      </Typography>

                      {isExpanded && (
                        <Box sx={{ mt: 2 }}>
                          {detail.details.map((item, index) => (
                            <Box 
                              key={item.label}
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                mt: index > 0 ? 1 : 0
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                {item.label}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {item.value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </ScoreDetailCard>
                  </Grid>
                );
              })}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Recent Changes */}
            <Typography variant="h6" gutterBottom>Recent Score Changes</Typography>
            <Grid container spacing={2}>
              {profileData.recentChanges.map((change, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1">{change.description}</Typography>
                      <Chip 
                        label={change.change}
                        size="small"
                        color={change.impact === 'Positive' ? 'success' : 'error'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {change.details}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {new Date(change.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Transaction History</Typography>
              <Grid container spacing={2}>
                {transactions.map((transaction) => (
                  <Grid item xs={12} key={transaction.id}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box 
                            sx={{ 
                              p: 1, 
                              borderRadius: '50%', 
                              bgcolor: transaction.type === 'credit' ? '#E8F5E9' : '#FFEBEE'
                            }}
                          >
                            {transaction.type === 'credit' ? (
                              <ArrowDownRight color="#4CAF50" size={24} />
                            ) : (
                              <ArrowUpRight color="#F44336" size={24} />
                            )}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              {transaction.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(transaction.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              color: transaction.type === 'credit' ? '#4CAF50' : '#F44336',
                              fontWeight: 'bold'
                            }}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                          </Typography>
                          <Chip
                            label={transaction.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusBgColor(transaction.status),
                              color: getStatusColor(transaction.status),
                              fontWeight: 'medium',
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                      </Box>
                      {(transaction.interestRate || transaction.duration) && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          {transaction.interestRate && (
                            <Typography variant="body2" color="text.secondary">
                              Interest Rate: {transaction.interestRate}%
                            </Typography>
                          )}
                          {transaction.duration && (
                            <Typography variant="body2" color="text.secondary">
                              Duration: {transaction.duration}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>
        </CardContent>
      </StyledCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={isSaved ? "Profile saved successfully" : "Profile removed from saved"}
      />
    </Container>
  );
}
