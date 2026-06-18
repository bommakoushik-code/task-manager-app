const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 *
 * This function reads the connection string from the environment variable
 * `MONGODB_URI`. It attempts to establish a connection using mongoose
 * and logs the outcome. If the connection fails, the error is logged
 * and the process exits with a non‑zero code. Keeping database logic in
 * a separate module makes the server setup cleaner and easier to test.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;