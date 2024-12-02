'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Button, 
  Grid, 
  Container, 
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  IconButton,
  styled,
  Collapse,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: { xs: 'none', sm: 'translateY(-4px)' },
    boxShadow: '0 12px 48px rgba(162, 25, 94, 0.12)',
  },
}));

const StyledButton = styled(Button)({
  background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(162, 25, 94, 0.2)',
  '&:hover': {
    background: 'linear-gradient(135deg, #8B1550 0%, #c13d6f 100%)',
    boxShadow: '0 6px 16px rgba(162, 25, 94, 0.3)',
  },
});

const StyledTransactionButton = styled(Button)(({ theme }) => ({
  justifyContent: 'space-between',
  color: '#1A1A1A',
  textTransform: 'none',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(162, 25, 94, 0.03)',
  '&:hover': {
    backgroundColor: 'rgba(162, 25, 94, 0.06)',
  },
  transition: 'all 0.3s ease',
}));

const TransactionCard = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(162, 25, 94, 0.06)',
  border: '1px solid rgba(162, 25, 94, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(162, 25, 94, 0.12)',
  },
}));

interface SavedProfile {
  id: string;
  name: string;
  phoneNumber: string;
  aadhaarNumber?: string;
  panNumber?: string;
  profileImage?: string;
  recentTransactions?: Array<{
    id: string;
    date: string;
    amount: number;
    type: string;
    status: string;
  }>;
}

