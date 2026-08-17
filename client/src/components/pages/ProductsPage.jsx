import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Grid, Container, Typography, Box, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Slider, CircularProgress
} from '@mui/material';
import { useProductContext } from '../../store/ProductContext';
import ProductCard from '../common/ProductCard';
import axios from '../../utils/axiosInstance';

const ProductsPage = () => {
  const { categories } = useProductContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'default',
    priceRange: [0, 10000],
  });

  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchProducts = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get('api/products', {
        params: {
          category: filters.category || undefined,
          search: filters.search || undefined,
          sortBy: filters.sortBy !== 'default' ? filters.sortBy : undefined,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          page: pageNum,
          limit,
        },
      });

      const newProducts = response.data;

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === limit);

      const highest = Math.max(...newProducts.map(p => p.price), 0);
      if (highest > maxPrice) setMaxPrice(highest);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'default';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPriceParam = Number(searchParams.get('maxPrice') || 10000);

  const newFilters = {
    category,
    search,
    sortBy,
    priceRange: [minPrice, maxPriceParam],
  };

  setFilters(newFilters);
  setProducts([]);
  setPage(1);

  const fetchMax = async () => {
    try {
      const response = await axios.get('api/products/max-price', {
        params: {
          category: category || undefined,
          search: search || undefined,
          minPrice,
          maxPrice: maxPriceParam,
        },
      });
      const fetchedMax = Math.ceil(response.data.maxPrice || 10000);
      setMaxPrice(fetchedMax);

      setFilters(prev => ({
        ...prev,
        priceRange: [
          prev.priceRange[0],
          Math.min(prev.priceRange[1], fetchedMax)
        ]
      }));
    } catch (e) {
      console.error('Failed to fetch max price', e);
    }
  };

  fetchMax();
  fetchProducts(1, true);
}, [searchParams]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy !== 'default') params.sortBy = filters.sortBy;
    if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
    if (filters.priceRange[1] < maxPrice) params.maxPrice = filters.priceRange[1];

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box>
            <Typography variant="h6">Filters</Typography>
            <TextField
              label="Search"
              fullWidth
              margin="normal"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="nameAsc">Name: A to Z</MenuItem>
                <MenuItem value="nameDesc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(e, newVal) => handleFilterChange('priceRange', newVal)}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                step={0.1}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">${filters.priceRange[0]}</Typography>
                <Typography variant="body2">${filters.priceRange[1]}</Typography>
              </Box>
            </Box>
            <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={applyFilters}>
              Search
            </Button>
            <Button variant="outlined" fullWidth onClick={clearFilters}>
              Clear Filters
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : !loading ? (
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center">
                  No products match your filters.
                </Typography>
              </Grid>
            ) : null}
          </Grid>

          {loading && (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          )}

          {!loading && hasMore && (
            <Box textAlign="center" mt={3}>
              <Button variant="outlined" onClick={loadMore}>
                Show More
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;
