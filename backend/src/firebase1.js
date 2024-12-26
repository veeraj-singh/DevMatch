const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json')
require('dotenv').config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }

module.exports = admin;