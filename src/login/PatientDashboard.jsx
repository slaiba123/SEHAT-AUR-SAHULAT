import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const PatientDashboard = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isFormVisible, setIsFormVisible] = useState(false); // Form visibility state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientInfo = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.log("User is not logged in.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching data for user:", user.uid);
        const docRef = doc(db, "patient", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPatientInfo(data);
          console.log("Patient data:", data);
        } else {
          console.error("No such document!");
          setPatientInfo(null);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setPatientInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      console.log("User is not logged in.");
      return;
    }

    try {
      const docRef = doc(db, "patient", user.uid);
      await updateDoc(docRef, formData);
      console.log("Patient details updated:", formData);
      setIsFormVisible(false); // Hide form after submission
      setPatientInfo({ ...patientInfo, ...formData }); // Update patient info state
    } catch (error) {
      console.error("Error updating patient details:", error);
    }
  };

  const handleBackClick = () => {
    setIsFormVisible(false); // Return to details view
  };

  return (
     <div className="relative min-h-screen flex justify-center items-center bg-black">
      {/* Back Button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10 backdrop-blur-lg"></div>

      <div className="bg-[#232946] shadow-lg rounded-lg p-8 max-w-md w-full z-20">
        {loading ? (
          <h2 className="text-2xl font-bold text-center text-indigo-600">Loading...</h2>
        ) : isFormVisible ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-[#b8c1ec] mb-6">Update Details</h2>
            <div>
              <label className="block text-white font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-[#eebbc3] text-black focus:outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-[#eebbc3] text-black focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-[#eebbc3] text-black focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleBackClick}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        ) : patientInfo ? (
          <>
      <h2 className="text-2xl font-bold text-center text-[#b8c1ec] mb-6">
        Welcome, {patientInfo.name}!
      </h2>
      <div className="bg-[#b8c1ec] text-[#232946] rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            <span className="block text-[#232946] text-opacity-70 mb-1">Name: {patientInfo.name}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="block text-[#232946] text-opacity-70 mb-1">Email: {patientInfo.email}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="block text-[#232946] text-opacity-70 mb-1">Phone: {patientInfo.phone}</span>
          </p>
        </div>
      </div>
            <button
              onClick={() => setIsFormVisible(true)}
              className="mt-6 bg-blue-200 text-blue px-4 py-2 rounded-md hover:bg-blue-900 w-full"
            >
              Update Details
            </button>
          </>
        ) : (
          <h2 className="text-2xl font-bold text-center text-red-600">No patient information available.</h2>
        )}
      </div>
    </div>
    </div>
  );
};

export default PatientDashboard;