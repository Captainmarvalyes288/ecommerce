import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import Payment from './components/Payment';
import Notification from './components/Notification';
import './App.css';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

function App() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>E-commerce Catalog</h1>
        </header>
        <main>
          <ProductCatalog showNotification={showNotification} />
          <div className="sidebar">
            <ShoppingCart showNotification={showNotification} />
            <Payment />
          </div>
        </main>
        {notification && <Notification message={notification} />}
      </div>
    </Provider>
  );
}

export default App;