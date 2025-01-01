import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useNavigate } from 'react-router-dom';

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    cityID: '',
    consultationFee: '',
    phone: '',
    image: null, // New field for the image
  });

  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'city'));
        const cityList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCities(cityList);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
    } else {
      const newValue = name === "consultationFee" ? (value === "" ? "" : parseFloat(value)) : value;
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const storage = getStorage();
    const { email, password, name, specialization, cityID, consultationFee, image } = formData;
    
    try {
      let imageUrl = null;

      // Upload image if it exists
      if (image) {
        const imageRef = ref(storage, `doctorImages/${email}_${Date.now()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      // Create the new doctor object with the necessary data
      const newDoctor = {
        name: name,
        email: email,
        specialization: specialization,
        cityID: cityID,
        consultationFee: consultationFee,
        phone: formData.phone,
        status: 'pending',
        createdAt: new Date().toISOString(),
        imageUrl, // Save the image URL in Firestore
      };
  
      // Add a new document to the 'pendingDoctors' collection
      const docRef = await addDoc(collection(db, 'pendingDoctors'), newDoctor);
      console.log('Doctor signup request submitted with ID:', docRef.id);
  
      // Save the auth data in a secure way (hashed password)
      await setDoc(doc(db, 'authData', docRef.id), {
        email: email,
        password: password, // Store the plain text password
      });
  
      alert('Your signup request has been submitted for approval.');
      navigate('/Login');
    } catch (error) {
      console.error('Error during doctor signup:', error.message);
      alert(`Failed to sign up: ${error.message}`);
    }
  };
  

  return (
      <div className="bg-customNavyBlue p-6 rounded-lg shadow-md max-w-xl w-full bg-opacity-50">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-customWhite">Name:</label>
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
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-white">City:</label>
            <select
              name="cityID"
              value={formData.cityID}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-white">Specialization:</label>
            <select
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
              required
            >
              <option value="">Select Spetialization</option>
              <option value="Gynaecologist">Gynaecologist</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Opthalmologist">Opthalmologist</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="General Physician">General Physician</option>
              <option value="Dentist">Dentist</option>
              <option value="Pulmonologist">Pulmonologist</option>
              <option value="Urologist">Urologist</option>
              <option value="Other">other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-white">Profile Image:</label>
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black"
            />
          </div>
          <button type="submit" 
          className="w-full py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
          >
            Sign Up as Doctor
          </button>
        </form>
      </div>
  );
};

export default DoctorSignup;

