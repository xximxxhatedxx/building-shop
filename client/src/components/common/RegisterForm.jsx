import React from 'react';
import {
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const RegisterForm = ({ onSubmit, loading, error }) => (
  <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>

    <TextField
      margin="normal"
      required
      fullWidth
      id="name"
      label="Name"
      name="name"
      autoComplete="name"
      autoFocus
      variant="outlined"
    />
    
    <TextField
      margin="normal"
      required
      fullWidth
      id="email"
      label="Email"
      name="email"
      autoComplete="email"
      variant="outlined"
    />
    
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      variant="outlined"
    />
    
    <TextField
      margin="normal"
      required
      fullWidth
      name="confirmPassword"
      label="Confirm password"
      type="password"
      id="confirmPassword"
      variant="outlined"
    />
    
    {error && (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )}
    
    <LoadingButton
      type="submit"
      fullWidth
      variant="contained"
      sx={{
        mt: 3,
        mb: 2,
        backgroundColor: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
      loading={loading}
    >
      Register
    </LoadingButton>
  </Box>
);

export default RegisterForm;
