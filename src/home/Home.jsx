import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';

const Home = () => {
  // const navigate = useNavigate(); // Initialize useNavigate hook

  // // handleSubmit function to navigate to services page
  // const handleSubmit = (e) => {
  //   e.preventDefault();  // Prevent default behavior if it's a form
  //   navigate('/services'); // Navigate to the services page
  // };

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 text-white relative">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover opacity-90" 
        src="/assets/home_bg_video.mp4" // Adjusted video path
        autoPlay 
        loop 
        muted 
        playsInline
      />

      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-0" /> {/* Overlay for better readability */}

      <div className="relative z-10 w-full lg:w-4/5 space-y-5 mt-10">
        <h1 className="text-5xl ml-[250px]">Your Health, Our Priority</h1>
        <p className='ml-[250px]'> At Health Care, we prioritize your well-being by offering comprehensive services and support tailored to your individual health needs. Our dedicated team is here to guide you on your journey to better health, ensuring you receive the care and attention you deserve.</p>

        {/* <button
        className="flex items-center px-4 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg hover:from-customPink hover:to-customHoverPink transition transform hover:scale-105 mb-2 ml-[250px]"
          // className='text-white px-4 py-2 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out ml-[250px]'
          style={{ backgroundColor: '#EEBBC3', color: '#232946' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#B8C1EC'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#EEBBC3'}
          onClick={handleSubmit}
        >
          See Services
        </button> */}
        {/* Using Link for navigation */}
        <Link 
          to="services"  // This will navigate to the /services page
          className="flex items-center px-2 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-customWhite font-semibold rounded-lg hover:from-customPink hover:to-customHoverPink transition transform hover:scale-105 mb-2 ml-[250px] max-w-[120px]"
          style={{ backgroundColor: '#EEBBC3', color: '#232946' }}
          spy={true} smooth={true} duration={500} 
          onMouseEnter={(e) => e.target.style.color = '#B8C1EC'} 
          onMouseLeave={(e) => e.target.style.color = 'white'}
        >
          See Services
        </Link>
      </div>
    </div>
  );
};

export default Home;
