import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../features/cartSlice';

const ShoppingCart = ({ showNotification }) => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item.id));
    showNotification(`Removed ${item.title} from cart`);
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {cart.items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.title}</span>
          <span>${item.price} x {item.quantity}</span>
          <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total: ${cart.total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default ShoppingCart;