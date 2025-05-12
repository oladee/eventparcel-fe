"use client";

import React from "react";
import { GrLocation } from "react-icons/gr";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { PiPhoneBold } from "react-icons/pi";
import { HostDetails, PickupDetails } from "@/types/host";

interface Props {
  host: HostDetails;
  pickup: PickupDetails;
}

const HostSidebarInfo: React.FC<Props> = ({ host, pickup }) => (
  <div className="space-y-6">
    {/* Host Details */}
    <div className="bg-white rounded-2xl p-4">
      <h4 className="text-xl font-bold text-[#111827]">Host Details</h4>
      <div className="mt-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#8C62FF] flex items-center justify-center font-semibold text-white">
          {host.hostName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-semibold text-black-100">{host.hostName}</p>
          <p className="text-[#718096] text-sm">{host.location}</p>
        </div>
      </div>
      <div className="border-t border-[#EEEFF2] mt-4 pt-3 space-y-2">
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <HiOutlineEnvelope size={20} /> {host.email}
        </div>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <PiPhoneBold size={20} /> {host.phoneNumber}
        </div>
      </div>
    </div>

    {/* Pickup Details */}
    <div className="bg-white rounded-2xl p-4">
      <h4 className="text-lg font-bold text-[#111827]">Pickup Details</h4>
      <div className="border-t border-[#EEEFF2] mt-3 pt-3 space-y-2">
        <p className="font-semibold">{pickup.contactName}</p>
        <p className="text-[#718096] text-sm">{pickup.location}</p>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <HiOutlineEnvelope size={20} /> {pickup.email}
        </div>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <PiPhoneBold size={20} /> {pickup.phoneNumber}
        </div>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <GrLocation size={20} /> {pickup.pickUpLocation}
        </div>
      </div>
    </div>
  </div>
);

export default HostSidebarInfo;











// import React from "react";
// import { GrLocation } from "react-icons/gr";
// import { HiOutlineEnvelope } from "react-icons/hi2";
// import { PiPhoneBold } from "react-icons/pi";

// const HostSidebarInfo: React.FC = () => (
//   <div className="space-y-6">
//     {/* host details */}
//     <div className="bg-white rounded-2xl p-4">
//       <div className="flex items-start justify-between">
//         <h4 className="text-xl font-bold text-[#111827] ">Host Details</h4>
//         {/* <FiMoreHorizontal className="text-[#A0AEC0]" size={20} /> */}
//       </div>
//       {/* host info */}
//       <div className="mt-2 pt-3 flex items-center">
//         {/* avatar */}
//         <div className="w-12 h-12 rounded-full bg-[#8C62FF] flex items-center justify-center font-semibold text-white text-sm">
//           DB
//         </div>
//         {/* name and email */}
//         <div className="ml-3">
//           <p className="font-semibold text-black-100">Darcel Ballentine</p>
//           <p className="text-[#718096] text-sm">Lagos, NG</p>
//         </div>
//       </div>
//       {/* contact info */}
//       <div className="border-t border-[#EEEFF2] mt-2 pt-3 space-y-4">
//         <p className="font-bold text-black-100">Contact Information</p>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <HiOutlineEnvelope className="text-[#A0AEC0]" size={24} />{" "}
//           darcelballentine@mail.com
//         </div>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <PiPhoneBold className="text-[#A0AEC0]" size={24} />
//           (671) 555-0110
//         </div>
//       </div>
//     </div>

//     {/* Pickup details */}
//     <div className="bg-white rounded-2xl p-6">
//       <h4 className="text-lg font-bold text-black-100">Pickup Details</h4>
//       <div className="mt-2 border-t border-[#EEEFF2] pt-3">
//         <p className="font-semibold">Darcel Ballentine</p>
//         <p className="text-[#718096] text-sm">Lagos, NG</p>
//       </div>
//       <div className="mt-2 border-t border-[#EEEFF2] pt-3 space-y-4">
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <HiOutlineEnvelope className="text-[#A0AEC0]" size={24} />{" "}
//           darcelballentine@mail.com
//         </div>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <PiPhoneBold className="text-[#A0AEC0]" size={24} />
//           (671) 555-0110
//         </div>
//       </div>
//       <div className="flex items-start gap-3 mt-2 text-[#A0AEC0] font-medium border-t border-[#EEEFF2] pt-3">
//         <GrLocation size={24} />
//         <p className="text-sm text-[#718096]">
//           2715 Ash Dr. San Jose, South Dakota 83475
//         </p>
//       </div>
//     </div>
//   </div>
// );

// export default HostSidebarInfo;
