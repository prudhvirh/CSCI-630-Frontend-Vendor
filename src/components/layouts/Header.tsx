import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        height: '80px',
        flexShrink: 0,
        backgroundColor: 'primary.main'
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '80px !important',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
      </Toolbar>
    </AppBar>
  );
};

export default Header; 