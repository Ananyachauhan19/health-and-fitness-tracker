'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const logsRef = collection(db, 'logs');
        const q = query(logsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const logs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Process logs for dashboard
        const processedData = {
          currentWeight: logs[logs.length - 1]?.weight || 0,
          avgCalories: Math.round(
            logs.reduce((acc, log) => acc + (log.calories?.total || 0), 0) / logs.length
          ),
          workoutStreak: calculateWorkoutStreak(logs),
          weight: logs.map(log => ({
            date: log.date,
            value: log.weight
          })),
          calories: logs.map(log => ({
            date: log.date,
            value: log.calories?.total || 0
          }))
        };

        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Your Health Dashboard
        </h1>
        <Dashboard data={data} />
      </div>
    </div>
  );
}

function calculateWorkoutStreak(logs) {
  let streak = 0;
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].exerciseTime > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}