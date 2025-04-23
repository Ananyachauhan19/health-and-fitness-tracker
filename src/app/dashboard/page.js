'use client';
import DashboardCard from '@/components/DashboardCard';

export default function Dashboard() {

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome {user ? user.email : 'Guest'} 👋</h1>

      {user && !profile && (
        <div className="text-center text-lg text-gray-500">
          <p>Let’s get to know you first!</p>
          <a href="/onboarding" className="text-blue-500 hover:underline">
            Complete your profile
          </a>
        </div>
      )}

      {user && profile && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Overview</h2>
          {Object.entries(profile).map(([key, value]) => (
            <DashboardCard key={key} label={key} value={value} />
          ))}
        </div>
      )}
    </div>
  );
}
