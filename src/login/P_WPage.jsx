


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { db, auth } from "../firebase";
// import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

// function P_WPage() {
//   const [doctorName, setDoctorName] = useState(""); // State to store doctor's name
//   const [patients, setPatients] = useState([]); // State to store consulted patients
//   const [blogContent, setBlogContent] = useState(""); // State for blog content
//   const [isBlogSubmitting, setIsBlogSubmitting] = useState(false);
//   const navigate = useNavigate(); 
  

//   useEffect(() => {
//     // Fetch the logged-in doctor's name and consulted patients
//     const fetchDoctorInfo = async () => {
//       try {
//         const user = auth.currentUser; // Get the current logged-in user
//         if (user) {
//           const doctorDocRef = doc(db, "doctors", user.uid); // Correct usage of doc
//           const doctorDoc = await getDoc(doctorDocRef);
//           if (doctorDoc.exists()) {
//             setDoctorName(doctorDoc.data().name); // Set doctor's name

//             // Fetch consulted patients from patient_history
//             const doctorId = `doctors/${user.uid}`;
//             const q = query(
//               collection(db, "patient"),
//               where("DoctorID", "==", doctorId)
//             );

//             console.log("DoctorID being queried:", user.uid);

//             const querySnapshot = await getDocs(q);

//             const patientList = await Promise.all(
//               querySnapshot.docs.map(async (patientSnapshot) => { 
//                 const patientData = patientSnapshot.data();
//                 console.log("Fetched Patient Data:", patientData); // Log each patient data
//                 if (patientData && patientData.DoctorID) { // Check if DoctorID exists in the patient data
//                   console.log("Patient Snapshot Data:", patientData);
//                   return patientData; // Return the patient data if DoctorID matches
//                 } else {
//                   console.warn("DoctorID not found for snapshot:", patientSnapshot.id);
//                   return null;
//                 }
//               })
//             );
            

//             setPatients(patientList.filter((p) => p !== null)); // Remove any null results
//           } else {
//             console.warn("Doctor document not found");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching doctor info:", error);
//       }
//     };

//     fetchDoctorInfo();
//   }, []);

//   // const handleBlogSubmit = async () => {
//   //   setIsBlogSubmitting(true);
//   //   try {
//   //     const user = auth.currentUser; // Get the current logged-in user
//   //     if (user) {
//   //       await addDoc(collection(db, "blogs"), {
//   //         doctorId: user.uid,
//   //         content: blogContent,
//   //         timestamp: new Date(),
//   //       });
//   //       alert("Blog posted successfully!");
//   //       setBlogContent(""); // Clear the blog text area
//   //     }
//   //   } catch (error) {
//   //     console.error("Error posting blog:", error);
//   //     alert("Failed to post the blog. Please try again.");
//   //   }
//   //   setIsBlogSubmitting(false);
//   // };

//   const handleSubmit = () => {
//     // Any necessary submission logic before navigating
//     navigate("/CreateBlog"); // Navigate to the CreateBlog page
//   };

//   return (
//     // <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat bg-white">
//     <div className="relative min-h-screen flex justify-center items-center bg-black">
//       {/* Video Background */}
//       <video
//         src="/assets/bg_video1.mp4"
//         autoPlay
//         loop
//         muted
//         className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
//         playsInline
//       />
//       {/* Overlay for a dark tint */}
//       <div className="absolute inset-0 bg-black opacity-50 z-10 backdrop-blur-lg"></div>

//       <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-2xl w-full bg-opacity-90 z-20">
//         {/* Welcome Message */}
//         {doctorName && (
//           <h1 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">
//             Welcome, Dr. {doctorName}!
//           </h1>
//         )}

