import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug Firebase configuration
console.warn('DEBUG - Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  config: firebaseConfig
});

// Initialize Firebase
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  console.warn('DEBUG - Firebase initialized successfully');
} catch (error) {
  console.error('DEBUG - Firebase initialization error:', error);
  throw error;
}

// Initialize Auth
let auth;
try {
  auth = getAuth(app);
  console.warn('DEBUG - Firebase Auth initialized successfully', {
    currentUser: auth.currentUser ? 'Present' : 'None',
    isInitialized: !!auth
  });
} catch (error) {
  console.error('DEBUG - Firebase Auth initialization error:', error);
  throw error;
}

export { app, auth };
