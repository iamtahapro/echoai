import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  return signInWithPopup(auth, googleProvider);
}

export async function resetPassword(email: string) {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  return sendPasswordResetEmail(auth, email);
}

export function logout() {
  if (!auth) {
    console.warn("Firebase authentication is not configured");
    return Promise.resolve();
  }
  return signOut(auth);
}

export function handleRedirect() {
  // No longer needed
}