//         {/* List of Patients */}
//         {/* List of Patients as a Table */}
//         <div className="mb-6">
//           <h2 className="text-xl font-bold text-[#b8c1ec]">Consulted Patients:</h2>
//           {patients.length > 0 ? (
//           <table className="w-full text-left bg-white text-sm border border-gray-300 rounded-md mt-4">
//             <thead className="bg-gray-100 text-black">
//               <tr>
//                 <th className="p-2 border-b border-gray-300">Name</th>
//                 <th className="p-2 border-b border-gray-300">Email</th>
//                 <th className="p-2 border-b border-gray-300">Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//             {patients.map((patient, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="p-2 border-b border-gray-300 text-black">{patient.name}</td>
//                 <td className="p-2 border-b border-gray-300 text-black">{patient.email}</td>
//                 <td className="p-2 border-b border-gray-300 text-black">{patient.phone}</td>
//               </tr>
//             ))}
//             </tbody>
//           </table>
//       ) : (
//         <p className="text-white mt-4">No patients found.</p>
//       )}
//     </div>


//         {/* Write Blog Section */}
//         <div className="mb-6">
//           <button
//             onClick={handleSubmit} // Call handleSubmit to navigate to CreateBlog
//             className="w-full py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
//           >
//             Create Blog
//           </button>
//           {/* <h2 className="text-xl font-bold text-[#b8c1ec]">Write a Blog:</h2>
//           <textarea
//             className="w-full bg-white p-2 border border-gray-300 rounded-md text-sm text-black mt-2"
//             rows="5"
//             value={blogContent}
//             onChange={(e) => setBlogContent(e.target.value)}
//             placeholder="Write your thoughts here..."
//           ></textarea>
//           <button
//             onClick={handleBlogSubmit}
//             disabled={isBlogSubmitting}
//             className="w-full mt-4 bg-[#eebbc3] text-black font-bold py-2 rounded-md hover:bg-[#95686f] transition-colors"
//           >
//             {isBlogSubmitting ? "Posting..." : "Post Blog"}
//           </button> */}
//         </div>

//         {/* Navigation Links */}
//         <div className="text-center w-full max-w-md">
//         </div>
//       </div>
//     </div>
//   );
// }

// export default P_WPage; 



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useDoctorData } from "../context/DoctorDataContext"; // Import the context hook

function P_WPage() {
  const [doctorName, setDoctorName] = useState("");
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const { setSelectedDoctor } = useDoctorData(); // Destructure setter from the context

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const doctorDocRef = doc(db, "doctors", user.uid);
          const doctorDoc = await getDoc(doctorDocRef);

          if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data();
            setDoctorName(doctorData.name); // Set local state
            setSelectedDoctor(doctorData); // Update context
          } else {
            console.warn("Doctor document not found");
          }

          // Fetch consulted patients
          const doctorId = `doctors/${user.uid}`;
          const q = query(collection(db, "patient"), where("DoctorID", "==", doctorId));
          const querySnapshot = await getDocs(q);

          const patientList = querySnapshot.docs.map((doc) => doc.data());
          setPatients(patientList);
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      }
    };

    fetchDoctorInfo();
  }, [setSelectedDoctor]);

  const handleSubmit = () => {
    navigate("/CreateBlog");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-black">
      <video
        src="/assets/bg_video1.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
        playsInline
      />
      <div className="absolute inset-0 bg-black opacity-50 z-10 backdrop-blur-lg"></div>

      <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-2xl w-full bg-opacity-90 z-20">
        {doctorName && (
          <h1 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">
            Welcome, Dr. {doctorName}!
          </h1>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#b8c1ec]">Consulted Patients:</h2>
          {patients.length > 0 ? (
            <table className="w-full text-left bg-white text-sm border border-gray-300 rounded-md mt-4">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="p-2 border-b border-gray-300">Name</th>
                  <th className="p-2 border-b border-gray-300">Email</th>
                  <th className="p-2 border-b border-gray-300">Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border-b border-gray-300 text-black">{patient.name}</td>
                    <td className="p-2 border-b border-gray-300 text-black">{patient.email}</td>
                    <td className="p-2 border-b border-gray-300 text-black">{patient.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white mt-4">No patients found.</p>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg shadow-lg hover:from-customHoverPink hover:to-customPink transition duration-300 transform hover:scale-105 focus:outlined-none"
          >
            Create Blog
          </button>
        </div>
      </div>
    </div>
  );
}

export default P_WPage;
