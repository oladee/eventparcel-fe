"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FocusLock from "react-focus-lock";

interface CohostActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohost: {
    _id: string;
    eventId: string;
    status: boolean;
  };
}

const CohostActionsModal: React.FC<CohostActionsModalProps> = ({
  isOpen,
  onClose,
  cohost,
}) => {
  const router = useRouter();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // When the modal opens, focus the modal for accessibility.
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Close modal if clicking on the backdrop.
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Close modal on Escape key.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleViewActivityLog = useCallback(() => {
    router.push(`/view-cohost/${cohost._id}`);
    onClose();
  }, [cohost._id, onClose, router]);

  const handleToggleStatus = useCallback(async () => {
    setLoadingToggle(true);
    const newStatus = false;
    try {
      await axiosInstance.post(`/disable-cohost/${cohost._id}`, {
        status: newStatus,
      });
      toast.success(`Co-host ${newStatus ? "enabled" : "disabled"} successfully.`);
      onClose();
    } catch (error: any) {
      console.error("Error toggling cohost status:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoadingToggle(false);
    }
  }, [cohost._id, onClose]);

  const handleRemoveCohost = useCallback(async () => {
    const confirmed = window.confirm("Are you sure you want to remove the co-host?");
    if (!confirmed) return;
    setLoadingRemove(true);
    try {
      await axiosInstance.delete(`/remove-cohost/${cohost._id}/${cohost.eventId}`);
      toast.success("Co-host removed successfully.");
      onClose();
    } catch (error: any) {
      console.error("Error removing cohost:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoadingRemove(false);
    }
  }, [cohost._id, onClose]);

  // Render into a portal so that the modal overlays the rest of the app.
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <FocusLock returnFocus>
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              tabIndex={-1}
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h2 id="modal-title" className="text-lg font-bold mb-4">
                Cohost Actions
              </h2>
              <p id="modal-description" className="text-sm text-gray-600 mb-4">
                Select an action to manage the cohost.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleViewActivityLog}
                  className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View Activity Log
                </button>
                <button
                  onClick={handleToggleStatus}
                  disabled={loadingToggle}
                  className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loadingToggle
                    ? "Processing..."
                    : cohost.status
                    ? "Disable Co-host"
                    : "Disable Co-host"}
                </button>
                <button
                  onClick={handleRemoveCohost}
                  disabled={loadingRemove}
                  className="w-full py-2 px-4 rounded-md hover:bg-red-200 text-red-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loadingRemove ? "Processing..." : "Remove Co-host"}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </FocusLock>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CohostActionsModal;

























// "use client";

// import React, { useEffect } from "react";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";

// interface CohostActionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   cohost: {
//     _id: string;
//     eventId: string;
//     status: boolean;
//   };
// }

// const CohostActionsModal: React.FC<CohostActionsModalProps> = ({ isOpen, onClose, cohost }) => {
//   const router = useRouter();

//   // Close modal on Escape key
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   const handleViewActivityLog = () => {
//     router.push(`/view-cohost/${cohost._id}`);
//     onClose();
//   };

//   const handleToggleStatus = async () => {
//     const newStatus = !cohost.status;
//     try {
//       await axiosInstance.post(`/disable-cohost/${cohost._id}`, {
//         status: newStatus,
//       });
//       toast.success(`Co-host ${newStatus ? "enabled" : "disabled"} successfully.`);
//       onClose();
//     } catch (error: any) {
//       console.error("Error toggling cohost status:", error);
//       toast.error(error.response?.data?.message || "An error occurred.");
//     }
//   };

//   const handleRemoveCohost = async () => {
//     const confirmed = window.confirm("Are you sure you want to remove the co-host?");
//     if (!confirmed) return;
//     try {
//       await axiosInstance.delete(`/remove-cohost/${cohost._id}`);
//       toast.success("Co-host removed successfully.");
//       onClose();
//     } catch (error: any) {
//       console.error("Error removing cohost:", error);
//       toast.error(error.response?.data?.message || "An error occurred.");
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm"
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 20 }}
//           >            
//             <div className="space-y-3">
//               <button
//                 onClick={handleViewActivityLog}
//                 className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium"
//               >
//                 View Activity Log
//               </button>

//               <button
//                 onClick={handleToggleStatus}
//                 className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium"
//               >
//                 {cohost.status ? "Disable Co-host" : "Enable Co-host"}
//               </button>

//               <button
//                 onClick={handleRemoveCohost}
//                 className="w-full py-2 px-4 rounded-md hover:bg-red-200 text-red-600 text-sm font-medium"
//               >
//                 Remove Co-host
//               </button>

//               <button
//                 onClick={onClose}
//                 className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default CohostActionsModal;

















// "use client";
// import React from "react";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// interface CohostActionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   cohost: {
//     _id: string;
//     eventId: string;
//     status: boolean;
//   };
// }

// const CohostActionsModal: React.FC<CohostActionsModalProps> = ({ isOpen, onClose, cohost }) => {
//   const router = useRouter();

//   if (!isOpen) return null;

//   // Route to view activity log for the given co-host
//   const handleViewActivityLog = () => {
//     router.push(`/view-cohost/${cohost._id}`);
//     onClose();
//   };

//   // Toggle status: if cohost.status is true, show "Enable Co-host", if false, show "Disable Co-host"
//   const handleToggleStatus = async () => {
//     // Toggle the status
//     const newStatus = !cohost.status;
//     try {
//       await axiosInstance.post(`/disable-cohost/${cohost._id}`, {
//         status: newStatus,
//       });
//       toast.success(`Co-host ${newStatus ? "Disabled" : "Enabled"} successfully.`);
//       onClose();
//       // Optionally trigger a refresh in the parent view to update the list
//     } catch (error: any) {
//       console.error("Error toggling cohost status:", error);
//       toast.error(error.response?.data?.message || "An error occurred.");
//     }
//   };

//   // Remove co-host after confirmation
//   const handleRemoveCohost = async () => {
//     const confirmation = window.confirm("Are you sure you want to remove the co-host?");
//     if (!confirmation) return;
//     try {
//       await axiosInstance.delete(`/remove-cohost/${cohost._id}`);
//       toast.success("Co-host removed successfully.");
//       onClose();
//       // Optionally trigger a refresh in the parent view to update the list
//     } catch (error: any) {
//       console.error("Error removing cohost:", error);
//       toast.error(error.response?.data?.message || "An error occurred.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-[12px] w-80">
//         {/* <h2 className="text-lg font-semibold mb-4">Co-host Actions</h2> */}
//         <button
//           onClick={handleViewActivityLog}
//           className="w-full py-2 px-4 mb-3 font-medium text-[#111827] hover:bg-gray-100"
//         >
//           View Activity Log 
//         </button>
//         <button
//           onClick={handleToggleStatus}
//           className="w-full py-2 px-4 mb-3 font-medium text-[#111827] hover:bg-gray-100"
//         >
//           {cohost.status ? "Enable Co-host" : "Disable Co-host"}
//         </button>
//         <button
//           onClick={handleRemoveCohost}
//           className="w-full py-2 px-4 mb-3 font-medium text-[#DE4222] hover:bg-gray-100"
//         >
//           Remove Co-host
//         </button>
//         <button
//           onClick={onClose}
//           className="w-full py-2 px-4 font-medium text-[#111827] hover:bg-gray-100"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CohostActionsModal;
