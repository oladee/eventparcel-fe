import React from "react";
import { FiSearch, FiX } from "react-icons/fi";
// import { Button } from "@/components/ui/button";

const contacts = [
  { id: 1, name: "James Paul-smith", phone: "08174628463", category: "All", initials: "JP", checked: false },
  { id: 2, name: "Darcy Patterson", phone: "+2348174628463", category: "Family", initials: "DP", checked: true },
  { id: 3, name: "Alex Hamilton", phone: "+2348174628463", category: "Family", initials: "AH", checked: false },
  { id: 4, name: "Bowen Group", phone: "+2348174628463", category: "Work", initials: "BG", checked: false },
  { id: 5, name: "Taylor Smith", phone: "08174628463", category: "All", initials: "TS", checked: true },
];

const ContactModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">Upload CSV File</h2>
          <FiX className="cursor-pointer text-gray-600" size={20} />
        </div>
        <p className="text-sm text-gray-500 mt-2">You can upload a csv file exported from your contact list</p>
        
        {/* Search Bar */}
        <div className="relative mt-4">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Contacts"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        
        {/* Category Tabs */}
        <div className="flex space-x-3 mt-4 border-b pb-2 text-sm">
          <span className="font-semibold border-b-2 border-red-500 pb-1 cursor-pointer">All <span className="text-xs">24</span></span>
          <span className="text-gray-500 cursor-pointer">Work <span className="text-xs">15</span></span>
          <span className="text-gray-500 cursor-pointer">Family <span className="text-xs">9</span></span>
        </div>
        
        {/* Contact List */}
        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-3 rounded-lg ${contact.checked ? 'bg-gray-100' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={contact.checked} className="accent-red-500" readOnly />
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: contact.checked ? "#DC2626" : "#E5E7EB" }}
                >
                  {contact.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.phone}</p>
                </div>
              </div>
              {contact.category !== "All" && <span className="text-xs text-gray-500">{contact.category}</span>}
            </div>
          ))}
        </div>
        
        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 mt-5">
          {/* <Button variant="outline">Cancel</Button>
          <Button className="bg-red-600 text-white">Import</Button> */}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;








// import React, { useState } from 'react';
// import { FiSearch } from 'react-icons/fi';

// interface Contact {
//   id: number;
//   name: string;
//   phone: string;
//   category: 'Work' | 'Family';
// }

// const ContactModal: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<'All' | 'Work' | 'Family'>('All');

//   // Categories to display in the tab filters
//   const categories = [
//     { label: 'All', count: 24 },
//     { label: 'Work', count: 15 },
//     { label: 'Family', count: 9 },
//   ];

//   // Example contact list
//   const contacts: Contact[] = [
//     {
//       id: 1,
//       name: 'James Paul-smith',
//       phone: '+08174628463',
//       category: 'Work',
//     },
//     {
//       id: 2,
//       name: 'Darcy Patterson',
//       phone: '+2348174628463',
//       category: 'Family',
//     },
//     {
//       id: 3,
//       name: 'Alex Hamilton',
//       phone: '+2348174628463',
//       category: 'Work',
//     },
//     {
//       id: 4,
//       name: 'Bowen Group',
//       phone: '+2348174628463',
//       category: 'Work',
//     },
//     {
//       id: 5,
//       name: 'Taylor Smith',
//       phone: '+08174628463',
//       category: 'Family',
//     },
//   ];

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 z-50">
//       {/* Modal container */}
//       <div className="bg-white w-full max-w-lg rounded-md shadow-lg flex flex-col">
        
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold">Upload CSV File</h2>
//           <p className="text-gray-500 text-sm mt-1">
//             You can upload a csv file exported from your contact list
//           </p>
//         </div>

//         {/* Search and category filter */}
//         <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           {/* Search input */}
//           <div className="relative w-full sm:max-w-xs">
//             <FiSearch className="absolute top-2 left-2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Contacts"
//               className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//           {/* Category tabs */}
//           <div className="flex gap-2 overflow-x-auto">
//             {categories.map((cat) => (
//               <button
//                 key={cat.label}
//                 onClick={() => setSelectedCategory(cat.label as 'All' | 'Work' | 'Family')}
//                 className={`text-sm px-3 py-1 rounded-md border whitespace-nowrap ${
//                   selectedCategory === cat.label
//                     ? 'bg-blue-500 text-white border-blue-500'
//                     : 'bg-white text-gray-700 border-gray-300'
//                 }`}
//               >
//                 {cat.label} ({cat.count})
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Contact List */}
//         <div className="px-6 py-4 max-h-64 overflow-y-auto">
//           <ul className="space-y-2">
//             {contacts
//               .filter((contact) =>
//                 selectedCategory === 'All'
//                   ? true
//                   : contact.category === selectedCategory
//               )
//               .map((contact) => (
//                 <li
//                   key={contact.id}
//                   className="flex items-center justify-between p-2 border border-gray-200 rounded"
//                 >
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       className="form-checkbox h-4 w-4 text-blue-600"
//                     />
//                     <div className="flex flex-col">
//                       <span className="font-medium text-gray-800">
//                         {contact.name}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {contact.phone}
//                       </span>
//                     </div>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {contact.category}
//                   </span>
//                 </li>
//               ))}
//           </ul>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 flex justify-end gap-2 border-t border-gray-200">
//           <button
//             className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md 
//                        hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md 
//                        hover:bg-blue-600 transition-colors"
//           >
//             Import
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactModal;
