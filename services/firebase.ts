import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyBUKuODCgPvYmYzm22K5y7OM6LTdN5LhxI',
  authDomain: 'nextjs-ecommerce-images-41632.firebaseapp.com',
  projectId: 'nextjs-ecommerce-images-41632',
  storageBucket: 'nextjs-ecommerce-images-41632.appspot.com',
  messagingSenderId: '664832439069',
  appId: '1:664832439069:web:a4bb5c2649aab41d63e7f4',
  measurementId: 'G-3BS7VRW87Y',
}

export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const storage = getStorage(app);