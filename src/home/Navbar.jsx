import React, { useState } from 'react';
import { Link } from "react-scroll";
import { useNavigate } from 'react-router-dom';

import { FaHome, FaInfoCircle, FaServicestack, FaUserMd, FaBlog, FaCalendarCheck } from 'react-icons/fa';

export const Navbar = () => {
  const navigate = useNavigate();  // Hook to navigate to different pages

  // Handle the submit action for Sign In
  const handleSubmit = () => {
    navigate('/login');
  
  };

  return (
    <div className='fixed w-[300px] z-10 text-white h-full bg-[#232946] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <div className='flex flex-col p-5'>
        <div className='flex flex-row items-center cursor-pointer'>
          <Link to='home' spy={true} smooth={true} duration={500}>
            <h1 className='text-2xl font-semibold text-white mb-[25px]'>Health Care</h1>
          </Link>
        </div>

        {/* Vertical Navigation (always visible for web) */}
        <nav className='flex flex-col p-4 space-y-4'>
          <Link to='home' spy={true} smooth={true} duration={500} className='flex items-center cursor-pointer space-x-2' onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} onMouseLeave={(e) => e.target.style.color = 'white'} style={{ marginBottom: '25px' }} >
            <FaHome /> <span> Home</span>
          </Link>
          <Link to='about' spy={true} smooth={true} duration={500} className='flex items-center cursor-pointer space-x-2' onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} onMouseLeave={(e) => e.target.style.color = 'white'} style={{ marginBottom: '25px' }} >
            <FaInfoCircle /> <span> About Us</span>
          </Link>
          <Link to='services' spy={true} smooth={true} duration={500} className='flex items-center cursor-pointer space-x-2' onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} onMouseLeave={(e) => e.target.style.color = 'white'} style={{ marginBottom: '25px' }} >
            <FaServicestack /> <span> Services</span>
          </Link>
          <Link to='booking' spy={true} smooth={true} duration={500} className='flex items-center cursor-pointer space-x-2' onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} onMouseLeave={(e) => e.target.style.color = 'white'} style={{ marginBottom: '25px' }} >
            <FaCalendarCheck  /> <span> Book Appointment</span>
          </Link>
          <Link to='hospitals' spy={true} smooth={true} duration={500} className='flex items-center cursor-pointer space-x-2' onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} onMouseLeave={(e) => e.target.style.color = 'white'} style={{ marginBottom: '25px' }} >
            <FaUserMd /> <span> Hospitals</span>
          </Link>
          <Link to='blogpage' spy={true} smooth={true} duration={500} className='flex items-center cursor-pointer space-x-2' onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} onMouseLeave={(e) => e.target.style.color = 'white'} style={{ marginBottom: '25px' }} >
            <FaBlog /> <span> Blog</span>
          </Link>
        </nav>

        {/* Sign Up Button */}
        <div className='mt-5'>
          <button 
          onClick={handleSubmit}
          className="flex items-center px-4 py-1 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg hover:from-customPink hover:to-customHoverPink transition transform hover:scale-105 mb-2"
          // className='text-white px-4 py-2 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out' style={{ backgroundColor: '#EEBBC3', color: '#232946' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#B8C1EC'} onMouseLeave={(e) => e.target.style.backgroundColor = '#EEBBC3'}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

