import React, { useState, useEffect, useContext } from 'react';
import { jsPDF } from 'jspdf'; // Import jsPDF
import { db } from '../firebase'; // Adjust the import path as necessary
import { collection, getDoc, getDocs, doc } from 'firebase/firestore'; // Firestore imports
import { useNavigate } from 'react-router-dom';
import { AppointmentContext } from '../context/AppointmentContext'; // Import the context

const Slip = () => {
  const [appointmentData, setAppointmentData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const navigate = useNavigate();

  // Consume `appointmentDateTime` from Context
  const { appointmentDateTime } = useContext(AppointmentContext);
  console.log("appointmentDateTime from context: ", appointmentDateTime);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const appointmentSnapshot = await getDocs(collection(db, 'appointement'));
        const appointments = appointmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const appointment = appointments.find((app) => app.appointmentDateTime === appointmentDateTime);
        if (appointment) {
          const patientRef = doc(db, 'patient', appointment.PatientId);
          const patientDoc = await getDoc(patientRef);
          const patientName = patientDoc.exists() ? patientDoc.data().name : "Unknown Patient";

          const doctorRef = doc(db, 'doctors', appointment.DoctorId);
          const doctorDoc = await getDoc(doctorRef);
          const doctorName = doctorDoc.exists() ? doctorDoc.data().name : "Unknown Doctor";
          const doctorFee = doctorDoc.exists() ? doctorDoc.data().consultationFee : "Unknown Fee";

          const hosCityRef = doc(db, 'hos_city', appointment.hos_CityId);
          const hosCityDoc = await getDoc(hosCityRef);
          const hospitalId = hosCityDoc.exists() ? hosCityDoc.data().Hospital_Id : null;

          const dateOnly = appointment.appointmentDateTime.split("T")[0];
          const [year, month, day] = dateOnly.split("-");
          const appointmentDate = `${month}-${day}-${year}`;

          const timeOnly = appointment.appointmentDateTime.split("T")[1].split(" ")[0];
          let [hours, minutes] = timeOnly.split(":");
          let period = "AM";

          if (parseInt(hours) >= 12) {
            period = "PM";
            if (hours > 12) hours = hours - 12;
          } else if (hours === "00") {
            hours = 12;
          }
          const appointmentTime = `${hours}:${minutes} ${period}`;

          let hospitalName = "Unknown Hospital";
          if (hospitalId) {
            const hospitalRef = doc(db, 'hospital', hospitalId.split('/').pop());
            const hospitalDoc = await getDoc(hospitalRef);
            hospitalName = hospitalDoc.exists() ? hospitalDoc.data().Name : hospitalName;
          }

          setAppointmentData({
            patientName,
            doctorName,
            hospitalName,
            consultationFee: doctorFee,
            time: appointmentTime,
            Date: appointmentDate,
          });
        } else {
          setAppointmentData(null);
        }
      } catch (error) {
        console.error("Error fetching appointment data: ", error);
      } finally {
        setIsReady(true);
      }
    };

    fetchAppointmentData();
  }, [appointmentDateTime]);

  const downloadSlip = (data) => {
    const doc = new jsPDF();
    const margin = 10;
    const startX = margin;
    const startY = margin;
    const boxWidth = 190;
    const boxHeight = 90;

    doc.rect(startX, startY, boxWidth, boxHeight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Appointment Slip", startX + margin, startY + margin + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lineHeight = 10;
    const startYContent = startY + 30;
    const details = [
      { label: "Patient Name:", value: data.patientName },
      { label: "Doctor Name:", value: data.doctorName },
      { label: "Hospital:", value: data.hospitalName },
      { label: "Consultation Fee:", value: data.consultationFee },
      { label: "Time:", value: data.time },
      { label: "Date:", value: data.Date },
    ];

    details.forEach((detail, index) => {
      const yPosition = startYContent + index * lineHeight;
      doc.text(detail.label, startX + margin, yPosition);
      doc.text(detail.value, startX + 120, yPosition);
    });

    doc.save("appointment-slip.pdf");
    navigate('/');
  };

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!appointmentData) {
    return <div>No appointment data available.</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/bg.jpeg')" }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-6 max-w-md w-full border border-gray-300">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Appointment Slip</h1>
          <div className="space-y-4">
            <p className="font-semibold text-gray-600">Patient Name: <span className="text-gray-800 pl-2">{appointmentData.patientName}</span></p>
            <p className="font-semibold text-gray-600">Doctor Name: <span className="text-gray-800 pl-2">{appointmentData.doctorName}</span></p>
            <p className="font-semibold text-gray-600">Hospital: <span className="text-gray-800 pl-2">{appointmentData.hospitalName}</span></p>
            <p className="font-semibold text-gray-600">Consultation Fee: <span className="text-gray-800 pl-2">{appointmentData.consultationFee}</span></p>
            <p className="font-semibold text-gray-600">Time: <span className="text-gray-800 pl-2">{appointmentData.time}</span></p>
            <p className="font-semibold text-gray-600">Date: <span className="text-gray-800 pl-2">{appointmentData.Date}</span></p>
          </div>
          <button
            onClick={() => downloadSlip(appointmentData)}
            className="mt-6 w-full px-4 py-2 bg-customNavyBlue text-white font-semibold rounded-lg hover:bg-customHoverNavy transition"
          >
            Download Slip
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Slip;
