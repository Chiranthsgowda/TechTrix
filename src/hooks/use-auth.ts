"use client";
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// The admin email is retrieved from environment variables for security.
// Fallbacks to a placeholder for development.
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    if (!ADMIN_EMAIL) {
        console.warn("NEXT_PUBLIC_ADMIN_EMAIL environment variable not set.");
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Check if the logged-in user's email matches the admin email.
      setIsAdmin(!!user && user.email === ADMIN_EMAIL);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
