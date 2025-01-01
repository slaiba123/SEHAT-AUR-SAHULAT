

import React, { useState } from 'react';

const FilterCities = ({ onFilterChange }) => {
  const citiesList = [
    { name: 'Karachi', selected: false },
    { name: 'Lahore', selected: false },
    { name: 'Islamabad', selected: false },
    { name: 'Peshawar', selected: false },
    { name: 'Quetta', selected: false },
    { name: 'Multan', selected: false },
    { name: 'Rawalpindi', selected: false },
    { name: 'Faisalabad', selected: false },
    { name: 'Hyderabad', selected: false },
    { name: 'Sialkot', selected: false },
    { name: 'Gujranwala', selected: false },
    { name: 'Bahawalpur', selected: false },
  ];

  const specializationsList = [
    { name: 'Cardiologist', selected: false, icon: '/src/icons/heart.png' },
    { name: 'Dermatologist', selected: false, icon: '/src/icons/skin.png' },
    { name: 'Pediatrician', selected: false, icon: '/src/icons/pediatrics.png' },
    { name: 'Orthopedic', selected: false, icon: '/src/icons/arthritis.png' },
    { name: 'General physician', selected: false, icon: '/src/icons/home(1).png' },
    { name: 'Gynaecologist', selected: false, icon: '/src/icons/obstetrical.png' },
    { name: 'Dentist', selected: false, icon: '/src/icons/clean.png' },
    { name: 'Pulmonologist', selected: false, icon: '/src/icons/lungs.png' },
    { name: 'Neurologist', selected: false, icon: '/src/icons/health.png' },
    { name: 'Urologist', selected: false, icon: '/src/icons/kidney.png' },
    { name: 'Opthalmologist', selected: false, icon: '/src/icons/optometry.png' },
  ];

  const [cities, setCities] = useState(citiesList);
  const [specializations, setSpecializations] = useState(specializationsList);
  const [range, setRange] = useState(500); // Initial range

  // Toggle city selection
  const toggleCitySelection = (name) => {
    const updatedCities = cities.map((city) =>
      city.name === name ? { ...city, selected: !city.selected } : city
    );
    setCities(updatedCities);
  };

  // Toggle specialization selection
  const toggleSpecializationSelection = (name) => {
    const updatedSpecializations = specializations.map((specialization) =>
      specialization.name === name ? { ...specialization, selected: !specialization.selected } : specialization
    );
    setSpecializations(updatedSpecializations);
  };

  // Apply filter and pass selected values to parent component
  const applyFilter = () => {
    const selectedCities = cities.filter(city => city.selected).map(city => city.name);
    const selectedSpecializations = specializations.filter(specialization => specialization.selected).map(specialization => specialization.name);
    
    // Call the function passed from parent to update the state
    onFilterChange(selectedCities, selectedSpecializations, range);
  };

  return (
    <div className="p-4  w-[1200px]">
      <div>
      <h1 className=" text-4xl font-semibold text-center lg:text-start ml-[50px] mb-[50px]">Book Your Appointments</h1>
      </div>
      <div className="flex flex-row">
        {/* Filter Cities Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Filter by City</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => toggleCitySelection(city.name)}
                className={`${
                  city.selected ? 'bg-customBlue text-customWhite' : 'bg-gray-100 text-gray-600'
                } border border-gray-300 rounded-full px-3 py-1 text-sm transition duration-300 ease-in-out hover:bg-customHoverBlue hover:text-customWhite`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider Section */}
        <div className="mb-6 w-[800px] mr-10">
          <h2 className="text-lg font-bold mb-4">Select Fee Range (Rs)</h2>
          <input
            type="range"
            min="500"
            max="15000"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full"
            style={{
              WebkitAppearance: 'none',
              height: '8px',
              borderRadius: '5px',
              background: `linear-gradient(to right, #6A8EBE 0%, #6A8EBE ${(range - 500) / (15000 - 500) * 100}%, white ${(range - 500) / (15000 - 500) * 100}%, white 100%)`,
              border: '2px solid grey',
            }}
          />
          <div className="text-center mt-2 text-sm">
            Selected Range: <span className="font-bold">{range} Rs</span>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      <div className="mb-6 w-[600px] ">
        <h2 className="text-lg font-bold mb-4">Specializations</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {specializations.map((specialization) => (
            <button
              key={specialization.name}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => toggleSpecializationSelection(specialization.name)}
              className={`${
                specialization.selected ? 'bg-customBlue text-customWhite' : 'bg-gray-100 text-gray-600'
              } border border-gray-300 rounded-full p-2 transition duration-300 ease-in-out hover:bg-customHoverBlue hover:text-customWhite flex items-center`}
              style={{
                transition: 'transform 0.3s ease',
              }}
            >
              <img
                src={specialization.icon}
                alt={specialization.name}
                className="w-10 h-10"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Apply Filter Button */}
      <div className="mb-6">
        <button
          onClick={applyFilter}
          className="bg-customNavyBlue text-customWhite w-[150px] h-[50px] rounded-3xl px-4 py-1 mx-3 hover:bg-customBlue"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default FilterCities;
