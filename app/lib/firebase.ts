import { initializeApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  // your firebase config here
}

const app = initializeApp(firebaseConfig)
export const auth: Auth = getAuth(app) 