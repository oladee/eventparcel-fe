"use client";

import React, { useEffect, useState } from "react";
import { PiCaretRightBold } from "react-icons/pi";
import { LuMessagesSquare } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  sendInviteSMS,
  sendInviteWhatsApp,
  sendInviteBoth,
} from "@/api/invites";
import { trackEvent } from "@/lib/mixpanel";

interface EventOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventGroupId: string;
  // For SMS invites, the API now expects an array of objects with guestName and phoneNumber.
  contacts: { guestName: string; phoneNumber: string }[];
  // For WhatsApp and Both invites, we continue using phoneNumbers list.
  phoneNumbers: string[];
}

const SendContactModal: React.FC<EventOptionsModalProps> = ({
  isOpen,
  onClose,
  eventGroupId,
  contacts,
  phoneNumbers,
}) => {
  // Loading states for each invitation type
  const [isLoadingSMS, setIsLoadingSMS] = useState(false);
  const [isLoadingWA, setIsLoadingWA] = useState(false);
  const [isLoadingBoth, setIsLoadingBoth] = useState(false);
  const [eventData, setEventData] = useState<null | any>(null);

  useEffect(() => {
      const storedData = localStorage.getItem("eventData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setEventData(parsed);
        } catch (error) {
          console.error("Failed to parse eventData from localStorage", error);
        }
      }
    }, []);
  

  const handleSendSMS = async () => {
    setIsLoadingSMS(true);
    try {
      // Call the updated SMS API passing contacts object as required.
      const data = await sendInviteSMS(eventGroupId, contacts);
      toast.success(data.message || "Invitations sent via SMS");
      console.log(data.message);
       trackEvent("Share Invite", {
          source: "share-contact page",
          event_id: eventData?._id,
          event_name: eventData?.eventName,
          timestamp: new Date().toISOString(),
          page_name: "Share-contact Page",
          route: "SMS",
          status: "Successful"
        });
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
      trackEvent("Share Invite Failed", {
        source: "share-contact page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        timestamp: new Date().toISOString(),
        page_name: "Share-contact Page",
        route: "SMS",
        status: "Failed"
      });
    } finally {
      setIsLoadingSMS(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setIsLoadingWA(true);
    try {
      const data = await sendInviteWhatsApp(eventGroupId, phoneNumbers);
      toast.success(data.message || "Invitations sent via WhatsApp");
      console.log(data.message);
      trackEvent("Share Invite", {
        source: "share-contact page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        timestamp: new Date().toISOString(),
        page_name: "Share-contact Page",
        route: "Whatsapp",
        status: "Successful"
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
      trackEvent("Share Invite Failed", {
        source: "share-contact page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        timestamp: new Date().toISOString(),
        page_name: "Share-contact Page",
        route: "Whatsapp",
        status: "Failed"
      });
    } finally {
      setIsLoadingWA(false);
    }
  };

  const handleSendBoth = async () => {
    setIsLoadingBoth(true);
    try {
      const data = await sendInviteBoth(eventGroupId, phoneNumbers);
      toast.success(data.message || "Invitations sent via WhatsApp/SMS");
      trackEvent("Share Invite", {
        source: "share-contact page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        timestamp: new Date().toISOString(),
        page_name: "Share-contact Page",
        route: "Both",
        status: "Successful"
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
      trackEvent("Share Invite Failed", {
        source: "share-contact page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        timestamp: new Date().toISOString(),
        page_name: "Share-contact Page",
        route: "Both",
        status: "Failed"
      });
    } finally {
      setIsLoadingBoth(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Slider Indicator */}
        <div className="w-full flex justify-center">
          <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-bold">
            Invite Options
          </h2>
          <button onClick={onClose} aria-label="Close Modal">
            <AiOutlineClose color="gray" size={24} />
          </button>
        </div>

        <div className="grid gap-4">
          {/* SMS Option */}
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={handleSendSMS}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <BiMessageSquareDetail size={20} />
              </span>
              <div className="ml-3 font-medium">
                <span className="capitalize">Send Via SMS</span>
                <p className="text-xs text-[#667085]">
                  Invite using text message only, charges apply
                </p>
              </div>
            </div>
            {isLoadingSMS ? <span>Sending...</span> : <PiCaretRightBold />}
          </div>

          {/* WhatsApp Option */}
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={handleSendWhatsApp}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <FaWhatsapp size={20} />
              </span>
              <div className="ml-3 font-medium">
                <span className="capitalize">Send Via WhatsApp</span>
                <p className="text-xs text-[#667085]">
                  Invite using WhatsApp only
                </p>
              </div>
            </div>
            {isLoadingWA ? <span>Sending...</span> : <PiCaretRightBold />}
          </div>

          {/* Both Option */}
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={handleSendBoth}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <LuMessagesSquare size={20} />
              </span>
              <div className="ml-3 font-medium">
                <span className="capitalize">Send Via Both</span>
                <p className="text-xs text-[#667085]">
                  This will try via WhatsApp before sending SMS; charges apply
                </p>
              </div>
            </div>
            {isLoadingBoth ? <span>Sending...</span> : <PiCaretRightBold />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendContactModal;












// "use client";

// import React, { useState } from "react";
// import { PiCaretRightBold } from "react-icons/pi";
// import { LuMessagesSquare } from "react-icons/lu";
// import { AiOutlineClose } from "react-icons/ai";
// import { BiMessageSquareDetail } from "react-icons/bi";
// import { FaWhatsapp } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { sendInviteSMS, sendInviteWhatsApp, sendInviteBoth } from "@/api/invites";

// interface EventOptionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventGroupId: string;
//   phoneNumbers: string[];
// }

// const SendContactModal: React.FC<EventOptionsModalProps> = ({
//   isOpen,
//   onClose,
//   eventGroupId,
//   phoneNumbers,
// }) => {
//   // Loading states for each invitation type
//   const [isLoadingSMS, setIsLoadingSMS] = useState(false);
//   const [isLoadingWA, setIsLoadingWA] = useState(false);
//   const [isLoadingBoth, setIsLoadingBoth] = useState(false);

//   const handleSendSMS = async () => {
//     setIsLoadingSMS(true);
//     try {
//       const data = await sendInviteSMS(eventGroupId, phoneNumbers);
//       toast.success(data.message || "Invitations sent via SMS");
//     } catch (error: any) {      
//       console.log(error);
//       toast.error("Failed to send SMS invitations");
//     } finally {
//       setIsLoadingSMS(false);
//     }
//   };

//   const handleSendWhatsApp = async () => {
//     setIsLoadingWA(true);
//     try {
//       const data = await sendInviteWhatsApp(eventGroupId, phoneNumbers);
//       toast.success(data.message || "Invitations sent via WhatsApp");
//     } catch (error: any) {
//       console.log(error);
//       toast.error("Failed to send WhatsApp invitations");
//     } finally {
//       setIsLoadingWA(false);
//     }
//   };

//   const handleSendBoth = async () => {
//     setIsLoadingBoth(true);
//     try {
//       const data = await sendInviteBoth(eventGroupId, phoneNumbers);
//       toast.success(data.message || "Invitations sent via WhatsApp/SMS");
//     } catch (error: any) {
//       console.log(error);
//       toast.error("Failed to send invitations via both");
//     } finally {
//       setIsLoadingBoth(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
//       onClick={onClose}
//       role="presentation"
//     >
//       <div
//         tabIndex={0}
//         role="dialog"
//         aria-modal="true"
//         className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0 outline-none"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Slider Indicator */}
//         <div className="w-full flex justify-center">
//           <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
//         </div>

//         <div className="flex justify-between items-center mb-4">
//           <h2 id="modal-title" className="text-lg font-bold">
//             Invite Options
//           </h2>
//           <button onClick={onClose} aria-label="Close Modal">
//             <AiOutlineClose color="gray" size={24} />
//           </button>
//         </div>

//         <div className="grid gap-4">
//           {/* SMS Option */}
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={handleSendSMS}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                 <BiMessageSquareDetail size={20} />
//               </span>
//               <div className="ml-3 font-medium">
//                 <span className="capitalize">Send Via SMS</span>
//                 <p className="text-xs text-[#667085]">
//                   Invite using text message only, charges apply
//                 </p>
//               </div>
//             </div>
//             {isLoadingSMS ? <span>Sending...</span> : <PiCaretRightBold />}
//           </div>

//           {/* WhatsApp Option */}
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={handleSendWhatsApp}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                 <FaWhatsapp size={20} />
//               </span>
//               <div className="ml-3 font-medium">
//                 <span className="capitalize">Send Via WhatsApp</span>
//                 <p className="text-xs text-[#667085]">
//                   Invite using WhatsApp only
//                 </p>
//               </div>
//             </div>
//             {isLoadingWA ? <span>Sending...</span> : <PiCaretRightBold />}
//           </div>

//           {/* Both Option */}
//           <div
//             className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
//             onClick={handleSendBoth}
//           >
//             <div className="flex items-center">
//               <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
//                 <LuMessagesSquare size={20} />
//               </span>
//               <div className="ml-3 font-medium">
//                 <span className="capitalize">Send Via Both</span>
//                 <p className="text-xs text-[#667085]">
//                   This will try via WhatsApp before sending SMS; charges apply
//                 </p>
//               </div>
//             </div>
//             {isLoadingBoth ? <span>Sending...</span> : <PiCaretRightBold />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SendContactModal;

