import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { UserProfile } from '../types';

interface AuthWrapperProps {
  children: (user: User, profile: UserProfile | null) => React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        setShowAuthModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
        setShowAuthModal(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#15161B]">
        <div className="w-8 h-8 border-4 border-[#5B7CFA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showAuthModal || !user) {
    return <AuthModal onSuccess={() => setShowAuthModal(false)} />;
  }

  return <>{children(user, profile)}</>;
};
