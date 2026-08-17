import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs
} from '@mui/material';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../common/LoginForm';
import RegisterForm from '../common/RegisterForm';

const Login = () => {
  const { login, register, loading, error } = useAuth();
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isSuccess = await login(formData.get('email'), formData.get('password'));
    
    if (isSuccess) {
      navigate('/');
    }
  };
  

  const handleRegister = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    register(
      formData.get('name'),
      formData.get('email'),
      formData.get('password'),
      formData.get('confirmPassword')
    );
    setTab(0);
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
        <Typography component="h1" variant="h5">
          BuildMarket
        </Typography>
        <Box sx={{ width: '100%', mt: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Log in" />
            <Tab label="Register" />
          </Tabs>
          <Box sx={{ mt: 3 }}>
            {tab === 0 ? (
              <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
            ) : (
              <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;