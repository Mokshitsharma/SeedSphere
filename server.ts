import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import admin from 'firebase-admin';
import firebaseConfig from './firebase-applet-config.json';
import { initialProducts } from './src/data/initialProducts';

// Initialize Firebase Admin
if (!admin.apps.length) {
  let serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    try {
      // Handle potential wrapping in quotes from environment variables
      if (serviceAccountKey.startsWith("'") && serviceAccountKey.endsWith("'")) {
        serviceAccountKey = serviceAccountKey.slice(1, -1);
      } else if (serviceAccountKey.startsWith('"') && serviceAccountKey.endsWith('"')) {
        serviceAccountKey = serviceAccountKey.slice(1, -1);
      }
      
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: firebaseConfig.projectId,
      });
      console.log('Firebase Admin initialized with service account key.');
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Falling back to default initialization.', error);
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  } else {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log('Firebase Admin initialized with default project ID.');
  }
}

const db = admin.firestore();
if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
  db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
}

// Auto-seed products if collection is empty
async function seedDatabase() {
  try {
    const productsSnapshot = await db.collection('products').limit(1).get();
    if (productsSnapshot.empty) {
      console.log('Products collection is empty. Seeding initial products...');
      const batch = db.batch();
      initialProducts.forEach((product) => {
        const { id, ...data } = product;
        const docRef = db.collection('products').doc(id);
        batch.set(docRef, data);
      });
      await batch.commit();
      console.log('Database seeded successfully with Admin SDK.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// API: Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, customer } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// API: Verify Payment and Save Order
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customer,
      items,
      amount 
    } = req.body;

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Save Order to Firestore
    const orderData = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      customer,
      items,
      status: 'Paid',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('orders').doc(razorpay_order_id).set(orderData);

    res.json({ success: true, orderId: razorpay_order_id });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Vite Middleware for Dev
async function startServer() {
  await seedDatabase(); // Run seeding before starting server

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
