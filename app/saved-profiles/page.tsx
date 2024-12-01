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
  styled
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.08)',
  transition: 'all 0.3s ease',
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
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(162, 25, 94, 0.2)',
  '&:hover': {
    background: 'linear-gradient(135deg, #8B1550 0%, #c13d6f 100%)',
    boxShadow: '0 6px 16px rgba(162, 25, 94, 0.3)',
  },
});

interface SavedProfile {
  id: string;
  name: string;
  phoneNumber: string;
  aadhaarNumber?: string;
  panNumber?: string;
  profileImage?: string;
}

export default function SavedProfiles() {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [loading, setLoading] = useState(true);
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
      const response = await fetch('/api/saved-profiles');
      const data = await response.json();
      setProfiles(data);
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

  const handleViewProfile = (profileId: string) => {
    router.push(`/profile/${profileId}`);
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
              background: 'linear-gradient(135deg, #A2195E 0%, #d4447c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Saved Profiles
          </Typography>
          <Typography 
            color="text.secondary" 
            sx={{ mb: 4 }}
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
              <Typography color="text.secondary" variant="h6">
                No saved profiles found
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
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
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar 
                          src={profile.profileImage} 
                          alt={profile.name}
                          sx={{ 
                            width: 64, 
                            height: 64,
                            bgcolor: '#A2195E',
                            fontSize: '1.5rem'
                          }}
                        >
                          {profile.name.charAt(0)}
                        </Avatar>
                        <Box flex={1}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#1A1A1A'
                            }}
                          >
                            {profile.name}
                          </Typography>
                          <Typography 
                            color="text.secondary" 
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            {profile.phoneNumber}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {profile.aadhaarNumber && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            mb: 0.5 
                          }}
                        >
                          Aadhaar: {profile.aadhaarNumber}
                        </Typography>
                      )}
                      {profile.panNumber && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            mb: 2
                          }}
                        >
                          PAN: {profile.panNumber}
                        </Typography>
                      )}
                      
                      <StyledButton
                        fullWidth
                        onClick={() => handleViewProfile(profile.id)}
                        endIcon={<ArrowForwardIcon />}
                      >
                        View Profile
                      </StyledButton>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
