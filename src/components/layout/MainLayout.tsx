import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          height: 'calc(100vh - 120px)',
          overflow: 'hidden'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 