import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDocFromServer } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfileDoc } from '../types/itinerary';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Firestore connection check on initial boot as mandated by Firebase skill
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'userProfiles', 'connection-probe'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration or network status.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Persist user profile in the specific collection 'userProfiles' (uid, email, createdAt)
          const profileDocRef = doc(db, 'userProfiles', currentUser.uid);
          const profileData: UserProfileDoc = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            createdAt: new Date().toISOString(),
            displayName: currentUser.displayName || 'Traveller',
            photoURL: currentUser.photoURL || ''
          };
          await setDoc(profileDocRef, profileData, { merge: true });
        } catch (e) {
          console.error('Error saving userProfile in Firestore:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err.message || 'Google sign-in failed. Please try again.');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        setUser({ ...cred.user, displayName: name });
      }
    } catch (err: any) {
      console.error('Email Sign-Up Error:', err);
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        authError,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
