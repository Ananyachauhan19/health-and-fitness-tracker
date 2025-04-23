"use client";
import React, { useEffect, useState } from "react";
import {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
  auth,
} from "../lib/firebase";
import { serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
const HomePage = () => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const data = await getFeedbacks();
    setFeedbackList(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "feedback") setFeedback(value);
    else if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !feedback) {
      setStatus("All fields are required!");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    const feedbackData = {
      name,
      email,
      feedback,
      timestamp: serverTimestamp(),
    };

    try {
      await addFeedback(feedbackData);
      setStatus("Thank you for your feedback!");
      setFeedback("");
      setName("");
      setEmail("");
      fetchFeedbacks();
    } catch (error) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteFeedback(id);
    fetchFeedbacks();
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          Welcome
          {userName && (
            <>
              , <span className="text-yellow-900">{userName}</span>
            </>
          )}{" "}
          to Your Health & Fitness Journey
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          This platform is designed to help you take charge of your health and
          wellness. Track your workouts, monitor your calories, keep an eye on
          your progress, and get AI-powered recommendations tailored to your
          goals.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Whether you’re aiming to gain strength, lose weight, or simply live
          healthier — we’re here to guide you every step of the way.
        </p>
        <p className="text-lg text-gray-800 font-medium mt-8 mb-10">
          To begin your journey, let us know more about you. Kindly go to update
          your profile.
        </p>
        <Link
          href="/profile"
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Click here to navigate to your profile
        </Link>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mt-10 shadow mb-10">
        <h2 className="text-xl font-semibold mb-3 text-center">
          We Value Your Feedback
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700" htmlFor="feedback">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={feedback}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
              rows="3"
              required
            ></textarea>
          </div>

          {status && (
            <p className="text-center text-sm text-red-500 mb-2">{status}</p>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {feedbackList.length > 0 && (
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Feedbacks</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="bg-white p-4 mb-4 shadow rounded relative"
              >
                <p className="font-semibold">
                  {fb.name} ({fb.email})
                </p>
                <p className="text-gray-700 mt-1">{fb.feedback}</p>
                <button
                  onClick={() => handleDelete(fb.id)}
                  className="absolute top-2 right-2 text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
