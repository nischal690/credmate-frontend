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
  DialogActions,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NoProfilesIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { motion } from 'framer-motion';
import { getSavedProfilesFromStorage } from '../../../utils/api';
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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    profileId: string | null;
  }>({
    open: false,
    profileId: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success',
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
        severity: 'error',
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
      setProfiles(
        profiles.filter((profile) => profile.id !== deleteDialog.profileId)
      );

      setSnackbar({
        open: true,
        message: 'Profile removed successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove profile',
        severity: 'error',
      });
    } finally {
      setDeleteDialog({ open: false, profileId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, profileId: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container
      disableGutters
      sx={{
        px: 0,
        pb: 2,
        maxWidth: '100% !important',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #fff5f8 100%)',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
          color: 'white',
          px: 2,
          pt: 4,
          pb: 3,
          mb: 3,
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 4px 20px rgba(162, 25, 94, 0.15)',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => router.back()}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 600,
              flex: 1,
            }}
          >
            Saved Profiles
          </Typography>
          <IconButton
            onClick={() => router.push('/search-profile')}
            sx={{
              bgcolor: 'white',
              color: '#A2195E',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Typography variant='body2' sx={{ opacity: 0.9 }}>
          {profiles.length} {profiles.length === 1 ? 'Profile' : 'Profiles'}{' '}
          saved
        </Typography>
      </Box>

      <Box sx={{ px: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <CircularProgress sx={{ color: '#A2195E' }} />
          </Box>
        ) : profiles.length === 0 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 3,
              background:
                'linear-gradient(135deg, rgba(162, 25, 94, 0.03) 0%, rgba(212, 68, 124, 0.03) 100%)',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <NoProfilesIcon
              sx={{
                fontSize: 64,
                color: '#A2195E',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography
              variant='h6'
              sx={{
                color: '#1A1A1A',
                mb: 1,
                fontWeight: 600,
              }}
            >
              No saved profiles yet
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#666',
                mb: 3,
                maxWidth: '280px',
              }}
            >
              Start adding profiles to keep track of your customers
            </Typography>
            <Button
              fullWidth
              variant='contained'
              onClick={() => router.push('/search-profile')}
              sx={{
                background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
                color: 'white',
                py: 1.5,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(162, 25, 94, 0.25)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #8B1550 0%, #c13d6f 100%)',
                  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.35)',
                },
              }}
            >
              Add Your First Profile
            </Button>
          </Box>
        ) : (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {profiles.map((profile, index) => (
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={profile.id}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(162, 25, 94, 0.1)',
                  boxShadow: '0 4px 16px rgba(162, 25, 94, 0.06)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(162, 25, 94, 0.1)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                <CardContent sx={{ p: '16px !important' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={profile.profileImageUrl || undefined}
                      sx={{
                        width: 52,
                        height: 52,
                        bgcolor: '#A2195E',
                        mr: 2,
                        border: '2px solid white',
                        boxShadow: '0 4px 12px rgba(162, 25, 94, 0.15)',
                      }}
                    >
                      {profile.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontWeight: 600,
                          color: '#1A1A1A',
                          mb: 0.5,
                          fontSize: '1.1rem',
                        }}
                      >
                        {profile.name}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: 16 }} />
                        {profile.phoneNumber}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={(event) => handleDeleteClick(profile.id, event)}
                      sx={{
                        color: '#d32f2f',
                        '&:hover': {
                          bgcolor: 'rgba(211, 47, 47, 0.04)',
                        },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                  <Button
                    fullWidth
                    onClick={() => handleViewProfile(profile)}
                    sx={{
                      background:
                        'linear-gradient(135deg, rgba(162, 25, 94, 0.04) 0%, rgba(212, 68, 124, 0.04) 100%)',
                      color: '#A2195E',
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      border: '1px solid rgba(162, 25, 94, 0.12)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, rgba(162, 25, 94, 0.08) 0%, rgba(212, 68, 124, 0.08) 100%)',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '320px',
            width: '90%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
        TransitionComponent={Fade}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            color: '#1A1A1A',
            pb: 1,
            pt: 0,
          }}
        >
          Delete Profile
        </DialogTitle>
        <DialogContent>
          <Typography
            variant='body1'
            align='center'
            color='text.secondary'
            sx={{ pt: 1 }}
          >
            Are you sure you want to delete this profile? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            gap: 2,
            pb: 1,
            px: 2,
          }}
        >
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: '#666',
              flex: 1,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '0.95rem',
              py: 1.25,
              border: '1px solid rgba(102, 102, 102, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.03)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #ff6b6b 100%)',
              color: 'white',
              flex: 1,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '0.95rem',
              py: 1.25,
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          mb: 2,
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem',
            },
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
