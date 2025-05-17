"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdOutlineCalendarToday } from "react-icons/md";
import EventOptionsModal from "./EventOptionsModal";

interface EventDetailsProps {
  eventData: {
    eventImgUrl: string;
    eventName: string;
    eventDescription: string;
    date: string;
    time: string;
    eventLocation: string;
    isShared?: boolean;
  };
}

const EventDetailsSection: React.FC<EventDetailsProps> = ({ eventData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const {
    eventImgUrl,
    eventName,
    eventDescription,
    date,
    time,
    eventLocation,
    isShared
  } = eventData;

  // Format the date
  const formattedDate = (() => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();
    return `${day} ${month}, ${year}`;
  })();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");


  return (
    <div className="bg-[#fff4ed] p-4 rounded-2xl">
      {/* Image Section */}
      <div className="relative w-full rounded-xl overflow-hidden">
        <Image
          src={eventImgUrl || "/images/placeholder_eventCover2.jpg"}
          alt={eventName}
          className="w-full h-48 object-cover rounded-xl"
          width={600}
          height={400}
          quality={100}
          priority
        />

        {/* Shared tag */}
        {isShared && (
          <label className="absolute top-3 left-3 bg-[#F5E6DD] border border-primary text-primary text-sm font-medium px-4 py-1 rounded-[50px] shadow-md">
            Shared
          </label>
        )}

        {/* More Options Button */}
        {!isShared && loggedInUser.role !== "cohost" && (
          <button
            onClick={toggleModal}
            className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md"
          >
            <FiMoreHorizontal size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Details Section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {eventName}
        </h2>
        <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
          {eventDescription}
        </p>

        {/* Event Info */}
        <div className="mt-4 border-t pt-3 text-gray-700">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MdOutlineCalendarToday size={18} />
            <span>
              {formattedDate} at {time}
            </span>
          </div>
          <p className="text-sm mt-1 text-gray-500">{eventLocation}</p>
        </div>
      </div>

      {/* Modal */}
      <EventOptionsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        eventData={eventData}
      />
    </div>
  );
};

export default EventDetailsSection;

// // "use client";

// import Image from "next/image";
// import React, { useState } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { MdOutlineCalendarToday } from "react-icons/md";
// import EventOptionsModal from "./EventOptionsModal";

// interface EventDetailsProps {
//   eventData: {
//     eventImgUrl: string;
//     eventName: string;
//     eventDescription: string;
//     date: string;
//     time: string;
//     eventLocation: string;
//     isShared?: boolean;
//   };
// }

// const EventDetailsSection: React.FC<EventDetailsProps> = ({ eventData }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const toggleModal = () => setIsModalOpen((prev) => !prev);
//   const {
//     eventImgUrl,
//     eventName,
//     eventDescription,
//     date,
//     time,
//     eventLocation,
//     isShared
//   } = eventData;

//   return (
//     <div className="bg-[#fff4ed] p-4 rounded-2xl">
//       {/* Image Section */}
//       <div className="relative w-full rounded-xl overflow-hidden">
//         <Image
//           src={
//             eventImgUrl ? eventImgUrl : "/images/placeholder_eventCover2.jpg"
//           }
//           alt={eventName}
//           className="w-full h-48 object-cover rounded-xl"
//           width={600}
//           height={400}
//           quality={100}
//           priority
//         />

//         {/* Shared tag */}
//         {isShared && (
//           <label className="absolute top-3 left-3 bg-[#F5E6DD] border border-primary text-primary text-sm font-medium px-4 py-1 rounded-[50px] shadow-md">
//             Shared
//           </label>
//         )}

//         {/* More Options Button */}
//         <button
//           onClick={toggleModal}
//           className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md"
//         >
//           <FiMoreHorizontal size={20} className="text-gray-600" />
//         </button>
//       </div>

//       {/* Details Section */}
//       <div className="mt-4">
//         <h2 className="text-xl font-bold text-gray-900 capitalize">
//           {eventName}
//         </h2>
//         <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
//           {eventDescription}
//         </p>

//         {/* Event Info */}
//         <div className="mt-4 border-t pt-3 text-gray-700">
//           <div className="flex items-center gap-2 text-sm font-semibold">
//             <MdOutlineCalendarToday size={18} />
//             <span>
//               {date} at {time}
//             </span>
//           </div>
//           <p className="text-sm mt-1 text-gray-500">{eventLocation}</p>
//         </div>
//       </div>
//       <EventOptionsModal
//         isOpen={isModalOpen}
//         onClose={toggleModal}
//         eventData={eventData}
//       />
//     </div>
//   );
// };

// export default EventDetailsSection;

// "use client";

// import Image from "next/image";
// import React, { useState } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { MdOutlineCalendarToday } from "react-icons/md";
// import EventOptionsModal from "./EventOptionsModal";

// const EventDetailsSection = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const toggleModal = () => setIsModalOpen((prev) => !prev);
//   return (
//     <div className="bg-[#fff4ed] p-4 rounded-2xl">
//       {/* Image Section */}
//       <div className="relative w-full rounded-xl overflow-hidden">
//       <Image
//           src="https://placehold.co/600x400/png"
//           alt="Invitation"
//           className="w-full h-48 object-cover rounded-xl"
//           width={600}
//           height={400}
//         />
//         {/* More Options Button */}

//         <button
//           onClick={toggleModal}
//           className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
//         >
//           <FiMoreHorizontal size={20} className="text-gray-600" />
//         </button>
//       </div>

//       {/* Details Section */}
//       <div className="mt-4">
//         <h2 className="text-xl font-bold text-gray-900">
//           James & Jane Wedding Anniversary 2025
//         </h2>
//         <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
//           Are you ready to fly again? JKT48 will soon be celebrating its 11th
//           anniversary through the JKT48 11th Anniversary: Flying High. Fasten
//           your seat belt, because JKT48 will invite you to fly higher into the
//           sky. Together, we will witness the beauty of the sky and the stars. We
//           will also see the beauty of the earth from the sky. We will fly high
//         </p>

//         {/* Event Info */}
//         <div className="mt-4 border-t pt-3 text-gray-700">
//           <div className="flex items-center gap-2 text-sm font-semibold">
//             <MdOutlineCalendarToday size={18} className="" />
//             <span>12 MAR, 2025 AT 10:30AM WAT</span>
//           </div>
//           <p className="text-sm mt-1 text-gray-500">
//             Jaja Hall, 18 Olumo Street, Onike, Yaba, Lagos.
//           </p>
//         </div>
//       </div>
//       <EventOptionsModal isOpen={isModalOpen} onClose={toggleModal} />
//     </div>
//   );
// };

// export default EventDetailsSection;
