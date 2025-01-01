import React, { useState, useRef } from 'react';
import { collection, addDoc, query, where, getDocs, doc } from 'firebase/firestore';
import SignatureCanvas from 'react-signature-canvas';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDoctorContext } from '../context/DoctorContext'; // Import the context
import { useAppointmentContext } from '../context/AppointmentContext';



const Form = () => {
  const { setAppointmentDateTime } = useAppointmentContext();
  const { selectedDoctor } = useDoctorContext();  // Access selectedDoctor from context
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    appointmentDate: new Date(),
    appointmentTime: '',
  });
  console.log("Selected Doctor888:", selectedDoctor); // Debugging log

  const [selectedTime, setSelectedTime] = useState('');
  const signatureRef = useRef(null);
  const navigate = useNavigate();

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setFormData({ ...formData, appointmentDate: date });
  };

  // Check if the selected time is available
  const checkIfTimeAvailable = async (doctorId, appointmentDate, appointmentTime) => {
    const appointmentQuery = query(
      collection(db, 'appointement'),
      where('DoctorId', '==', doctorId),
      where('appointmentDateTime', '==', `${appointmentDate.toISOString()} ${appointmentTime}`)
    );

    const querySnapshot = await getDocs(appointmentQuery);
    return querySnapshot.empty; // true if no appointment exists for this time
  };

  // Handle time selection
  const handleTimeSelect = async (time) => {
    const isAvailable = await checkIfTimeAvailable(
      selectedDoctor.id,
      formData.appointmentDate,
      time
    );
    

    if (isAvailable) {
      setSelectedTime(time);
      setFormData({ ...formData, appointmentTime: time });
    } else {
      alert('The selected time is already booked. Please choose a different time.');
    }
  };

  // Get patient ID by email
  const getPatientIdByEmail = async (email) => {
    const q = query(collection(db, 'patient'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.id;
    }
    return null;
  };

  // Get hospital ID by city ID
  const getHospitalIdByCityId = async (CityId) => {
    const doctorCityId = selectedDoctor.CityId;
    const cityRef = doc(db, 'city', doctorCityId);
    const querySnapshot = await getDocs(query(collection(db, 'hos_city'), where('City_Id', '==', doctorCityId)));
    console.log(querySnapshot.empty)
    if (!querySnapshot.empty) {
      console.log("yaya",querySnapshot.docs[0].id)
      return querySnapshot.docs[0].id;
    }
   
    return null;
  };
  
  

  // Handle form submission
// Updated handleSubmit with input validation
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate form inputs
  if (!formData.firstName.trim()) {
      alert('First Name is required.');
      return;
  }
  if (!formData.lastName.trim()) {
      alert('Last Name is required.');
      return;
  }
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert('A valid Email is required.');
      return;
  }
  if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      alert('A valid 10-digit Phone Number is required.');
      return;
  }
  if (signatureRef.current.isEmpty()) {
      alert('Signature is required.');
      return;
  }

  if (!selectedDoctor) {
      alert("Please select a doctor before submitting.");
      return;
  }

  const patientId = await getPatientIdByEmail(formData.email);
  if (!patientId) {
      alert("No patient found with this email; please register first.");
      return;
  }

  const hospitalCityId = await getHospitalIdByCityId(selectedDoctor.CityId);
  if (!hospitalCityId) {
      alert("No hospital found for the selected doctor's city. Please try again.");
      return;
  }

  const appointmentDateTime = formData.appointmentDate.toISOString() + ' ' + (formData.appointmentTime || '');
  setAppointmentDateTime(appointmentDateTime);

  const appointmentData = {
      appointmentDateTime: appointmentDateTime,
      DoctorId: `${selectedDoctor.id}`,
      hos_CityId: `${hospitalCityId}`,
      PatientId: `${patientId}`,
  };

  try {
      await addDoc(collection(db, 'appointement'), appointmentData);
      alert('Appointment and patient details stored successfully!');

      // Reset form data
      setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          appointmentDate: new Date(),
          appointmentTime: '',
      });
      signatureRef.current.clear();
      setSelectedTime('');
  } catch (error) {
      console.error("Error submitting form: ", error.message || error);
      alert('Failed to store data: ' + (error.message || "Unknown error"));
  }
};

  return (
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

     {/* <div className="max-w-lg mx-auto p-6 bg-customNavyBlue shadow-md rounded-lg my-6"> */}
     <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-md w-full bg-opacity-90 z-20 mt-8 mb-8 ">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#b8c1ec] animate-typing">Book Your Appointment</h1>
      <form onSubmit={handleSubmit}>
        {/* First Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
          />
        </div>

        {/* Last Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-customHoverPink rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-customHoverPink rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
          />
        </div>

        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-customHoverPink rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
          />
        </div>

        {/* Appointment Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Appointment Date</label>
          <Calendar
            onChange={handleDateChange}
            value={formData.appointmentDate}
            minDate={new Date()} // Prevent selecting past dates
            className="custom-calendar"
          />
        </div>

        {/* Appointment Time Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Appointment Time</label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {["01:00", "02:00"].map((time) => (
              <button
                key={time}
                type="button"
                className={`w-full py-2 rounded-lg hover:bg-[#d27280] ${selectedTime === time ? 'bg-customHoverPink text-white' : 'border border-customPink'}`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Signature</label>
          <SignatureCanvas
            ref={signatureRef}
            penColor="pink"
            canvasProps={{ width: 400, height: 200, className: 'border border-customHoverPink rounded-lg' }}
          />
          <button
            type="button"
            className="mt-2 bg-customHoverPink text-white px-4 py-2 rounded-lg hover:bg-customPink"
            onClick={() => signatureRef.current.clear()}
          >
            Clear
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-customHoverPink text-white py-2 rounded-lg hover:bg-customPink"
          
        >
          Submit
        </button>
        <button
          type="button"
          className="mt-4 w-full bg-customHoverPink text-white py-2 rounded-lg hover:bg-customPink"
          onClick={() => navigate('/slip')}  // Navigate to Slip component
        >
          Go to Slip
        </button>
      </form>
    </div>
   </div>
  );
};

export default Form;






















// import React, { useState, useRef } from 'react';
// import { collection, addDoc, query, where, getDocs, doc } from 'firebase/firestore';
// import SignatureCanvas from 'react-signature-canvas';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { db } from '../firebase';
// import { useNavigate } from 'react-router-dom';
// import { useDoctorContext } from '../context/DoctorContext'; // Import the context
// import { useAppointmentContext } from '../context/AppointmentContext';



// const Form = () => {
//   const { setAppointmentDateTime } = useAppointmentContext();
//   const { selectedDoctor } = useDoctorContext();  // Access selectedDoctor from context
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     appointmentDate: new Date(),
//     appointmentTime: '',
//   });
//   console.log("Selected Doctor888:", selectedDoctor); // Debugging log

//   const [selectedTime, setSelectedTime] = useState('');
//   const signatureRef = useRef(null);
//   const navigate = useNavigate();

//   // Handle input field changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle date selection
//   const handleDateChange = (date) => {
//     setFormData({ ...formData, appointmentDate: date });
//   };

//   // Check if the selected time is available
//   const checkIfTimeAvailable = async (doctorId, appointmentDate, appointmentTime) => {
//     const appointmentQuery = query(
//       collection(db, 'appointement'),
//       where('DoctorId', '==', doctorId),
//       where('appointmentDateTime', '==', `${appointmentDate.toISOString()} ${appointmentTime}`)
//     );

//     const querySnapshot = await getDocs(appointmentQuery);
//     return querySnapshot.empty; // true if no appointment exists for this time
//   };

//   // Handle time selection
//   const handleTimeSelect = async (time) => {
//     const isAvailable = await checkIfTimeAvailable(
//       selectedDoctor.id,
//       formData.appointmentDate,
//       time
//     );
    

//     if (isAvailable) {
//       setSelectedTime(time);
//       setFormData({ ...formData, appointmentTime: time });
//     } else {
//       alert('The selected time is already booked. Please choose a different time.');
//     }
//   };

//   // Get patient ID by email
//   const getPatientIdByEmail = async (email) => {
//     const q = query(collection(db, 'patient'), where('email', '==', email));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//       const doc = querySnapshot.docs[0];
//       return doc.id;
//     }
//     return null;
//   };

//   // Get hospital ID by city ID
//   const getHospitalIdByCityId = async (CityId) => {
//     const doctorCityId = selectedDoctor.CityId;
//     const cityRef = doc(db, 'city', doctorCityId);
//     const querySnapshot = await getDocs(query(collection(db, 'hos_city'), where('City_Id', '==', doctorCityId)));
//     console.log(querySnapshot.empty)
//     if (!querySnapshot.empty) {
//       console.log("yaya",querySnapshot.docs[0].id)
//       return querySnapshot.docs[0].id;
//     }
   
//     return null;
//   };
  
  

//   // Handle form submission
// // Updated handleSubmit with input validation
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Validate form inputs
//   if (!formData.firstName.trim()) {
//       alert('First Name is required.');
//       return;
//   }
//   if (!formData.lastName.trim()) {
//       alert('Last Name is required.');
//       return;
//   }
//   if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
//       alert('A valid Email is required.');
//       return;
//   }
//   if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
//       alert('A valid 10-digit Phone Number is required.');
//       return;
//   }
//   if (signatureRef.current.isEmpty()) {
//       alert('Signature is required.');
//       return;
//   }

//   if (!selectedDoctor) {
//       alert("Please select a doctor before submitting.");
//       return;
//   }

//   const patientId = await getPatientIdByEmail(formData.email);
//   if (!patientId) {
//       alert("No patient found with this email; please register first.");
//       return;
//   }

//   const hospitalCityId = await getHospitalIdByCityId(selectedDoctor.CityId);
//   if (!hospitalCityId) {
//       alert("No hospital found for the selected doctor's city. Please try again.");
//       return;
//   }

//   const appointmentDateTime = formData.appointmentDate.toISOString() + ' ' + (formData.appointmentTime || '');
//   setAppointmentDateTime(appointmentDateTime);

//   const appointmentData = {
//       appointmentDateTime: appointmentDateTime,
//       DoctorId: `${selectedDoctor.id}`,
//       hos_CityId: `${hospitalCityId}`,
//       PatientId: `${patientId}`,
//   };

//   try {
//       await addDoc(collection(db, 'appointement'), appointmentData);
//       alert('Appointment and patient details stored successfully!');

//       // Reset form data
//       setFormData({
//           firstName: '',
//           lastName: '',
//           email: '',
//           phone: '',
//           appointmentDate: new Date(),
//           appointmentTime: '',
//       });
//       signatureRef.current.clear();
//       setSelectedTime('');
//   } catch (error) {
//       console.error("Error submitting form: ", error.message || error);
//       alert('Failed to store data: ' + (error.message || "Unknown error"));
//   }
// };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-customNavyBlue shadow-md rounded-lg my-6">
//       <h1 className="text-2xl font-bold mb-4 text-center text-customHoverPink animate-typing">Book Your Appointment</h1>
//       <form onSubmit={handleSubmit}>
//         {/* First Name Input */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
//           />
//         </div>

//         {/* Last Name Input */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-customHoverPink rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
//           />
//         </div>

//         {/* Email Input */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-customHoverPink rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
//           />
//         </div>

//         {/* Phone Number Input */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">Phone Number</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-customHoverPink rounded-lg focus:outline-none focus:ring focus:ring-customHoverPink focus:ring-offset-customPink"
//           />
//         </div>

//         {/* Appointment Date Picker */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">Appointment Date</label>
//           <Calendar
//             onChange={handleDateChange}
//             value={formData.appointmentDate}
//             minDate={new Date()} // Prevent selecting past dates
//             className="custom-calendar"
//           />
//         </div>

//         {/* Appointment Time Selection */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">Appointment Time</label>
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {["01:00", "02:00"].map((time) => (
//               <button
//                 key={time}
//                 type="button"
//                 className={`w-full py-2 rounded-lg hover:bg-[#d27280] ${selectedTime === time ? 'bg-customHoverPink text-white' : 'border border-customPink'}`}
//                 onClick={() => handleTimeSelect(time)}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Signature Canvas */}
//         <div className="mb-4">
//           <label className="block text-customHoverPink">Signature</label>
//           <SignatureCanvas
//             ref={signatureRef}
//             penColor="pink"
//             canvasProps={{ width: 400, height: 200, className: 'border border-customHoverPink rounded-lg' }}
//           />
//           <button
//             type="button"
//             className="mt-2 bg-customHoverPink text-white px-4 py-2 rounded-lg hover:bg-customPink"
//             onClick={() => signatureRef.current.clear()}
//           >
//             Clear
//           </button>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-customHoverPink text-white py-2 rounded-lg hover:bg-customPink"
          
//         >
//           Submit
//         </button>
//         <button
//           type="button"
//           className="mt-4 w-full bg-customHoverPink text-white py-2 rounded-lg hover:bg-customPink"
//           onClick={() => navigate('/slip')}  // Navigate to Slip component
//         >
//           Go to Slip
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Form;





//sahi wala
// import React, { useState, useRef } from 'react';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import SignatureCanvas from 'react-signature-canvas';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { db } from '../firebaseConfig'; // Adjust this import based on your Firebase config file

// const Form = ({ selectedDoctor }) => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     appointmentDate: new Date(), // Default to current date
//     appointmentTime: '',
//   });

//   const [selectedTime, setSelectedTime] = useState('');
//   const signatureRef = useRef(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleDateChange = (date) => {
//     setFormData({ ...formData, appointmentDate: date });
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//     setFormData({ ...formData, appointmentTime: time });
//   };

//   const getPatientIdByEmail = async (email) => {
//     const q = query(collection(db, 'patient'), where('Email', '==', email));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//       const doc = querySnapshot.docs[0];
//       return doc.id; // Return the document ID
//     }
//     return null; // Return null if no patient is found
//   };
//  // Get the city ID from selected doctor
//   const getHospitalIdByCityId = async (CityId) => {
//     const doctorCityId = selectedDoctor.CityId;
//     console.log(":",doctorCityId);
//     const querySnapshot = await getDocs(query(collection(db, 'hos_city'), where('CityId', '==', `/city/${doctorCityId}`)));
//     if (!querySnapshot.empty) {
//         return querySnapshot.docs[0].id; // Return the document ID of the first hospital city
//     }
//     return null; // No hospital found for this city ID
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedDoctor) {
//       alert("Please select a doctor before submitting.");
//       return;
//     }

//     // Fetch the patient ID using the email
//     const patientId = await getPatientIdByEmail(formData.email);
//     if (!patientId) {
//       alert("No patient found with this email; please register first.");
//       return;
//     }
//     const hospitalCityId = await getHospitalIdByCityId(selectedDoctor.CityId);
//     if (!hospitalCityId) {
//         alert("No hospital found for the selected doctor's city. Please try again.");
//         return;
//     }
//     // Prepare appointment data
//     const appointmentData = {
//       appointmentDateTime: formData.appointmentDate.toISOString() + ' ' + (formData.appointmentTime || ''),
//       DoctorId: ` /doctors/${selectedDoctor.id}`,
//       hos_CityId:  `/hos_city/${hospitalCityId}`,
//       PatientId: `/patient/${patientId}`,
     
//     };

//     try {
//       // Store appointment data
//       await addDoc(collection(db, 'appointement'), appointmentData);
      
//       alert('Appointment and patient details stored successfully!');
//       // Reset form data
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         appointmentDate: new Date(),
//         appointmentTime: '',
//       });
//       signatureRef.current.clear();
//       setSelectedTime('');
//     } catch (error) {
//       console.error("Error submitting form: ", error.message || error);
//       alert('Failed to store data: ' + (error.message || "Unknown error"));
//     }
//   };
//   console.log("Selected Doctor:", selectedDoctor); // Check if this logs the expected object

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-customPink shadow-md rounded-lg my-6">
//       <h1 className="text-2xl font-bold mb-4 text-center text-pink-800 animate-typing">Book Your Appointment</h1>
//       <form onSubmit={handleSubmit}>
//         {/* First Name Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Last Name Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Email Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Phone Number Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Phone Number</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Appointment Date Picker */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Appointment Date</label>
//           <Calendar
//             onChange={handleDateChange}
//             value={formData.appointmentDate}
//             className="custom-calendar"
//           />
//         </div>

//         {/* Appointment Time Selection */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Appointment Time</label>
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {["01:00", "18:00", "19:00", "20:00", "23:00"].map((time) => (
//               <button
//                 key={time}
//                 type="button"
//                 className={`w-full py-2 rounded-lg hover:bg-[#FFB6C1] ${selectedTime === time ? 'bg-pink-900 text-white' : 'border border-pink-300'}`}
//                 onClick={() => handleTimeSelect(time)}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Signature Canvas */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Signature</label>
//           <SignatureCanvas
//             ref={signatureRef}
//             penColor="pink"
//             canvasProps={{ width: 400, height: 200, className: 'border border-pink-300 rounded-lg' }}
//           />
//           <button
//             type="button"
//             className="mt-2 bg-pink-900 text-white px-4 py-2 rounded-lg hover:bg-pink-800"
//             onClick={() => signatureRef.current.clear()}
//           >
//             Clear
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-900 text-white py-2 rounded-lg hover:bg-pink-800"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Form;



// import React, { useState, useRef } from 'react';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import SignatureCanvas from 'react-signature-canvas';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { db } from '../firebaseConfig';
// import { useNavigate } from 'react-router-dom';
// import { doc } from 'firebase/firestore';
// const Form = ({ selectedDoctor, setAppointmentDateTime }) => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     appointmentDate: new Date(),
//     appointmentTime: '',
//   });

//   const [selectedTime, setSelectedTime] = useState('');
//   const signatureRef = useRef(null);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleDateChange = (date) => {
//     setFormData({ ...formData, appointmentDate: date });
//   };

//   const handleTimeSelect = (time) => {
    
//     setSelectedTime(time);
//     setFormData({ ...formData, appointmentTime: time });
//   };

//   const getPatientIdByEmail = async (email) => {
//     const q = query(collection(db, 'patient'), where('email', '==', email));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//       const doc = querySnapshot.docs[0];
//       return doc.id;
//     }
//     return null;
//   };
  
//   const getHospitalIdByCityId = async (CityId) => {
//     const doctorCityId = selectedDoctor.CityId;
//     // const querySnapshot = await getDocs(query(collection(db, 'hos_city'), where('City_Id', '==', `/city/${CityId}`)));
//     const cityRef = doc(db, 'city', doctorCityId);
//     const querySnapshot = await getDocs(query(collection(db, 'hos_city'),where('City_Id', '==', cityRef) ));
//     console.log(querySnapshot)
//     if (!querySnapshot.empty) {
//       return querySnapshot.docs[0].id;
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedDoctor) {
//       alert("Please select a doctor before submitting.");
//       return;
//     }

//     const patientId = await getPatientIdByEmail(formData.email);
//     if (!patientId) {
//       alert("No patient found with this email; please register first.");
//       return;
//     }
//     const hospitalCityId = await getHospitalIdByCityId(selectedDoctor.CityId);
//     if (!hospitalCityId) {
//       alert("No hospital found for the selected doctor's city. Please try again.");
//       return;
//     }

//     const appointmentDateTime = formData.appointmentDate.toISOString() + ' ' + (formData.appointmentTime || '');
//     setAppointmentDateTime(appointmentDateTime);

//     const appointmentData = {
//       appointmentDateTime: appointmentDateTime,
//       DoctorId: `${selectedDoctor.id}`,
//       hos_CityId: `${hospitalCityId}`,
//       PatientId: `${patientId}`,
//     };

//     try {
//       await addDoc(collection(db, 'appointement'), appointmentData);
      
//       alert('Appointment and patient details stored successfully!');
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         appointmentDate: new Date(),
//         appointmentTime: '',
//       });
//       signatureRef.current.clear();
//       setSelectedTime('');
//     } catch (error) {
//       console.error("Error submitting form: ", error.message || error);
//       alert('Failed to store data: ' + (error.message || "Unknown error"));
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-customPink shadow-md rounded-lg my-6">
//       <h1 className="text-2xl font-bold mb-4 text-center text-pink-800 animate-typing">Book Your Appointment</h1>
//       <form onSubmit={handleSubmit}>
//               {/* First Name Input */}
//               <div className="mb-4">
//           <label className="block text-pink-800">First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Last Name Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Email Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Phone Number Input */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Phone Number</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 focus:ring-offset-pink-900"
//           />
//         </div>

//         {/* Appointment Date Picker */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Appointment Date</label>
//           <Calendar
//             onChange={handleDateChange}
//             value={formData.appointmentDate}
//             className="custom-calendar"
//           />
//         </div>

//         {/* Appointment Time Selection */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Appointment Time</label>
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {["01:00", "02:00"].map((time) => (
//               <button
//                 key={time}
//                 type="button"
//                 className={`w-full py-2 rounded-lg hover:bg-[#FFB6C1] ${selectedTime === time ? 'bg-pink-900 text-white' : 'border border-pink-300'}`}
//                 onClick={() => handleTimeSelect(time)}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Signature Canvas */}
//         <div className="mb-4">
//           <label className="block text-pink-800">Signature</label>
//           <SignatureCanvas
//             ref={signatureRef}
//             penColor="pink"
//             canvasProps={{ width: 400, height: 200, className: 'border border-pink-300 rounded-lg' }}
//           />
//           <button
//             type="button"
//             className="mt-2 bg-pink-900 text-white px-4 py-2 rounded-lg hover:bg-pink-800"
//             onClick={() => signatureRef.current.clear()}
//           >
//             Clear
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-900 text-white py-2 rounded-lg hover:bg-pink-800"
//         >
//           Submit
//         </button>
//         <button
//           type="button"
//           className="mt-4 w-full bg-customHoverPink text-white py-2 rounded-lg hover:bg-customPink"
//           onClick={() => navigate('/slip')}  // Navigate to Slip component
//         >
//           Go to Slip
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Form;



