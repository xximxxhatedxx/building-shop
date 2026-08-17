import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Layout from './components/layout/Layout';

import Home from './components/pages/Home';
import Login from './components/pages/Login';
import AdminPanel from './components/pages/AdminPanel';
import { AuthProvider } from './store/AuthContext';
import Profile from './components/pages/Profile';
import ProductsPage from './components/pages/ProductsPage';
import ProductDetails from './components/pages/ProductDetails';
import Cart from './components/pages/Cart';
import { ProductProvider } from './store/ProductContext';
import OrdersPage from './components/pages/OrdersPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProductProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<ProductsPage /> } />
                <Route path="/products/:id" element={<ProductDetails /> } />
                <Route path="/cart" element={<Cart /> } />
                <Route path="/orders" element={<OrdersPage />} />
              </Routes>
            </Layout>
          </Router>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


