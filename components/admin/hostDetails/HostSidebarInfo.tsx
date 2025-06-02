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
          <p className="font-semibold text-black-100 capitalize">
            {host.hostName}
          </p>
          {/* <p className="text-[#718096] text-sm">{host.location}</p> */}
        </div>
      </div>
      <div className="border-t border-[#EEEFF2] mt-4 pt-3 space-y-2">
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <HiOutlineEnvelope size={20} /> {host.email}
        </div>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <PiPhoneBold size={20} />   {host.phoneNumber ? host.phoneNumber : "Not provided"}
        </div>
      </div>
    </div>

    {/* Pickup Details */}
    <div className="bg-white rounded-2xl p-4">
      <h4 className="text-lg font-bold text-[#111827]">Pickup Details</h4>
      <div className="border-t border-[#EEEFF2] mt-3 pt-3 space-y-2">
        <p className="font-semibold capitalize">{pickup.contactName}</p>
        {/* <p className="text-[#718096] text-sm">{pickup.location}</p> */}
        {pickup.email && (
          <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
            <HiOutlineEnvelope size={20} /> {pickup.email}
          </div>
        )}
        {pickup.phoneNumber && (
          <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
            <PiPhoneBold size={20} /> {pickup.phoneNumber}
          </div>
        )}
        {pickup.pickUpLocation && (
          <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
            <GrLocation size={20} /> {pickup.pickUpLocation}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default HostSidebarInfo;














// "use client";

// import React from "react";
// import { GrLocation } from "react-icons/gr";
// import { HiOutlineEnvelope } from "react-icons/hi2";
// import { PiPhoneBold } from "react-icons/pi";
// import { HostDetails, PickupDetails } from "@/types/host";

// interface Props {
//   host: HostDetails;
//   pickup: PickupDetails;
// }

// const HostSidebarInfo: React.FC<Props> = ({ host, pickup }) => (
//   <div className="space-y-6">
//     {/* Host Details */}
//     <div className="bg-white rounded-2xl p-4">
//       <h4 className="text-xl font-bold text-[#111827]">Host Details</h4>
//       <div className="mt-3 flex items-center gap-3">
//         <div className="w-10 h-10 rounded-full bg-[#8C62FF] flex items-center justify-center font-semibold text-white">
//           {host.hostName
//             .split(" ")
//             .map((n) => n[0])
//             .join("")}
//         </div>
//         <div>
//           <p className="font-semibold text-black-100 capitalize">{host.hostName}</p>
//           {/* <p className="text-[#718096] text-sm">{host.location}</p> */}
//         </div>
//       </div>
//       <div className="border-t border-[#EEEFF2] mt-4 pt-3 space-y-2">
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <HiOutlineEnvelope size={20} /> {host.email}
//         </div>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <PiPhoneBold size={20} /> {host.phoneNumber}
//         </div>
//       </div>
//     </div>

//     {/* Pickup Details */}
//     <div className="bg-white rounded-2xl p-4">
//       <h4 className="text-lg font-bold text-[#111827]">Pickup Details</h4>
//       <div className="border-t border-[#EEEFF2] mt-3 pt-3 space-y-2">
//         <p className="font-semibold capitalize">{pickup.contactName}</p>
//         <p className="text-[#718096] text-sm">{pickup.location}</p>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <HiOutlineEnvelope size={20} /> {pickup.email}
//         </div>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <PiPhoneBold size={20} /> {pickup.phoneNumber}
//         </div>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <GrLocation size={20} /> {pickup.pickUpLocation}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default HostSidebarInfo;
