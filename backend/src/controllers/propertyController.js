const pool = require('../config/db');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Get all properties
exports.getAllProperties = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
};

// Get single property
exports.getPropertyById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
};

// Create property with AI prediction
exports.createProperty = async (req, res) => {
    try {
        const { title, location, bedrooms, bathrooms, square_feet, actual_price, description, image_url } = req.body;
        const userId = req.user.id; // From authMiddleware

        // 1. Get AI Prediction
        let predicted_price = null;
        let status = 'pending';

        try {
            const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
                bedrooms,
                bathrooms,
                square_feet,
                location
            });
            predicted_price = mlResponse.data.predicted_price;
            
            // 2. Determine status
            if (actual_price) {
                const diff = (actual_price - predicted_price) / predicted_price;
                status = diff > 0.1 ? 'overpriced' : 'fair';
            }
        } catch (mlError) {
            console.warn('ML Service unavailable, proceeding without prediction');
        }

        // 3. Save to DB
        const [result] = await pool.query(
            `INSERT INTO properties 
            (title, location, bedrooms, bathrooms, square_feet, actual_price, predicted_price, status, description, image_url, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, location, bedrooms, bathrooms, square_feet, actual_price, predicted_price, status, description, image_url, userId]
        );

        res.status(201).json({ 
            message: 'Property created successfully', 
            propertyId: result.insertId,
            predicted_price,
            status
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    try {
        const { title, location, bedrooms, bathrooms, square_feet, actual_price, description, image_url } = req.body;
        const propertyId = req.params.id;
        const userId = req.user.id;

        // Check ownership (simple check for this example)
        const [rows] = await pool.query('SELECT user_id FROM properties WHERE id = ?', [propertyId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Property not found' });
        if (rows[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized to update this property' });

        await pool.query(
            `UPDATE properties 
            SET title = ?, location = ?, bedrooms = ?, bathrooms = ?, square_feet = ?, actual_price = ?, description = ?, image_url = ? 
            WHERE id = ?`,
            [title, location, bedrooms, bathrooms, square_feet, actual_price, description, image_url, propertyId]
        );

        res.json({ message: 'Property updated successfully' });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Failed to update property' });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user.id;

        // Check ownership
        const [rows] = await pool.query('SELECT user_id FROM properties WHERE id = ?', [propertyId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Property not found' });
        if (rows[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized to delete this property' });

        await pool.query('DELETE FROM properties WHERE id = ?', [propertyId]);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Failed to delete property' });
    }
};

// Predictive endpoint only
exports.predictOnly = async (req, res) => {
    try {
        const { bedrooms, bathrooms, square_feet, location } = req.body;
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
            bedrooms,
            bathrooms,
            square_feet,
            location
        });
        res.json({ predicted_price: response.data.predicted_price });
    } catch (error) {
        console.error('ML Service Error:', error.message);
        res.status(500).json({ error: 'Failed to generate prediction' });
    }
};
