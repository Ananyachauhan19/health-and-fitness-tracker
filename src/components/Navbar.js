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
    <nav className="bg-white shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-95 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Health Tracker
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Home</Link>
            <Link href="/profile" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Profile</Link>
            <Link href="/daily-input" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Daily Log</Link>
            <Link href="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Dashboard</Link>
            <Link href="/workout-planner" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Workouts</Link>
            <Link href="/meal-planner" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Meal Plans</Link>
            <Link href="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">About</Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <button className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
