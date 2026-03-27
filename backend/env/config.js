/**
 * Environment Configuration
 * Centralized management of environment variables
 */

require('dotenv').config();

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET'
];

/**
 * Validate that all required environment variables are set
 */
const validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// Validate on module load
validateEnv();

const config = {
    server: {
        port: parseInt(process.env.PORT, 10) || 5000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    database: {
        uri: process.env.MONGODB_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expire: process.env.JWT_EXPIRE || '7d'
    },
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000'
    }
};

module.exports = config;
