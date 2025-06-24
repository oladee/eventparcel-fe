"use client";

import Container from "@/components/dashboard/Container";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import SendContactModal from "@/components/shareContact/SendContactModal";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/mixpanel";
import { ChevronLeft } from 'lucide-react';

// Define the type for an invited contact coming from the backend.
interface InvitedContact {
  _id: string;
  guestName: string;
  phoneNumber: string;
  eventGroupId: string;
  inviteLink: string;
  hasViewed: boolean;
  status: "pending" | "ordered" | "viewed";
  viewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Custom hook to debounce a value (e.g. for search).
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Helper function to generate initials from a full name.
const getInitials = (name: string) => {
  const parts = name.split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
};

const InvitedContactsPage: React.FC = () => {
  const router = useRouter();

  const [groupId, setGroupId] = useState<string | null>(null);
  const [invitedContacts, setInvitedContacts] = useState<InvitedContact[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [optionModal, setOptionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<null | any>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    if (!id) {
      router.replace("/dashboard/events");
    } else {
      setGroupId(id);
    }
  }, [router]);

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

  useEffect(() => {
    if (!groupId) return;
    const fetchContacts = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/event-group-contacts/${groupId}`
        );
        if (data.success) {
          setInvitedContacts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch invited contacts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [groupId]);

  // Ensure hooks are always called
  const filteredContacts = useMemo(() => {
    if (!debouncedSearch) return invitedContacts;
    return invitedContacts.filter((contact) =>
      contact.guestName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [invitedContacts, debouncedSearch]);

  // Helper function to validate Nigerian prefixesimport { useCallback, useMemo } from 'react';
const isValidNigerianPrefix = useCallback((prefix: string): boolean => {
  const nigerianPrefixes = ['701', '702', '703', '704', '705', '706', '707', '708', '709', 
                          '801', '802', '803', '804', '805', '806', '807', '808', '809',
                          '810', '811', '812', '813', '814', '815', '816', '817', '818', '819',
                          '909', '908', '901', '902', '903', '904', '905', '906', '907'];
  return nigerianPrefixes.includes(prefix);
}, []);

// Memoized contact validation
const hasNonNigerianContacts = useCallback((contacts: Array<{ phoneNumber: string }>): boolean => {
  return contacts.some(contact => {
    const cleanedNumber = contact.phoneNumber.replace(/\D/g, "");
    
    const isNigerian = 
      (cleanedNumber.startsWith('234') && cleanedNumber.length === 13) ||
      (cleanedNumber.startsWith('0') && cleanedNumber.length === 11) ||
      (cleanedNumber.length === 10 && isValidNigerianPrefix(cleanedNumber.substring(0, 3)));
    
    return !isNigerian;
  });
}, [isValidNigerianPrefix]);

// Main component logic
const extractedContacts = useMemo(() => {
  const contacts = invitedContacts
    .filter((contact) => selectedIds.has(contact._id))
    .map((contact) => ({
      guestName: contact.guestName,
      phoneNumber: contact.phoneNumber.replace(/\D/g, "")
    }));

  const containsForeignNumbers = hasNonNigerianContacts(contacts);

  trackEvent("Import Contact Save", {
    source: "share-contact page",
    event_id: eventData?._id,
    event_name: eventData?.eventName,
    timestamp: new Date().toISOString(),
    page_name: "Share-contact Page",
    route: "Google",
    count: contacts.length,
    non_ngn_country_code: containsForeignNumbers ? "Yes" : "No",
  });

  return contacts;
}, [
  invitedContacts, 
  selectedIds, 
  eventData?._id, 
  eventData?.eventName, 
  hasNonNigerianContacts  
]);

  // const extractedContacts = useMemo(() => {
  //   return invitedContacts
  //     .filter((contact) => selectedIds.has(contact._id))
  //     .map((contact) => ({
  //       guestName: contact.guestName,
  //       phoneNumber: contact.phoneNumber.replace(/\D/g, "")
  //     }));
  // }, [invitedContacts, selectedIds]);

  const extractedPhoneNumbers = useMemo(() => {
    return invitedContacts
      .filter((contact) => selectedIds.has(contact._id))
      .map((contact) => contact.phoneNumber.replace(/\D/g, ""))
      .filter((num) => num.length > 0);
  }, [invitedContacts, selectedIds]);

  const isAnySelected = selectedIds.size > 0;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusClasses = (status: InvitedContact["status"]) => {
    switch (status) {
      case "pending":
        return "text-[#667085]";
      case "ordered":
        return "text-[#0CAF60]";
      case "viewed":
        return "text-[#FBBC05]";
      default:
        return "text-gray-700";
    }
  };

  const handleResendInvite = () => {
    if (isAnySelected) {
      setOptionModal(true);
    }
  };

  // Conditional rendering after hooks
  if (!groupId || loading) {
    return (
      <Container>
        <div className="w-full text-center py-6 text-gray-500">Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <div
        className="fixed top-16 w-[90%] md:w-[80%] h-auto py-3 bg-gray-100"
        id="back-button"
      >
        <button className="w-[20%] md:w-[5%] cursor-pointer flex flex-row items-center" onClick={() => window.history.back()}>
          <ChevronLeft className="w-6 h-6 " />
          <span className="font-medium text-base text-[#111827] ml-1">Back</span>
        </button>
      </div>
      <div className="w-full max-w-2xl mx-auto md:p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Invited Contacts
          </h1>
          <p className="text-gray-500">
            List of contacts you&apos;ve invited for this group
          </p>
        </div>
        {/* Search Bar */}
        <div className="relative mb-6 w-full">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts"
            aria-label="Search contacts"
            className="w-full pl-10 pr-10 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <FiX
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => setSearch("")}
            />
          )}
        </div>
        {/* Contacts List */}
        {filteredContacts.length > 0 ? (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className="w-full flex items-start sm:items-center justify-between bg-white p-4 border-b border-gray-100 rounded-md hover:bg-[#F4F8FB]"
              >
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`checkbox-${contact._id}`}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded checkbox"
                      checked={selectedIds.has(contact._id)}
                      onChange={() => handleToggleSelect(contact._id)}
                    />
                    <label
                      htmlFor={`checkbox-${contact._id}`}
                      className="sr-only"
                    >
                      Select {contact.guestName}
                    </label>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase bg-gray-200 text-gray-700`}
                  >
                    {getInitials(contact.guestName)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {contact.guestName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {contact.phoneNumber}
                    </span>
                  </div>
                </div>
                <div
                  className={`mt-2 sm:mt-0 rounded-full text-sm font-medium ${getStatusClasses(
                    contact.status
                  )}`}
                >
                  {contact.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-6">
            No contacts found for this Event group.
          </div>
        )}
        {/* Footer Buttons */}
        <div className="flex justify-end p-4  gap-4 mt-6 bg-white">
          <button
            // onClick={() => setSelectedIds(new Set())}
            onClick={() => router.back()}
            className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
          >
            Cancel
          </button>
          <button
            onClick={handleResendInvite}
            disabled={!isAnySelected}
            className={`py-3 px-8 rounded-[12px] flex items-center justify-center font-extrabold font-manrope ${
              isAnySelected
                ? "bg-primary text-white  hover:bg-red-800 transition"
                : "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            Resend-Invite
          </button>
        </div>
      </div>

      <ToastContainer />

      {/* Render SendContactModal when the Resend Invite button is clicked */}
      <SendContactModal
        isOpen={optionModal}
        onClose={() => setOptionModal(false)}
        eventGroupId={groupId}
        contacts={extractedContacts}
        phoneNumbers={extractedPhoneNumbers}
      />
    </Container>
  );
};

export default InvitedContactsPage;

// "use client";
// import Container from "@/components/dashboard/Container";
// import React, { useState, useMemo, useEffect } from "react";
// import { FiSearch, FiX } from "react-icons/fi";

// interface Contact {
//   id: number;
//   name: string;
//   phone: string;
//   status: "Pending" | "Ordered" | "Viewed";
// }

// const contacts: Contact[] = [
//   { id: 1, name: "James Paul-smith", phone: "+2348174628463", status: "Pending" },
//   { id: 2, name: "Darcy Patterson", phone: "+2348174628463", status: "Pending" },
//   { id: 3, name: "Alex Hamilton", phone: "+2348174628463", status: "Ordered" },
//   { id: 4, name: "Bowen Group", phone: "+2348174628463", status: "Viewed" },
//   { id: 5, name: "Taylor Smith", phone: "+2348174628463", status: "Viewed" },
//   { id: 6, name: "Alex Hamilton", phone: "+2348174628463", status: "Ordered" },
//   { id: 7, name: "Bowen Group", phone: "+2348174628463", status: "Viewed" },
//   { id: 8, name: "Taylor Smith", phone: "+2348174628463", status: "Viewed" }
// ];

// // Custom hook to debounce any fast-changing value (like search input)
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debouncedValue;
// }

// // Generate initials from the contact name
// const getInitials = (name: string) => {
//   const parts = name.split(" ");
//   const first = parts[0]?.[0] ?? "";
//   const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
//   return (first + last).toUpperCase();
// };

// // Deterministically choose an avatar color based on contact id
// const generateAvatarColor = (id: number): string => {
//   const colors = [
//     "bg-[#C4C4C466] text-[#000000]",
//     "bg-[#F7BAAD66] text-[#E95D3F]",
//     "bg-[#CAF6AD66] text-[#84CA53]",
//     "bg-[#9BB3E366] text-[#3C5C98]",
//     "bg-[#E2A5D766] text-[#A43A92]"
//   ];
//   return colors[id % colors.length];
// };

// // Get CSS classes for the status badge
// const getStatusClasses = (status: Contact["status"]) => {
//   switch (status) {
//     case "Pending":
//       return "text-[#667085]";
//     case "Ordered":
//       return "text-[#0CAF60]";
//     case "Viewed":
//       return "text-[#FBBC05]";
//     default:
//       return "text-gray-700";
//   }
// };

// interface ContactItemProps {
//   contact: Contact;
// }

// const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
//   return (
//     <div className="w-full flex items-start sm:items-center justify-between bg-white p-4 border-b border-gray-100 rounded-md hover:bg-[#F4F8FB]">
//       {/* Left Side: Checkbox, Avatar, Name & Phone */}
//       <div className="flex items-center space-x-3 w-full sm:w-auto">
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id={`checkbox-${contact.id}`}
//             className="w-4 h-4 text-blue-600 border-gray-300 rounded"
//           />
//           <label htmlFor={`checkbox-${contact.id}`} className="sr-only">
//             Select {contact.name}
//           </label>
//         </div>
//         <div
//           className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase ${generateAvatarColor(contact.id)}`}
//         >
//           {getInitials(contact.name)}
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-800">{contact.name}</span>
//           <span className="text-sm text-gray-500">{contact.phone}</span>
//         </div>
//       </div>
//       {/* Right Side: Status */}
//       <div className={`mt-2 sm:mt-0 rounded-full text-sm font-medium ${getStatusClasses(contact.status)}`}>
//         {contact.status}
//       </div>
//     </div>
//   );
// };

// const Page: React.FC = () => {
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 300);

//   // Memoize filtered contacts for performance optimization
//   const filteredContacts = useMemo(() => {
//     return contacts.filter((contact) =>
//       contact.name.toLowerCase().includes(debouncedSearch.toLowerCase())
//     );
//   }, [debouncedSearch]);

//   return (
//     <Container>
//       <div className="w-full max-w-2xl mx-auto md:p-4">
//         {/* Header Section */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold mb-1">Invited Contacts</h1>
//           <p className="text-gray-500">List of contacts you&apos;ve invited for this group</p>
//         </div>
//         <div className="bg-white rounded-t-3xl p-6">
//           {/* Search Bar */}
//           <div className="relative mb-6 w-full">
//             <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search contacts"
//               aria-label="Search contacts"
//               className="w-full pl-10 pr-10 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {search && (
//               <FiX
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
//                 onClick={() => setSearch("")}
//               />
//             )}
//           </div>
//           {/* Contacts List or Empty State */}
//           {filteredContacts.length > 0 ? (
//             <div className="grid gap-4">
//               {filteredContacts.map((contact) => (
//                 <ContactItem key={contact.id} contact={contact} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 py-6">
//               No contacts match your search criteria.
//             </div>
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Page;
