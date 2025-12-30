import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// VITE_FIREBASE_CONFIG_JSON='{...your config...}'
const firebaseConfigStr = import.meta.env.VITE_FIREBASE_CONFIG_JSON;
let firebaseConfig = {};

try {
    firebaseConfig = firebaseConfigStr ? JSON.parse(firebaseConfigStr) : {};
} catch (e) {
    console.error("Error parsing VITE_FIREBASE_CONFIG_JSON", e);
}

export const appId = import.meta.env.VITE_APP_ID || 'lumendose-app-standalone';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
}

export { app, db, auth };
