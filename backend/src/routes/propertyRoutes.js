const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/predict', propertyController.predictOnly);

// Protected routes (require login)
router.post('/', authMiddleware, upload.array('images', 5), propertyController.createProperty);
router.put('/:id', authMiddleware, upload.array('images', 5), propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;