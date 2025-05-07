"use client"
import Image from "next/image"
import React from "react"
// import { AiOutlineEdit } from "react-icons/ai"

// the shape of each package under an eventGroup
export interface Package {
  _id: string
  packageImgUrls: string[]
  packageTitle: string
  packagePrice: number
}

export interface Props {
  id: string
  title: string
  // a group here is really an event
  packages: Package[]
}

const GroupCard: React.FC<Props> = ({ id, title, packages }) => (
  <div key={id} className="bg-white rounded-2xl p-6 flex flex-col">
    <h4 className="text-xl font-semibold text-black-100">{title}</h4>
    <p className="text-[#718096] text-sm mb-4">
      {/* you could put an event description here if you have one */}
    </p>
    <h5 className="text-base font-semibold text-[#111827] mb-2">
      Packages
    </h5>
    <div className="space-y-4 max-h-56 overflow-y-auto no-scrollbar">
      {packages.map(pkg => (
        <div
          key={pkg._id}
          className="border rounded-xl p-3 flex items-center gap-4"
        >
          <Image
            src={pkg.packageImgUrls[0]}
            alt={pkg.packageTitle}
            width={64}
            height={64}
            className="w-16 h-16 rounded-[6px] object-cover"
          />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#111827] truncate-text2">
              {pkg.packageTitle}
            </h4>
            <p className="text-[#718096] font-medium text-xs">
              ₦{pkg.packagePrice.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default GroupCard






























// // components/admin/eventDetails/GroupCard.tsx
// "use client"
// import Image from "next/image";
// import React from "react";
// import { AiOutlineEdit } from "react-icons/ai";
// import { FiMoreHorizontal } from "react-icons/fi";

// // shape of each package coming from the API
// export interface Package {
//   _id: string;
//   packageImgUrls: string[];
//   packageTitle: string;
//   packagePrice: number;
// }

// export interface Props {
//   id: string;
//   type: "General" | "Private";
//   title: string;
//   desc: string;
//   sales: string;
//   sold: number;
//   inStock?: number;
//   packages: Package[];
// }

// const GroupCard: React.FC<Props> = ({
//   type,
//   title,
//   desc,
//   sales,
//   sold,
//   inStock,
//   packages,
// }) => (
//   <div className="bg-white rounded-2xl p-6 flex flex-col">
//     <div className="flex justify-between items-center">
//       <span
//         className={`px-3 py-1 text-xs font-semibold rounded-full ${
//           type === "General"
//             ? "bg-[#2B9EA01F] text-[#2B9EA0] border border-[#2B9EA0]"
//             : "bg-[#DE42221F] text-[#DE4222] border border-[#DE4222]"
//         }`}
//       >
//         {type}
//       </span>
//       <FiMoreHorizontal className="text-[#A0AEC0]" size={24} />
//     </div>
//     <h4 className="mt-3 text-xl font-semibold text-black-100">
//       {title}
//     </h4>
//     <p className="mt-2 text-[#718096] font-medium text-sm leading-relaxed flex-1">
//       {desc}
//     </p>
//     <div className="grid grid-cols-3 mt-4 gap-4 text-gray-700">
//       <div>
//         <p className="text-xl text-black-100 font-semibold">{sales}</p>
//         <p className="text-xs text-[#718096] font-medium">
//           Overall sales
//         </p>
//       </div>
//       <div className="relative flex flex-col items-center justify-center">
//         <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
//         <p className="text-xl font-semibold text-black-100">{sold}</p>
//         <p className="text-xs text-[#718096] font-medium">Sold</p>
//       </div>
//       {inStock !== undefined && (
//         <div className="relative flex flex-col items-center justify-center">
//           <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
//           <p className="text-xl text-[#111827] font-semibold">{inStock}</p>
//           <p className="text-xs text-[#0CAF60] font-medium">
//             In stock
//           </p>
//         </div>
//       )}
//     </div>

//     {/* Packages */}
//     <div className="mt-4">
//       <h5 className="text-base font-semibold text-[#111827] mb-2">
//         Packages
//       </h5>
//       <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4">
//         {packages.map((pkg) => (
//           <div
//             key={pkg._id}
//             className="border rounded-xl p-3 flex items-center gap-4"
//           >
//             <Image
//               src={pkg.packageImgUrls[0]}
//               alt={pkg.packageTitle}
//               className="w-16 h-16 rounded-[6px] object-cover"
//               width={64}
//               height={64}
//             />
//             <div className="flex-1">
//               <h4 className="text-sm font-bold text-[#111827] truncate-text2">
//                 {pkg.packageTitle}
//               </h4>
//               <p className="text-[#718096] font-medium text-xs">
//                 ₦{pkg.packagePrice.toLocaleString()}
//               </p>
//             </div>
//             <AiOutlineEdit
//               size={20}
//               className="text-[#718096] cursor-pointer"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// export default GroupCard;
