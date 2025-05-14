'use client';
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';

export default function Recommendation() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setError("Please log in to see recommendations");
        setLoading(false);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const generateAdvice = async () => {
      if (!user) return;

      try {
        // Get user profile
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (!profileSnap.exists()) {
          setError("Please complete your profile first");
          setLoading(false);
          return;
        }

        const profile = profileSnap.data();
        console.log("Profile data:", profile); // Debug log

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

        const fetchLog = async (dateStr) => {
          const logQuery = query(
            collection(db, 'logs'),
            where('userId', '==', user.uid),
            where('date', '==', dateStr)
          );
          const snap = await getDocs(logQuery);
          return snap.empty ? null : snap.docs[0].data();
        };

        const logToday = await fetchLog(formatDate(today));
        const logYesterday = await fetchLog(formatDate(yesterday));

        console.log("Today's log:", logToday); // Debug log
        console.log("Yesterday's log:", logYesterday); // Debug log

        const tips = [];

        // Add default recommendations even if no logs exist
        tips.push("✨ General Health Tips:");
        tips.push("💧 Aim to drink 2-3 liters of water daily");
        tips.push("🏃‍♀️ Try to exercise for at least 30 minutes");
        tips.push("🛌 Get 7-8 hours of sleep each night");
        tips.push("🥗 Maintain a balanced diet with plenty of vegetables");

        if (logToday) {
          // Add specific recommendations based on today's log
          if (parseFloat(logToday.waterIntake || 0) < 2) {
            tips.push("💧 Your water intake is low. Try to drink more water.");
          }

          if (parseInt(logToday.exerciseTime || 0) < 30) {
            tips.push("🏃‍♀️ You haven't reached 30 minutes of exercise today.");
          }

          // Compare with yesterday if data exists
          if (logYesterday) {
            const waterComparison = compareMetric("Water Intake", logToday.waterIntake, logYesterday.waterIntake, "L");
            const exerciseComparison = compareMetric("Exercise Time", logToday.exerciseTime, logYesterday.exerciseTime, "min");
            
            tips.push("📊 Daily Comparison:");
            tips.push(waterComparison);
            tips.push(exerciseComparison);
          }
        }

        setAdvice(tips);
        setLoading(false);
      } catch (err) {
        console.error("Error generating advice:", err);
        setError("Failed to generate recommendations. Please try again.");
        setLoading(false);
      }
    };

    if (user) {
      generateAdvice();
    }
  }, [user]);

  const compareMetric = (label, todayVal, yestVal, unit) => {
    const t = parseFloat(todayVal || 0);
    const y = parseFloat(yestVal || 0);
    if (t > y) return `${label}: ↑ Improved (+${(t - y).toFixed(1)} ${unit})`;
    if (t < y) return `${label}: ↓ Decreased (-${(y - t).toFixed(1)} ${unit})`;
    return `${label}: → No change`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Your Personalized Health Insights</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
      ) : (
        <div className="grid gap-6">
          {advice.map((tip, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
