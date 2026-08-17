import React  from 'react';
import { Grid, Typography, Button, Container, Box, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../store/ProductContext';
import ProductCard from '../common/ProductCard';

const Home = () => {
  const { categories, popularProducts } = useProductContext();
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          BuildMarket
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Everything for construction and renovation
        </Typography>
        <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/products')}>
          Go to Shopping
        </Button>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2 }}>
        Product Categories
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4}
              key={category.id}
            >
              <Box sx={{ height: '100%' }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex', 
                    flexDirection: 'column',
                    boxShadow: 3,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { 
                      transform: 'scale(1.02)', 
                      boxShadow: 6 
                    }
                  }}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      paddingTop: '80%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={category.image_url}
                      alt={category.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        padding: '8px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    padding: '8px',
                  }}>
                    <Typography 
                      variant="h5"
                      component="h3" 
                      sx={{
                        textAlign: 'center',
                        mb: 1,
                        fontWeight: 'bold',
                        height: '1.2em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography 
                      variant="body1"
                      color="text.secondary" 
                      sx={{ 
                        textAlign: 'center',
                        height: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {category.description || 'No description available.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No categories available.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Typography variant="h4" component="h2" gutterBottom>
        Popular Products
      </Typography>
      <Grid container spacing={2}>
        {popularProducts.length > 0 ? (
          popularProducts.map((product) => (
            <ProductCard product={product}/>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No popular products available.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
