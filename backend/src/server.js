require('dotenv').config();
const app = require('./app');
const axios = require('axios');

const PORT = process.env.PORT || 5000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Keep ML service alive on Render free tier (spins down after 15 min)
    // Ping every 14 minutes to prevent cold starts
    if (process.env.NODE_ENV === 'production' && ML_SERVICE_URL.includes('onrender.com')) {
        console.log(`🏓 Keepalive ping enabled for ML Service: ${ML_SERVICE_URL}`);
        setInterval(async () => {
            try {
                await axios.get(`${ML_SERVICE_URL}/`, { timeout: 5000 });
                console.log('🏓 ML Service keepalive ping: OK');
            } catch (err) {
                console.warn(`🏓 ML Service keepalive ping failed: ${err.message}`);
            }
        }, 14 * 60 * 1000); // Every 14 minutes
    }
});
