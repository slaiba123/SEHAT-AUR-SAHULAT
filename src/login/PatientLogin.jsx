import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './doc1.jpg';

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in the patients collection
      const userDoc = await getDoc(doc(db, 'patients', user.uid));

      if (userDoc.exists()) {
        alert(`Logged in as Patient: ${user.email}`);
        navigate('/Login'); // Redirect to patient's dashboard
      } else {
        alert('Patient account not found. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in as Patient:', error);
      alert('Failed to log in as Patient. Please check your credentials.');
    }
  };

  return (
    // <div className="flex justify-center items-center min-h-screen max-w-sm mx-auto bg-[#232946]">
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-md w-full bg-opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">Patient Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Email:</label>
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
            <label className="block text-sm font-medium text-white-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#eebbc3] text-black font-bold py-2 rounded-md hover:bg-[#95686f] transition-colors">
            Log In as Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;

