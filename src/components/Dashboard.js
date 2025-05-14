import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ data }) {
  const weightData = {
    labels: data?.weight?.map(w => w.date) || [],
    datasets: [{
      label: 'Weight Progress',
      data: data?.weight?.map(w => w.value) || [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const calorieData = {
    labels: data?.calories?.map(c => c.date) || [],
    datasets: [{
      label: 'Daily Calories',
      data: data?.calories?.map(c => c.value) || [],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Current Weight</h3>
          <p className="text-3xl font-bold text-blue-600">
            {data?.currentWeight || '--'} kg
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Daily Avg. Calories</h3>
          <p className="text-3xl font-bold text-green-600">
            {data?.avgCalories || '--'} cal
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Workout Streak</h3>
          <p className="text-3xl font-bold text-purple-600">
            {data?.workoutStreak || 0} days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
          <Line data={weightData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Calorie Intake</h3>
          <Line data={calorieData} />
        </div>
      </div>
    </div>
  );
}