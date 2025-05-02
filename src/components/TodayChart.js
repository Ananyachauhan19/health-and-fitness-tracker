"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TodayChart({ logs = [] }) {
  const today = new Date().toISOString().split("T")[0];
  const todayLog = logs?.find((log) => log.date === today);

  const data = todayLog
    ? [
        { metric: "Water (L)", value: Number(todayLog.waterIntake) || 0 },
        { metric: "Exercise (min)", value: Number(todayLog.exerciseTime) || 0 },
      ]
    : [];

  return (
    <div className="bg-white p-4 mt-8 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Today’s Summary</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No data for today yet.</p>
      )}
    </div>
  );
}
