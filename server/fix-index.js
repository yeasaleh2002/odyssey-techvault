const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Drop the obsolete index
    await mongoose.connection.collection('users').dropIndex('firebaseUid_1');
    console.log('Successfully dropped firebaseUid_1 index');
    
  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
      console.log('Index firebaseUid_1 does not exist. It might have already been dropped or has a different name.');
    } else {
      console.error('Error:', err);
    }
  } finally {
    await mongoose.disconnect();
  }
}

fix();
