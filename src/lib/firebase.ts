import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGd3IXb6cZ6-aNvEiHdzWiLmUfwX_LMn8",
  authDomain: "knotted-cocoa-vgtt6.firebaseapp.com",
  projectId: "knotted-cocoa-vgtt6",
  storageBucket: "knotted-cocoa-vgtt6.firebasestorage.app",
  messagingSenderId: "305494025408",
  appId: "1:305494025408:web:8b3fba7a48bd075ea8b925"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-aiemergencyassis-5b264e63-062a-4162-9982-5cdd65a7cb2f");
