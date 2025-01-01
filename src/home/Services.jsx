import React from 'react'
import Button from "../layouts/Button";
import ServicesCard from '../layouts/ServicesCard';
import { RiMicroscopeLine } from 'react-icons/ri';
import { MdHealthAndSafety } from 'react-icons/md';
import { FaHeartbeat } from 'react-icons/fa';

const Services = () => {

  const icon1 = <RiMicroscopeLine size={35} className='text-backgroundColor'/>
  const icon2 = <MdHealthAndSafety size={35} className='text-backgroundColor'/>
  const icon3 = <FaHeartbeat size={35} className='text-backgroundColor'/>

  return (
    <div className='min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-8 lg:pt-8'>
        <div className='flex flex-col items-center lg:flex-row justify-between'>
            <div>
                <h1 className=" text-4xl font-semibold text-center lg:text-start ml-[250px] mb-[50px]">Our Services</h1>
                <p className='ml-[200px] mt-2 lg:text-start'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className='ml-[200px]'>
                <Button title='See Services'/>
            </div>
        </div>
        <div className='ml-[200px] flex flex-col lg:flex-row gap-5 pt-14'>
            <ServicesCard icon={icon1} title="Lab Test"/>
            <ServicesCard icon={icon2} title="Health Check"/>
            <ServicesCard icon={icon3} title="Heart Health"/>
        </div>
    </div>
  )
}

export default Services;