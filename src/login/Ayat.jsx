import React, { useEffect, useRef, useState } from 'react';
import './Ayat.css';

const Ayat = () => {
  const notices = [
    "Make use of medical treatment, for Allah has not made a disease without appointing a remedy for it, with the exception of one disease, namely old age",
    "Health check-up camp scheduled for next week.",
    "New timings for patient consultation.",
    "Flu vaccine now available at the health center.",
    "Meeting for staff on Friday at 3 PM in the conference room.",
    "Additional meeting for managers next Monday.",
    "Mandatory training sessions on cyber security.",
    "Additional meeting for managers next Monday.",
    "Mandatory training sessions on cyber security.",
    "Additional meeting for managers next Monday.",
    "Mandatory training sessions on cyber security.",
    "Mandatory training sessions on cyber security.",
    "Additional meeting for managers next Monday.",
    "Mandatory training sessions on cyber security.",
    "Additional meeting for managers next Monday.",
    "Mandatory training sessions on cyber security.",
    
  ];

  const [visibleIndices, setVisibleIndices] = useState([]);

  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'), 10);
            setVisibleIndices((prevVisibleIndices) =>
              prevVisibleIndices.includes(index) ? prevVisibleIndices : [...prevVisibleIndices, index]
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.notice-item');
    items.forEach((item) => observer.current.observe(item));

    return () => observer.current.disconnect();
  }, []);

  return (
    <div className="notice-board max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg h-[465px] transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notice Board</h2>
      <ul className="notices-list list-disc pl-6 space-y-2 text-gray-700">
        {notices.map((notice, index) => (
          <li
            key={index}
            data-index={index}
            className={`notice-item ${
              visibleIndices.includes(index) ? 'scale-105 opacity-100' : 'opacity-0'
            } transform transition-all duration-300`}
          >
            {notice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ayat;