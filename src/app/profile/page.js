'use client';
import { getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ticketHistory = [
    { flight: 'AI203', from: 'Delhi', to: 'London', date: '2024-12-05', status: 'Completed' },
    { flight: 'EK503', from: 'Dubai', to: 'New York', date: '2024-11-22', status: 'Completed' },
  ];

  const currentBookings = [
    { flight: 'QR728', from: 'Doha', to: 'Paris', date: '2025-04-25', status: 'Confirmed' },
  ];

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push('/'); 
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <p><strong>Name:</strong> {user?.displayName || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.uid}</p>
      </div>
    </div>
  );
}
