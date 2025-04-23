import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

interface HeaderProps {
  isAuth?: boolean;
}

const Header = ({ isAuth = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const user = authService.getCurrentUser();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        height: '120px',
        flexShrink: 0,
        backgroundColor: '#1976d2'
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '120px !important',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isAuth ? 'space-between' : 'center',
          px: 3
        }}
      >
        <Typography 
          variant="h4"
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '2.5rem',
            letterSpacing: '1px'
          }}
        >
          GIG NATION VENDOR
        </Typography>

        {isAuth && (
          <Box display="flex" alignItems="center">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 40,
                  height: 40
                }}
              >
                {user?.name?.[0]?.toUpperCase() || 'V'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 