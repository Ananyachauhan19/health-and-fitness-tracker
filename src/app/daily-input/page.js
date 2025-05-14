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
  const [calorieInfo, setCalorieInfo] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
    total: 0
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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Update calorie calculations for food inputs
    if (['breakfast', 'lunch', 'dinner', 'snacks'].includes(name)) {
      const updatedMeals = {
        ...form,
        [name]: value
      };
      const calories = calculateDailyCalories(updatedMeals);
      setCalorieInfo(calories);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Daily Health Log
        </h1>

        {/* Calorie Summary */}
        <div className="mb-8 p-4 bg-blue-50 rounded-xl">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Calorie Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Breakfast</p>
              <p className="text-lg font-semibold">{calorieInfo.breakfast} cal</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Lunch</p>
              <p className="text-lg font-semibold">{calorieInfo.lunch} cal</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Dinner</p>
              <p className="text-lg font-semibold">{calorieInfo.dinner} cal</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Snacks</p>
              <p className="text-lg font-semibold">{calorieInfo.snacks} cal</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-bold text-blue-900">
              Total Daily Calories: {calorieInfo.total}
            </p>
          </div>
        </div>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wake Up Time (24-hour format)</label>
            <input
              type="time"
              name="wakeTime"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <span className="text-xs text-gray-500">Example: 07:00 for 7 AM, 22:00 for 10 PM</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bedtime (24-hour format)</label>
            <input
              type="time"
              name="sleepTime"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <span className="text-xs text-gray-500">Example: 23:00 for 11 PM</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (Liters)</label>
            <input
              type="number"
              step="0.1"
              name="waterIntake"
              placeholder="e.g., 2.5"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Duration (minutes)</label>
            <input
              type="number"
              name="exerciseTime"
              placeholder="e.g., 30"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
            <input
              type="text"
              name="exercise"
              placeholder="e.g., Running, Yoga"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast</label>
            <input
              type="text"
              name="breakfast"
              placeholder="What did you eat?"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lunch</label>
            <input
              type="text"
              name="lunch"
              placeholder="What did you eat?"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dinner</label>
            <input
              type="text"
              name="dinner"
              placeholder="What did you eat?"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Snacks</label>
            <input
              type="text"
              name="snacks"
              placeholder="Any snacks?"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="md:col-span-2 flex gap-4 justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Save Log
            </button>
            
            <Link href="/recommendation">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                View Recommendations
              </button>
            </Link>
          </div>
        </form>

        <div className="mt-12 space-y-8">
          <TodayChart />
          <Last10DaysChart />
        </div>
      </div>
    </div>
  );
}
