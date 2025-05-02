'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This will ensure the component only renders on the client side
    setMounted(true);

    // Set user state based on Firebase auth state
    const unsubscribe = auth.onAuthStateChanged(setUser);
    
    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!mounted) {
    return null; // Prevent rendering on SSR
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex gap-6 mx-auto">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/about">About</Link>
        <Link href="/support">Support</Link>
        <Link href="/daily-input">DailyLog</Link>
      </div>

      {user ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      ) : (
        <Link href="/login">
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}
