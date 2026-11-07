import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const useEmulators = import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Boolean(
  useEmulators || (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId),
);

if (!hasFirebaseConfig) {
  console.warn(
    "Firebase não configurado. Copie .env.example para .env e preencha as chaves.",
  );
}

export const app = initializeApp(
  useEmulators
    ? { apiKey: "demo-pedrodev-key", projectId: "demo-pedrodev", appId: "demo-pedrodev-app", authDomain: "localhost" }
    : hasFirebaseConfig
    ? firebaseConfig
    : {
        apiKey: "not-configured",
        projectId: "not-configured",
        appId: "not-configured",
      },
);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
if (useEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
