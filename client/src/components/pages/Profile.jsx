import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../store/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await axios.put('/api/auth/me', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      updateUser(response.data.user);

      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleGoToOrders}
        >
          My orders
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;