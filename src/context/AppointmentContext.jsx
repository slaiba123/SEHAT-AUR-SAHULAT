// AppointmentContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const AppointmentContext = createContext();

// Context provider component
export const AppointmentProvider = ({ children }) => {
  const [appointmentDateTime, setAppointmentDateTime] = useState(null);

  return (
    <AppointmentContext.Provider value={{ appointmentDateTime, setAppointmentDateTime }}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the context

export const useAppointmentContext = () => {
  return useContext(AppointmentContext);
};
