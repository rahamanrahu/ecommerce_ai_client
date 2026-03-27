/**
 * Database Connection Module
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');
const config = require('../env/config');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.database.uri);

        console.log('MongoDB connected ✅');
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('MongoDB Connection Failed ❌');
        console.error(`Error: ${error.message}`);
        
        if (error.message.includes('IP that isn\'t whitelisted')) {
            console.error('\n👉 Please whitelist your IP address in MongoDB Atlas:');
            console.error('   https://cloud.mongodb.com -> Network Access -> Add IP Address');
        }
        
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB Disconnected');
    } catch (error) {
        console.error(`Database Disconnection Error: ${error.message}`);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from database');
});

// Handle application termination
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

module.exports = {
    connectDB,
    disconnectDB
};
