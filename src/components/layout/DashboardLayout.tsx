import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Handyman as ServicesIcon,
  ShoppingCart as OrdersIcon
} from '@mui/icons-material'

// Styled components for custom styling
const SidebarItem = styled(ListItemButton)(({ theme }) => ({
  margin: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(25, 118, 210, 0.16)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.24)',
    },
  },
}));

const DRAWER_WIDTH = 280;

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Services', icon: <ServicesIcon />, path: '/services' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/orders' }
  ]

  const isSelected = (path: string) => {
    return location.pathname === path
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        width: '100%',
        height: 'calc(100vh - 120px)',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={2}
        sx={{
          width: DRAWER_WIDTH,
          minWidth: DRAWER_WIDTH,
          height: '100%',
          borderRadius: 0,
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <List sx={{ pt: 2, flex: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <SidebarItem
                selected={isSelected(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected(item.path) ? 'primary.main' : 'inherit',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isSelected(item.path) ? 600 : 400,
                      color: isSelected(item.path) ? 'primary.main' : 'inherit'
                    }
                  }}
                />
              </SidebarItem>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
          height: '100%'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout 