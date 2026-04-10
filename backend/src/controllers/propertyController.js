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
        let { 
            title, location, bedrooms, bathrooms, square_feet, actual_price, 
            description, image_url, property_type, property_status, 
            furnishing, facing, age_of_property, is_featured, amenities 
        } = req.body;

        let gallery = [];
        if (req.files && req.files.length > 0) {
            gallery = req.files.map(file => `/uploads/${file.filename}`);
            image_url = gallery[0]; // Primary image
        }
        const userId = req.user.id; 

        // 1. Get AI Prediction
        let predicted_price = null;
        let analysis_status = 'pending';

        try {
            const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
                bedrooms,
                bathrooms,
                square_feet,
                location
            });
            predicted_price = mlResponse.data.predicted_price;
            
            // 2. Determine market analysis status
            if (actual_price) {
                const diff = (actual_price - predicted_price) / predicted_price;
                analysis_status = diff > 0.1 ? 'overpriced' : (diff < -0.1 ? 'underpriced' : 'fair');
            }
        } catch (mlError) {
            console.warn('ML Service unavailable, proceeding without prediction');
        }

        // 3. Save to DB
        const [result] = await pool.query(
            `INSERT INTO properties 
            (title, location, bedrooms, bathrooms, square_feet, actual_price, predicted_price, status, description, image_url, gallery, user_id, 
             property_type, property_status, furnishing, facing, age_of_property, is_featured, amenities) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, location, bedrooms, bathrooms, square_feet, actual_price, predicted_price, analysis_status, description, image_url, 
                JSON.stringify(gallery), userId,
                property_type || 'Apartment', property_status || 'Ready', furnishing || 'Unfurnished', facing, age_of_property || 0, is_featured || 0, amenities
            ]
        );

        res.status(201).json({ 
            message: 'Property created successfully', 
            propertyId: result.insertId,
            predicted_price,
            status: analysis_status
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    try {
        let { 
            title, location, bedrooms, bathrooms, square_feet, actual_price, 
            description, image_url, property_type, property_status, 
            furnishing, facing, age_of_property, is_featured, amenities 
        } = req.body;

        let gallery = null;
        if (req.body.gallery) {
            if (Array.isArray(req.body.gallery)) {
                gallery = req.body.gallery;
            } else if (typeof req.body.gallery === 'string') {
                try {
                    gallery = JSON.parse(req.body.gallery);
                } catch (e) {
                    // Fallback: If it's a string, wrap it in an array if it looks like a URL
                    gallery = [req.body.gallery];
                }
            }
        }
        
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            // If images were selected, we replace or append. Let's assume replacement for simplicity or append if gallery exists.
            // Actually, for a clean "upload", let's replace unless specified.
            gallery = newImages; 
            image_url = gallery[0];
        }

        const propertyId = req.params.id;
        const userId = req.user.id;

        // Check ownership & get current data
        const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [propertyId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Property not found' });
        if (rows[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized to update this property' });

        const current = rows[0];
        let predicted_price = current.predicted_price;
        let analysis_status = current.status;

        // Re-predict if core specs changed
        const specsChanged = 
            location !== current.location || 
            parseInt(bedrooms) !== current.bedrooms || 
            parseInt(bathrooms) !== current.bathrooms || 
            parseInt(square_feet) !== current.square_feet;

        if (specsChanged || (actual_price && actual_price !== current.actual_price)) {
            try {
                const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
                    bedrooms: bedrooms || current.bedrooms,
                    bathrooms: bathrooms || current.bathrooms,
                    square_feet: square_feet || current.square_feet,
                    location: location || current.location
                });
                predicted_price = mlResponse.data.predicted_price;
                
                if (actual_price || current.actual_price) {
                    const price = actual_price || current.actual_price;
                    const diff = (price - predicted_price) / predicted_price;
                    analysis_status = diff > 0.1 ? 'overpriced' : (diff < -0.1 ? 'underpriced' : 'fair');
                }
            } catch (mlError) {
                console.warn('ML Service unavailable during update');
            }
        }

        await pool.query(
            `UPDATE properties 
            SET title = ?, location = ?, bedrooms = ?, bathrooms = ?, square_feet = ?, actual_price = ?, 
                predicted_price = ?, status = ?, description = ?, image_url = ?, gallery = ?, property_type = ?, 
                property_status = ?, furnishing = ?, facing = ?, age_of_property = ?, 
                is_featured = ?, amenities = ?
            WHERE id = ?`,
            [
                title, location, bedrooms, bathrooms, square_feet, actual_price, 
                predicted_price, analysis_status, description, image_url, 
                gallery ? JSON.stringify(gallery) : null,
                property_type, 
                property_status, furnishing, facing, age_of_property, 
                is_featured, amenities, propertyId
            ]
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
        console.log(`\n🔍 [PREDICTION REQUEST]`);
        console.log(`📍 Location: ${location}`);
        console.log(`🏠 Specs: ${bedrooms}BHK, ${bathrooms}BA, ${square_feet} sqft`);

        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
            bedrooms,
            bathrooms,
            square_feet,
            location
        });
        
        console.log(`💰 [ML RESPONSE] Price: ₹${response.data.predicted_price} Lakhs`);
        res.json(response.data);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        res.status(500).json({ error: 'Failed to generate prediction' });
    }
};
