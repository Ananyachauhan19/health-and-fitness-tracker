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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        <div className="text-center space-y-8 mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 tracking-tight">
            Welcome
            {userName && (
              <>
                , <span className="text-yellow-500">{userName}</span>
              </>
            )}{" "}
            to Your Health & Fitness Journey
          </h1>
          <div className="space-y-6">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              This platform is designed to help you take charge of your health and
              wellness. Track your workouts, monitor your calories, keep an eye on
              your progress, and get AI-powered recommendations tailored to your
              goals.
            </p>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              Whether you're aiming to gain strength, lose weight, or simply live
              healthier — we're here to guide you every step of the way.
            </p>
            <div className="pt-6">
              <Link
                href="/profile"
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-blue-800"
              >
                Update Your Profile
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl mb-12 backdrop-filter backdrop-blur-lg bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
          <div className="p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-8 text-center">
              We Value Your Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200" htmlFor="feedback">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={feedback}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                  rows="4"
                  required
                ></textarea>
              </div>

              {status && (
                <p className={`text-center font-medium text-sm ${status.includes('thank') ? 'text-green-500' : 'text-red-500'} animate-fade-in`}>
                  {status}
                </p>
              )}

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {feedbackList.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-8">
                Recent Feedbacks
              </h3>
              <div className="space-y-6 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                {feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-800 flex items-center gap-2">
                          {fb.name}
                          <span className="text-gray-500 text-sm">({fb.email})</span>
                        </p>
                        <p className="text-gray-700">{fb.feedback}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(fb.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
