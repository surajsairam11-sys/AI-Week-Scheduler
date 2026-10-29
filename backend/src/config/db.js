const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB not available — using in-memory storage.');
    // Continue without exiting to allow server start
  }
};

module.exports = connectDB;
