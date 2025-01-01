// // File: DoctorDataContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { db, auth } from "../firebase";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// const DoctorDataContext = createContext();

// export const DoctorDataProvider = ({ children }) => {
//   const [doctorName, setDoctorName] = useState("");
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     const fetchDoctorInfo = async () => {
//       try {
//         const user = auth.currentUser; // Get the logged-in user
//         if (user) {
//           const doctorDocRef = doc(db, "doctors", user.uid);
//           const doctorDoc = await getDoc(doctorDocRef);

//           if (doctorDoc.exists()) {
//             setDoctorName(doctorDoc.data().name);

//             // Fetch consulted patients
//             const doctorId = `doctors/${user.uid}`;
//             const q = query(
//               collection(db, "patient"),
//               where("DoctorID", "==", doctorId)
//             );
//             const querySnapshot = await getDocs(q);
//             const patientList = querySnapshot.docs.map((doc) => doc.data());

//             setPatients(patientList);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching doctor info:", error);
//       }
//     };

//     fetchDoctorInfo();
//   }, []);

//   return (
//     <DoctorDataContext.Provider value={{ doctorName, patients }}>
//       {children}
//     </DoctorDataContext.Provider>
//   );
// };

// export const useDoctorDataContext = () => {
//   return useContext(DoctorDataContext);
// };

import React, { createContext, useState, useContext } from "react";

// Create the context
const DoctorDataContext = createContext();

// Custom hook to use the context
export const useDoctorData = () => useContext(DoctorDataContext);

// Context Provider
export const DoctorDataProvider = ({ children }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State for the selected doctor
  

  return (
    <DoctorDataContext.Provider value={{ selectedDoctor, setSelectedDoctor }}>
      {children}
    </DoctorDataContext.Provider>
  );
};


export const useDoctorDataContext = () => {
  return useContext(DoctorDataContext);
};
