import React from 'react';
import {
  TextField,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const LoginForm = ({ onSubmit, loading, error }) => (
  <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
    <TextField
      margin="normal"
      required
      fullWidth
      id="email"
      label="Email"
      name="email"
      autoComplete="email"
      autoFocus
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
      autoComplete="current-password"
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
      sx={{ mt: 3, mb: 2 }}
      loading={loading}
    >
      Log in
    </LoadingButton>
    <Box sx={{ textAlign: 'center' }}>
      <Link href="#" variant="body2">
        Forgot password?
      </Link>
    </Box>
  </Box>
);

export default LoginForm;
