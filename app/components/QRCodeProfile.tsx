'use client';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Typography, Container, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const QRCodeProfile = () => {
  const theme = useTheme();
  
  // Generate the profile URL based on the user's ID
  const profileUrl = ``;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #a2195e 0%, #300a1c 100%)',
        pt: 4,
        pb: 4,
        position: 'relative',
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
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 3,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(162, 25, 94, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #a2195e 0%, #ff2b8f 50%, #a2195e 100%)',
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
            >
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #a2195e 0%, #ff2b8f 50%, #a2195e 100%)',
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s linear infinite',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textAlign: 'center',
                  mb: 1,
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
              variant="body1" 
              sx={{ 
                maxWidth: '80%', 
                mb: 2, 
                textAlign: 'center',
                color: '#666',
                fontSize: '1.1rem',
                lineHeight: 1.5,
              }}
            >
              Share your professional profile instantly with this unique QR code
            </Typography>
            <motion.div
              whileHover={{ scale: 1.02, rotate: [0, -1, 1, -1, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Box 
                sx={{ 
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 10px 40px rgba(162, 25, 94, 0.15)',
                  border: '2px solid rgba(162, 25, 94, 0.1)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '22px',
                    padding: '2px',
                    background: 'linear-gradient(135deg, #a2195e, #ff2b8f)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }
                }}
              >
                <QRCodeSVG
                  value={profileUrl}
                  size={260}
                  level="H"
                  includeMargin={true}
                  style={{
                    display: 'block',
                  }}
                />
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 3,
                  color: '#666',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: 'rgba(162, 25, 94, 0.05)',
                  border: '1px solid rgba(162, 25, 94, 0.1)',
                }}
              >
                Profile URL: <span style={{ color: '#a2195e', fontWeight: 500 }}>{profileUrl}</span>
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default QRCodeProfile;
