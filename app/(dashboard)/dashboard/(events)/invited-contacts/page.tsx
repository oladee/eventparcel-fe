"use client";
import Container from "@/components/dashboard/Container";
import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface Contact {
  id: number;
  name: string;
  phone: string;
  status: "Pending" | "Ordered" | "Viewed";
}

const contacts: Contact[] = [
  { id: 1, name: "James Paul-smith", phone: "+2348174628463", status: "Pending" },
  { id: 2, name: "Darcy Patterson", phone: "+2348174628463", status: "Pending" },
  { id: 3, name: "Alex Hamilton", phone: "+2348174628463", status: "Ordered" },
  { id: 4, name: "Bowen Group", phone: "+2348174628463", status: "Viewed" },
  { id: 5, name: "Taylor Smith", phone: "+2348174628463", status: "Viewed" },
  { id: 6, name: "Alex Hamilton", phone: "+2348174628463", status: "Ordered" },
  { id: 7, name: "Bowen Group", phone: "+2348174628463", status: "Viewed" },
  { id: 8, name: "Taylor Smith", phone: "+2348174628463", status: "Viewed" }
];

// Custom hook to debounce any fast-changing value (like search input)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Generate initials from the contact name
const getInitials = (name: string) => {
  const parts = name.split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
};

// Deterministically choose an avatar color based on contact id
const generateAvatarColor = (id: number): string => {
  const colors = [
    "bg-[#C4C4C466] text-[#000000]",
    "bg-[#F7BAAD66] text-[#E95D3F]",
    "bg-[#CAF6AD66] text-[#84CA53]",
    "bg-[#9BB3E366] text-[#3C5C98]",
    "bg-[#E2A5D766] text-[#A43A92]"
  ];
  return colors[id % colors.length];
};

// Get CSS classes for the status badge
const getStatusClasses = (status: Contact["status"]) => {
  switch (status) {
    case "Pending":
      return "text-[#667085]";
    case "Ordered":
      return "text-[#0CAF60]";
    case "Viewed":
      return "text-[#FBBC05]";
    default:
      return "text-gray-700";
  }
};

interface ContactItemProps {
  contact: Contact;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
  return (
    <div className="w-full flex items-start sm:items-center justify-between bg-white p-4 border-b border-gray-100 rounded-md hover:bg-[#F4F8FB]">
      {/* Left Side: Checkbox, Avatar, Name & Phone */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`checkbox-${contact.id}`}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor={`checkbox-${contact.id}`} className="sr-only">
            Select {contact.name}
          </label>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase ${generateAvatarColor(contact.id)}`}
        >
          {getInitials(contact.name)}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{contact.name}</span>
          <span className="text-sm text-gray-500">{contact.phone}</span>
        </div>
      </div>
      {/* Right Side: Status */}
      <div className={`mt-2 sm:mt-0 rounded-full text-sm font-medium ${getStatusClasses(contact.status)}`}>
        {contact.status}
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // Memoize filtered contacts for performance optimization
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  return (
    <Container>
      <div className="w-full max-w-2xl mx-auto md:p-4">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Invited Contacts</h1>
          <p className="text-gray-500">List of contacts you&apos;ve invited for this group</p>
        </div>
        <div className="bg-white rounded-t-3xl p-6">
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
          {/* Contacts List or Empty State */}
          {filteredContacts.length > 0 ? (
            <div className="grid gap-4">
              {filteredContacts.map((contact) => (
                <ContactItem key={contact.id} contact={contact} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              No contacts match your search criteria.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Page;












// "use client";
// import Container from "@/components/dashboard/Container";
// import React, { useState } from "react";
// import { FiSearch, FiX } from "react-icons/fi";

// interface Contact {
//   id: number;
//   name: string;
//   phone: string;
//   status: "Pending" | "Ordered" | "Viewed";
// }

// const contacts: Contact[] = [
//   {
//     id: 1,
//     name: "James Paul-smith",
//     phone: "+2348174628463",
//     status: "Pending"
//   },
//   {
//     id: 2,
//     name: "Darcy Patterson",
//     phone: "+2348174628463",
//     status: "Pending"
//   },
//   { id: 3, name: "Alex Hamilton", phone: "+2348174628463", status: "Ordered" },
//   { id: 4, name: "Bowen Group", phone: "+2348174628463", status: "Viewed" },
//   { id: 5, name: "Taylor Smith", phone: "+2348174628463", status: "Viewed" },
//   { id: 6, name: "Alex Hamilton", phone: "+2348174628463", status: "Ordered" },
//   { id: 7, name: "Bowen Group", phone: "+2348174628463", status: "Viewed" },
//   { id: 8, name: "Taylor Smith", phone: "+2348174628463", status: "Viewed" }
// ];

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

// const Page: React.FC = () => {
//   const [search, setSearch] = useState("");

//   return (
//     <Container>
//       <div className="w-full max-w-2xl mx-auto md:p-4">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold mb-1">
//             Invited Contacts
//           </h1>
//           <p className="text-gray-500">
//             List of contacts you&apos;ve invited for this group
//           </p>
//         </div>

//         <div className="bg-white rounded-t-3xl p-6">
//           {/* Search Bar */}
//           <div className="relative mb-6 w-full">
//             <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search contacts"
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

//           {/* Contacts List */}
//           <div className="grid gap-4">
//             {contacts
//               .filter((contact) =>
//                 contact.name.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((contact) => (
//                 <div
//                   key={contact.id}
//                   className="w-full flex items-start sm:items-center justify-between bg-white p-4 border-b border-gray-100 rounded-md hover:bg-[#F4F8FB]"
//                 >
//                   {/* Left Side: Checkbox, Avatar, Name & Phone */}
//                   <div className="flex items-center space-x-3 w-full sm:w-auto">
//                     {/* Checkbox */}
//                     <input
//                       type="checkbox"
//                       id="checkbox"
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded"
//                     />
//                     {/* Avatar with Deterministic Colors */}
//                     <div
//                       className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase ${generateAvatarColor(
//                         contact.id
//                       )}`}
//                     >
//                       {getInitials(contact.name)}
//                     </div>
//                     {/* Name & Phone */}
//                     <div className="flex flex-col">
//                       <span className="font-semibold text-gray-800">
//                         {contact.name}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {contact.phone}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Right Side: Status */}
//                   <div
//                     className={`mt-2 sm:mt-0 rounded-full text-sm font-medium ${getStatusClasses(
//                       contact.status
//                     )}`}
//                   >
//                     {contact.status}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Page;


