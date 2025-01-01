import React, { useState } from 'react';
import PatientSignup from './PatientSignup';
import DoctorSignup from './DoctorSignup';

const Signup = () => {
  const [userType, setUserType] = useState('');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
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

      <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-md w-full bg-opacity-90 mt-8 mb-8 z-20">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-sm text-left font-medium text-white">
            Select User Type:
          </label>
          <select
            name="userType"
            value={userType}
            onChange={handleUserTypeChange}
            className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
            required
          >
            <option value="">Select</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {userType === 'patient' && <PatientSignup />}
        {userType === 'doctor' && <DoctorSignup />}
      </div>
    </div>
  );
};

export default Signup;

