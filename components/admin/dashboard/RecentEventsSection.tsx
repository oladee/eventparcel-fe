import React from "react";
import Image from "next/image";
import { MdOutlineCalendarToday } from "react-icons/md";
import Link from "next/link";

interface EventItem {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  eventLocation: string;
  eventImgUrl: string;
}
interface Props {
  events: EventItem[];
}

const RecentEventsSection: React.FC<Props> = ({ events }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
      <Link
        href="/admin/admin-events"
        className="text-red-600 text-sm font-medium cursor-pointer"
      >
        See All
      </Link>
    </div>
    <div className="max-h-96 overflow-y-auto no-scrollbar mt-4 space-y-4">
      {events.map((e) => (
        <div
          key={e._id}
          className="flex flex-col justify-center p-3 rounde bg-[#FAFBFC]"
        >
          <div className="flex items-center gap-4">
            <Image
              width={50}
              height={50}
              src={e.eventImgUrl || "/images/placeholder_eventCover2.jpg"}
              alt={e.eventName}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#111827]">
                {e.eventName}
              </h4>
            </div>
          </div>
          <div className="mt-4 border-t pt-3 text-gray-700 w-full">
            <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
              <MdOutlineCalendarToday size={18} />
              <span>{`${e.date} AT ${e.time}`}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default RecentEventsSection;

// import Image from "next/image";
// import React from "react";
// import { MdOutlineCalendarToday } from "react-icons/md";

// const events = [
//   {
//     id: 1,
//     title: "James & Jane Wedding Anniversary 2025",
//     date: "12 MAR, 2025 AT 10:30AM WAT",
//     image: "/images/placeholder_eventCover2.jpg"
//   },
//   {
//     id: 2,
//     title: "James & Jane Wedding Anniversary 2025",
//     date: "12 MAR, 2025 AT 10:30AM WAT",
//     image: "/images/placeholder_eventCover2.jpg"
//   }
// ];

// const RecentEventsSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow p-6">
//     <div className="flex justify-between items-center">
//       <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
//       <a href="#" className="text-red-600 text-sm font-medium">
//         See All
//       </a>
//     </div>
//     <div className="mt-4 space-y-4">
//       {events.map((e) => (
//         <div key={e.id} className="flex flex-col justify-center p-3 rounde bg-[#FAFBFC]">
//           {/* Event Image and Title */}
//           <div className="flex items-center gap-4">
//             <Image
//               width={50}
//               height={50}
//               src={e.image}
//               alt={e.title}
//               className="rounded-lg object-cover"
//             />
//             <div className="flex-1">
//               <h4 className="font-bold text-sm text-[#111827]">{e.title}</h4>
//             </div>
//           </div>
//           {/* event date and time */}
//           <div className="mt-4 border-t pt-3 text-gray-700 w-full">
//             <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
//               <MdOutlineCalendarToday size={18} />
//               <span>{e.date}</span>
//             </div>
//           </div>
//           {/* <p className="text-gray-500 text-sm flex items-center">
//             <svg className="inline-block mr-1" width="16" height="16">
//               <path d="M8 2v12M2 8h12" stroke="#9CA3AF" />
//             </svg>
//             {e.date}
//           </p> */}
//         </div>
//       ))}
//     </div>
//   </div>
// );
// export default RecentEventsSection;
