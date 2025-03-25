"use client";

import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import GroupOptionsModal from "./GroupOptionsModal";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import { Group,Package } from "@/app/interface/Group";
import CreatePackageModal from "@/components/CreatePackageModal";

// interface Package {
//   _id: string;
//   packageImgUrls: string[];
//   packageTitle: string;
//   packagePrice: number;
//   packagePriceCurrency: string;
// }

// interface Group {
//   _id: string;
//   groupName: string;
//   groupDescription: string;
//   groupPrivacy: string;
//   packages: Package[];
//   link?: string; // Optional: include the group link
// }

interface PackagesSectionProps {
  eventData: {
    eventGroups: Group[];
  };
}

const PackagesSection: React.FC<PackagesSectionProps> = ({ eventData }) => {
    const [openModalPackage, setOpenModalPackage] = useState(false);
      const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [group1, setGroup1] = useState<Group | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  // New state to keep track of the selected group for sharing
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const router = useRouter();

  // Use groups from eventData
  const groups = eventData.eventGroups || [];

  // Open modal and store selected group
  const openGroupOptions = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const formatNumber = (value: number): string => {
    return value.toLocaleString("en-US");
  };

  const handleSendInviteClick = () => {
    router.push("/share-contact");
  };

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
                } border px-3 rounded-full text-sm font-medium capitalize`}
              >
                {group.groupPrivacy}
              </span>
              <span onClick={() => openGroupOptions(group)}>
                <FiMoreHorizontal
                  size={24}
                  className="text-gray-500 cursor-pointer"
                />
              </span>
            </div>

            {/* Group Title and Description */}
            <h2 className="text-xl font-bold text-[#111827] mt-2 capitalize">
              {group.groupName}
            </h2>
            <p className="text-[#718096] text-sm mt-1 truncate-text2">
              {group.groupDescription}
            </p>

            {/* Packages Section */}
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-bold text-gray-900">Packages</h3>
              <button
                onClick={() => {
                  setModalMode("create");
                  setSelectedPackage(null);
                  setOpenModalPackage(true);
                  setGroup1(group)
                }}
                className="text-primary flex items-center gap-1 font-medium"
              >
                <AiOutlinePlus size={18} /> Add New
              </button>
            </div>

            {/* Packages List */}
            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4 mt-4">
              {group.packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="border rounded-xl p-3 flex items-center gap-4"
                >
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
                    <h4 className="text-sm font-bold text-[#111827] truncate-text2">
                      {pkg.packageTitle
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </h4>
                    <p className="text-[#718096] font-medium text-xs">
                      <span className="">
                        {pkg.packagePriceCurrency === "NGN" ? "₦" : "$"}
                      </span>
                      {formatNumber(pkg.packagePrice)}
                    </p>
                  </div>
                  <AiOutlineEdit
                   onClick={() => {
                    setModalMode("update");
                    setSelectedPackage(pkg);
                    setOpenModalPackage(true);
                  }}
                    size={20}
                    className="text-[#718096] cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Contacts and Invite Section */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-500 text-sm font-medium">
                Contacts: <span className="text-gray-900 font-bold">0</span>
              </p>
              <button
                onClick={handleSendInviteClick}
                className="text-primary flex items-center gap-1 font-medium outline-none"
              >
                <IoIosSend size={18} /> Send Invite
              </button>
            </div>
          </div>
        ))}
      </div>

      {openModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CreatePackageModal
            setOpenModalPackage={setOpenModalPackage}
            mode={modalMode}
            packageData={selectedPackage}
            groudId={group1?._id}
            groupCurrency={group1?.groupCurrency}
          />
        </div>
      )}
      {/* Pass the selected group to the modal */}
      <GroupOptionsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        group={selectedGroup}
      />
    </>
  );
};

export default PackagesSection;

// "use client";

// import React, { useState } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
// import { IoIosSend } from "react-icons/io";
// import GroupOptionsModal from "./GroupOptionsModal";
// // import { useRouter } from "next-nprogress-bar";
// import Image from "next/image";

// interface Package {
//   _id: string;
//   packageImgUrls: string[];
//   packageTitle: string;
//   packagePrice: number;
//   // ... any additional fields you need
// }

// interface Group {
//   _id: string;
//   groupName: string;
//   groupDescription: string;
//   groupPrivacy: string;
//   packages: Package[];
//   // ... any additional fields you need
// }

// interface PackagesSectionProps {
//   eventData: {
//     eventGroups: Group[];
//   };
// }

// const PackagesSection: React.FC<PackagesSectionProps> = ({ eventData }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // const router = useRouter();
//   const toggleModal = () => setIsModalOpen((prev) => !prev);

//   const formatNumber = (value: number): string => {
//     return value.toLocaleString("en-US");
//   };

//   // Use groups from eventData
//   const groups = eventData.eventGroups || [];

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-11">
//         {groups.map((group) => (
//           <div key={group._id} className="bg-white rounded-2xl p-6">
//             {/* Header Section */}
//             <div className="flex justify-between items-start">
//               <span
//                 className={`${
//                   group.groupPrivacy.toLowerCase() === "private"
//                     ? "text-red-600 border-red-600 bg-[#DE42221F]"
//                     : "text-[#2B9EA0] border-[#2B9EA0] bg-[#2B9EA01F]"
//                 } border px-3 rounded-full text-sm font-medium`}
//               >
//                 {group.groupPrivacy}
//               </span>
//               <span onClick={toggleModal}>
//                 <FiMoreHorizontal size={24} className="text-gray-500 cursor-pointer" />
//               </span>
//             </div>

//             {/* Group Title and Description */}
//             <h2 className="text-xl font-bold text-[#111827] mt-2 capitalize">{group.groupName}</h2>
//             <p className="text-[#718096] text-sm mt-1 truncate-text2">
//               {group.groupDescription}
//             </p>

//             {/* Packages Section */}
//             <div className="flex justify-between items-center mt-6">
//               <h3 className="text-lg font-bold text-gray-900">Packages</h3>
//               <button className="text-primary flex items-center gap-1 font-medium">
//                 <AiOutlinePlus size={18} /> Add New
//               </button>
//             </div>

//             {/* Packages List */}
//             <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4 mt-4">
//               {group.packages.map((pkg) => (
//                 <div key={pkg._id} className="border rounded-xl p-3 flex items-center gap-4">
//                   <Image
//                     src={
//                       pkg.packageImgUrls && pkg.packageImgUrls.length > 0
//                         ? pkg.packageImgUrls[0]
//                         : "https://placehold.co/600x400/png"
//                     }
//                     alt={pkg.packageTitle}
//                     className="w-16 h-16 rounded-lg object-cover"
//                     width={64}
//                     height={64}
//                   />
//                   <div className="flex-1">
//                     <h4 className="text-sm font-bold text-gray-900 truncate-text2">
//                       {pkg.packageTitle
//                         .split(" ")
//                         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                         .join(" ")}
//                     </h4>
//                     <p className="text-gray-500 text-sm">₦{formatNumber(pkg.packagePrice)}</p>
//                   </div>
//                   <AiOutlineEdit size={20} className="text-gray-500 cursor-pointer" />
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
