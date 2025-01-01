// import React, { useState, useRef } from 'react';
// import { db, storage } from '../firebase'; // Ensure this imports your initialized Firebase app
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { useDoctorDataContext } from '../context/DoctorDataContext'; // Import the context hook

// function CreateBlog() {
//   const { doctor } = useDoctorDataContext(); // Access doctorName from context
//   console.log('ss',doctor)

//   const categories = [
//     { name: 'Cardiologist' },
//     { name: 'Dermatologist' },
//     { name: 'Pediatrician' },
//     { name: 'Orthopedic' },
//     { name: 'General Physician' },
//     { name: 'Gynecologist' },
//     { name: 'Dentist' },
//     { name: 'Pulmonologist' },
//   ];

//   const [image, setImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null); // Store the actual file
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [title, setTitle] = useState('');
//   const [text, setText] = useState('');
//   const fileInputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       setImageFile(file); // Set the file for upload
//     }
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     setImageFile(null);
//     fileInputRef.current.value = '';
//   };

//   const handleTitleChange = (e) => {
//     const input = e.target.value;
//     if (input.length <= 33) {
//       setTitle(input);
//     } else {
//       alert('Title cannot exceed 33 characters.');
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     let imageUrl = '';
    

//     // Check if an image file has been selected
//     if (imageFile) {
//       const imageRef = ref(storage, `images/${imageFile.name}`); // Create a storage reference
//       await uploadBytes(imageRef, imageFile); // Upload the image
//       imageUrl = await getDownloadURL(imageRef); // Get the download URL
//     }
    


//     try {
//       // Add a new document with the form data
//       await addDoc(collection(db, 'Blog'), {
//         DoctorName: doctor.name, // Use doctorName from context
//         category: doctor.specialization,
//         content: text,
//         image: imageUrl,
//         title: title,
//         like: 0,
//         createdAt: new Date().toISOString(), // Current timestamp
//       });
//       alert('Blog post published successfully!');
//       // Reset form
//       setImage(null);
//       setImageFile(null);
//       setSelectedCategory('');
//       setTitle('');
//       setText('');
//       fileInputRef.current.value = '';
//     } catch (error) {
//       console.error('Error adding document: ', error);
//       alert('Failed to publish blog post.');
//     }
//   };

//   return (
//     <div className="h-screen w-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow w-full flex">
//         <div className="bg-white shadow-lg flex w-full h-full animate-fade-in">
//           <div className="w-1/3 bg-secondary text-white p-16 flex flex-col items-center animate-slide-in">
//             <img
//               // src={doctor?.imageUrl} // Replace with your actual image URL
//               alt="Doctor Profile"
//               className="w-1/2 h-1/2 rounded-full mb-6 transition-transform duration-300 transform hover:scale-105 shadow-lg object-cover"
//             />
//             <h2 className="text-xl font-semibold">{doctor.name || "Doctor Name"}</h2>
//             <p className="text-sm mt-1 opacity-80">{doctor.specialization}</p>
      
//           </div>

//           <div className="w-px bg-gray-300"></div>

//           <div className="w-2/3 p-6 flex flex-col  animate-scale-up">
//             <div className="flex justify-between items-center mb-4">
//               <h1 className="text-2xl font-semibold text-gray-800">Create a Blog Post</h1>
//               <button className="bg-gradient-to-r from-customHoverPink to-customPink text-white py-1 px-4 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-l">
//                 Logout
//               </button>
//             </div>

//             <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={handleTitleChange}
//                 placeholder="Blog Title"
//                 className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customNavyBlue hover:border-customNavyBlue transition-all"
//               />

//               {/* Select Category */}
//               <div
//                 className="relative flex flex-col"
//                 onMouseEnter={() => setDropdownOpen(true)}
//                 onMouseLeave={() => setDropdownOpen(false)}
//               >
//                 <label className="text-gray-600 mb-1">Category</label>
//                 <button
//                   type="button"
//                   className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary flex justify-between items-center w-full"
//                 >
//                   {selectedCategory || 'Select Category'}
//                   <span className="transition-transform duration-300">▼</span>
//                 </button>
//                 {isDropdownOpen && (
//                   <ul className="absolute top-full mt-0 bg-white border border-gray-300 rounded-lg w-full z-10 shadow-lg transform transition-all duration-300 origin-top">
//                     {categories.map((category) => (
//                       <li
//                         key={category.name}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setSelectedCategory(category.name);
//                           setDropdownOpen(false);
//                         }}
//                         className={`p-2 cursor-pointer transition-colors duration-200 hover:bg-customPink ${
//                           selectedCategory === category.name ? 'bg-customHoverPink text-white' : ''
//                         }`}
//                       >
//                         {category.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {/* Add Image Section */}
//               <div className="flex flex-col space-y-2">
//                 <label className="text-gray-600">Add an Image</label>
//                 <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary transition-all duration-300 ease-in-out">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                     ref={fileInputRef}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current.click()}
//                     className="bg-gradient-to-r from-[#232946] to-[#1A1E34] text-white px-4 py-2 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-l"
//                   >
//                     Upload Image
//                   </button>
//                   <span className="mt-2 text-gray-600">{image ? image.split('/').pop() : 'No file chosen'}</span>
//                   {image && (
//                     <div className="flex flex-col items-center">
//                       <img
//                         src={image}
//                         alt="Selected"
//                         className="w-64 h-48 object-cover rounded-lg mt-4 shadow-md animate-image-fade-in"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleRemoveImage}
//                         className="mt-2 bg-gradient-to-r from-customHoverPink to-customPink text-white px-3 py-1 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-l"
//                       >
//                         Remove Image
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <textarea
//                 placeholder="Write your blog content here..."
//                 rows="6"
//                 value={text}
//                 onChange={handleTextChange}
//                 className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customNavyBlue hover:border-customNavyBlue transition-all resize-none"
//               ></textarea>

