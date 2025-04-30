import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AuthLayout = () => {
  return (
    <>
      <Header isAuth={false} />
      <Outlet />
    </>
  );
};

export default AuthLayout; 