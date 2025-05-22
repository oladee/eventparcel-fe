"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePowerSettingsNew, MdDeleteOutline } from "react-icons/md";
import { PiCaretRightBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import UpdateEventModal from "./UpdateEventModal";
import DeleteConfirmationDialog from "@/components/modals/DeleteConfirmationDialog";
import axiosInstance from "@/lib/axiosInstance";
// import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next-nprogress-bar";
import { trackEvent } from "@/lib/mixpanel";

interface EventOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData?: any;
}

const EventOptionsModal: React.FC<EventOptionsModalProps> = ({
  isOpen,
  onClose,
  eventData
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>("");
  const router = useRouter();


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

  const handleClose = () => {
    setShowUpdateModal(false);
    onClose();
  };

  const handleDeleteEvent = async () => {
    if (!eventData?._id) return;

    try {
      await axiosInstance.delete(`/delete-event/${eventData._id}`);
      console.log("Event deleted successfully");
      setIsDeleteDialogOpen(false);
      onClose();
      // Optionally, refresh or update the event list:
      // router.refresh();
      window.dispatchEvent(new Event("refreshEvents"));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again later.");
    }
  };

  const handleDisableEvent = async () => {
    if (!eventData?._id) return;

    trackEvent("Disable An Event - Started", {
      source: "dashboard event page",
      timestamp: new Date().toISOString(),
      page_name: "dashboard event page",
      event_id: eventData?._id,
      event_name: eventData?.eventName,
    });
    
    try {
      const isCurrentlyDisabled = eventData.isDisabled;
      setLoading(true);
      setLoadingMessage(isCurrentlyDisabled ? "Enabling..." : "Disabling...");

      const response = await axiosInstance.put(
        `/disable-enable/${eventData._id}`,
        {
          isDisabled: !isCurrentlyDisabled // Toggle the isDisabled state
        }
      );

      trackEvent("Disable An Event - End", {
        source: "dashboard event page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard event page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        status: "Successfull"
      });

      console.log("Event disabled/enabled successfully");
      window.dispatchEvent(new Event("refreshEvents"));
      toast.success(response.data.message);
      onClose();
      // router.refresh();
    } catch (error: any) {
      console.error("Error disabling/enabling event:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update event status. Please try again.");
      }
      trackEvent("Disable An Event - End", {
        source: "dashboard event page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard event page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        status: "Failed"
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <>
      {showUpdateModal && (
        <UpdateEventModal
          isOpen={showUpdateModal}
          onClose={handleClose}
          // eventData={JSON.parse(localStorage.getItem("eventData")!)}
          eventData={eventData}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteEvent}
      />
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${
          showUpdateModal ? "hidden" : "flex"
        } items-end justify-center z-50`}
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
              Event Options
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
            {/* Hide Edit option if event is shared */}
            {!eventData?.isShared && (
              <div
                className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setShowUpdateModal(true);
                }}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                    <LuPencilLine size={20} />
                  </span>
                  <span className="ml-3 font-medium">Edit Event</span>
                </div>
                <PiCaretRightBold />
              </div>
            )}

            {!eventData?.isShared && (
              <div
                className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  localStorage.setItem("eventId", eventData._id);
                  localStorage.setItem("groupLength", eventData.eventGroups.length);
                  localStorage.setItem("isNairaAccount", eventData.isNairaAccount)
                  localStorage.setItem("isDollarAccount", eventData.isDollarAccount)
                  router.push("/dashboard/editPaymentDetails");
                }}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                    <LuPencilLine size={20} />
                  </span>
                  <span className="ml-3 font-medium">Edit Payment</span>
                </div>
                <PiCaretRightBold />
              </div>
            )}
            {!eventData?.isShared && (
              <div
                className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  localStorage.setItem("eventId", eventData._id);
                  localStorage.setItem("groupLength", eventData.eventGroups.length);
                  router.push("/dashboard/editPickupDetail");
                }}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                    <LuPencilLine size={20} />
                  </span>
                  <span className="ml-3 font-medium">Edit Pickup</span>
                </div>
                <PiCaretRightBold />
              </div>
            )}
            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={handleDisableEvent}
            >
              <div className="flex items-center">
                <span
                  className={`p-2 bg-[#FFF7F2] rounded-full ${
                    eventData.isDisabled ? "text-[#5cba52]" : "text-primary"
                  } `}
                >
                  <MdOutlinePowerSettingsNew size={20} />
                </span>
                <span className="ml-3 font-medium">
                  {" "}
                  {loading
                    ? loadingMessage
                    : eventData.isDisabled
                    ? "Enable Event"
                    : "Disable Event"}
                </span>
              </div>
              <PiCaretRightBold />
            </div>
            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <div className="flex items-center">
                <span className="p-2 bg-[#FFF7F2] rounded-full text-red-500">
                  <MdDeleteOutline size={20} />
                </span>
                <span className="ml-3 font-medium text-red-500">
                  Delete Event
                </span>
              </div>
              <PiCaretRightBold />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EventOptionsModal;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { MdOutlinePowerSettingsNew, MdDeleteOutline } from "react-icons/md";
// import { PiCaretRightBold } from "react-icons/pi";
// import { LuPencilLine } from "react-icons/lu";
// import { AiOutlineClose } from "react-icons/ai";
// import UpdateEventModal from "./UpdateEventModal";
// import DeleteConfirmationDialog from "@/components/modals/DeleteConfirmationDialog";
// import axiosInstance from "@/lib/axiosInstance";
// // import { useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface EventOptionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventData?: any;
// }

// const EventOptionsModal: React.FC<EventOptionsModalProps> = ({
//   isOpen,
//   onClose,
//   eventData
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingMessage, setLoadingMessage] = useState<string | null>("");
//   // const router = useRouter();

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

//   const handleClose = () => {
//     setShowUpdateModal(false);
//     onClose();
//   };

//   const handleDeleteEvent = async () => {
//     if (!eventData?._id) return;

//     try {
//       await axiosInstance.delete(`/delete-event/${eventData._id}`);
//       console.log("Event deleted successfully");
//       setIsDeleteDialogOpen(false);
//       onClose();
//       // Optionally, refresh or update the event list:
//       // router.refresh();
//       window.dispatchEvent(new Event("refreshEvents"));
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       alert("Failed to delete event. Please try again later.");
//     }
//   };

//   const handleDisableEvent = async () => {
//     if (!eventData?._id) return;

//     try {
//       const isCurrentlyDisabled = eventData.isDisabled;
//       setLoading(true);
//       setLoadingMessage(isCurrentlyDisabled ? "Enabling..." : "Disabling...");

//       const response = await axiosInstance.put(
//         `/disable-enable/${eventData._id}`,
//         {
//           isDisabled: !isCurrentlyDisabled // Toggle the isDisabled state
//         }
//       );

//       console.log("Event disabled/enabled successfully");
//       window.dispatchEvent(new Event("refreshEvents"));
//       toast.success(response.data.message);
//       onClose();
//       // router.refresh();
//     } catch (error: any) {
//       console.error("Error disabling/enabling event:", error);
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Failed to update event status. Please try again.");
//       }
//     }finally{
//       setLoading(false);
//       setLoadingMessage("");
//     }
//   };

//   if (!isOpen) return null; // Don't render if modal is closed

//   return (
//     <>
//       {showUpdateModal && (
//         <UpdateEventModal
//           isOpen={showUpdateModal}
//           onClose={handleClose}
//           // eventData={JSON.parse(localStorage.getItem("eventData")!)}
//           eventData={eventData}
//         />
//       )}

//       <DeleteConfirmationDialog
//         isOpen={isDeleteDialogOpen}
//         onClose={() => setIsDeleteDialogOpen(false)}
//         onDelete={handleDeleteEvent}
//       />
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 ${
//           showUpdateModal ? "hidden" : "flex"
//         } items-end justify-center z-50`}
//         onClick={onClose}
//         role="presentation"
//       >
//         <div
//           ref={modalRef}
//           tabIndex={0}
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-title"
//           onKeyDown={handleKeyDown}
//           onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
//           className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0"
//         >
//           {/* Slider indicator */}
//           <div className="w-full flex justify-center">
//             <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
//           </div>

//           <div className="flex justify-between items-center mb-4">
//             <h2 id="modal-title" className="text-lg font-bold">
//               Event Options
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-xl"
//               aria-label="Close Modal"
//             >
//               <AiOutlineClose color="gray" />
//             </button>
//           </div>
//           <div className="grid gap-4">
//             <div
//               className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//               onClick={() => {
//                 // onClose();
//                 setShowUpdateModal(true);
//               }}
//             >
//               <div className="flex items-center">
//                 <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                   <LuPencilLine size={20} />
//                 </span>
//                 <span className="ml-3 font-medium">Edit Event</span>
//               </div>
//               <PiCaretRightBold />
//             </div>
//             <div
//               className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//               onClick={handleDisableEvent}
//             >
//               <div className="flex items-center">
//                 <span
//                   className={`p-2 bg-[#FFF7F2] rounded-full ${
//                     eventData.isDisabled ? "text-[#5cba52]" : "text-primary"
//                   } `}
//                 >
//                   <MdOutlinePowerSettingsNew size={20} />
//                 </span>
//                 <span className="ml-3 font-medium">
//                   {" "}
//                   {loading ? loadingMessage : eventData.isDisabled ? "Enable Event" : "Disable Event"}
//                 </span>
//               </div>
//               <PiCaretRightBold />
//             </div>
//             <div
//               className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//               onClick={() => setIsDeleteDialogOpen(true)}
//             >
//               <div className="flex items-center">
//                 <span className="p-2 bg-[#FFF7F2] rounded-full text-red-500">
//                   <MdDeleteOutline size={20} />
//                 </span>
//                 <span className="ml-3 font-medium text-red-500">
//                   Delete Event
//                 </span>
//               </div>
//               <PiCaretRightBold />
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default EventOptionsModal;