export default function SavedProfiles() {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; profileId: string | null }>({
    open: false,
    profileId: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });
  const router = useRouter();

  useEffect(() => {
    fetchSavedProfiles();
  }, []);

  const fetchSavedProfiles = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulating API response with mock data
      const mockData: SavedProfile[] = [
        {
          id: '1',
          name: 'John Doe',
          phoneNumber: '+91 9876543210',
          aadhaarNumber: '1234-5678-9012',
          panNumber: 'ABCDE1234F',
          profileImage: '',
          recentTransactions: [
            {
              id: 't1',
              date: '2024-03-15',
              amount: 25000,
              type: 'Credit Given',
              status: 'Completed'
            },
            {
              id: 't2',
              date: '2024-03-10',
              amount: 15000,
              type: 'Credit Received',
              status: 'Pending'
            }
          ]
        },
        {
          id: '2',
          name: 'Jane Smith',
          phoneNumber: '+91 9876543211',
          aadhaarNumber: '9876-5432-1098',
          panNumber: 'FGHIJ5678K',
          profileImage: '',
          recentTransactions: [
            {
              id: 't3',
              date: '2024-03-14',
              amount: 30000,
              type: 'Credit Given',
              status: 'Completed'
            },
            {
              id: 't4',
              date: '2024-03-08',
              amount: 20000,
              type: 'Credit Received',
              status: 'Completed'
            }
          ]
        }
      ];
      setProfiles(mockData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch saved profiles',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (profile: SavedProfile) => {
    const nameSlug = profile.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/profile/${profile.id}?name=${nameSlug}`);
  };

  const handleDeleteClick = (profileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, profileId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.profileId) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/profiles/${deleteDialog.profileId}`, { method: 'DELETE' });
      
      // Update local state
      setProfiles(profiles.filter(profile => profile.id !== deleteDialog.profileId));
      
      setSnackbar({
        open: true,
        message: 'Profile removed successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove profile',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, profileId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, profileId: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        className="bg-gradient-to-br from-pink-50 via-white to-pink-100"
      >
        <CircularProgress sx={{ color: '#A2195E' }} />
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Saved Profiles
          </Typography>
          <Typography 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            View and manage your saved profiles
          </Typography>
        </motion.div>
        
        {profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              textAlign="center" 
              py={8}
              sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Typography color="text.secondary" variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                No saved profiles found
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Start by adding a new profile
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {profiles.map((profile, index) => (
              <Grid item xs={12} sm={6} md={4} key={profile.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StyledCard 
                    sx={{ 
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-4px)' }
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar 
                          src={profile.profileImage} 
                          alt={profile.name}
                          sx={{ 
                            width: { xs: 48, sm: 64 }, 
                            height: { xs: 48, sm: 64 },
                            bgcolor: '#A2195E',
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                          }}
                        >
                          {profile.name.charAt(0)}
                        </Avatar>
                        <Box flex={1}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#1A1A1A',
                              fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                          >
                            {profile.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {profile.phoneNumber}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={(e) => handleDeleteClick(profile.id, e)}
                            sx={{
                              color: '#666666',
                              '&:hover': {
                                backgroundColor: 'rgba(162, 25, 94, 0.05)',
                                color: '#A2195E',
                              },
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: '1.25rem' }} />
                          </IconButton>
                          <StyledButton
                            onClick={() => handleViewProfile(profile)}
                            size="small"
                            sx={{
                              px: { xs: 2, sm: 3 },
                              py: { xs: 1, sm: 1.5 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            View Profile
                          </StyledButton>
                        </Box>
                      </Box>

                      {/* Expandable Recent Transactions */}
                      <Box 
                        sx={{ 
                          mt: 2,
                          pt: 2
                        }}
                      >
                        <StyledTransactionButton
                          onClick={() => setExpandedProfile(expandedProfile === profile.id ? null : profile.id)}
                          fullWidth
                          endIcon={
                            <KeyboardArrowDownIcon 
                              sx={{ 
                                transform: expandedProfile === profile.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                              }} 
                            />
                          }
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              sx={{ 
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 600,
                              }}
                            >
                              Recent Transactions
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                bgcolor: 'rgba(162, 25, 94, 0.1)',
                                color: '#A2195E',
                                px: 1,
                                py: 0.5,
                                borderRadius: '12px',
                                fontSize: { xs: '0.625rem', sm: '0.75rem' }
                              }}
                            >
                              {profile.recentTransactions?.length || 0}
                            </Typography>
                          </Box>
                        </StyledTransactionButton>

                        <Collapse in={expandedProfile === profile.id}>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box sx={{ mt: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
                              {profile.recentTransactions?.slice(0, 2).map((transaction) => (
                                <TransactionCard key={transaction.id}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Box
                                        sx={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: '12px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          bgcolor: transaction.type.toLowerCase().includes('given') 
                                            ? 'rgba(239, 68, 68, 0.1)' 
                                            : 'rgba(34, 197, 94, 0.1)',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                            color: transaction.type.toLowerCase().includes('given') 
                                              ? '#EF4444' 
                                              : '#22C55E',
                                          }}
                                        >
                                          {transaction.type.toLowerCase().includes('given') ? '−' : '+'}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography 
                                          sx={{ 
                                            fontWeight: 600,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            color: '#1A1A1A',
                                            mb: 0.5
                                          }}
                                        >
                                          {transaction.type}
                                        </Typography>
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                          }}
                                        >
                                          {new Date(transaction.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                      <Typography 
                                        sx={{ 
                                          fontWeight: 700,
                                          fontSize: { xs: '1rem', sm: '1.125rem' },
                                          color: transaction.type.toLowerCase().includes('given') 
                                            ? '#EF4444' 
                                            : '#22C55E',
                                          mb: 0.5
                                        }}
                                      >
                                        ₹{transaction.amount.toLocaleString('en-IN')}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          px: 1.5,
                                          py: 0.5,
                                          borderRadius: '20px',
                                          fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                          fontWeight: 500,
                                          bgcolor: transaction.status.toLowerCase() === 'completed' 
                                            ? 'rgba(34, 197, 94, 0.1)' 
                                            : 'rgba(234, 179, 8, 0.1)',
                                          color: transaction.status.toLowerCase() === 'completed'
                                            ? '#22C55E'
                                            : '#EAB308'
                                        }}
                                      >
                                        {transaction.status}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TransactionCard>
                              ))}
                              
                              <Button
                                variant="text"
                                onClick={() => router.push(`/profile/${profile.id}/transactions`)}
                                sx={{
                                  color: '#A2195E',
                                  fontSize: { xs: '0.875rem', sm: '1rem' },
                                  fontWeight: 600,
                                  '&:hover': {
                                    backgroundColor: 'rgba(162, 25, 94, 0.05)',
                                  },
                                  borderRadius: '12px',
                                  py: 1.5
                                }}
                                endIcon={<ArrowForwardIcon />}
                              >
                                View All Transactions
                              </Button>
                            </Box>
                          </motion.div>
                        </Collapse>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '16px',
            maxWidth: '400px',
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(162, 25, 94, 0.1)',
            boxShadow: '0 8px 32px rgba(162, 25, 94, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Remove Profile
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
            Are you sure you want to remove this profile? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: '#666666',
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
              color: 'white',
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '10px',
              '&:hover': {
                opacity: 0.9,
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
