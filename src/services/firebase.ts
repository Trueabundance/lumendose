import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Helper to get config from JSON or individual vars
const getFirebaseConfig = () => {
    // 1. Try JSON config
    try {
        const jsonConfig = import.meta.env.VITE_FIREBASE_CONFIG_JSON;
        if (jsonConfig) {
            const cleanStr = jsonConfig.replace(/^'|'$/g, '');
            return JSON.parse(cleanStr);
        }
    } catch (e) {
        console.warn("Failed to parse VITE_FIREBASE_CONFIG_JSON", e);
    }

    // 2. Try individual vars
    const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    // Filter out undefined values
    const cleanConfig = Object.fromEntries(
        Object.entries(config).filter(([_, v]) => v !== undefined && v !== '')
    );

    if (Object.keys(cleanConfig).length > 0) {
        return cleanConfig;
    }

    return null;
};

export const appId = import.meta.env.VITE_APP_ID || 'lumendose-app-standalone';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

const firebaseConfig = getFirebaseConfig();

if (firebaseConfig) {
    try {
        console.log("Initializing Firebase with config keys:", Object.keys(firebaseConfig));
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        console.log("Firebase Initialized Successfully");
    } catch (err) {
        console.error("Firebase Initialization Failed:", err);
    }
} else {
    console.error("Firebase Config is Missing! Please check VITE_FIREBASE_CONFIG_JSON or individual VITE_FIREBASE_* variables.");
}

export { app, db, auth };
