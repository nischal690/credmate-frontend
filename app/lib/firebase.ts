import { initializeApp, getApps } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  // your firebase config here
}

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth: Auth = getAuth(app)