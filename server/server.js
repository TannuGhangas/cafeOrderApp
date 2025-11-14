// /server/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from the React Native app
app.use(express.json()); // Body parser for raw JSON data

// Define Routes
// User/Preference Routes
app.use('/api/user', userRoutes);
// Order Routes
app.use('/api/orders', orderRoutes);

// Simple welcome route
app.get('/', (req, res) => {
    res.send('Cafe Ordering API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));