//               {/* Gradient Publish Button */}
//               <button
//                 type="submit"
//                 className="mt-4 py-2 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-[#232946] to-[#1A1E34] hover:bg-gradient-to-l text-white"
//               >
//                 Publish
//               </button>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CreateBlog;




import React, { useState, useRef } from 'react';
import { db, storage } from '../firebase'; // Ensure this imports your initialized Firebase app
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDoctorDataContext } from '../context/DoctorDataContext';
import { useNavigate } from "react-router-dom";
import './CreateBlog.css';
function CreateBlog() {
  const navigate = useNavigate();
  const { selectedDoctor } = useDoctorDataContext();
  const categories = [
    { name: 'Cardiologist' },
    { name: 'Dermatologist' },
    { name: 'Pediatrician' },
    { name: 'Orthopedic' },
    { name: 'General Physician' },
    { name: 'Gynecologist' },
    { name: 'Dentist' },
    { name: 'Pulmonologist' },
  ];

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store the actual file
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file); // Set the file for upload
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
    fileInputRef.current.value = '';
  };

  const handleTitleChange = (e) => {
    const input = e.target.value;
    if (input.length <= 33) {
      setTitle(input);
    } else {
      alert('Title cannot exceed 33 characters.');
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    let imageUrl = '';

    // Check if an image file has been selected
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`); // Create a storage reference
      await uploadBytes(imageRef, imageFile); // Upload the image
      imageUrl = await getDownloadURL(imageRef); // Get the download URL
    }

    try {
      // Add a new document with the form data
      await addDoc(collection(db, 'Blog'), {
        DoctorId: selectedDoctor?.id || '', // Example Doctor ID
        category: selectedCategory,
        content: text,
        image: imageUrl,
        title: title,
        like: 0,
        createdAt: new Date().toISOString(), // Current timestamp
      });
      alert('Blog post published successfully!');
      // Reset form
      setImage(null);
      setImageFile(null);
      setSelectedCategory('');
      setTitle('');
      setText('');
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to publish blog post.');
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <main className="flex-grow w-full flex">
        <div className="bg-white shadow-lg flex w-full h-full animate-fade-in">
          <div className="w-1/3 bg-secondary text-white p-16 flex flex-col items-center animate-slide-in">
            <img
              src={selectedDoctor?.imageUrl}// Replace with your actual image URL
              alt="Doctor Profile"
              className="w-1/2 h-1/2 rounded-full mb-6 transition-transform duration-300 transform hover:scale-105 shadow-lg object-cover"
            />
            <h2 className="text-xl font-semibold">{selectedDoctor?.name || 'Doctor Name'}</h2>
            <p className="text-sm mt-1 opacity-80">{selectedDoctor?.specialization || 'Specialization'}</p>
          </div>

          <div className="w-px bg-gray-300"></div>

          <div className="w-2/3 p-6 flex flex-col  animate-scale-up">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">Create a Blog Post</h1>
              <button
                className="bg-gradient-to-r from-customHoverPink to-customPink text-white py-1 px-4 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-l"
                onClick={() => {
                  // Add your logout logic here
                  navigate('/'); // Redirect to the login page
                }}
              >
                Logout
              </button>
            </div>

            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Blog Title"
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customNavyBlue hover:border-customNavyBlue transition-all"
              />

              {/* Select Category */}
              <div
                className="relative flex flex-col"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <label className="text-gray-600 mb-1">Category</label>
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary flex justify-between items-center w-full"
                >
                  {selectedCategory || 'Select Category'}
                  <span className="transition-transform duration-300">▼</span>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute top-full mt-0 bg-white border border-gray-300 rounded-lg w-full z-10 shadow-lg transform transition-all duration-300 origin-top">
                    {categories.map((category) => (
                      <li
                        key={category.name}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(category.name);
                          setDropdownOpen(false);
                        }}
                        className={`p-2 cursor-pointer transition-colors duration-200 hover:bg-customPink ${
                          selectedCategory === category.name ? 'bg-customHoverPink text-white' : ''
                        }`}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add Image Section */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Add an Image</label>
                <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary transition-all duration-300 ease-in-out">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gradient-to-r from-[#232946] to-[#1A1E34] text-white px-4 py-2 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-l"
                  >
                    Upload Image
                  </button>
                  <span className="mt-2 text-gray-600">{image ? image.split('/').pop() : 'No file chosen'}</span>
                  {image && (
                    <div className="flex flex-col items-center">
                      <img
                        src={image}
                        alt="Selected"
                        className="w-64 h-48 object-cover rounded-lg mt-4 shadow-md animate-image-fade-in"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-2 bg-gradient-to-r from-customHoverPink to-customPink text-white px-3 py-1 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-l"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <textarea
                placeholder="Write your blog content here..."
                rows="6"
                value={text}
                onChange={handleTextChange}
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customNavyBlue hover:border-customNavyBlue transition-all resize-none"
              ></textarea>

              {/* Gradient Publish Button */}
              <button
                type="submit"
                className="mt-4 py-2 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-[#232946] to-[#1A1E34] hover:bg-gradient-to-l text-white"
              >
                Publish
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateBlog;