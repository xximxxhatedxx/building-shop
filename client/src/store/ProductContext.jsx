import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosInstance';

const ProductContext = createContext();

export const useProductContext = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, popularProductsResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/products/categories'),
          axios.get('/api/products/popular')
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setPopularProducts(popularProductsResponse.data);

        const highestPrice = Math.max(...productsResponse.data.map((p) => p.price), 0);
        setMaxPrice(highestPrice);
      } catch (error) {
        console.error('Error fetching products or categories:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, popularProducts, maxPrice }}>
      {children}
    </ProductContext.Provider>
  );
};
