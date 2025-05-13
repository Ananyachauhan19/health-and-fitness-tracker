'use client';
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function Recommendation() {
  const [advice, setAdvice] = useState([]);

  useEffect(() => {
    const generateAdvice = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const profileRef = doc(db, 'profiles', user.uid);
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) return;
  const profile = profileSnap.data();

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

  if (!logToday) return setAdvice(["No log for today."]);

  const tips = [];

  // Daily comparison logic
  const waterComparison = compareMetric("Water Intake", logToday.waterIntake, logYesterday?.waterIntake, "L");
  const exerciseComparison = compareMetric("Exercise Time", logToday.exerciseTime, logYesterday?.exerciseTime, "min");
  const sleepComparison = compareMetric("Sleep Duration", logToday.sleepTime, logYesterday?.sleepTime, "hrs");

  // Add the comparisons to the tips
  tips.push("✅ You're doing great today! Keep it up!");
  tips.push("📊 Daily Comparison:");
  tips.push(waterComparison);
  tips.push(exerciseComparison);
  tips.push(sleepComparison);

  // Add advice tips based on logic
  if (parseFloat(logToday.waterIntake || 0) < 2)
    tips.push("💧 Drink at least 2L of water today.");

  if (parseInt(logToday.exerciseTime || 0) < 30)
    tips.push("🏃‍♀️ Try to exercise for at least 30 minutes.");

  const sleepHours = getSleepHours(logToday.sleepTime, logToday.wakeTime);
  if (sleepHours < 7)
    tips.push("🛌 Aim for at least 7 hours of sleep.");

  if (!logToday.breakfast || !logToday.lunch || !logToday.dinner)
    tips.push("🍱 Avoid skipping major meals like breakfast, lunch, or dinner.");

  const bmi = calculateBMI(profile.weight, profile.height);
  if (bmi < 18.5)
    tips.push("📈 Your BMI suggests you're underweight. Consider a healthy weight gain plan.");
  else if (bmi > 24.9)
    tips.push("📉 Your BMI is above the normal range. Consider more physical activity and a balanced diet.");

  setAdvice(tips.length ? tips : ["✅ You're doing great today! Keep it up!"]);
};


    generateAdvice();
  }, []);

  const getSleepHours = (sleep, wake) => {
  if (!sleep || !wake) return 0;
  const [sH, sM] = sleep.split(":").map(Number);
  const [wH, wM] = wake.split(":").map(Number);
  return ((24 + wH + wM / 60 - sH - sM / 60) % 24).toFixed(1);
};

const calculateBMI = (weight, height) => {
  const hM = height / 100;
  return (weight / (hM * hM)).toFixed(1);
};

const compareMetric = (label, todayVal, yestVal, unit) => {
  const t = parseFloat(todayVal || 0);
  const y = parseFloat(yestVal || 0);
  if (t > y) return `${label}: ↑ Improved (+${(t - y).toFixed(1)} ${unit})`;
  if (t < y) return `${label}: ↓ Decreased (-${(y - t).toFixed(1)} ${unit})`;
  return `${label}: – No change`;
};


  return (
  <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
    <h1 className="text-2xl font-bold mb-4 text-blue-600">Today's Personalized Recommendations</h1>
    {advice.length === 0 ? (
      <p>Loading...</p>
    ) : (
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        {advice.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

}
