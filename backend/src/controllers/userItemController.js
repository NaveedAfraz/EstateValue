const pool = require('../config/db');

// Wishlist Logic
exports.toggleWishlist = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user.id;

        // Check if already in wishlist
        const [existing] = await pool.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND property_id = ?',
            [userId, propertyId]
        );
 
        if (existing.length > 0) {
            await pool.query('DELETE FROM wishlist WHERE user_id = ? AND property_id = ?', [userId, propertyId]);
            return res.json({ message: 'Removed from wishlist', action: 'removed' });
        } else {
            await pool.query('INSERT INTO wishlist (user_id, property_id) VALUES (?, ?)', [userId, propertyId]);
            return res.status(201).json({ message: 'Added to wishlist', action: 'added' });
        }
    } catch (error) {
        console.error('Wishlist error:', error);
        res.status(500).json({ error: 'Failed to update wishlist' });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            `SELECT p.* FROM properties p 
             JOIN wishlist w ON p.id = w.property_id 
             WHERE w.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Fetch wishlist error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

// Prediction History Logic
exports.savePrediction = async (req, res) => {
    try {
        const { location, bedrooms, bathrooms, square_feet, predicted_price, status } = req.body;
        const userId = req.user.id;

        await pool.query(
            `INSERT INTO saved_predictions 
            (user_id, location, bedrooms, bathrooms, square_feet, predicted_price, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, location, bedrooms, bathrooms, square_feet, predicted_price, status]
        );

        res.status(201).json({ message: 'Prediction saved to history' });
    } catch (error) {
        console.error('Save prediction error:', error);
        res.status(500).json({ error: 'Failed to save prediction' });
    }
};

exports.getSavedPredictions = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            'SELECT * FROM saved_predictions WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Fetch predictions error:', error);
        res.status(500).json({ error: 'Failed to fetch predictions' });
    }
};
