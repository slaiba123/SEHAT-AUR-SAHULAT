// src/section/Doctors_List.js
import React, { useEffect, useState } from 'react';
import DoctorCard from '../login/DoctorCard';
import FilterCities from '../login/Filter_search'; // Import the FilterCities component
import { useDoctorContext } from '../context/DoctorContext'; // Import the custom hook

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false); // Track if any filter is applied

  const { handleDoctorSelect } = useDoctorContext(); // Get handleDoctorSelect from context

  const fetchCityName = async (cityReference) => {
    try {
      const response = await fetch(cityReference);
      const text = await response.text(); // Fetch raw text for debugging
      const cityData = JSON.parse(text);
      return cityData.fields?.name?.stringValue || "Unknown City";
    } catch (error) {
      console.error("Error fetching city:", error);
      return "Unknown City";
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("https://firestore.googleapis.com/v1/projects/hospital-management-syst-e87d7/databases/(default)/documents/doctors");
      const data = await response.json();

      if (Array.isArray(data.documents)) {
        const doctors = await Promise.all(
          data.documents.map(async (doc) => {
            const fields = doc?.fields || {};
            const docId = doc?.name?.split("/").pop() || "Unknown ID";
            const cityId = fields?.cityID?.stringValue;
            const cityName = cityId
              ? await fetchCityName(`https://firestore.googleapis.com/v1/projects/hospital-management-syst-e87d7/databases/(default)/documents/city/${cityId}`)
              : "Unknown City";

            return {
              id: docId,
              name: fields?.name?.stringValue,
              consultationFee: parseFloat(fields?.consultationFee?.stringValue) || 0,
              email: fields?.email?.stringValue,
              specialization: fields?.specialization?.stringValue,
              city: cityName,
              CityId: cityId,
              image: fields?.imageUrl,
            };
          })
        );

        setDoctors(doctors);
        
        setFilteredDoctors(doctors);
      } else {
        console.error("Unexpected response structure");
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleFilterChange = (selectedCities, selectedSpecializations, range) => {
    const filtered = doctors.filter((doctor) => {
      const matchesCity = selectedCities.length > 0 ? selectedCities.includes(doctor.city) : true;
      const matchesFee = doctor.consultationFee <= range;
      const matchesSpecialization =
        selectedSpecializations.length > 0 ? selectedSpecializations.includes(doctor.specialization) : true;

      return matchesCity && matchesFee && matchesSpecialization;
    });

    setFilteredDoctors(filtered);

    // Update isFilterApplied based on whether filters are active
    const isFilterActive =
      selectedCities.length > 0 || selectedSpecializations.length > 0 || range < Infinity;
    setIsFilterApplied(isFilterActive);
  };

  return (
    <div>
      <FilterCities onFilterChange={handleFilterChange} />

      <div className="flex flex-wrap gap-4 gap-y-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onDoctorSelect={handleDoctorSelect} />
          ))
        ) : isFilterApplied ? (
          <p>No doctors match the selected criteria.</p>
        ) : null}
      </div>
    </div>
  );
};

export default DoctorList;






// import React, { useEffect, useState } from 'react';
// import DoctorCard from '../components/DoctorCard';
// import FilterCities from '../components/Filter_search'; // Import the FilterCities component

// const DoctorList = ({ onDoctorSelect }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);

//   const fetchCityName = async (cityReference) => {
//     try {
//       const response = await fetch(cityReference);
//       const text = await response.text(); // Fetch raw text for debugging
//       console.log("City API Response:", text); // Log the entire response
  
//       // Try to parse the response as JSON
//       const cityData = JSON.parse(text);
//       return cityData.fields?.name?.stringValue || "Unknown City";
//     } catch (error) {
//       console.error("Error fetching city:", error);
//       return "Unknown City";
//     }
//   };
  
//   const fetchDoctors = async () => {
//     try {
//       const response = await fetch("https://firestore.googleapis.com/v1/projects/hospital-management-syst-e87d7/databases/(default)/documents/doctors");
//       const data = await response.json();
  
//       console.log("API response:", data); // Log the API response for debugging
  
//       if (Array.isArray(data.documents)) {
//         // Map over each doctor and fetch the corresponding city name
//         const doctors = await Promise.all(
//           data.documents.map(async (doc) => {
//             const fields = doc?.fields || {};
            
//             // Log the full document path to see if doc.name exists
//             const docName = doc?.name;
//             console.log("Full document path:", docName);
  
//             let docId = "Unknown ID"; // Default value in case of error
//             if (docName) {
//               try {
//                 docId = docName.split("/").pop(); // Try splitting and extracting the ID
//                 console.log("Extracted Document ID:", docId);
//               } catch (error) {
//                 console.error("Error splitting doc.name:", error); // Log any splitting error
//               }
//             } else {
//               console.error("doc.name is undefined or null", doc);
//             }
  
//             const cityId = fields?.cityID?.stringValue; // The full reference string
//             // Ensure cityId is defined before using it
//             console.log("cityid",cityId)
//             // console.log("image",fields?.imageUrl)
//             const cityName = cityId 
//               ? await fetchCityName(`https://firestore.googleapis.com/v1/projects/hospital-management-syst-e87d7/databases/(default)/documents/city/${cityId}`) 
//               : "Unknown City";

//             return {
//               id: docId, // Store the extracted ID or "Unknown ID"
//               name: fields?.name?.stringValue,
//               consultationFee: parseFloat(fields?.consultationFee?.stringValue) || 0,
//               email: fields?.email?.stringValue ,
//               specialization: fields?.specialization?.stringValue,
//               city: cityName,
//               CityId:cityId, // Store city name, not the reference ID
//               image:fields?.imageUrl
//             };
//           })
//         );
  
//         // Set the doctors and filteredDoctors state
//         setDoctors(doctors);
//         setFilteredDoctors(doctors);
//       } else {
//         console.error("Unexpected response structure: 'documents' not found or not an array", data);
//         setDoctors([]);  // Set to empty array if structure is invalid
//       }
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);
  
//   console.log("Filtered Doctors: ", filteredDoctors);

//   // Handle filter changes from FilterCities component
//   const handleFilterChange = (selectedCities, selectedSpecializations, range) => {
//     const filtered = doctors.filter((doctor) => {
//       const matchesCity = selectedCities.length > 0 ? selectedCities.includes(doctor.city) : true;
//       const matchesFee = doctor.consultationFee <= range;
//       const matchesSpecialization = selectedSpecializations.length > 0 ? selectedSpecializations.includes(doctor.specialization) : true;
  
//       // Logging the current doctor's details and match results
//       console.log("Filtering doctor:", doctor);
//       console.log("matchesCity:", matchesCity);
//       console.log("matchesFee:", matchesFee);
//       console.log("matchesSpecialization:", matchesSpecialization);
  
//       return matchesCity && matchesFee && matchesSpecialization;
//     });
  
//     console.log("Filtered doctors:", filtered); // Check what is being set as filtered
//     setFilteredDoctors(filtered);
//   };
  

//   return (
//     <div>
//       {/* Pass the handleFilterChange function to FilterCities component */}
//       <FilterCities onFilterChange={handleFilterChange} />

//       {/* Render filtered doctors */}
//       <div className="flex flex-wrap gap-4 gap-y-8">
//         {filteredDoctors.length > 0 ? (
//           filteredDoctors.map((doctor) => (
//             <DoctorCard key={doctor.id}
//             doctor={doctor}
//             onDoctorSelect={onDoctorSelect} />
//           ))
//         ) : (
//           <p>No doctors match the selected criteria.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorList;



