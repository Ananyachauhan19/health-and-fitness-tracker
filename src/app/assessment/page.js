'use client';
import { useState } from 'react';

export default function WeeklyAssessment() {
  const [assessment, setAssessment] = useState({
    energyLevels: {
      morning: 1,
      afternoon: 1,
      evening: 1
    },
    moodTracking: {
      overall: 1,
      stress: 1,
      motivation: 1
    },
    physicalWellness: {
      muscularSoreness: 1,
      jointPain: 1,
      flexibility: 1,
      endurance: 1
    },
    recoveryMetrics: {
      sleepQuality: 1,
      fatigue: 1,
      appetite: 1
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Weekly Wellness Assessment</h1>
      
      {/* Energy Levels Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Energy Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(assessment.energyLevels).map(timeOfDay => (
            <div key={timeOfDay} className="p-4 bg-white rounded-xl shadow">
              <label className="block mb-2 capitalize">{timeOfDay}</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={assessment.energyLevels[timeOfDay]}
                onChange={(e) => setAssessment(prev => ({
                  ...prev,
                  energyLevels: {
                    ...prev.energyLevels,
                    [timeOfDay]: parseInt(e.target.value)
                  }
                }))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Add similar sections for mood, physical wellness, and recovery metrics */}
    </div>
  );
}