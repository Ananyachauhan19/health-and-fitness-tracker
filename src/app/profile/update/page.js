"use client";
import { useEffect, useState } from "react";
import { auth, getUserData, saveUserData } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function UpdateProfile() {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    status: "",
    profession: "",
    exercise: "",
    sleep: ""
  });
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserData(user.uid);
        if (data) setForm(data);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      await saveUserData(user.uid, form);
      router.push("/profile");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["age", "gender", "weight", "height", "status", "profession", "exercise", "sleep"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save and Go to Profile
        </button>
      </form>
    </div>
  );
}
