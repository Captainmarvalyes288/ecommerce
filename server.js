const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/create-order', async (req, res) => {
  try {
    console.log('Received order creation request:', req.body);

    const amountInPaise = Math.round(req.body.amount * 100); // amount in paise
    if (isNaN(amountInPaise)) {
      return res.status(400).json({ message: "Invalid amount provided" });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7)
    };

    console.log('Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order);

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

app.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const Razorpay = require('razorpay');
// require('dotenv').config();

// const app = express();
// app.use(bodyParser.json());

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// app.post('/create-order', async (req, res) => {
//   try {
//     console.log('Received order creation request:', req.body);

//     const amountInPaise = Math.round(req.body.amount * 100); // amount in paise
//     if (isNaN(amountInPaise) || amountInPaise <= 0) {
//       return res.status(400).json({ message: "Invalid amount provided" });
//     }

//     const options = {
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: "receipt_" + Math.random().toString(36).substring(7)
//     };

//     console.log('Creating order with options:', options);
//     const order = await razorpay.orders.create(options);
//     console.log('Order created successfully:', order);

//     res.json(order);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: "Error creating order", error: error.message });
//   }
// });

// app.post('/verify-payment', (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ message: "Missing required parameters" });
//     }

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (razorpay_signature === expectedSign) {
//       res.status(200).json({ message: "Payment verified successfully" });
//     } else {
//       res.status(400).json({ message: "Invalid signature sent!" });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ message: "Error verifying payment", error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
