import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase Web App configuration supplied for this test project.
const firebaseConfig = {
  apiKey: "AIzaSyDVs1CKs5HtcZgGtRMaT-xjqmwCCZr_Qvw",
  authDomain: "my-life-manager-ab4a3.firebaseapp.com",
  projectId: "my-life-manager-ab4a3",
  storageBucket: "my-life-manager-ab4a3.firebasestorage.app",
  messagingSenderId: "195558423463",
  appId: "1:195558423463:web:2a8b3958c990c141351482",
  measurementId: "G-T2R6002CFB"
};

export const app = getApps()[0] || initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const firebaseEnabled = true;

if (typeof window !== 'undefined') {
  isSupported().then(ok => { if (ok) getAnalytics(app); }).catch(() => {});
}

export function createGoogleProvider(){
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar');
  provider.setCustomParameters({ prompt: 'consent' });
  return provider;
}
