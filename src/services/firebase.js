import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, query, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Configuración de Firebase - Usa variables de entorno o valores por defecto para desarrollo
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "demo-app-id"
};

export const appId = process.env.REACT_APP_ID || 'diabetes-control-app';
export const initialAuthToken = process.env.REACT_APP_INITIAL_AUTH_TOKEN || null;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signIn = async () => {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
};

export { onAuthStateChanged, doc, getDoc, setDoc, addDoc, collection, query, onSnapshot, serverTimestamp };
