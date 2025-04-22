import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCza5MXXRNA1NTbhd_DNZo_aEmv6YcZOdU",
    authDomain: "health-and-fitness-track-ba83b.firebaseapp.com",
    projectId: "health-and-fitness-track-ba83b",
    storageBucket: "health-and-fitness-track-ba83b.firebasestorage.app",
    messagingSenderId: "916895725571",
    appId: "1:916895725571:web:23cc6601a34adbe097f636",
    measurementId: "G-ZQHDH8SE3T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

const addFeedback = async (feedback) => {
  const docRef = await addDoc(collection(db, "feedback"), feedback);
  return docRef.id;
};

export { auth, googleProvider, db, addFeedback };
