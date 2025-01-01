import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import bcrypt from "bcryptjs";

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [roleToDelete, setRoleToDelete] = useState('doctor');
  const [consultationFee, setConsultationFee] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cities, setCities] = useState({});
  const [isVisible, setIsVisible] = useState(true);


  useEffect(() => {
    // Listen for new pending doctor signups
    const unsubscribe = onSnapshot(collection(db, 'pendingDoctors'), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingDoctors(docs);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all doctors and patients on mount
  useEffect(() => {
    const fetchCitiesAndUsers = async () => {
      try {
        // Fetch city data
        const citiesSnapshot = await getDocs(collection(db, 'city'));
        const citiesData = {};
        citiesSnapshot.forEach((doc) => {
          citiesData[doc.id] = doc.data().name; // Assuming each city document has a 'name' field
        });
        setCities(citiesData);
  
        // Fetch doctors and patients
        const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
        const patientsSnapshot = await getDocs(collection(db, 'patient'));
  
        const doctors = doctorsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data, cityName: citiesData[data.cityID] || 'Unknown' };
        });
  
        const patients = patientsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        setAllDoctors(doctors);
        setAllPatients(patients);
      } catch (error) {
        console.error('Error fetching users or cities:', error);
      }
    };
  
    fetchCitiesAndUsers();
  }, []);

  // On approval process
  const approveDoctor = async (doctor) => {
    const auth = getAuth();
    try {
      // Log the doctor object for debugging
      console.log('Approving doctor:', doctor);
  
      // Retrieve the password from the authData collection based on the doctor's email
      const docSnapshot = await getDoc(doc(db, 'authData', doctor.id));
      if (!docSnapshot.exists()) {
        throw new Error('No authentication data found for this doctor.');
      }
      
      const { password } = docSnapshot.data(); // Assuming the password is stored here
  
      // Check if the password is valid
      if (!password || password.trim() === '') {
        throw new Error('Password is missing or invalid');
      }
  
      // Create the user in Firebase Authentication using the provided email and password
      const userCredential = await createUserWithEmailAndPassword(auth, doctor.email, password);
      const user = userCredential.user; // This contains the user's ID (user.uid)
  
      // Save the doctor's details in the 'doctors' collection using the new UID
      await setDoc(doc(db, 'doctors', user.uid), {
        name: doctor.name,
        id: user.uid,
        email: doctor.email,
        specialization: doctor.specialization,
        cityID: doctor.cityID,
        consultationFee: doctor.consultationFee,
        imageUrl: doctor.imageUrl, // Include the image URL here
         // Unique ID from Firebase Auth
        approved: "Approved",
        createdAt: doctor.createdAt || new Date().toISOString(),
      });
  
      // Delete the doctor from the 'pendingDoctors' collection
      await deleteDoc(doc(db, 'pendingDoctors', doctor.id));
  
      alert(`Approved doctor with email: ${doctor.email}`);
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to approve doctor: ' + error.message);
    }
  };

  const deletePendingDoctor = async (doctor) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the doctor with email ${doctor.email}?`
    );
  
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'pendingDoctors', doctor.id)); // Deletes the doctor from Firestore
        alert(`Deleted doctor with email ${doctor.email}`);
        
        // Remove the doctor from the pendingDoctors state
        setPendingDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Failed to delete doctor.');
      }
    }
  };
  
  
  

  // Fetch user by email and display data
  const fetchUserByEmail = async (email, role) => {
    setErrorMessage('');
    setSelectedUser(null);
    try {
      const collectionName = role === 'doctor' ? 'doctors' : 'patient';
      const querySnapshot = await getDocs(collection(db, collectionName));
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const user = users.find((user) => user.email === email);
      
      if (user) {
        setSelectedUser(user);
      } else {
        setErrorMessage(`No ${role} found with email: ${email}`);
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
      setErrorMessage('Failed to fetch user by email.');
    }
  };

  // Show user details when placard is clicked
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setDeleteEmail(user.email); // Update the email field for potential deletion
    setRoleToDelete(user.hasOwnProperty('specialization') ? 'doctor' : 'patient');
  };

  // Delete user
  const deleteUser = async () => {
    if (!selectedUser) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${roleToDelete} with email ${selectedUser.email}?`
    );

    if (confirmDelete) {
      const collectionName = roleToDelete === 'doctor' ? 'doctors' : 'patient';
      try {
        await deleteDoc(doc(db, collectionName, selectedUser.id));
        alert(`Deleted ${roleToDelete} with email ${selectedUser.email}`);
        setSelectedUser(null);
        setDeleteEmail('');
      } catch (error) {
        console.error('Error deleting user:', error);
        setErrorMessage('Failed to delete user.');
      }
    }
  };

  const updateConsultationFee = async () => {
    if (!selectedUser) return;
    try {
      const doctorRef = doc(db, 'doctors', selectedUser.id);
      await updateDoc(doctorRef, { consultationFee });
      alert(`Consultation fee updated for doctor with email: ${selectedUser.email}`);
      setConsultationFee('');
    } catch (error) {
      console.error('Error updating consultation fee:', error);
      setErrorMessage('Failed to update consultation fee.');
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

      <div className="bg-white p-6 rounded-lg shadow-md bg-opacity-10 mb-8 mt-8 z-20">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">Admin Dashboard</h1>
      
      <h2 className="text-2xl font-semibold mb-4 text-white">Pending Doctor Approvals</h2>
      <div>
      {pendingDoctors.length > 0 ? (
        <div className= "grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingDoctors.map((doctor) => (
            <div key={doctor.id} className="p-4 border rounded-md bg-customNavyBlue shadow-md text-customBlue">
              <img src={doctor.imageUrl} alt={`${doctor.name}'s profile`} className="w-24 h-24 rounded-full mb-2" /> {/* Display the image */}
              <p><strong>Name:</strong> {doctor.name}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => approveDoctor(doctor)}
                  // className="mt-2 px-4 py-2 bg-[#232946] text-white rounded-md hover:bg-[#5d6594]"
                  className='text-customWhite bg-gradient-to-r from-customBlue to-customHoverBlue px-4 py-2 rounded-lg shadow-lg m-4 hover:from-customHoverBlue hover:to-customBlue transition duration-300 transform hover:scale-105 focus:outline-none'
                >
                  Approve Doctor
                </button>
                <button
                    onClick={() => deletePendingDoctor(doctor)}
                     className="m-4 px-4 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
                    // className="mt-2 px-4 py-2 bg-[#c42b2b] text-black rounded-md hover:bg-[#e04646]"
                  >
                    Delete doctor
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className = "text-white">No pending doctors at the moment.</p>
      )}
      </div>

      {/* Existing features for deleting users, updating patient history, etc. */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">User Management</h2>
        <div className="flex justify-start items-center gap-4 mb-4">
        <div className="mb-4">
          <label className="mr-2 font-semibold text-white">Select Role:</label>
          <select
            value={roleToDelete}
            onChange={(e) => setRoleToDelete(e.target.value)}
            className="px-3 py-2 border border-customNavyBlue-300 rounded-md text-black bg-white"
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="mr-2 font-semibold text-white ">Enter Email:</label>
          <input
            type="email"
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            placeholder="Enter user email"
            className="px-3 py-2 border border-customNavyBlue-300 rounded-md w-72 text-black bg-white "
          />
          <button
            onClick={() => fetchUserByEmail(deleteEmail, roleToDelete)}
            className='text-customWhite bg-gradient-to-r from-customBlue to-customHoverBlue px-4 py-2 rounded-lg shadow-lg m-4 hover:from-customHoverBlue hover:to-customBlue transition duration-300 transform hover:scale-105 focus:outline-none'
            // className="px-4 py-2 bg-[#eebbc3] text-black rounded-md hover:bg-[#95686f] ml-2"
          >
            Fetch User
          </button>
        </div>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {selectedUser && (
          <div className="flex justify-center items-center w-full">
            <div className="mt-4 p-4 border rounded-md bg-customNavyBlue shadow-md text-customBlue max-w-lg w-full">
            {roleToDelete === 'doctor' && (
              <img 
                src={selectedUser.imageUrl} 
                alt={`${selectedUser.name}'s profile`} 
                className="w-24 h-24 rounded-full mb-2" 
              />
            )}
            <h2 className="text-xl font-semibold text-customBlue">User Information</h2>
            {Object.entries(selectedUser).map(([key, value]) => (
              key === 'cityID' ? (
                <p key={key}><strong>City:</strong> {selectedUser.cityName || 'Unknown'}</p>
              ) : (
                key !== 'imageUrl' && <p key={key}><strong>{key}:</strong> {value}</p>
              )
            ))}
            {roleToDelete === 'patient' && (
              <>
                <div className="mt-4">
                  <div className="flex justify-center gap-4 mt-4">
                  <button
                  onClick={deleteUser}
                  className="m-4 px-4 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
                  // className="mt-2 px-4 py-2 bg-[#c42b2b] text-black rounded-md hover:bg-[#e04646]"
                >
                  Delete User
                </button>
                  </div>
                </div>
                
              </>
            )}
            {roleToDelete === 'doctor' && (
              <>
                <div className="mt-4">
                  <label className="block font-semibold mb-2 text-customBlue">Add Consultation Fee</label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="Enter consultation fee"
                    className="px-3 py-2 border rounded-md w-72 text-black bg-white"
                  />
                  <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={updateConsultationFee}
                    className='text-customWhite bg-gradient-to-r from-customBlue to-customHoverBlue px-4 py-2 rounded-lg shadow-lg m-4 hover:from-customHoverBlue hover:to-customBlue transition duration-300 transform hover:scale-105 focus:outline-none'
                    // className="mt-2 px-4 py-2 bg-[#232946] text-white rounded-md hover:bg-[#5d6594]"
                  >
                    Add Consultation Fee
                  </button>

                  <button
                  onClick={deleteUser}
                   className="m-4 px-4 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
                  // className="mt-2 px-4 py-2 bg-[#c42b2b] text-black rounded-md hover:bg-[#e04646]"
                >
                  Delete User
                </button>
                  </div>
                </div>
                
              </>
            )}
          </div>
          </div>
        )}
      </div>

      
      {/* Display All Doctors and Patients */}  
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">All Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allDoctors.map((doctor) => (
            <div key={doctor.id} 
            className={`p-4 border rounded-md bg-customNavyBlue shadow-2xl text-customBlue cursor-pointer transform transition-transform duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } hover:scale-105`}
            onClick={() => showUserDetails(doctor)}
            
            >
              <img src={doctor.imageUrl} alt={`${doctor.name}'s profile`} className="w-24 h-24 rounded-full mb-2" /> {/* Display the image */}
              <h3 className="font-semibold">{doctor.name}</h3>
              <p>Email: {doctor.email}</p>
              <p>Specialization: {doctor.specialization}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-white mt-8">All Patients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allPatients.map((patient) => (
            <div key={patient.id} 
            className={`p-4 border rounded-md bg-customNavyBlue shadow-2xl text-customBlue cursor-pointer transform transition-transform duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } hover:scale-105`}
            onClick={() => showUserDetails(patient)}
            >
              <h3 className="font-semibold">{patient.name}</h3>
              <p>Email: {patient.email}</p>
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

