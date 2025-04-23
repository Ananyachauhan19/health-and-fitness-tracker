"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, getUserData } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

export default function UpdateProfile() {

  const [form, setform] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    status: "",
    profession: "",
    exerciseLevel: "",
    sleep: ""
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            setform({
              age: userData.age || "",
              gender: userData.gender || "",
              weight: userData.weight || "",
              height: userData.height || "",
              status: userData.status || "",
              profession: userData.profession || "",
              exerciseLevel: userData.exerciseLevel || "",
              sleep: userData.sleep || "",
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        console.log("No user is signed in.");
      }
    });
  
    return () => unsubscribe(); 
  }, []);

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        if (isNaN(form.age) || isNaN(form.weight) || isNaN(form.height) || isNaN(form.sleep)) {
          toast.error("Age, weight, height, and sleep must be numbers");
          return;
        }
        await saveUserData(user.uid, form);
        toast.success("Profile updated successfully!");
        router.push("/profile");
      } catch (error) {
        toast.error("Update failed. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-4">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-lg mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="Student">Student</option>
            <option value="Job">Job</option>
            <option value="Nothing">Nothing</option>
          </select>
        </div>
        <div>
          <label className="block text-lg mb-2">Profession / Course Name</label>
          <input
            type="text"
            name="profession"
            value={form.profession}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Exercise Level</label>
          <select
            name="exerciseLevel"
            value={form.exerciseLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Exercise Level</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-lg mb-2">Sleep (hours)</label>
          <input
            type="number"
            name="sleep"
            value={form.sleep}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
