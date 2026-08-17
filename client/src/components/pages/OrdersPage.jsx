import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from '../../utils/axiosInstance';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/orders/my');
        setOrders(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          'Failed to fetch orders'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : orders.length === 0 ? (
        <Typography variant="body1">You have no orders yet.</Typography>
      ) : (
        <List
          subheader={
            <ListSubheader component="div">
              Order History
            </ListSubheader>
          }
        >
          {orders.map(order => (
            <Box key={order.id} mb={3}>
              <ListItem>
                <ListItemText
                  primary={`Order №${order.id} — ${new Date(order.created_at).toLocaleString()}`}
                  secondary={
                    <>
                      <div>Status: {order.status}</div>
                      <div>Address: {order.address}</div>
                      <div>Sum: {order.total_price} $</div>
                    </>
                  }
                />
              </ListItem>
              <List dense sx={{ pl: 4 }}>
                {order.items.map(item => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={`${item.name} (x${item.quantity})`}
                      secondary={`Price: ${item.price} $`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ mt: 2, mb: 2 }} />
            </Box>
          ))}
        </List>
      )}
    </Container>
  );
};

export default OrdersPage;