'use client';
import { useEffect, useState } from 'react';
// import CarouselComponent from '../components/CarouselComponent'; // Correct relative path
import { addFeedback, db } from '../lib/firebase';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  useEffect(() => {
    const fetchFeedback = async () => {
      const querySnapshot = await getDocs(collection(db, "feedback"));
      const feedbackList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmittedFeedback(feedbackList);
    };

    fetchFeedback();
  }, []);

  const handleChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const feedbackId = await addFeedback(feedback);
      setSubmittedFeedback(prev => [...prev, { ...feedback, id: feedbackId }]);
      toast.success("Feedback submitted successfully!");
      setFeedback({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error("Failed to submit feedback.");
    }
  };


  return (
    <div className="w-full">
      {/* <CarouselComponent /> */}

      <div className="text-center mt-10 px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Health and Fitness Tracker</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
          Our platform helps you find the best health dail routine based on real-time trends,
          personalized recommendations, and smart tracking features. 
        </p>
      </div>

       <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={feedback.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={feedback.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded"
        />
        <textarea
          name="message"
          placeholder="Your Feedback"
          value={feedback.message}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>
      </form>

      {/* Display Feedback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-6"
      >
        <h3 className="text-xl font-semibold">Submitted Feedback:</h3>
        <ul className="space-y-4">
          {submittedFeedback.map(item => (
            <li key={item.id} className="p-4 border border-gray-300 rounded">
              <p><strong>{item.name}</strong> ({item.email})</p>
              <p>{item.message}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
