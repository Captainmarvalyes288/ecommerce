
import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Payment = () => {
  const cart = useSelector(state => state.cart);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handlePayment = useCallback(async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      return;
    }

    // Create order first
    const order = await axios.post('http://localhost:3001/create-order', {
      amount: cart.total // amount in INR
    });

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.data.amount,
      currency: "INR",
      name: "Boat",
      description: "Purchase Description",
      order_id: order.data.id, // Use the order ID returned by the create-order endpoint
      handler: async function (response) {
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };

        const result = await axios.post('http://localhost:3001/verify-payment', data);
        alert(result.data.message);
      },
      prefill: {
        name: "Tejas Navale",
        email: "ias.tejasnavale10@gmail.com",
        contact: "8600194737"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }, [cart.total, loadRazorpayScript]);

  useEffect(() => {
    loadRazorpayScript();
  }, [loadRazorpayScript]);

  return (
    <div className="payment">
      <h2>Payment</h2>
      <p>Total Amount: ${cart.total.toFixed(2)}</p>
      <button onClick={handlePayment} className="razorpay-payment-button">
        Pay Now
      </button>
    </div>
  );
};

export default Payment;

// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const Payment = () => {
//   const cart = useSelector(state => state.cart);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
//     script.async = true;
//     script.setAttribute('data-payment_button_id', 'pl_OZR0KRCE9QUvN8'); // Replace with your payment button ID
//     document.getElementById('razorpay-button-container').appendChild(script);

//     return () => {
//       const element = document.getElementById('razorpay-button-container');
//       if (element) element.removeChild(script);
//     };
//   }, []);

//   useEffect(() => {
//     const createOrder = async () => {
//       try {
//         await axios.post('http://localhost:3000/create-order', { amount: cart.total });
//       } catch (error) {
//         console.error('Error creating order:', error);
//       }
//     };
//     createOrder();
//   }, [cart.total]);

//   return (
//     <div className="payment">
//       <h2>Payment</h2>
//       <p>Total Amount: ${cart.total.toFixed(2)}</p>
//       <div id="razorpay-button-container">
//         {/* The script will inject the payment button here */}
//       </div>
//     </div>
//   );
// };

// export default Payment;
