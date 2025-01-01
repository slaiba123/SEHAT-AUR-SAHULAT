import React from "react";


function WriteBlogPage() {
  return (
    // <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(/bg.png)` }}>
    <div
    className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
    
  >
      <div className="bg-[#232946] p-6 rounded-lg shadow-md max-w-md w-full bg-opacity-50">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#b8c1ec]">Write Blog</h1>
        <button className="w-full bg-[#eebbc3] text-black font-bold py-2 rounded-md hover:bg-[#95686f] transition-colors">
          Write Blog
        </button>
      </div>
    </div>
  );
}

export default WriteBlogPage;

