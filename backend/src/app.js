const express = require('express');
const cors = require('cors');
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://estate-value.vercel.app'
  

];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                     origin.includes('localhost') || 
                     origin.includes('vercel.app');

    if (isAllowed) {
      return callback(null, true);
    }

    console.warn("CORS origin not explicitly in list, but allowing for debug:", origin);
    return callback(null, true); // Allow all for now to stop the blocks
  },
  credentials: true
}));
app.options('*', cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contacts', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("🔥 ERROR:", err);

    res.status(500).json({
        error: err.message || 'Internal Server Error'
    });
});

module.exports = app;
