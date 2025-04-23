"use client";
import { getRedirectResult } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, listenToUserData  } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ticketHistory = [
    {
      flight: "AI203",
      from: "Delhi",
      to: "London",
      date: "2024-12-05",
      status: "Completed",
    },
    {
      flight: "EK503",
      from: "Dubai",
      to: "New York",
      date: "2024-11-22",
      status: "Completed",
    },
  ];

  const currentBookings = [
    {
      flight: "QR728",
      from: "Doha",
      to: "Paris",
      date: "2025-04-25",
      status: "Confirmed",
    },
  ];

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        listenToUserData(currentUser.uid, setUserData);
      }
    });
    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <p>
          <strong>Name:</strong> {user?.displayName || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>User ID:</strong> {user?.uid}
        </p>
      </div>

      <Link href="/update-profile">
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300">
          Fill / Update Profile Information
        </button>
      </Link>

      <div className="space-y-2">
        <p><strong>Age:</strong> {userData.age}</p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>Weight:</strong> {userData.weight} kg</p>
        <p><strong>Height:</strong> {userData.height} cm</p>
        <p><strong>Status:</strong> {userData.status}</p>
        <p><strong>Profession/Course:</strong> {userData.profession}</p>
        <p><strong>Exercise Level:</strong> {userData.exercise}</p>
        <p><strong>Sleep Duration:</strong> {userData.sleep} hrs</p>
      </div>
      <Link href="/profile/update">
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Update Info
        </button>
      </Link>
      
    </div>
  );
}
