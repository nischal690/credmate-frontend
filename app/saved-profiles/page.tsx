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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NoProfilesIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { motion, AnimatePresence } from 'framer-motion';
import { getSavedProfilesFromStorage } from '../../utils/api';
import { useUser } from '../contexts/UserContext';
import Image from 'next/image';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.08)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
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
  '&:hover': {
    background: 'linear-gradient(135deg, #8B1550 0%, #c13d6f 100%)',
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
  date_of_birth: string;
  businessType: string;
  profileImageUrl: string;
  phoneNumber: string;
  aadhaarNumber: string | null;
  panNumber: string | null;
  createdAt: string;
  updatedAt: string;
  transactionCount: number;
  savedAt: string;
}

export default function SavedProfiles() {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [loading, setLoading] = useState(true);
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
  const { refreshSavedProfiles } = useUser();

  useEffect(() => {
    fetchSavedProfiles();
  }, []);

  const fetchSavedProfiles = async () => {
    try {
      setLoading(true);
      // Get profiles from localStorage
      const savedProfiles = getSavedProfilesFromStorage();
      setProfiles(savedProfiles);
      
      // Refresh the profiles from the API
      await refreshSavedProfiles();
      
      // Get the updated profiles after API call
      const updatedProfiles = getSavedProfilesFromStorage();
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error('Error fetching saved profiles:', error);
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

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #fff5f8 100%)',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
          >
            <Image
              src="/images/searchprofileicons/arrowbendleft.svg"
              alt="Back"
              width={20} 
              height={20}
              className="opacity-70"
            />
          </button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, ml: 2 }}>
            Saved Profiles
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: { xs: 3, sm: 4 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.5rem' },
                background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Saved Profiles
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Quick access to your saved customer profiles
            </Typography>
          </Box>
          <StyledButton
            onClick={() => router.push('/search-profile')}
            startIcon={<AddIcon />}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' }
            }}
          >
            Add New Profile
          </StyledButton>
        </Box>

        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="300px"
          >
            <CircularProgress sx={{ color: '#A2195E' }} />
          </Box>
        ) : profiles.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              p: { xs: 3, sm: 6 },
              textAlign: 'center'
            }}
          >
            <NoProfilesIcon sx={{ fontSize: 80, color: '#A2195E', opacity: 0.8, mb: 3 }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#1A1A1A',
                mb: 2
              }}
            >
              No Saved Profiles Yet
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '400px',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Start by searching and saving profiles of your customers for quick access.
            </Typography>
            <StyledButton
              onClick={() => router.push('/search-profile')}
              startIcon={<SearchIcon />}
            >
              Search Profiles
            </StyledButton>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {profiles.map((profile) => (
              <Grid item xs={12} sm={6} md={4} key={profile.id}>
                <StyledCard>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        position: 'relative'
                      }}
                    >
                      <Avatar
                        src={profile.profileImageUrl || undefined}
                        alt={profile.name}
                        sx={{ 
                          width: { xs: 48, sm: 56 }, 
                          height: { xs: 48, sm: 56 },
                          bgcolor: '#A2195E',
                          fontSize: { xs: '1.25rem', sm: '1.5rem' },
                          border: '2px solid #fff',
                          boxShadow: '0 4px 12px rgba(162, 25, 94, 0.15)'
                        }}
                      >
                        {profile.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            mb: 0.5,
                            color: '#1A1A1A'
                          }}
                        >
                          {profile.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: { xs: '0.813rem', sm: '0.875rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: '1rem', opacity: 0.8 }} />
                          {profile.phoneNumber}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: { xs: '0.813rem', sm: '0.875rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <BusinessIcon sx={{ fontSize: '1rem', opacity: 0.8 }} />
                          {profile.businessType}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, profileId: profile.id })}
                        sx={{
                          color: '#666',
                          '&:hover': {
                            color: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          },
                          position: 'absolute',
                          top: 0,
                          right: 0
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: '1.25rem' }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Dialog - Styled version */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              padding: '16px',
              maxWidth: '400px',
              width: '90%'
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center',
            fontWeight: 600,
            color: '#1A1A1A',
            pb: 1
          }}>
            Delete Profile
          </DialogTitle>
          <DialogContent>
            <Typography 
              variant="body1" 
              align="center"
              color="text.secondary"
              sx={{ pt: 1 }}
            >
              Are you sure you want to delete this profile? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            gap: 2,
            pb: 2,
            px: 3
          }}>
            <Button
              onClick={handleDeleteCancel}
              sx={{
                color: '#666',
                flex: 1,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.938rem'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{
                bgcolor: '#ef4444',
                color: 'white',
                flex: 1,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.938rem',
                '&:hover': {
                  bgcolor: '#dc2626'
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar with custom styling */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              '& .MuiAlert-icon': {
                fontSize: '1.25rem'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
