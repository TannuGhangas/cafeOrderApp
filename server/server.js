// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Assuming a database connection file
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests from frontends
app.use(express.json()); // Body parser for JSON data

// --- Database Connection ---
 connectDB(); // Uncomment when integrating a real database (e.g., MongoDB)

// --- Routes ---
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Sip Station Server is running!');
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));