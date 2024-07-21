import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { addToCart } from '../features/cartSlice';

const ProductCatalog = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    showNotification(`Added ${product.title} to cart`);
  };

  return (
    <div className="product-catalog">
      {products.map(product => (
        <div key={product.id} className="product-item">
          <LazyLoad height={200} once>
            <img src={product.image} alt={product.title} />
          </LazyLoad>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductCatalog;