'use client';

import WorkoutPlanner from '@/components/WorkoutPlanner';

export default function WorkoutPlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Workout Planner
        </h1>
        <WorkoutPlanner />
      </div>
    </div>
  );
}