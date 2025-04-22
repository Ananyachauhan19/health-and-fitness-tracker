'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex gap-6 mx-auto">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/about">About</Link>
        <Link href="/support">Support</Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
