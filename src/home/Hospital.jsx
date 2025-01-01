import React, { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import '../App'

function Navigation() {
    return (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/hospital">Our Doctors</Link>
      </nav>
    );
  }


const Hospital = () => {
  const data = [
    {
      img: "/assets/hos1.png",
      name: "Aga Khan University Hospital (AKUH) - Karachi",
      specialties: "AKUH is Pakistan's leading healthcare facility, offering cutting-edge technology and medical expertise. It holds international recognition and was the first hospital in Pakistan to be accredited by the Joint Commission International (JCI). It is known for its academic medical center status, providing a comprehensive range of services and research initiatives.",
    },
    {
      img: "/assets/hos2.png",
      name: "Shaukat Khanum Memorial Cancer Hospital & Research Centre - Lahore/Peshawar",
      specialties: "Established by the late Imran Khan, Shaukat Khanum is one of the largest cancer hospitals in Pakistan. It provides state-of-the-art cancer treatment and comprehensive care, focusing on research and training while maintaining high standards of patient care.​",
    },
    {
      img: "/assets/hos3.png",
      name: "Shifa International Hospital - Islamabad",
      specialties: "A leading healthcare institution, Shifa International offers a wide range of medical services, from diagnostic to treatment, with a team of highly qualified healthcare professionals. It is JCI-accredited, ensuring international standards of medical care.",
    },
    {
      img: "/assets/hos4.png",
      name: "Jinnah Postgraduate Medical Centre (JPMC) - Karachi",
      specialties: "JPMC is a major teaching hospital, known for its medical education and comprehensive healthcare services. It provides specialized treatments in various fields, including cardiology, surgery, and neurology.",
    },
    {
      img: "/assets/hos5.png",
      name: "Combined Military Hospital (CMH) - Lahore",
      specialties: "CMH is part of the Pakistan Army’s healthcare system and is renowned for its excellent medical facilities, especially in trauma care and surgery. It also offers specialized services for military personnel and the general public.​",
    },
    {
      img: "/assets/hos6.png",
      name: "Mayo Hospital - Lahore",
      specialties: "Mayo Hospital is one of the oldest and largest hospitals in Pakistan, providing a wide range of medical services. It is a teaching hospital with advanced surgical facilities and specialized care in various medical disciplines.",
    },
  ];

  const slider = useRef(null);

  const settings = {
    accessibility: true,
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          centerPadding: "5px",
        },
      },
    ],
    centerMode: false
    // appendDots: dots => (
    //     <ul className="mt-4">{dots}</ul>
    //   ),
    //   customPaging: i => (
    //     <button className="text-white"> {/* Replace with your preferred color */}
    //       ●
    //     </button>
    //   ),
  };

  return (
    <div className=" min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-16 bg-white ">
      <div className=" flex flex-col items-center lg:flex-row justify-between mb-10 lg:mb-0 ">
        <div>
          <h1 className=" text-4xl font-semibold text-center lg:text-start ml-[250px] mb-[50px]">
            Our Hospitals
          </h1>
          <p className="ml-[200px] mt-2 lg:text-start">
           Our hospitals are recognized for their quality of care, modern facilities, and specialized services, making them top choices for healthcare in Pakistan.
          </p>
        </div>
        <div className="flex gap-5 mt-4 lg:mt-0 ">
          <button
            className=" bg-grey text-backgroundColor px-4 py-2 rounded-lg active:bg-grey"
            onClick={() => slider.current.slickPrev()}
          >
            <FaArrowLeft size={25} />
          </button>
          <button
            className=" bg-grey text-backgroundColor px-4 py-2 rounded-lg active:bg-grey"
            onClick={() => slider.current.slickNext()}
          >
            <FaArrowRight size={25} />
          </button>
        </div>
      </div>
      <div className=" ml-[200px] mt-2 lg:text-start">
        <Slider ref={slider} {...settings}>
          {data.map((e, index) => (
            <div
              className="h-[550px] text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-2 cursor-pointer bg-white gap-4 mx-10"
              key={index}
            >
              <div>
                <img
                  src={e.img}
                  alt="img"
                  className=" h-56 rounded-t-xl w-full"
                />
              </div>

              <div className=" flex flex-col justify-center items-center mx-2">
                <h1 className=" font-semibold text-xl pt-4">{e.name}</h1>
                <h3 className=" pt-2">{e.specialties}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hospital;