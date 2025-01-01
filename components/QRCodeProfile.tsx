'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Typography, Container, Paper, useTheme, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';

const QRCodeProfile = () => {
  const theme = useTheme();
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate loading the profile URL
    setTimeout(() => {
      setProfileUrl('https://credmate.app/profile/123');
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #a2195e 0%, #300a1c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: { xs: 3, sm: 4 },
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: { xs: '20px', sm: '24px' },
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(162, 25, 94, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #a2195e 0%, #ff2b8f 50%, #a2195e 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear',
              },
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
              },
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  background: 'linear-gradient(135deg, #A2195E 0%, #ff2b8f 50%, #A2195E 100%)',
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s linear infinite',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: { xs: 1, sm: 2 },
                  '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% center' },
                    '100%': { backgroundPosition: '200% center' },
                  },
                }}
              >
                Your Profile QR Code
              </Typography>
            </motion.div>

            <Typography 
              variant="body2" 
              sx={{ 
                width: '100%',
                mb: { xs: 2, sm: 3 }, 
                textAlign: 'center',
                color: '#666',
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                lineHeight: 1.5,
                px: { xs: 1, sm: 2 },
              }}
            >
              Share your professional profile instantly
            </Typography>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Box 
                sx={{ 
                  p: { xs: 2.5, sm: 3 },
                  bgcolor: 'white',
                  borderRadius: { xs: '16px', sm: '20px' },
                  boxShadow: '0 8px 32px rgba(162, 25, 94, 0.12)',
                  border: '2px solid rgba(162, 25, 94, 0.1)',
                  position: 'relative',
                  width: 'fit-content',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '18px',
                    padding: '2px',
                    background: 'linear-gradient(135deg, #a2195e, #ff2b8f)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }
                }}
              >
                {isLoading ? (
                  <Box
                    sx={{
                      width: { xs: 180, sm: 220 },
                      height: { xs: 180, sm: 220 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: '#A2195E' }} />
                  </Box>
                ) : (
                  <QRCodeSVG
                    value={profileUrl}
                    size={220}
                    level="H"
                    includeMargin={false}
                    style={{
                      width: '100%',
                      height: 'auto',
                      
                      display: 'block',
                    }}
                  />
                )}
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ width: '100%' }}
            >
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: { xs: 2.5, sm: 3 },
                  bgcolor: '#A2195E',
                  color: 'white',
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#8B1550',
                  },
                  '&:disabled': {
                    bgcolor: '#A2195E',
                    opacity: 0.7,
                  },
                }}
                onClick={handleCopyLink}
                disabled={isLoading || copied}
              >
                {copied ? 'Copied!' : 'Copy Profile Link'}
              </Button>
            </motion.div>

            <Typography 
              variant="body2" 
              sx={{ 
                mt: { xs: 1.5, sm: 2 },
                color: 'rgba(102, 102, 102, 0.8)',
                textAlign: 'center',
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
              }}
            >
              Scan to view and share your profile
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default QRCodeProfile;
