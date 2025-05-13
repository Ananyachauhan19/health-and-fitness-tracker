"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import Link from 'next/link';

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import TodayChart from "@/components/TodayChart";
import Last10DaysChart from "@/components/Last10DaysChart";

export default function DailyLog() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    date: "",
    wakeTime: "",
    waterIntake: "",
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
    exercise: "",
    exerciseTime: "",
    sleepTime: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchLogs(currentUser.uid);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first.");

    try {
      await addDoc(collection(db, "logs"), {
        ...form,
        userId: user.uid,
        timestamp: new Date(),
      });
      alert("Log saved!");
      router.push("/recommendation");
      fetchLogs(user.uid);
    } catch (err) {
      console.error("Error saving log:", err);
    }
  };

  const fetchLogs = async (uid) => {
    const q = query(
      collection(db, "logs"),
      where("userId", "==", uid),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());
    setLogs(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Daily Health Log
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="time"
          name="wakeTime"
          placeholder="Wake Up Time"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="waterIntake"
          placeholder="Water Intake (in L)"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="breakfast"
          placeholder="Breakfast"
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="lunch"
          placeholder="Lunch"
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="snacks"
          placeholder="Snacks"
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="dinner"
          placeholder="Dinner"
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="exercise"
          placeholder="Exercise"
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="exerciseTime"
          placeholder="Exercise Duration (min)"
          onChange={handleChange}
          className="input"
        />
        <input
          type="time"
          name="sleepTime"
          placeholder="Sleep Time"
          onChange={handleChange}
          className="input"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Save Log
        </button>
      </form>
      <Link href="/recommendation">
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          View Today's Recommendations
        </button>
      </Link>

      <div className="mt-10">
        <TodayChart />
        <Last10DaysChart />
      </div>
    </div>
  );
}
