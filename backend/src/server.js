require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Prevent crashes from unhandled errors (critical for Render stability)
process.on('uncaughtException', (err) => {
    console.error('🔴 Uncaught Exception (process kept alive):', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('🔴 Unhandled Rejection (process kept alive):', reason);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
