import React from "react";

const Button = ({ title }) => {
  return (
    <button
    className='text-white px-4 py-2 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out ml-[250px]'
    style={{ backgroundColor: '#EEBBC3', color: '#232946' }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#B8C1EC'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#EEBBC3'}
  >
   {title}
  </button>
  );
};

export default Button;
