"use client";


import Image from "next/image";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdOutlineCalendarToday } from "react-icons/md";
import EventOptionsModal from "./EventOptionsModal";

const EventDetailsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  return (
    <div className="bg-[#fff4ed] p-4 rounded-2xl">
      {/* Image Section */}
      <div className="relative w-full rounded-xl overflow-hidden">
      <Image
          src="https://placehold.co/600x400/png"
          alt="Invitation"
          className="w-full h-48 object-cover rounded-xl"
          width={600}
          height={400}
        />
        {/* More Options Button */}

        <button
          onClick={toggleModal}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
        >
          <FiMoreHorizontal size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Details Section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold text-gray-900">
          James & Jane Wedding Anniversary 2025
        </h2>
        <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
          Are you ready to fly again? JKT48 will soon be celebrating its 11th
          anniversary through the JKT48 11th Anniversary: Flying High. Fasten
          your seat belt, because JKT48 will invite you to fly higher into the
          sky. Together, we will witness the beauty of the sky and the stars. We
          will also see the beauty of the earth from the sky. We will fly high
        </p>

        {/* Event Info */}
        <div className="mt-4 border-t pt-3 text-gray-700">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MdOutlineCalendarToday size={18} className="" />
            <span>12 MAR, 2025 AT 10:30AM WAT</span>
          </div>
          <p className="text-sm mt-1 text-gray-500">
            Jaja Hall, 18 Olumo Street, Onike, Yaba, Lagos.
          </p>
        </div>
      </div>
      <EventOptionsModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default EventDetailsSection;






// const EventDetailsSection: React.FC = () => {
//   return (
//     <div>
//       {/* Top Banner Section */}
//       <div
//         className="relative w-full h-52 bg-cover bg-center flex flex-col items-center justify-center"
//         style={{ backgroundImage: 'url("/images/banner-bg.jpg")' }} // Replace with your actual banner image
//       >
//         {/* Semi-transparent overlay for text */}
//         <div className="bg-white/90 p-4 rounded-md text-center max-w-2xl mx-auto">
//           <p className="text-xs uppercase tracking-wider text-gray-600">
//             You are invited to
//           </p>
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
//             James &amp; Jane Wedding Anniversary 2025
//           </h1>
//           <p className="text-sm text-gray-700 mt-2">
//             12 MAR, 2025 AT 10:30AM WAT
//           </p>
//           <p className="text-sm text-gray-700">
//             Jaja Hall, 18 Odun Street, Onike, Yaba, Lagos.
//           </p>
//         </div>
//       </div>

//       {/* Optional Intro Text */}
//       <div className="mt-6 px-4 md:px-8 lg:px-16 text-center text-sm text-gray-600 leading-relaxed">
//         In this year of our next, JKT48 will soon be celebrating its 11th
//         anniversary through the JKT48 11th Anniversary: Flying High. Fasten your
//         seat belt, because JKT48 will land on your city soon. Through the next
//         show, we will witness the beauty of…
//       </div>
//     </div>
//   );
// };

// export default EventDetailsSection;
