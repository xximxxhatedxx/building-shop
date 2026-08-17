import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
      <Box sx={{ height: '100%' }}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 3,
            borderRadius: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 6,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              paddingTop: '75%',
            }}
          >
            <CardMedia
              component="img"
              image={product.image_url}
              alt={product.name}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: '12px',
                objectFit: 'contain',
              }}
            />
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
              padding: '12px',
            }}
          >
            <div>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  mb: 1,
                  height: '2.4em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2em',
                  fontWeight: 500,
                }}
              >
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.category}
              </Typography>
            </div>
            <div>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {product.price.toLocaleString()} $
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

export default ProductCard;
