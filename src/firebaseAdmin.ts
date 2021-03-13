import admin from 'firebase-admin';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const uid = 'X1Dsc3SdF7UW2zzyn4N3kOoIClC2';

//admin.initializeApp({
//  credential: admin.credential.cert({
//    projectId: 'manuscripts-kyonenya',
//    clientEmail:
//      'firebase-adminsdk-36vwk@manuscripts-kyonenya.iam.gserviceaccount.com',
//    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
//  }),
//});

export const getIdToken = async (uid: string): Promise<string> => {
  const apiKey = 'AIzaSyAttARzXFbAreQhdIaAKPMsn6bPzbTMA8o';
  const customToken = await admin.auth().createCustomToken(uid);
  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return res.idToken;
};

export default admin;
