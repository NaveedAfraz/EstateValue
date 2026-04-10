const pool = require('../config/db');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

exports.getAllProperties = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM properties');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
};

exports.predictPrice = async (req, res) => {
    try {
        const { bedrooms, bathrooms, square_feet, location } = req.body;
        
        // Forward data to Python ML service for prediction
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
            bedrooms,
            bathrooms,
            square_feet,
            location
        });

        res.json({ predicted_price: response.data.predicted_price });
    } catch (error) {
        console.error('Error communicating with ML service:', error.message);
        res.status(500).json({ error: 'Failed to generate prediction' });
    }
};
