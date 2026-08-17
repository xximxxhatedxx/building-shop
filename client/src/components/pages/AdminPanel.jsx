import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Slider,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const defaultPendingFilters = {
  category: '',
  search: '',
  sortBy: 'default',
  priceRange: [0, 10000],
};

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock_count: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [filters, setFilters] = useState(defaultPendingFilters);
  const [pendingFilters, setPendingFilters] = useState(defaultPendingFilters);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [maxPrice, setMaxPrice] = useState(10000);
  const limit = 20;

  useEffect(() => {
    if (!(user && user.role_id === 1)) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchCategories();
    fetchMaxPrice();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [filters]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page, false);
  }, [page]);

  const fetchProducts = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products', {
        params: {
          category: filters.category || undefined,
          search: filters.search || undefined,
          sortBy: filters.sortBy !== 'default' ? filters.sortBy : undefined,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          page: pageNum,
          limit,
          showDeleted: 1,
        },
      });
      const newProducts = response.data;
      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      setHasMore(newProducts.length === limit);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMaxPrice = async () => {
    try {
      const response = await axios.get('/api/products/max-price');
      const price = response.data?.maxPrice || 10000;
      setMaxPrice(price);
      setPendingFilters(prev => ({
        ...prev,
        priceRange: [0, price],
      }));
      setFilters(prev => ({
        ...prev,
        priceRange: [0, price],
      }));
    } catch (err) {
      console.error('Error fetching max price:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setPendingFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const clearFilters = () => {
    setPendingFilters({
      ...defaultPendingFilters,
      priceRange: [0, maxPrice],
    });
    setFilters({
      ...defaultPendingFilters,
      priceRange: [0, maxPrice],
    });
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = (product = null) => {
    if (product) {
      setFormValues(product);
      setEditingId(product.id);
    } else {
      setFormValues({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        stock_count: '',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      stock_count: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setFormError('');
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formValues);
      } else {
       await axios.post('/api/products', formValues);
      }
      setFilters({ ...filters });
      handleClose();
      fetchMaxPrice();
      fetchProducts();
    } catch (err) {
      setFormError(
        err.response?.data?.error ||
        'Failed to save product'
      );
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setFilters({ ...filters });
        fetchMaxPrice();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const filteredProducts = products;

  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Products Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box>
            <Typography variant="h6">Filters</Typography>
            <TextField
              label="Search"
              fullWidth
              margin="normal"
              value={pendingFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={pendingFilters.category}
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
                value={pendingFilters.sortBy}
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
                value={pendingFilters.priceRange}
                onChange={(e, newVal) => handleFilterChange('priceRange', newVal)}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                step={0.1}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">${pendingFilters.priceRange[0]}</Typography>
                <Typography variant="body2">${pendingFilters.priceRange[1]}</Typography>
              </Box>
            </Box>
            <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={applyFilters}>
              Search
            </Button>
            <Button variant="outlined" fullWidth onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen()}
              sx={{ mt: 2 }}
              fullWidth
            >
              Add Product
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock Count</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.category_name}</TableCell>
                      <TableCell>{product.stock_count}</TableCell>
                      <TableCell>
                        {product.is_deleted ? (
                          <Typography color="error" variant="body2">
                            Soft deleted
                          </Typography>
                        ) : (
                          <>
                            <Button onClick={() => handleOpen(product)} color="primary">
                              Change
                            </Button>
                            <Button onClick={() => handleDelete(product.id)} color="error">
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No products match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Change Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', gap: 2 }}>
          <Paper
            elevation={3}
            sx={{
              width: 150,
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {formValues.image_url ? (
              <img
                src={formValues.image_url}
                alt="Product"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography color="text.secondary" variant="body2">
                No Image
              </Typography>
            )}
          </Paper>
          <div style={{ flex: 1 }}>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              value={formValues.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              value={formValues.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={formValues.price}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={formValues.category_id}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="URL image"
              name="image_url"
              fullWidth
              value={formValues.image_url}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Stock Count"
              name="stock_count"
              type="number"
              fullWidth
              value={formValues.stock_count}
              onChange={handleInputChange}
            />
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;