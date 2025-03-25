
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKeys.json';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { admin, db };
