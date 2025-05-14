"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { db, auth, listenToUserData } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    occupation: "",
    course: "",
    exerciseLevel: "",
    sleepDuration: "",
  });

  const additionalHealthMetrics = {
    bloodPressure: '',
    restingHeartRate: '',
    bodyFat: '',
    bodyType: '',
    medicalConditions: [],
    allergies: [],
    fitnessGoals: [],
    dietaryRestrictions: [],
    activityLevel: '',
    stressLevel: '',
    sleepQuality: '',
    recoveryRate: ''
  };

  // Auth state and redirect if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setFormData(snap.data());
        }
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, formData, { merge: true });
      setEditMode(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-10">
          Profile Settings
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Details</h2>
          <div className="space-y-4">
            <p className="flex items-center text-gray-700">
              <span className="font-semibold w-24">Name:</span>
              <span className="text-gray-900">{user?.displayName || "N/A"}</span>
            </p>
            <p className="flex items-center text-gray-700">
              <span className="font-semibold w-24">Email:</span>
              <span className="text-gray-900">{user?.email}</span>
            </p>
            <p className="flex items-center text-gray-700">
              <span className="font-semibold w-24">User ID:</span>
              <span className="text-gray-500 text-sm font-mono">{user?.uid}</span>
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(formData).map((field) => (
              <div key={field} className="group">
                <label className="block font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    editMode 
                      ? "border-blue-500 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      : "border-gray-300 bg-gray-50"
                  } transition-all duration-200`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
