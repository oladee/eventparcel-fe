"use client"


import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import React from "react";
import { FiMoreHorizontal, FiCalendar } from "react-icons/fi";

interface Props {
  id: number;
  image: string;
  title: string;
  date: string;
  location: string;
  sales: string;
  packagesSold: number;
}

const EventCard: React.FC<Props> = ({
  id,
  image,
  title,
  date,
  location,
  sales,
  packagesSold
}) => {
  const router = useRouter(); 

  const handleClick = () => {
    router.push(`admin-events/${id}`); 
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
      <div className="relative px-4 pt-4">
        <Image
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-[7px]"
          width={100}
          height={100}
        />
        <button className="absolute top-6 right-6 bg-white p-2 rounded-[7px] shadow">
          <FiMoreHorizontal className="text-[#718096] text-xl" />
        </button>
      </div>
      <div
        onClick={handleClick}
        className="p-4 flex-1 flex flex-col cursor-pointer"
      >
        <h3 className="text-lg font-bold text-[#111827] leading-tight pb-4 border-b border-[#CBD5E0]">
          {title}
        </h3>
        <p className="mt-2 text-[#111827] font-medium text-sm flex items-center">
          <FiCalendar className="mr-2" />
          {date}
        </p>
        <p className="text-[#78858F] font-medium text-sm mt-1">{location}</p>
        <div className="pt-4 flex items-center justify-between">
          <div>
            <span className="text-[#751423] font-semibold text-lg">{sales}</span>
            <p className="text-[#718096] text-xs">Overall sales</p>
          </div>
          <div className="border-l pl-4">
            <span className="text-[#111827] font-semibold text-lg">
              {packagesSold}
            </span>
            <p className="text-[#718096] text-xs">Package Sold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;













// import Image from "next/image";
// import React from "react";
// import { FiMoreHorizontal, FiCalendar } from "react-icons/fi";

// interface Props {
//   id: number;
//   image: string;
//   title: string;
//   date: string;
//   location: string;
//   sales: string;
//   packagesSold: number;
// }

// const EventCard: React.FC<Props> = ({
//   image,
//   title,
//   date,
//   location,
//   sales,
//   packagesSold
// }) => 
  
//   (
//   <div className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
//     <div className="relative px-4 pt-4">
//       <Image
//         src={image}
//         alt={title}
//         className="w-full h-40 object-cover rounded-[7px]"
//         width={100}
//         height={100}
//       />
//       <button className="absolute top-6 right-6 bg-white p-2 rounded-[7px] shadow">
//         <FiMoreHorizontal className="text-[#718096] text-xl" />
//       </button>
//     </div>
//     <div
//       className="p-4 flex-1 flex flex-col cursor-pointer"
//     >
//       <h3 className="text-lg font-bold text-[#111827] leading-tight pb-4 border-b border-[#CBD5E0]">
//         {title}
//       </h3>
//       <p className="mt-2 text-[#111827] font-medium text-sm flex items-center">
//         <FiCalendar className="mr-2" />
//         {date}
//       </p>
//       <p className="text-[#78858F] font-medium text-sm mt-1">{location}</p>
//       <div className="pt-4 flex items-center justify-between">
//         <div>
//           <span className="text-[#751423] font-semibold text-lg">{sales}</span>
//           <p className="text-[#718096] text-xs">Overall sales</p>
//         </div>
//         <div className="border-l pl-4">
//           <span className="text-[#111827] font-semibold text-lg">
//             {packagesSold}
//           </span>
//           <p className="text-[#718096] text-xs">Package Sold</p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default EventCard;
