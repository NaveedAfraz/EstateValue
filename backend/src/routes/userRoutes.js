const express = require('express');
const router = express.Router();
const userItemController = require('../controllers/userItemController');
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

// Wishlist
router.post('/wishlist/toggle', userItemController.toggleWishlist);
router.get('/wishlist', userItemController.getWishlist);

// Predictions
router.post('/predictions', userItemController.savePrediction);
router.get('/predictions', userItemController.getSavedPredictions);

module.exports = router;
