import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ data }) {
  // Today's summary data
  const todayData = {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat', 'Water', 'Sleep'],
    datasets: [{
      label: 'Today\'s Progress',
      data: [
        data?.today?.totalCalories || 0,
        data?.today?.totalProtein || 0,
        data?.today?.totalCarbs || 0,
        data?.today?.totalFat || 0,
        data?.today?.waterIntake || 0,
        data?.today?.sleepHours || 0
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ],
      borderWidth: 1
    }]
  };

  // 10-day comparison data
  const tenDayData = {
    labels: data?.lastTenDays?.map(day => day.date) || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: data?.lastTenDays?.map(day => day.weight) || [],
        borderColor: 'rgb(75, 192, 192)',
        yAxisID: 'y',
        tension: 0.1
      },
      {
        label: 'Calories',
        data: data?.lastTenDays?.map(day => day.calories) || [],
        borderColor: 'rgb(255, 99, 132)',
        yAxisID: 'y1',
        tension: 0.1
      },
      {
        label: 'Sleep (hours)',
        data: data?.lastTenDays?.map(day => day.sleep) || [],
        borderColor: 'rgb(153, 102, 255)',
        yAxisID: 'y2',
        tension: 0.1
      }
    ]
  };

  // Mood and wellness data
  const moodData = {
    labels: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'],
    datasets: [{
      data: data?.today?.moodDistribution || [0, 0, 0, 1, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Current Weight</h3>
          <p className="text-3xl font-bold text-blue-600">
            {data?.currentWeight || '--'} kg
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Today's Calories</h3>
          <p className="text-3xl font-bold text-green-600">
            {data?.today?.totalCalories || '--'} cal
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Sleep Quality</h3>
          <p className="text-3xl font-bold text-purple-600">
            {data?.today?.sleepQuality || '--'}/5
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Workout Status</h3>
          <p className="text-3xl font-bold text-orange-600">
            {data?.today?.workoutComplete ? '✓' : '–'}
          </p>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
          <Bar 
            data={todayData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Today's Mood</h3>
          <Doughnut data={moodData} />
        </div>
      </div>

      {/* 10-Day Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">10-Day Overview</h3>
        <Line 
          data={tenDayData}
          options={{
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Weight (kg)'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Calories'
                },
                grid: {
                  drawOnChartArea: false,
                }
              },
              y2: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Sleep (hours)'
                },
                grid: {
                  drawOnChartArea: false,
                }
              },
            }
          }}
        />
      </div>
    </div>
  );
}