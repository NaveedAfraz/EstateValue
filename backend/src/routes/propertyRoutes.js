const express = require('express');
const router = express.Router();
const axios = require('axios');
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Public routes
router.get('/', propertyController.getAllProperties);

// ✅ IMPORTANT: BEFORE :id
router.post('/predict', async (req, res) => {
  try {
    console.log("Incoming:", req.body);

    const { bedrooms, bathrooms, square_feet, location } = req.body;

    if (
      bedrooms === undefined ||
      bathrooms === undefined ||
      square_feet === undefined ||
      !location
    ) {
      return res.status(400).json({ error: "Missing fields" });
    }

    let response;

    try {
      const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
      response = await axios.post(
        `${mlUrl}/predict`,
        req.body,
        { timeout: 5000 }
      );
    } catch (error) {
      console.error("🔥 ML API ERROR:", error.message);
      return res.status(502).json({ error: "ML service unavailable" });
    }

    return res.json(response.data);

  } catch (err) {
    console.error("❌ Predict Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:id', propertyController.getPropertyById);

// Protected routes
router.post('/', authMiddleware, upload.array('images', 5), propertyController.createProperty);
router.put('/:id', authMiddleware, upload.array('images', 5), propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

// ✅ ONLY ONE EXPORT
module.exports = router;