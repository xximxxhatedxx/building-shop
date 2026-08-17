import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from '../../utils/axiosInstance';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderAddress, setOrderAddress] = useState('');
  const [paymentData, setPaymentData] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/cart');
        if (Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
          setTotalPrice(response.data.totalPrice);
        } else {
          setCartItems([]);
          setTotalPrice(0);
        }
      } catch (error) {
        console.error('Error fetching cart', error);
      }
    };
    fetchCart();
  }, []);

  const updateCartItem = useCallback((productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const handleRemoveItem = async (cartId) => {
    try {
      await axios.delete(`/api/cart/${cartId}`);
      setCartItems(cartItems.filter(item => item.cart_id !== cartId));
      const response = await axios.get('/api/cart');
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      alert('Failed to remove product');
    }
  };

  const handleChangeQuantity = async (productId, cartId, newQuantity, stockCount) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;
    if (newQuantity > stockCount) {
      alert('Cannot order more than available in stock!');
      return;
    }
    try {
      await axios.put('/api/cart', { product_id: productId, quantity: newQuantity });
      updateCartItem(productId, newQuantity);
      const response = await axios.get('/api/cart');
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const handleOrderClick = () => {
    setOrderDialogOpen(true);
    setOrderError('');
    setOrderSuccess('');
  };

  const handleOrderClose = () => {
    setOrderDialogOpen(false);
    setOrderAddress('');
    setPaymentData('');
    setOrderError('');
    setOrderSuccess('');
  };

  const handleOrderConfirm = async () => {
    setOrderError('');
    const overLimitItem = cartItems.find(item => item.quantity > item.stock_count);
    if (overLimitItem) {
      setOrderError(
        `Product "${overLimitItem.name}" has only ${overLimitItem.stock_count} in stock.`
      );
      return;
    }
    if (!orderAddress.trim() || !paymentData.trim()) {
      setOrderError('Please enter address and payment details');
      return;
    }
    setOrdering(true);
    try {
      const response = await axios.post('/api/cart/order', {
        address: orderAddress,
        payment: paymentData,
      });
      setOrderSuccess('Order placed successfully!');
      setCartItems([]);
      setTotalPrice(0);
    } catch (err) {
      setOrderError(
        err.response?.data?.error ||
        'Failed to place order'
      );
    } finally {
      setOrdering(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      <List>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <ListItem key={item.cart_id}>
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    {`Price: ${(item.price * item.quantity).toFixed(2)} $`}
                    <br />
                    {`In stock: ${item.stock_count}`}
                    {item.quantity > item.stock_count && (
                      <span style={{ color: 'red', marginLeft: 8 }}>
                        (not enough in stock)
                      </span>
                    )}
                  </>
                }
              />
              <IconButton
                color="primary"
                onClick={() => {
                  const newQuantity = item.quantity + 1;
                  handleChangeQuantity(item.product_id, item.cart_id, newQuantity, item.stock_count);
                }}
                disabled={item.quantity >= item.stock_count}
              >
                <Add />
              </IconButton>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(event) => {
                  const newQuantity = parseInt(event.target.value, 10);
                  if (!isNaN(newQuantity) && newQuantity >= 1) {
                    handleChangeQuantity(item.product_id, item.cart_id, newQuantity, item.stock_count);
                  }
                }}
                inputProps={{ min: 1, max: item.stock_count }}
                sx={{ width: 60, margin: '0 8px' }}
                error={item.quantity > item.stock_count}
                helperText={
                  item.quantity > item.stock_count
                    ? `Max: ${item.stock_count}`
                    : ''
                }
              />
              <IconButton
                color="primary"
                onClick={() => {
                  const newQuantity = Math.max(item.quantity - 1, 1);
                  handleChangeQuantity(item.product_id, item.cart_id, newQuantity, item.stock_count);
                }}
              >
                <Remove />
              </IconButton>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveItem(item.cart_id)}
              >
                Remove
              </Button>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">Your cart is empty</Typography>
        )}
      </List>
      <Typography variant="h6" gutterBottom>
        Total: ${totalPrice}
      </Typography>
      {cartItems.length > 0 && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleOrderClick}>
            Place Order
          </Button>
        </Box>
      )}

      <Dialog open={orderDialogOpen} onClose={handleOrderClose}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Delivery Address"
            fullWidth
            margin="normal"
            value={orderAddress}
            onChange={e => setOrderAddress(e.target.value)}
          />
          <TextField
            label="Payment Details"
            fullWidth
            margin="normal"
            value={paymentData}
            onChange={e => setPaymentData(e.target.value)}
            placeholder="Card, phone, etc."
          />
          {orderError && <Alert severity="error" sx={{ mt: 2 }}>{orderError}</Alert>}
          {orderSuccess && <Alert severity="success" sx={{ mt: 2 }}>{orderSuccess}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOrderClose} disabled={ordering}>Cancel</Button>
          <Button onClick={handleOrderConfirm} variant="contained" disabled={ordering}>
            {ordering ? 'Placing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;