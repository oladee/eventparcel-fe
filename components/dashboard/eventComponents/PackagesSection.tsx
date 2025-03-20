"use client";

import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import GroupOptionsModal from "./GroupOptionsModal";
// import { useRouter } from "next-nprogress-bar";
import Image from "next/image";

interface Package {
  _id: string;
  packageImgUrls: string[];
  packageTitle: string;
  packagePrice: number;
  // ... any additional fields you need
}

interface Group {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupPrivacy: string;
  packages: Package[];
  // ... any additional fields you need
}

interface PackagesSectionProps {
  eventData: {
    eventGroups: Group[];
  };
}

const PackagesSection: React.FC<PackagesSectionProps> = ({ eventData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const router = useRouter();
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const formatNumber = (value: number): string => {
    return value.toLocaleString("en-US");
  };

  // Use groups from eventData
  const groups = eventData.eventGroups || [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-11">
        {groups.map((group) => (
          <div key={group._id} className="bg-white rounded-2xl p-6">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <span
                className={`${
                  group.groupPrivacy.toLowerCase() === "private"
                    ? "text-red-600 border-red-600 bg-[#DE42221F]"
                    : "text-[#2B9EA0] border-[#2B9EA0] bg-[#2B9EA01F]"
                } border px-3 rounded-full text-sm font-medium`}
              >
                {group.groupPrivacy}
              </span>
              <span onClick={toggleModal}>
                <FiMoreHorizontal size={24} className="text-gray-500 cursor-pointer" />
              </span>
            </div>

            {/* Group Title and Description */}
            <h2 className="text-xl font-bold text-[#111827] mt-2 capitalize">{group.groupName}</h2>
            <p className="text-[#718096] text-sm mt-1 truncate-text2">
              {group.groupDescription}
            </p>

            {/* Packages Section */}
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-bold text-gray-900">Packages</h3>
              <button className="text-primary flex items-center gap-1 font-medium">
                <AiOutlinePlus size={18} /> Add New
              </button>
            </div>

            {/* Packages List */}
            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4 mt-4">
              {group.packages.map((pkg) => (
                <div key={pkg._id} className="border rounded-xl p-3 flex items-center gap-4">
                  <Image
                    src={
                      pkg.packageImgUrls && pkg.packageImgUrls.length > 0
                        ? pkg.packageImgUrls[0]
                        : "https://placehold.co/600x400/png"
                    }
                    alt={pkg.packageTitle}
                    className="w-16 h-16 rounded-lg object-cover"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate-text2">
                      {pkg.packageTitle
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </h4>
                    <p className="text-gray-500 text-sm">₦{formatNumber(pkg.packagePrice)}</p>
                  </div>
                  <AiOutlineEdit size={20} className="text-gray-500 cursor-pointer" />
                </div>
              ))}
            </div>

            {/* Contacts and Invite Section */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-500 text-sm font-medium">
                Contacts: <span className="text-gray-900 font-bold">0</span>
              </p>
              <button className="text-primary flex items-center gap-1 font-medium">
                <IoIosSend size={18} /> Send Invite
              </button>
            </div>
          </div>
        ))}
      </div>
      <GroupOptionsModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default PackagesSection;

















// "use client";

// import React, { useEffect, useState } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
// import { IoIosSend } from "react-icons/io";
// import GroupOptionsModal from "./GroupOptionsModal";
// import { useRouter } from "next-nprogress-bar";
// import { Group } from "@/app/interface/Group";
// import { Package } from "@/app/interface/Group";
// import axiosInstance from "@/lib/axiosInstance";

// const PackagesSection: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [packages, setPackages] = useState<Package[]>([]);
//   console.log(loading, error);
//   const router = useRouter();
//   const toggleModal = () => setIsModalOpen((prev) => !prev);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // const storedEventId = localStorage.getItem("eventId");
//       const storedEventId = "67da2a946c438683086ee53a";

//       if (!storedEventId) {
//         router.replace("/event-creation");
//         return;
//       }

//       const fetchGroups = async () => {
//         setLoading(true);
//         try {
//           const response = await axiosInstance.get(
//             `/view-groups/${storedEventId}`
//           );
//           setGroups(response.data.data);
//           setPackages(response.data.data.packages);
//         } catch (err) {
//           console.error("Error fetching groups:", err);
//           setError("Failed to fetch groups");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchGroups();
//     }
//   }, []);

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-11">
//         {groups.map((group,index) => (
//           <div key={index} className="bg-white rounded-2xl p-6">
//             {/* Header Section */}
//             <div className="flex justify-between items-start">
//               {/* <span className="text-red-600 border border-red-600 px-3 py-1 rounded-full text-sm font-medium">
//               Private
//             </span> */}
//               <span
//                 className={`${
//                   group.groupPrivacy === "Private"
//                     ? "text-red-600 border-red-600 bg-[#DE42221F]"
//                     : "text-[#2B9EA0] border-[#2B9EA0] bg-[#2B9EA01F]"
//                 } border px-3 rounded-full text-sm font-medium`}
//               >
//                 {group.groupPrivacy}
//               </span>

//               <span onClick={toggleModal}>
//                 <FiMoreHorizontal
//                   size={24}
//                   className="text-gray-500 cursor-pointer"
//                 />
//               </span>
//             </div>

//             {/* Family Title */}
//             <h2 className="text-xl font-bold text-[#111827] mt-2">
//             {group.groupName}
//             </h2>
//             <p className="text-[#718096] text-sm mt-1 truncate-text2">
//             {group.groupDescription}
//             </p>

//             {/* Packages Section */}
//             <div className="flex justify-between items-center mt-6">
//               <h3 className="text-lg font-bold text-gray-900">Packages</h3>
//               <button className="text-primary flex items-center gap-1 font-medium">
//                 <AiOutlinePlus size={18} /> Add New
//               </button>
//             </div>

//             {/* Scrollable Wrapper */}
//             <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4 mt-4">
//               {packages.map((item, index) => (
//                 <div
//                   key={index}
//                   className="border rounded-xl p-3 flex items-center gap-4"
//                 >
//                   <img
//                     src={
//                       item.packageImgUrls && item.packageImgUrls.length > 0
//                         ? item.packageImgUrls[0]
//                         : "/images/placeholder.png"
//                     }
//                     alt={item.packageTitle}
//                     className="w-16 h-16 rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <h4 className="text-sm font-bold text-gray-900 truncate-text2">
//                       {/* {item.packageTitle} */}
//                       {item.packageTitle
//                           .split(" ")
//                           .map(
//                             (word) =>
//                               word.charAt(0).toUpperCase() + word.slice(1)
//                           )
//                           .join(" ")}
//                     </h4>
//                     <p className="text-gray-500 text-sm">
//                     ₦{item.packagePrice}
//                     </p>
//                   </div>
//                   <AiOutlineEdit
//                     size={20}
//                     className="text-gray-500 cursor-pointer"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Contacts and Invite Section */}
//             <div className="mt-6 flex justify-between items-center">
//               <p className="text-gray-500 text-sm font-medium">
//                 Contacts: <span className="text-gray-900 font-bold">0</span>
//               </p>
//               <button className="text-primary flex items-center gap-1 font-medium">
//                 <IoIosSend size={18} /> Send Invite
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <GroupOptionsModal isOpen={isModalOpen} onClose={toggleModal} />
//     </>
//   );
// };

// export default PackagesSection;
