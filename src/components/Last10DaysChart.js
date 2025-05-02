"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Last10DaysChart({ logs = [] }) {
  const data = logs
    ?.slice(-10)
    .map((log) => ({
      date: log.date,
      water: Number(log.waterIntake) || 0,
      exercise: Number(log.exerciseTime) || 0,
    }));

  return (
    <div className="bg-white p-4 mt-8 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-green-600">
        Last 10 Days Overview
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="water" stroke="#3b82f6" name="Water (L)" />
            <Line type="monotone" dataKey="exercise" stroke="#10b981" name="Exercise (min)" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No data to display yet.</p>
      )}
    </div>
  );
}
