import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

const DATABASE_URL = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || ''

let db: ReturnType<typeof getDatabase> | null = null

try {
  if (firebaseConfig.projectId && DATABASE_URL) {
    const app = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0]
    db = getDatabase(app, DATABASE_URL)
  }
} catch (err) {
  console.warn('Firebase initialization failed:', err)
}

export { db }
export default db
