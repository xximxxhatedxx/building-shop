import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Header />
      <Container 
        component="main" 
        sx={{ 
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
