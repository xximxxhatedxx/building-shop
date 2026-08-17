import React  from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Box
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  AdminPanelSettings,
  Logout,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            flexGrow: 1 
          }}
        >
          BuildMarket
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={0} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          {user ? (
            <>
              {user.role_id === 1 ? (
                <Button
                  color="inherit"
                  startIcon={<AdminPanelSettings />}
                  component={Link}
                  to="/admin"
                >
                  Admin Panel
                </Button>
              ) : (
                <Button
                  color="inherit"
                  startIcon={<Person />}
                  component={Link}
                  to="/profile"
                >
                  Profile
                </Button>
              )}
              <Button
                color="inherit"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              startIcon={<Person />}
              component={Link} 
              to="/login"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
