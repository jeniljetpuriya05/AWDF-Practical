const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise_rbac_db';
    const conn = await mongoose.connect(connUri);

    console.log(`✅ [Practical-10] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [Practical-10] MongoDB Connection Error: ${error.message}`);
    // Don't kill process immediately in dev so API documentation remains testable
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [Practical-10] MongoDB disconnected');
});

module.exports = connectDB;
