import React from 'react';

const BlogNav = ({ onSelectSpecialization }) => {
  const specializationsList = [
    { name: 'Cardiologist', icon: './icons/heart.png' },
    { name: 'Dermatologist', icon: './icons/skin.png' },
    { name: 'Pediatrician', icon: './icons/pediatrics.png' },
    { name: 'Orthopedic', icon: './icons/arthritis.png' },
    { name: 'General Physician', icon: './icons/home(1).png' },
    { name: 'Gynecologist', icon: './icons/obstetrical.png' },
    { name: 'Dentist', icon: './icons/clean.png' },
    { name: 'Pulmonologist', icon: './icons/lungs.png' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-customNavyBlue text-customWhite shadow-lg p-1 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0 text-customBlue pl-9 ">Blogs</h1>
        <div className="flex flex-wrap space-x-2 pt-1">
          <button
            onClick={() => onSelectSpecialization('Recent')}
            className="flex items-center px-4 py-1 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg hover:from-customPink hover:to-customHoverPink transition transform hover:scale-105 mb-2"
          >
            Recent
          </button>
          {specializationsList.map((specialization) => (
            <button
              key={specialization.name}
              onClick={() => onSelectSpecialization(specialization.name)}
              className="flex items-center px-4 py-1 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg hover:from-customPink hover:to-customHoverPink transition transform hover:scale-105 mb-2"
            >
              <img src={specialization.icon} alt={`${specialization.name} icon`} className="w-5 h-5" />
              <span className="sr-only">{specialization.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BlogNav;