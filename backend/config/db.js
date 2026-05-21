const mongoose = require('mongoose');

module.exports = async function connectDB() {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing required environment variable: MONGO_URI.');
    console.error('Set MONGO_URI in your host (Render/Heroku) or in a local .env file.');
    console.error('Example format: mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority');
    throw new Error('MONGO_URI is not set');
  }

  // sanitize common mistakes: trim and strip surrounding quotes
  uri = uri.trim().replace(/^['\"]|['\"]$/g, '');

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
};
