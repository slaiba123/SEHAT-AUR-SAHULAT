
import React, { useEffect, useRef, useState } from 'react';
import './DoctorCard.css'; // Ensure you have this CSS file
import { useNavigate } from 'react-router-dom';
import { useDoctorContext } from '../context/DoctorContext'; // Import useDoctorContext to access the context

const DoctorCard = ({ doctor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate here

  const { handleDoctorSelect } = useDoctorContext(); // Get handleDoctorSelect from context

  const handleAppointmentClick = () => {
    console.log("hello");
    handleDoctorSelect(doctor); // Call handleDoctorSelect from context with the selected doctor
    
    navigate('/form'); // Use navigate function to change the route
  };


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false); // Optional: reset visibility
      }
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  

  return (
    <div
      ref={cardRef}
      className={`w-80 h-auto bg-customNavyBlue shadow-2xl rounded-lg p-4 transform transition-opacity duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Image with fade-in effect */}
      <div className={`w-full h-48 mb-4 transition-opacity duration-500 ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'}`}>
        <img
          src={doctor.image?.stringValue} // Use the doctor image URL
          alt={`${doctor.name}'s profile`}
          className="object-contain w-full h-full rounded-t-lg"
        />
      </div>

      {/* Doctor's Name and Post */}
      <div className="text-center mt-2">
        <h3 className={`text-xl text-customPink font-semibold ${isVisible ? 'animate-typing' : 'opacity-0'}`}>{doctor.name}</h3>
        <p className={`text-customBlue text-sm mt-1 ${isVisible ? 'animate-typing' : 'opacity-0'}`}>{doctor.specialization}</p>
        <p className="text-gray-400">{doctor.city}</p>
      </div>

      {/* Consultation Fee and Rating */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-customBlue text-sm">Fee: PKR {doctor.consultationFee}</span>
        {isVisible && <span className="text-yellow-500 text-md">⭐ 4.5 </span>}
      </div>

      {/* Book Appointment Button */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-customBlue text-customWhite px-3 py-1 rounded-lg hover:bg-customeHoverBlue"
          onClick={handleAppointmentClick}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
