require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const orderRoutes = require('./routes/ordersRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', orderRoutes);
app.use('/api/stripe', stripeRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('📘 Ebook Store API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
