import React from "react";
import img from "/assets/about.jpg";

const About = () => {
  return (
    <div className=" min-h-screen flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 pt-8 lg:pt-8 gap-5">
      <div className=" w-full lg:w-3/4 space-y-4">
        <h1 className=" text-4xl font-semibold text-center lg:text-start ml-[250px] mb-[25px]">About Us</h1>
        <p className=" text-justify lg:text-start ml-[200px] mt-[150px]">
        Welcome to Sehat Aur Sahulat, where your health is our priority. We are committed to providing high-quality, accessible healthcare services tailored to each individual's unique needs.
        </p>
        <p className="text-justify lg:text-start ml-[200px]">
        Our platform connects you with experienced doctors and healthcare professionals, enabling seamless appointment scheduling, secure access to medical records, and personalized care in a single, convenient place. 
        </p>
        <p className="text-justify lg:text-start ml-[200px]">
        At Sehat Aur Sahulat, we value compassion, integrity, and innovation, ensuring that every step of your healthcare journey is supported with empathy and advanced technology. Our mission is to create a trusted healthcare experience that empowers you to take control of your health and well-being. Thank you for choosing us as your partner in health.
        </p>
      </div>
      <div className=" w-full lg:w-3/4">
        <img className=" rounded-lg ml-[100px]" src={img} alt="img" />
      </div>
    </div>
  );
};

export default About;