"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
// import ReusuableSuccess from "../modals/ReusuableSuccess";
import SendContactModal from "./SendContactModal";

interface Contact {
  id: number;
  name: string;
  phone: string;
  category: string;
  initials: string;
}

interface CSVContactModalProps {
  onClose: () => void;
  contacts: Contact[];
}

const CSVContactModal: React.FC<CSVContactModalProps> = ({
  onClose,
  contacts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  // const [showModal] = useState<boolean>(false);
  const [optionModal, setOptionModal] = useState(false);

  // Update filteredContacts and set initials
  useEffect(() => {
    try {
      // Validate contacts structure
      const validateContacts = (contacts: Contact[]): boolean => {
        return contacts.every((contact) => contact.name && contact.phone);
      };

      if (!validateContacts(contacts)) {
        throw new Error("Invalid CSV");
      }

      // Generate initials for each contact
      const getInitials = (name: string): string => {
        const names = name.split(" ");
        const firstInitial = names[0] ? names[0][0].toUpperCase() : "";
        const lastInitial = names[1] ? names[1][0].toUpperCase() : "";
        return firstInitial + lastInitial;
      };

      // Format contacts with initials
      const formattedContacts = contacts.map((contact, index) => ({
        ...contact,
        id: index + 1, // Generate a unique ID
        initials: getInitials(contact.name),
        category: contact.category || "", // Default category if missing
      }));

      // Filter contacts based on category and search term
      const filtered = formattedContacts.filter((contact) => {
        const matchesCategory =
          selectedCategory === "All" || contact.category === selectedCategory;
        const matchesSearch = (contact.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      setFilteredContacts(filtered);
    } catch (error) {
      console.log(error);
      setShowErrorModal(true);
    }
  }, [contacts, selectedCategory, searchTerm]);

  // Toggle single contact selection
  const toggleSelect = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((contactId) => contactId !== id)
        : [...prev, id]
    );
  };

  // Toggle select all contacts
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact.id));
    }
    setSelectAll(!selectAll);
  };

  // When user clicks import, toggle the option modal for sharing via SMS/WhatsApp/both
  const handleImport = () => {
    setOptionModal((prev) => !prev);
  };

  // Update extraction logic: from the filteredContacts selected, extract an array of contact objects with guestName and phoneNumber.
  const extractedContacts = filteredContacts
    .filter((contact) => selectedContacts.includes(contact.id))
    .map((contact) => ({
      guestName: contact.name,
      phoneNumber: contact.phone,
    }));

  // Also, extract just phone numbers for WhatsApp and Both invites.
  const extractedPhoneNumbers = filteredContacts
    .filter((contact) => selectedContacts.includes(contact.id))
    .map((contact) => contact.phone);

  return (
    <>
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mt-44">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Invalid CSV</h2>
              <FiX
                className="cursor-pointer text-gray-600"
                size={20}
                onClick={() => setShowErrorModal(false)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              The CSV you imported doesn&apos;t meet our criteria. Kindly upload
              a CSV file using our template.
            </p>
            <div className="flex justify-end space-x-3 mt-5">
              <button
                onClick={() => setShowErrorModal(false)}
                className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {!showErrorModal && (
        <div className="fixed overflow-y-auto no-scrollbar inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mt-44">
            {/* Header */}
            <div className="relative border-b pb-3">
              <h2
                id="uploadCsvHeade"
                className="text-lg lg:text-xl font-bold text-[#111827]"
              >
                Upload CSV File
              </h2>
              <FiX
                className="absolute top-4 right-4 cursor-pointer text-gray-600"
                size={20}
                onClick={onClose}
              />
              <p id="uploadCsvDesc" className="text-sm text-[#718096] mt-2">
                You can upload a csv file exported from your contact list
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mt-4">
              <FiSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                id="seearchBarCSV"
                type="text"
                placeholder="Search contacts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* Category Tabs */}
            <div className="relative flex space-x-3 mt-4 px-2 text-sm">
              <hr className="h-[2px] bg-[#EAECF0] absolute right-0 -bottom-0 w-full" />
              <span
                onClick={() => setSelectedCategory("All")}
                className={`cursor-pointer px-1 !pb-2 ${
                  selectedCategory === "All"
                    ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
                    : "text-gray-500"
                }`}
              >
                All{" "}
                <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
                  {contacts.length}
                </span>
              </span>
              <span
                onClick={() => setSelectedCategory("Work")}
                className={`cursor-pointer px-1 !pb-2 ${
                  selectedCategory === "Work"
                    ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
                    : "text-gray-500"
                }`}
              >
                Work{" "}
                <span className="text-xs  bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
                  {contacts.filter((c) => c.category === "Work").length}
                </span>
              </span>
              <span
                onClick={() => setSelectedCategory("Family")}
                className={`cursor-pointer px-1 !pb-2 ${
                  selectedCategory === "Family"
                    ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
                    : "text-gray-500"
                }`}
              >
                Family{" "}
                <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
                  {contacts.filter((c) => c.category === "Family").length}
                </span>
              </span>
              {selectedContacts.length > 0 && (
                <span className="ml-auto">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />{" "}
                  <label htmlFor="selectAll">Select All</label>
                </span>
              )}
            </div>

            {/* Contact List */}
            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      selectedContacts.includes(contact.id)
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`checkbox-${contact.id}`}
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        className="outline-none"
                      />
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{
                          backgroundColor: selectedContacts.includes(contact.id)
                            ? "#751423"
                            : "#C4C4C4",
                        }}
                      >
                        {contact.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    {contact.category !== "All" && (
                      <span className="text-xs text-gray-500">
                        {contact.category}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
                  <FiSearch size={48} className="mb-4" />
                  <p className="text-lg font-semibold">No contacts found</p>
                  <p className="text-sm">
                    Try adjusting your search or filter to find what you&apos;re
                    looking for.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 mt-5">
              <button
                onClick={onClose}
                className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
              >
                Cancel
              </button>
              <button
                className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                  selectedContacts.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={selectedContacts.length === 0}
                onClick={handleImport}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {showModal && (
        <ReusuableSuccess
          title="Nicely done, you're almost there"
          subtitle="Let's setup your payment process and delivery plans"
          route="/dashboard/events"
          buttonText="Continue"
        />
      )} */}

      {/* Pass the extracted contact details and phone numbers to the SendContactModal */}
      <SendContactModal
        isOpen={optionModal}
        onClose={handleImport}
        // eventGroupId="67eeab0c65b211b0e9281b9b"
        eventGroupId={localStorage.getItem("sendGroupId") || ""}
        contacts={extractedContacts}
        phoneNumbers={extractedPhoneNumbers}
      />
      <ToastContainer />
    </>
  );
};

export default CSVContactModal;











// "use client";

// import React, { useState, useEffect } from "react";
// import { FiSearch, FiX } from "react-icons/fi";
// import { ToastContainer } from "react-toastify";
// import ReusuableSuccess from "../modals/ReusuableSuccess";
// import SendContactModal from "./SendContactModal";

// interface Contact {
//   id: number;
//   name: string;
//   phone: string;
//   category: string;
//   initials: string;
// }

// interface CSVContactModalProps {
//   onClose: () => void;
//   contacts: Contact[];
// }

// const CSVContactModal: React.FC<CSVContactModalProps> = ({
//   onClose,
//   contacts,
// }) => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectAll, setSelectAll] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
//   const [showModal] = useState<boolean>(false);
//   const [optionModal, setOptionModal] = useState(false);

//   // Update filteredContacts and set initials
//   useEffect(() => {
//     try {
//       // Validate contacts structure
//       const validateContacts = (contacts: Contact[]): boolean => {
//         return contacts.every((contact) => contact.name && contact.phone);
//       };

//       if (!validateContacts(contacts)) {
//         throw new Error("Invalid CSV");
//       }

//       // Generate initials for each contact
//       const getInitials = (name: string): string => {
//         const names = name.split(" ");
//         const firstInitial = names[0] ? names[0][0].toUpperCase() : "";
//         const lastInitial = names[1] ? names[1][0].toUpperCase() : "";
//         return firstInitial + lastInitial;
//       };

//       // Format contacts with initials
//       const formattedContacts = contacts.map((contact, index) => ({
//         ...contact,
//         id: index + 1, // Generate a unique ID
//         initials: getInitials(contact.name),
//         category: contact.category || "", // Default category if missing
//       }));

//       // Filter contacts based on category and search term
//       const filtered = formattedContacts.filter((contact) => {
//         const matchesCategory =
//           selectedCategory === "All" || contact.category === selectedCategory;
//         const matchesSearch = (contact.name || "")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//         return matchesCategory && matchesSearch;
//       });

//       setFilteredContacts(filtered);
//     } catch (error) {
//       console.log(error);
//       setShowErrorModal(true);
//     }
//   }, [contacts, selectedCategory, searchTerm]);

//   // Toggle single contact selection
//   const toggleSelect = (id: number) => {
//     setSelectedContacts((prev) =>
//       prev.includes(id)
//         ? prev.filter((contactId) => contactId !== id)
//         : [...prev, id]
//     );
//   };

//   // Toggle select all contacts
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedContacts([]);
//     } else {
//       setSelectedContacts(filteredContacts.map((contact) => contact.id));
//     }
//     setSelectAll(!selectAll);
//   };

//   // When user clicks import, extract the phone numbers based on selected contact IDs
//   const handleImport = () => {
//     setOptionModal((prev) => !prev);
//   };

//   // Phone Extraction Logic:
//   // Filter the contacts that are selected and extract the phone number from each.
//   const extractedPhoneNumbers = filteredContacts
//     .filter((contact) => selectedContacts.includes(contact.id))
//     .map((contact) => contact.phone);

//   return (
//     <>
//       {showErrorModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mt-44">
//             <div className="flex justify-between items-center border-b pb-3">
//               <h2 className="text-lg font-semibold">Invalid CSV</h2>
//               <FiX
//                 className="cursor-pointer text-gray-600"
//                 size={20}
//                 onClick={() => setShowErrorModal(false)}
//               />
//             </div>
//             <p className="text-sm text-gray-500 mt-2">
//               The CSV you imported doesn&apos;t meet our criteria. Kindly upload
//               a CSV file using our template.
//             </p>
//             <div className="flex justify-end space-x-3 mt-5">
//               <button
//                 onClick={() => setShowErrorModal(false)}
//                 className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {!showErrorModal && (
//         <div className="fixed overflow-y-auto no-scrollbar inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mt-44">
//             {/* Header */}
//             <div className="relative border-b pb-3">
//               <h2
//                 id="uploadCsvHeade"
//                 className="text-lg lg:text-xl font-bold text-[#111827]"
//               >
//                 Upload CSV File
//               </h2>
//               <FiX
//                 className="absolute top-4 right-4 cursor-pointer text-gray-600"
//                 size={20}
//                 onClick={onClose}
//               />
//               <p id="uploadCsvDesc" className="text-sm text-[#718096] mt-2">
//                 You can upload a csv file exported from your contact list
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="relative mt-4">
//               <FiSearch
//                 className="absolute left-3 top-2.5 text-gray-400"
//                 size={16}
//               />
//               <input
//                 id="seearchBarCSV"
//                 type="text"
//                 placeholder="Search contacts"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
//               />
//             </div>

//             {/* Category Tabs */}
//             <div className="relative flex space-x-3 mt-4 px-2 text-sm">
//               <hr className="h-[2px] bg-[#EAECF0] absolute right-0 -bottom-0 w-full" />
//               <span
//                 onClick={() => setSelectedCategory("All")}
//                 className={`cursor-pointer px-1 !pb-2 ${
//                   selectedCategory === "All"
//                     ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
//                     : "text-gray-500"
//                 }`}
//               >
//                 All{" "}
//                 <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
//                   {contacts.length}
//                 </span>
//               </span>
//               <span
//                 onClick={() => setSelectedCategory("Work")}
//                 className={`cursor-pointer px-1 !pb-2 ${
//                   selectedCategory === "Work"
//                     ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Work{" "}
//                 <span className="text-xs  bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
//                   {contacts.filter((c) => c.category === "Work").length}
//                 </span>
//               </span>
//               <span
//                 onClick={() => setSelectedCategory("Family")}
//                 className={`cursor-pointer px-1 !pb-2 ${
//                   selectedCategory === "Family"
//                     ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Family{" "}
//                 <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
//                   {contacts.filter((c) => c.category === "Family").length}
//                 </span>
//               </span>
//               {selectedContacts.length > 0 && (
//                 <span className="ml-auto">
//                   <input
//                     type="checkbox"
//                     id="selectAll"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                   />{" "}
//                   <label htmlFor="selectAll">Select All</label>
//                 </span>
//               )}
//             </div>

//             {/* Contact List */}
//             <div className="mt-4 space-y-3 max-h-64 overflow-y-auto no-scrollbar">
//               {filteredContacts.length > 0 ? (
//                 filteredContacts.map((contact) => (
//                   <div
//                     key={contact.id}
//                     className={`flex items-center justify-between p-3 rounded-lg ${
//                       selectedContacts.includes(contact.id)
//                         ? "bg-gray-100"
//                         : ""
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <input
//                         type="checkbox"
//                         id={`checkbox-${contact.id}`}
//                         checked={selectedContacts.includes(contact.id)}
//                         onChange={() => toggleSelect(contact.id)}
//                         className="outline-none"
//                       />
//                       <div
//                         className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
//                         style={{
//                           backgroundColor: selectedContacts.includes(contact.id)
//                             ? "#751423"
//                             : "#C4C4C4",
//                         }}
//                       >
//                         {contact.initials}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">{contact.name}</p>
//                         <p className="text-xs text-gray-500">{contact.phone}</p>
//                       </div>
//                     </div>
//                     {contact.category !== "All" && (
//                       <span className="text-xs text-gray-500">
//                         {contact.category}
//                       </span>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
//                   <FiSearch size={48} className="mb-4" />
//                   <p className="text-lg font-semibold">No contacts found</p>
//                   <p className="text-sm">
//                     Try adjusting your search or filter to find what you&apos;re
//                     looking for.
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Footer Buttons */}
//             <div className="flex justify-end space-x-3 mt-5">
//               <button
//                 onClick={onClose}
//                 className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//               >
//                 Cancel
//               </button>
//               <button
//                 className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//                   selectedContacts.length === 0
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//                 disabled={selectedContacts.length === 0}
//                 onClick={handleImport}
//               >
//                 Import
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <ReusuableSuccess
//           title="Nicely done, you're almost there"
//           subtitle="Let's setup your payment process and delivery plans"
//           route="/dashboard/events"
//           buttonText="Continue"
//         />
//       )}

//       {/* Pass the extracted phone numbers and a fixed eventGroupId to the SendContactModal */}
//       <SendContactModal
//         isOpen={optionModal}
//         onClose={handleImport}
//         eventGroupId="67eeab0c65b211b0e9281b9b"
//         phoneNumbers={extractedPhoneNumbers}
//       />
//       <ToastContainer />
//     </>
//   );
// };

// export default CSVContactModal;