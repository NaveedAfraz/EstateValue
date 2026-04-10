const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/', propertyController.getAllProperties);
router.post('/predict', propertyController.predictPrice);

module.exports = router;
