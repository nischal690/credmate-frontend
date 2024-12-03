'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState } from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LockIcon from '@mui/icons-material/Lock';
import ShareIcon from '@mui/icons-material/Share';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleQRScan = () => {
    router.push('/qr-code');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleUpgradeClick = () => {
    setDrawerOpen(false); // Close the drawer
    router.push('/upgrade'); // Navigate to upgrade page
  };

  const handleReferral = () => {
    setDrawerOpen(false); // Close the drawer
    router.push('/referral'); // Navigate to referral page
  };

  const handleSavedProfiles = () => {
    setDrawerOpen(false); // Close the drawer
    router.push('/saved-profiles'); // Navigate to saved profiles page
  };

  const menuItems = [
    { text: 'Saved Profiles', icon: <BookmarkIcon />, onClick: handleSavedProfiles, color: '#CC1E77' },
    { 
      text: 'Refer & Earn', 
      icon: <ShareIcon />, 
      onClick: handleReferral,
      color: '#D14B8F',
      badge: '100',
      highlight: true,
      sparkle: true
    },
    { text: 'Help & Support', icon: <HelpIcon />, onClick: () => console.log('Help clicked'), color: '#D62081' },
    { text: 'Logout', icon: <LogoutIcon />, onClick: () => console.log('Logout clicked'), color: '#E0228B' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-lg border-b border-neutral-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logoR.svg"
              alt="Credmate Logo"
              width={100}
              height={32}
              className="w-[100px] h-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95" onClick={handleMenuClick}>
              <Image 
                src="/images/List.svg" 
                alt="Menu"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95" onClick={handleQRScan}>
              <Image 
                src="/images/QRcode.svg" 
                alt="QR Code Scanner"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95" onClick={handleNotifications}>
              <Image 
                src="/images/Bell.svg" 
                alt="Notifications"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
          </div>
        </div>
      </div>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: '#1A0612',
            borderRight: 'none',
            boxShadow: '0 25px 50px -12px rgba(162, 25, 94, 0.35)',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2D0A1F',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#A2195E',
              borderRadius: '2px',
            },
          },
        }}
        SlideProps={{
          timeout: 400,
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#A2195E] opacity-20 blur-3xl transform -translate-y-1/2"></div>
          <div className="p-6 bg-gradient-to-br from-[#A2195E] via-[#BA1C6C] to-[#8A1550] relative">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center ring-2 ring-[#A2195E] shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#A2195E]/30 via-[#BA1C6C]/30 to-transparent"></div>
                <AccountCircleIcon sx={{ fontSize: 40, color: 'white' }} />
              </motion.div>
              <div>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-xl text-white mb-1"
                >
                  John Doe
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-white/80 font-medium"
                >
                  john.doe@example.com
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <List sx={{ 
          pt: 2,
          px: 2,
          '& .MuiListItemButton-root': {
            borderRadius: '12px',
            mb: 1,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onMouseEnter={() => setHoveredItem(item.text)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={item.onClick}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: item.highlight ? 'rgba(162, 25, 94, 0.15)' : (hoveredItem === item.text ? 'rgba(162, 25, 94, 0.1)' : 'transparent'),
                  '&:hover': {
                    backgroundColor: 'rgba(162, 25, 94, 0.1)',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: item.color,
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'white',
                      letterSpacing: '0.025em',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: (item.highlight || hoveredItem === item.text) ? item.color : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: '40px',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: (item.highlight || hoveredItem === item.text) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: item.highlight ? 600 : 500,
                      transition: 'all 0.3s ease',
                    },
                  }}
                />
                {item.badge && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#A2195E] text-white">
                    <CurrencyRupeeIcon sx={{ fontSize: 12 }} />
                    {item.badge}
                  </div>
                )}
                {item.sparkle && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                      scale: [0.5, 1.2, 1],
                      opacity: [0, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FFD700]"
                    style={{
                      boxShadow: '0 0 10px #FFD700',
                    }}
                  />
                )}
                {hoveredItem === item.text && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}33 0%, transparent 100%)`,
                      borderRadius: '12px',
                      boxShadow: `inset 0 0 20px ${item.color}11`,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}

          <div className="mx-4 my-6 p-4 rounded-2xl bg-gradient-to-br from-[#2D0A1F] to-[#1A0612] border border-[#A2195E]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#A2195E]/10 flex items-center justify-center">
                <WorkspacePremiumIcon sx={{ fontSize: 20, color: '#A2195E' }} />
              </div>
              <div>
                <h4 className="text-white/90 font-semibold">Free Version</h4>
                <p className="text-xs text-white/60">Limited features access</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <LockIcon sx={{ fontSize: 16 }} />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <LockIcon sx={{ fontSize: 16 }} />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <LockIcon sx={{ fontSize: 16 }} />
                <span>Custom integrations</span>
              </div>
            </div>

            <button 
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A2195E] to-[#BA1C6C] text-white font-medium text-sm hover:shadow-lg hover:shadow-[#A2195E]/20 transition-all duration-300 active:scale-[0.98]"
              onClick={handleUpgradeClick}
            >
              Upgrade to Pro
            </button>
          </div>

          <Divider sx={{ 
            my: 2, 
            backgroundColor: 'rgba(162, 25, 94, 0.2)',
            '&::before, &::after': {
              borderColor: 'rgba(162, 25, 94, 0.1)',
            }
          }} />
        </List>
      </Drawer>
    </div>
  );
}