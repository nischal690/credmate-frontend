'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, IconButton, Box, Badge } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsAppBar from '../components/NotificationsAppBar';

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Loan Approved',
      message: 'Your loan application has been approved! Check your email for details.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Document Required',
      message: 'Please upload your latest bank statement to complete your application.',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Payment Reminder',
      message: 'Your EMI payment is due in 3 days. Please ensure sufficient balance.',
      timestamp: '2 days ago',
      read: false,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'info':
        return <InfoIcon sx={{ color: '#2196F3' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196F3' }} />;
    }
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NotificationsAppBar />
      <main className="flex-1 overflow-y-auto pt-16 pb-6">
        <div className="max-w-md mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <Card
                  className={`${notification.read ? 'bg-opacity-90' : 'bg-opacity-100'}`}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(162, 25, 94, 0.15)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'success' ? 'bg-[#FFE8F0]' :
                          notification.type === 'error' ? 'bg-[#FFE1EC]' :
                          notification.type === 'warning' ? 'bg-[#FFF0F5]' :
                          'bg-[#FFE8F0]'
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography 
                              variant="subtitle1" 
                              sx={{
                                fontWeight: 600,
                                color: '#1A1A1A',
                                fontSize: '1.1rem',
                                marginBottom: '0.5rem'
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{
                                color: 'rgba(0,0,0,0.7)',
                                lineHeight: 1.5
                              }}
                            >
                              {notification.message}
                            </Typography>
                          </div>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            sx={{
                              color: 'rgba(162, 25, 94, 0.4)',
                              '&:hover': {
                                color: 'rgba(162, 25, 94, 0.7)',
                                backgroundColor: 'rgba(162, 25, 94, 0.05)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                        <Typography 
                          variant="caption" 
                          sx={{
                            color: 'rgba(162, 25, 94, 0.6)',
                            display: 'block',
                            marginTop: '0.75rem',
                            fontSize: '0.8rem'
                          }}
                        >
                          {notification.timestamp}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        color="primary"
                        variant="dot"
                        sx={{
                          position: 'absolute',
                          top: '16px',
                          right: '48px',
                          '& .MuiBadge-dot': {
                            backgroundColor: '#A2195E',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.8)'
                          }
                        }}
                      />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}

            {notifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 16,
                    px: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(162, 25, 94, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: 'linear-gradient(to right, #A2195E, #E65C8C)',
                    }
                  }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    style={{
                      background: 'linear-gradient(45deg, rgba(162, 25, 94, 0.1), rgba(230, 92, 140, 0.1))',
                      borderRadius: '50%',
                      padding: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [-5, 5, -5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    >
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                          }}
                          d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                          stroke="url(#gradient)"
                          strokeWidth="0.5"
                          fill="url(#gradient)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <motion.circle
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.2, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          cx="17"
                          cy="7"
                          r="3"
                          fill="#E65C8C"
                          opacity="0.5"
                        />
                        <motion.circle
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            delay: 0.3
                          }}
                          cx="17"
                          cy="7"
                          r="2"
                          fill="#A2195E"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22">
                            <stop offset="0%" stopColor="#A2195E">
                              <animate
                                attributeName="stop-color"
                                values="#A2195E; #E65C8C; #A2195E"
                                dur="4s"
                                repeatCount="indefinite"
                              />
                            </stop>
                            <stop offset="100%" stopColor="#E65C8C">
                              <animate
                                attributeName="stop-color"
                                values="#E65C8C; #A2195E; #E65C8C"
                                dur="4s"
                                repeatCount="indefinite"
                              />
                            </stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ 
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{
                        color: '#A2195E',
                        fontWeight: 600,
                        mb: 2,
                        mt: 3,
                        fontSize: '1.5rem'
                      }}
                    >
                      All Caught Up!
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: 'rgba(162, 25, 94, 0.7)',
                        maxWidth: '300px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        fontSize: '1rem'
                      }}
                    >
                      You have no new notifications at the moment. Check back later!
                    </Typography>
                  </motion.div>

                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '-20px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(162, 25, 94, 0.1) 0%, rgba(162, 25, 94, 0) 70%)',
                      zIndex: 0
                    }}
                  />
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(230, 92, 140, 0.1) 0%, rgba(230, 92, 140, 0) 70%)',
                      zIndex: 0
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
