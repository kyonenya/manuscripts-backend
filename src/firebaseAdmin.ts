import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'manuscripts-kyonenya',
    clientEmail: 'firebase-adminsdk-36vwk@manuscripts-kyonenya.iam.gserviceaccount.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
  }),
});

export const uid = 'X1Dsc3SdF7UW2zzyn4N3kOoIClC2';

export default admin;
