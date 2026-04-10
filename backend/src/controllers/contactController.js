const pool = require('../config/db');

// Submit a new contact message (Public)
exports.createMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message, propertyId } = req.body;
        
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await pool.query(
            'INSERT INTO contacts (first_name, last_name, email, phone, message, property_id) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone, message, propertyId || null]
        );

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Get all messages (Admin Only)
exports.getAllMessages = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, p.title as property_title 
            FROM contacts c 
            LEFT JOIN properties p ON c.property_id = p.id 
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Fetch messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Delete a message (Admin Only)
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
