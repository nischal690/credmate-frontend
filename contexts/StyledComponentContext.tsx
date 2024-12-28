'use client';

import React, { createContext, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Card, Avatar, Box, Chip } from '@mui/material';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 'bold',
}));

// Create the context
const StyledComponentContext = createContext({
  StyledCard,
  StyledAvatar,
  GradientBox,
  StyledChip,
});

// Create a provider component
export const StyledComponentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <StyledComponentContext.Provider
      value={{
        StyledCard,
        StyledAvatar,
        GradientBox,
        StyledChip,
      }}
    >
      {children}
    </StyledComponentContext.Provider>
  );
};

// Create a custom hook to use the context
export const useStyledComponents = () => useContext(StyledComponentContext);
