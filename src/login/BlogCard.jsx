import React, { useEffect, useRef, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

const BlogCard = ({ id, title, content, doctorName, likes: initialLikes, image }) => {
  const [visible, setVisible] = useState(false);
  const [isFullPostVisible, setIsFullPostVisible] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const cardRef = useRef(null);

  const MAX_CHARACTERS = 60;
  const MAX_HEADING_LENGTH = 15;

  const truncateText = (text, maxCharacters) =>
    text.length > maxCharacters ? text.slice(0, maxCharacters) + "…" : text;

  const truncateHeading = (heading, maxLength) =>
    heading.length > maxLength ? heading.slice(0, maxLength) + "…" : heading;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleReadMore = () => {
    setIsFullPostVisible(true);
  };

  const handleBack = () => {
    setIsFullPostVisible(false);
  };
  
  const handleLike = async () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes); // Update local state optimistically

    try {
      const blogDocRef = doc(db, 'Blog', id); // Reference Firestore document
      await updateDoc(blogDocRef, { like: updatedLikes }); // Update only the likes field
      console.log('Likes updated successfully in the database.');
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (


    <div>
      {isFullPostVisible ? (
        <div
          className="fixed inset-0 bg-cover bg-center z-50 overflow-hidden bg-no-repeat bg-fixed h-screen"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <img
            className="fixed inset-0 bg-cover bg-center z-100 overflow-hidden w-full object-cover"
            src={image}
            alt={title}
          />
          <button
            className="text-customWhite bg-gradient-to-r from-customBlue to-customHoverBlue px-4 py-2 rounded-lg shadow-lg m-4 hover:from-customHoverBlue hover:to-customBlue transition duration-300 transform hover:scale-105 focus:outline-none"
            onClick={handleBack}
          >
            ← Back
          </button>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white/30 backdrop-blur-lg rounded-lg p-8 max-w-3xl mx-4 text-customHoverNavy">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-semibold text-left">{title}</h2>
                <span className="px-3 py-1 text-sm font-semibold text-white bg-customNavyBlue rounded-full">
                  {doctorName}
                </span>
              </div>
              <p className="text-lg leading-relaxed text-customNavyBlue">{content}</p>
              <div className="flex items-center justify-center space-x-4 pt-6">
                <button
                  className="px-6 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
                  type="button"
                  onClick={handleLike}
                >
                  👍 Like
                </button>
                <span className="text-customWhite text-lg font-medium">{likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={cardRef}
          style={{
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            marginBottom: '2rem',
          }}
          className="relative flex flex-col bg-customWhite rounded-lg shadow-lg overflow-hidden min-h-[472px]"
        >
          <div className="relative w-full lg:w-full h-64 bg-cover bg-center">
            <img
              src={image}
              alt={title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80"></div>
          </div>
          <div className="flex flex-col justify-between p-4 space-y-4 text-customNavyBlue">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold leading-tight text-customNavyBlue">
                {truncateHeading(title, MAX_HEADING_LENGTH)}
              </h2>
              <span className="px-3 py-1 text-sm font-semibold text-white bg-customNavyBlue rounded-full">
                {doctorName}
              </span>
            </div>
            <p className="text-customNavyBlue text-lg leading-relaxed">
              {truncateText(content, MAX_CHARACTERS)}
            </p>
            <div className="flex items-center justify-center space-x-4 pt-2">
              <button
                className="px-6 py-2 bg-gradient-to-r from-customBlue to-customHoverBlue text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
                type="button"
                onClick={handleReadMore}
              >
                Read More
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
                type="button"
                onClick={handleLike}
              >
                👍 Like
              </button>
              <span className="text-customNavyBlue text-lg font-medium">{likes} likes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCard;

// import React, { useEffect, useRef, useState } from 'react';

// const BlogCard = ({ title, content, doctorName, likes,image }) => {
//   const [visible, setVisible] = useState(false);
//   const [isFullPostVisible, setIsFullPostVisible] = useState(false);
  
//   const cardRef = useRef(null);

//   const MAX_CHARACTERS = 90; // Maximum words for main page content
//   const MAX_HEADING_LENGTH = 15; // Maximum characters for heading

//   const truncateText = (text, maxCharacters) => {
//     return text.length > maxCharacters ? text.slice(0, maxCharacters) + "…" : text;
//   };
//   const truncateHeading = (heading, maxLength) => {
//     return heading.length > maxLength ? heading.slice(0, maxLength) + "…" : heading;
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setVisible(true);
//             observer.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     if (cardRef.current) observer.observe(cardRef.current);

//     return () => {
//       if (cardRef.current) observer.unobserve(cardRef.current);
//     };
//   }, []);

//   const handleReadMore = () => {
//     setIsFullPostVisible(true);
//   };

//   const handleBack = () => {
//     setIsFullPostVisible(false);
//   };
//   // 


//     console.log(image) // Debugging the image URL
//   return (
// <div>
//   {isFullPostVisible ? (
//     <div
//       className="fixed inset-0 bg-cover bg-center z-50 overflow-hidden bg-no-repeat bg-fixed h-screen"
//       style={{
//         backgroundImage: `url(${image})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
  

//       <img
//       className="fixed inset-0 bg-cover bg-center z-100 overflow-hidden w-full  object-cover" 
//         src={image} 
//         alt={title} 

//       />
//       <button
//         className="text-customWhite bg-gradient-to-r from-customBlue to-customHoverBlue px-4 py-2 rounded-lg shadow-lg m-4 hover:from-customHoverBlue hover:to-customBlue transition duration-300 transform hover:scale-105 focus:outline-none"
//         onClick={handleBack}
//       >
//         ← Back
//       </button>
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-white/30 backdrop-blur-lg rounded-lg p-8 max-w-3xl mx-4 text-customHoverNavy">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-3xl font-semibold text-left">{title}</h2>
//             <span className="px-3 py-1 text-sm font-semibold text-white bg-customNavyBlue rounded-full">
//               {doctorName}
//             </span>
//           </div>
//           <p className="text-lg leading-relaxed text-customNavyBlue">{content}</p>
//           <div className="flex items-center justify-center space-x-4 pt-6">
//             <button
//               className="px-6 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
//               type="button"
//             >
//               👍 Like
//             </button>
//             <span className="text-customWhite text-lg font-medium">{likes} likes</span>
//           </div>
//         </div>
//       </div>
//     </div>
//       ) : (
//         <div
//           ref={cardRef}
//           style={{
//             transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
//             opacity: visible ? 1 : 0,
//             transform: visible ? 'translateY(0)' : 'translateY(10px)',
//             marginBottom: '2rem',
//           }}
//           className="relative flex flex-col bg-customWhite rounded-lg shadow-lg overflow-hidden min-h-[472px]"
//         >
//           <div
//             className="relative w-full lg:w-full h-64 bg-cover bg-center"
//             style={{
              
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//             }}
//           >
//             <img 
//             src={image} 
//             alt={title} 
//             className="w-full h-64 object-cover" 
//           />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80"></div>
//           </div>
//           <div className="flex flex-col justify-between p-4 space-y-4 text-customNavyBlue">
//             <div className="flex items-center justify-between">
//               <h2 className="text-3xl font-semibold leading-tight text-customNavyBlue">
//                 {truncateHeading(title, MAX_HEADING_LENGTH)}
//               </h2>
//               <span className="px-3 py-1 text-sm font-semibold text-white bg-customNavyBlue rounded-full">
//                 {doctorName}
//               </span>
//             </div>
//             <p className="text-customNavyBlue text-lg leading-relaxed">
//               {truncateText(content, MAX_CHARACTERS)}
//             </p>
//             <div className="flex items-center justify-center space-x-4 pt-2">
//               <button
//                 className="px-6 py-2 bg-gradient-to-r from-customBlue to-customHoverBlue text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
//                 type="button"
//                 onClick={handleReadMore}
//               >
//                 Read More
//               </button>
//               <button
//                 className="px-6 py-2 bg-gradient-to-r from-customHoverPink to-customPink text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
//                 type="button"
                
//               >
//                 👍 Like
//               </button>
//               <span className="text-customNavyBlue text-lg font-medium">{likes} likes</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogCard;



