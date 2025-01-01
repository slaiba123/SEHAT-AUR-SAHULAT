import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import BlogNav from '../login/BlogNav';
import BlogCard from '../login/BlogCard';
import Ayat from '../login/Ayat';

const BlogPage = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("Cardiologist");
  const [blogPosts, setBlogPosts] = useState([]); // State to store blog posts from Firestore
  const [doctorNames, setDoctorNames] = useState({}); // State to store doctor names

  // Fetch blog posts and doctor names from Firestore when the component mounts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollection = collection(db, 'Blog'); // Reference to the 'blogposts' collection
        const blogSnapshot = await getDocs(blogCollection); // Get documents from the collection
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() // Spread the document data
        }));
        
        setBlogPosts(blogList); // Set the fetched blog posts in state
        console.log(blogList)
        // Fetch doctor names based on DoctorId
        const doctorIds = [...new Set(blogList.map(post => post.DoctorId))]; // Get unique doctor IDs
        console.log("doctorsids:",doctorIds)
        const doctorCollection = collection(db, 'doctors'); // Reference to the 'doctors' collection
        const doctorSnapshot = await getDocs(doctorCollection); // Get documents from the collection
        const doctors = {};
        doctorSnapshot.docs.forEach(doc => {
          const doctorData = doc.data();
          if (doctorIds.includes(doc.id)) { // If the doctor ID matches
            console.log("d.id",doc.id)
            doctors[doc.id] = doctorData.name; // Store doctor name using doctor ID
          }
        });
        
        setDoctorNames(doctors); // Set the fetched doctor names in state
        console.log(doctorNames)
      } catch (error) {
        console.error("Error fetching blog posts or doctor names:", error);
      }
    };

    fetchBlogPosts();
  }, []);
  
  const handleSpecializationSelect = (specialization) => {
    setSelectedSpecialization(specialization);
    // Add logic here to filter blog posts based on the selected specialization
  };
  return (
    // <section className="pt-24 px-4 lg:px-16 bg-gray-50">
    <section className='min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-8 lg:pt-8'>
      {/* <BlogNav onSelectSpecialization={handleSpecializationSelect} /> */}
      <div>
      <h1 className=" text-4xl font-semibold text-center lg:text-start ml-[250px] mb-[50px]">Blogs</h1>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col space-y-10">
        <div className="flex flex-col lg:flex-row lg:w-[calc(85%)] ml-auto pr-2 gap-6 items-start">
          <div className="lg:w-2/3">
            {blogPosts.length > 0 && (
              <BlogCard 
                id={blogPosts[0].id}
                title={blogPosts[0].title} 
                content={blogPosts[0].content} 
                doctorName={doctorNames[blogPosts[0].DoctorId] || "Unknown Doctor"} // Fetch doctor name using DoctorId
                likes={parseInt(blogPosts[0].like)} // Convert string to integer
                large 
                image={blogPosts[0].image} // Assuming BlogCard accepts an image prop
              />
            )}
          </div>

          <div className="lg:w-1/3 h-[490px]">
            <Ayat />
          </div>
        </div>

        <div className="lg:w-[calc(85%)] ml-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogPosts.slice(1).map((post) => (
            
            <BlogCard 
              key={post.id} 
              id={post.id}
              title={post.title} 
              content={post.content} 
              doctorName={doctorNames[post.DoctorId] || "Unknown Doctor"} // Fetch doctor name using DoctorId
              likes={parseInt(post.like)} // Convert string to integer
              image={post.image} // Assuming BlogCard accepts an image prop
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
