"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdOutlineCalendarToday } from "react-icons/md";
import EventOptionsModal from "./EventOptionsModal";
import { useRouter } from "next-nprogress-bar";

interface EventDetailsProps {
  eventData: Array<{
    isDraft: React.JSX.Element;
    isDrafted: React.JSX.Element;
    _id: string;
    eventImgUrl: string;
    eventName: string;
    eventDescription: string;
    date: string;
    time: string;
    eventLocation: string;
    isShared?: boolean;
  }>;
}

const EventDetailsSection2: React.FC<EventDetailsProps> = ({ eventData }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    null | (typeof eventData)[0]
  >(null);

  const toggleModal = (event: (typeof eventData)[0]) => {
    setSelectedEvent(event);
    setIsModalOpen((prev) => !prev);
  };

  const handleViewOneEvent = (eventId: string) => {
    console.log(eventId);
    localStorage.setItem("eventId", eventId);
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleCreateNewEvent = () => {
    router.push("/dashboard/event-creation");
  };

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  return (
    <>
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h1 className="capitalize text-2xl md:text-4xl text-[#111827] font-bold font-general">
            Events
          </h1>
          <button
            onClick={handleCreateNewEvent}
            className="flex items-center outline-none"
          >
            <Image src="/images/plus.png" alt="plus" width={32} height={32} />
            <span className="font-general font-medium text-base text-[#751423] capitalize">
              Create New
            </span>
          </button>
          {/* {loggedInUser.role !== "cohost" && (
            <button
              onClick={handleCreateNewEvent}
              className="flex items-center outline-none"
            >
              <Image src="/images/plus.png" alt="plus" width={32} height={32} />
              <span className="font-general font-medium text-base text-[#751423] capitalize">
                Create New
              </span>
            </button>
          )} */}
        </div>
        {eventData.map((event, i) => {
          const formattedDate = (() => {
            const dateObj = new Date(event.date);
            const day = dateObj.getDate().toString().padStart(2, "0");
            const month = dateObj.toLocaleString("default", { month: "short" });
            const year = dateObj.getFullYear();
            return `${day} ${month}, ${year}`;
          })();

          return (
            <div key={i} className="bg-[#fff4ed] p-4 rounded-2xl mb-4">
              {/* Image Section */}
              <div className="relative w-full rounded-xl overflow-hidden">
                <Image
                  src={
                    event.eventImgUrl
                      ? event.eventImgUrl
                      : "/images/placeholder_eventCover2.jpg"
                  }
                  alt={event.eventName}
                  className="w-full h-48 object-cover rounded-xl"
                  width={600}
                  height={400}
                  quality={100}
                  priority
                />

                {/* Shared tag */}
                {event?.isShared && (
                  <label className="absolute top-3 left-3 bg-[#F5E6DD] border border-primary text-primary text-sm font-medium px-4 py-1 rounded-[50px] shadow-md">
                    Shared
                  </label>
                )}

                {event?.isDraft && (
                  <label className="absolute top-3 left-3 bg-[#F5E6DD] border border-primary text-primary text-sm font-medium px-4 py-1 rounded-[50px] shadow-md">
                    Drafted
                  </label>
                )}

                {/* More Options Button */}
                {!event?.isShared && loggedInUser.role !== "cohost" && (
                  <button
                    onClick={() => toggleModal(event)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md"
                  >
                    <FiMoreHorizontal size={20} className="text-gray-600" />
                  </button>
                )}
              </div>

              {/* Details Section */}
              <div
                onClick={() => handleViewOneEvent(event._id)}
                className="mt-4 cursor-pointer"
              >
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {event.eventName}
                </h2>
                <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
                  {event.eventDescription}
                </p>

                {/* Event Info */}
                <div className="mt-4 border-t pt-3 text-gray-700">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MdOutlineCalendarToday size={18} />
                    <span
                      id="date-text"
                      className="font-medium text-sm text-[#111827]"
                    >
                      {formattedDate} at {event.time} WAT
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-500">
                    {event.eventLocation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && selectedEvent && (
        <EventOptionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventData={selectedEvent}
        />
      )}
    </>
  );
};

export default EventDetailsSection2;

// "use client";

// import Image from "next/image";
// import React, { useState } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { MdOutlineCalendarToday } from "react-icons/md";
// import EventOptionsModal from "./EventOptionsModal";
// import { useRouter } from "next-nprogress-bar";

// interface EventDetailsProps {
//   eventData: Array<{
//     isDraft: React.JSX.Element;
//     isDrafted: React.JSX.Element;
//     _id: string;
//     eventImgUrl: string;
//     eventName: string;
//     eventDescription: string;
//     date: string;
//     time: string;
//     eventLocation: string;
//     isShared?: boolean;
//     // ... include any additional fields you want to use
//   }>;
// }

// const EventDetailsSection2: React.FC<EventDetailsProps> = ({ eventData }) => {
//   const router = useRouter();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   console.log(eventData);

//   const toggleModal = (event: any) => {
//     setSelectedEvent(event);
//     setIsModalOpen((prev) => !prev);
//   };

//   const handleViewOneEvent = (eventId: any) => {
//     console.log(eventId);
//     localStorage.setItem("eventId", eventId);
//     router.push(`/dashboard/events/${eventId}`);
//   };

//   const handleCreateNewEvent = () => {
//     router.push("/dashboard/event-creation");
//   };

//   return (
//     <>
//       <div className="">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="capitalize text-2xl md:text-4xl text-[#111827] font-bold font-general">
//             Events
//           </h1>
//           <button
//             onClick={handleCreateNewEvent}
//             className="flex items-center outline-none"
//           >
//             <Image src="/images/plus.png" alt="plus" width={32} height={32} />
//             <span className="font-general font-medium text-base text-[#751423] capitalize">
//               Create New
//             </span>
//           </button>
//         </div>
//         {eventData.map((event, i) => (
//           <div key={i} className="bg-[#fff4ed] p-4 rounded-2xl mb-4">
//             {/* Image Section */}
//             <div className="relative w-full rounded-xl overflow-hidden">
//               <Image
//                 src={
//                   event.eventImgUrl
//                     ? event.eventImgUrl
//                     : "/images/placeholder_eventCover2.jpg"
//                 }
//                 alt={event.eventName}
//                 className="w-full h-48 object-cover rounded-xl"
//                 width={600}
//                 height={400}
//                 quality={100}
//                 priority
//               />

//               {/* Shared tag */}
//               {event?.isShared && (
//                 <label className="absolute top-3 left-3 bg-[#F5E6DD] border border-primary text-primary text-sm font-medium px-4 py-1 rounded-[50px] shadow-md">
//                   Shared
//                 </label>
//               )}

//               {event?.isDraft && (
//                 <label className="absolute top-3 left-3 bg-[#F5E6DD] border border-primary text-primary text-sm font-medium px-4 py-1 rounded-[50px] shadow-md">
//                   Drafted
//                 </label>
//               )}

//               {/* More Options Button */}
//               <button
//                 onClick={() => toggleModal(event)}
//                 className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md"
//               >
//                 <FiMoreHorizontal size={20} className="text-gray-600" />
//               </button>
//             </div>

//             {/* Details Section */}
//             <div
//               onClick={() => handleViewOneEvent(event._id)}
//               className="mt-4 cursor-pointer"
//             >
//               <h2 className="text-xl font-bold text-gray-900 capitalize">
//                 {event.eventName}
//               </h2>
//               <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
//                 {event.eventDescription}
//               </p>

//               {/* Event Info */}
//               <div className="mt-4 border-t pt-3 text-gray-700">
//                 <div className="flex items-center gap-2 text-sm font-semibold">
//                   <MdOutlineCalendarToday size={18} />
//                   <span>
//                     {event.date} at {event.time}
//                   </span>
//                 </div>
//                 <p className="text-sm mt-1 text-gray-500">
//                   {event.eventLocation}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {isModalOpen && selectedEvent && (
//         <EventOptionsModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           eventData={selectedEvent}
//         />
//       )}
//     </>
//   );
// };

// export default EventDetailsSection2;
