import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginAs, setLoginAs] = useState('patient'); // Default to 'patient'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginAsChange = (e) => {
    setLoginAs(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (loginAs === 'Administrator') {
      // Admin login validation with Firestore
      const q = query(collection(db, 'admin'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const storedPassword = adminDoc.data().password;

        if (storedPassword === password) {
          alert(`Logged in as Administrator: ${email}`);
          navigate('/AdminPage'); // Replace with actual admin dashboard route
        } else {
          alert('Incorrect password.');
        }
      } else {
        alert('Administrator account not found.');
      }
    } else {
      // Firebase authentication for doctor and patient
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check user collection based on loginAs
        const collectionName = loginAs === 'doctor' ? 'doctors' : 'patient';
        const userDoc = await getDoc(doc(db, collectionName, user.uid));

        if (userDoc.exists()) {
          alert(`Logged in as ${loginAs.charAt(0).toUpperCase() + loginAs.slice(1)}: ${user.email}`);
          const historyPage = loginAs === 'doctor' ? '/P_WPage' : '/PatientDashboard';
          navigate(historyPage);
        } else {
          alert(`${loginAs.charAt(0).toUpperCase() + loginAs.slice(1)} account not found.`);
        }
      } catch (error) {
        console.error(`Error logging in as ${loginAs}:`, error);
        alert(`Failed to log in as ${loginAs}. Please check your credentials.`);
      }
    }
  };

  const handleForgotPassword = async () => {
    const auth = getAuth();
    if (!formData.email) {
      alert("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    // <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat bg-white">
    <div className="relative min-h-screen flex justify-center items-center bg-black">
      {/* Video Background */}
      <video
        src="/assets/bg_video1.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
        playsInline
      />
      {/* Overlay for a dark tint */}
      <div className="absolute inset-0 bg-black opacity-50 z-10 backdrop-blur-lg"></div>

      <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-md w-full bg-opacity-90 z-20 ">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">
          {loginAs.charAt(0).toUpperCase() + loginAs.slice(1)} Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Login As:</label>
            <select
              value={loginAs}
              onChange={handleLoginAsChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
          >
            Log In as {loginAs.charAt(0).toUpperCase() + loginAs.slice(1)}
          </button>
        </form>
        <div className="text-center mt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
            className="text-[#eebbc3] hover:text-[#95686f] transition-colors cursor-pointer"
           >
            Forgot Password?
          </a>
        </div>
        <div className="text-center mt-4">
          <p className="text-[#b8c1ec]">Don't have an account?</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="/Signup" className="text-[#eebbc3] hover:text-[#95686f] transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


















