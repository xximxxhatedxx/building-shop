import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Typography, CardMedia, Grid } from '@mui/material';
import axios from '../../utils/axiosInstance';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post('/api/cart', { product_id: Number(id), quantity: 1 });
      alert('Product added to cart!');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.includes('already in cart')
      ) {
        try {
          await axios.put('/api/cart', { product_id: Number(id), quantity: 1 });
          alert('Product quantity updated in cart!');
        } catch (putError) {
          console.error('Error updating cart', putError);
          alert('Failed to update product quantity in cart');
        }
      } else {
        console.error('Error adding to cart', error);
        alert('Failed to add product to cart');
      }
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const isOutOfStock = product.stock_count === 0;

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={product.image_url}
            alt={product.name}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Typography variant="h6" gutterBottom>
            Price: {product.price.toLocaleString()} $
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {product.description}
          </Typography>
          <Typography variant="body2" color={isOutOfStock ? "error" : "text.secondary"} sx={{ mb: 3 }}>
            {isOutOfStock ? "Out of stock" : `In stock: ${product.stock_count}`}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of stock" : "Add to Cart"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;