import React from 'react';
import { 
  Box, 
  Container, 
  Grid2, 
  Typography, 
  Link 
} from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        pt: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          <Grid2 item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About company
            </Typography>
            <Typography variant="body2" color="text.secondary">
              BuildMarket is your trusted online marketplace for premium construction and renovation materials.
            </Typography>
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contacts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tel: +(123) 456-78-90
              <br />
              Email: info@buildmarket.com
            </Typography>
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Information
            </Typography>
            <Link href="/delivery" color="inherit" display="block" sx={{ mb: 0.5 }}>
              Delivery
            </Link>
            <Link href="/payment" color="inherit" display="block" sx={{ mb: 0.5 }}>
              Payment
            </Link>
            <Link href="/contacts" color="inherit" display="block">
              Contacts
            </Link>
          </Grid2>
        </Grid2>
      </Container>
      <Box 
        sx={{
          py: 1,
          mt: 5,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[300]
              : theme.palette.grey[800],
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} BuildMarket. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
