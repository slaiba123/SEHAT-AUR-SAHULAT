// src/context/DoctorContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const DoctorContext = createContext();

// Provider component
export const DoctorProvider = ({ children }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);

  };

  return (
    <DoctorContext.Provider value={{ selectedDoctor, handleDoctorSelect }}>
      {children}
    </DoctorContext.Provider>
  );
};


export const useDoctorContext = () => {
  return useContext(DoctorContext);
};