const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public route to submit message
router.post('/', contactController.createMessage);

// Admin routes
router.get('/', authMiddleware, contactController.getAllMessages);
router.delete('/:id', authMiddleware, contactController.deleteMessage);

module.exports = router;
