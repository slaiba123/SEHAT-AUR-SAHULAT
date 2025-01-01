import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';


const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const { email, password, name, phone, dateOfBirth } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        dateOfBirth: formData.dateOfBirth,
      };

      await setDoc(doc(db, 'patient', user.uid), userData);

      console.log("Patient account created successfully:", userData);
      alert('Patient signup successful!');
      navigate('/Login');
    } catch (error) {
      console.error('Error during patient signup:', error.message);
      alert(`Failed to sign up: ${error.message}`);
    }
  };

  return (
    // <div className="flex justify-center items-center min-h-screen max-w-md mx-auto bg-[#232946]">
    // <div
    //   className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
    //   // style={{ backgroundImage: `url(${backgroundImage})` }}
    //   >
      <div className="bg-customNavyBlue p-6 rounded-lg shadow-md max-w-xl w-full bg-opacity-50">
        {/* <h2 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">PATIENT SIGNUP</h2> */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-white">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-white">Email:</label>
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
            <label className="block text-sm text-left font-medium text-white">Password:</label>
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
            <label className="block text-sm text-left font-medium text-white">Date of Birth:</label>
              <input
                type="date" // Use "date" type for date input
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
                required
              />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-white">Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
              placeholder="Enter your phone number (e.g., +92XXXXXXXXXX)"
              pattern="^\+92[0-9]{10}$" // Regex for +92 followed by 10 digits
              title="Please enter a valid Pakistani phone number starting with +92 followed by 10 digits."
            />
          </div>
          <button type="submit" 
          className="w-full py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
          >
            Sign Up as Patient
          </button>
        </form>
      </div>
    // </div>
  );
};

export default PatientSignup;


