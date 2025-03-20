"use client";

import React, { useEffect, useRef } from "react";
import { MdOutlinePowerSettingsNew, MdDeleteOutline } from "react-icons/md";
import { PiCaretRightBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { GoShareAndroid } from "react-icons/go";

interface Group {
  _id: string;
  groupName: string;
  link?: string;
}

interface GroupOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

const GroupOptionsModal: React.FC<GroupOptionsModalProps> = ({
  isOpen,
  onClose,
  group
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus on the modal when it opens and add Escape key support
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Share group link function
  const handleShareGroupLink = async () => {
    if (!group) return;
    // Use group.link if it exists, otherwise create a default link.
    const shareUrl = group.link || `https://yourwebsite.com/groups/${group._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: group.groupName,
          text: `Check out the group: ${group.groupName}`,
          url: shareUrl,
        });
        console.log("Group link shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else if (navigator.clipboard) {
      // Fallback: copy the link to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0"
      >
        {/* Slider indicator */}
        <div className="w-full flex justify-center">
          <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-bold">
            Group Options
          </h2>
          <button
            onClick={onClose}
            className="text-xl"
            aria-label="Close Modal"
          >
            <AiOutlineClose color="gray" />
          </button>
        </div>
        <div className="grid gap-4">
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Edit Group clicked")}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <LuPencilLine size={20} />
              </span>
              <span className="ml-3 font-medium">Edit Group</span>
            </div>
            <PiCaretRightBold />
          </div>
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={handleShareGroupLink}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <GoShareAndroid size={20} />
              </span>
              <span className="ml-3 font-medium">Share Group Link</span>
            </div>
            <PiCaretRightBold />
          </div>
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Disable Group clicked")}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <MdOutlinePowerSettingsNew size={20} />
              </span>
              <span className="ml-3 font-medium">Disable Group</span>
            </div>
            <PiCaretRightBold />
          </div>
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Delete Group clicked")}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-red-500">
                <MdDeleteOutline size={20} />
              </span>
              <span className="ml-3 font-medium text-red-500">
                Delete Group
              </span>
            </div>
            <PiCaretRightBold />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupOptionsModal;






























// "use client";

// import React, { useEffect, useRef } from "react";
// import { MdOutlinePowerSettingsNew, MdDeleteOutline } from "react-icons/md";
// import { PiCaretRightBold } from "react-icons/pi";
// import { LuPencilLine } from "react-icons/lu";
// import { AiOutlineClose } from "react-icons/ai";
// import { GoShareAndroid } from "react-icons/go";

// interface GroupOptionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const GroupOptionsModal: React.FC<GroupOptionsModalProps> = ({
//   isOpen,
//   onClose
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   // Focus on the modal when it opens and add Escape key support
//   useEffect(() => {
//     if (isOpen && modalRef.current) {
//       modalRef.current.focus();
//     }
//   }, [isOpen]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     if (e.key === "Escape") {
//       onClose();
//     }
//   };

//   if (!isOpen) return null; // Don't render if modal is closed

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
//       onClick={onClose}
//       role="presentation"
//     >
//       <div
//         ref={modalRef}
//         tabIndex={0}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="modal-title"
//         onKeyDown={handleKeyDown}
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
//         className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0"
//       >
//         {/* Slider indicator */}
//         <div className="w-full flex justify-center">
//           <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
//         </div>

//         <div className="flex justify-between items-center mb-4">
//           <h2 id="modal-title" className="text-lg font-bold">
//             Group Options
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-xl"
//             aria-label="Close Modal"
//           >
//             <AiOutlineClose color="gray" />
//           </button>
//         </div>
//         <div className="grid gap-4">
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={() => console.log("Edit Group clicked")}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                 <LuPencilLine size={20} />
//               </span>
//               <span className="ml-3 font-medium">Edit Group</span>
//             </div>
//             <PiCaretRightBold />
//           </div>
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={() => console.log("Edit Group clicked")}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                 <GoShareAndroid size={20} />
//               </span>
//               <span className="ml-3 font-medium">Share Group Link</span>
//             </div>
//             <PiCaretRightBold />
//           </div>
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={() => console.log("Disable Group clicked")}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                 <MdOutlinePowerSettingsNew size={20} />
//               </span>
//               <span className="ml-3 font-medium">Disable Group</span>
//             </div>
//             <PiCaretRightBold />
//           </div>
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={() => console.log("Delete Group clicked")}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-red-500">
//                 <MdDeleteOutline size={20} />
//               </span>
//               <span className="ml-3 font-medium text-red-500">
//                 Delete Group
//               </span>
//             </div>
//             <PiCaretRightBold />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupOptionsModal;
