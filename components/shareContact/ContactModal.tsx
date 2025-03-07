// import React, { useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { XCircle } from "lucide-react";
// import { FileUpload } from "../icons/Icons";
// import ContactModal from "./ContactModal";
// import axios from 'axios';

// interface CsvModalProps {
//   // onClose: () => void;
//   onClose: () => void; contacts: any[];
// }

// const CsvModal: React.FC<CsvModalProps> = ({ onClose }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [contacts, setContacts] = useState<any[]>([]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.type === "text/csv") {
//       setSelectedFile(file);
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file && file.type === "text/csv") {
//       setSelectedFile(file);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//   };

//   const handleImport = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('csvData', selectedFile);

//     try {
//       const response = await axios.post('https://your-backend-endpoint/extract-csv', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data && response.data.data) {
//         const parsedContacts = response.data.data.map((contact: any, index: number) => ({
//           id: index + 1,
//           name: contact.name,
//           phone: contact.phoneNumber,
//           category: '', // You can set a default category or leave it empty
//           initials: contact.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
//           "First Name": contact.name.split(' ')[0],
//           "Last Name": contact.name.split(' ').slice(1).join(' '),
//           "Phone 1 - Value": contact.phoneNumber,
//         }));

//         setContacts(parsedContacts);
//       }
//     } catch (error) {
//       console.error('Error uploading CSV:', error);
//       // Handle error (e.g., show an error message to the user)
//     }
//   };

//   if (contacts.length > 0) {
//     return (
//       <ContactModal
//         onClose={onClose}
//         contacts={contacts}
//       />
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-900">Upload CSV File</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-800"
//           >
//             <IoClose size={24} />
//           </button>
//         </div>
//         <p className="text-gray-500 mt-1">
//           You can upload a csv file exported from your contact list
//         </p>

//         <div
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           className="relative border border-dashed border-gray-300 rounded-[12px] p-6 mt-6 text-center space-y-2"
//         >
//           {selectedFile ? (
//             <div className="text-center">
//               <p className="text-green-600 font-medium">
//                 {selectedFile.name}{" "}
//               </p>
//               <XCircle
//                 className="text-red-500 absolute top-0 right-4 cursor-pointer mt-2"
//                 size={20}
//                 onClick={removeFile}
//               />
//             </div>
//           ) : (
//             <>
//               <div className="flex justify-center p-3">
//                 <FileUpload width={50} height={50} />
//               </div>
//               <p className="text-primary text-sm font-medium mt-2">
//                 Select a CSV file to upload
//               </p>
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileChange}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//               <p className="text-[#718096] text-xs hidden sm:block">or drag and drop it here</p>
//             </>
//           )}
//         </div>

//         <p className="mt-4 text-sm text-gray-900 font-medium">
//           Got a manually created CSV?{" "}
//           <span className="text-primary cursor-pointer font-medium">
//             Download Template
//           </span>
//         </p>

//         <div className="flex justify-end space-x-4 mt-6">
//           <button
//             onClick={onClose}
//             className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleImport}
//             disabled={!selectedFile}
//             className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//               !selectedFile ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             Import
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CsvModal;













import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface Contact {
  id: number;
  name: string;
  phone: string;
  category: string;
  initials: string;
  "First Name": string;
  "Last Name": string;
  "Phone 1 - Value": string;
}

interface ContactModalProps {
  onClose: () => void;
  contacts: Contact[];
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, contacts }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    try {
      const validateContacts = (contacts: Contact[]): boolean => {
        return contacts.every(
          (contact) =>
            contact["First Name"] && contact["Last Name"] && contact["Phone 1 - Value"]
        );
      };

      if (!validateContacts(contacts)) {
        throw new Error("Invalid CSV");
      }

      const getInitials = (firstName: string, lastName: string): string => {
        const getValidChar = (name: string) => {
          for (const char of name) {
            if (/[a-zA-Z]/.test(char)) {
              return char.toUpperCase();
            }
          }
          return "";
        };

        const firstInitial = getValidChar(firstName);
        const lastInitial = lastName ? getValidChar(lastName) : "";

        if (firstInitial && lastInitial) {
          return firstInitial + lastInitial;
        } else if (firstInitial) {
          return firstInitial + (getValidChar(firstName.slice(1)) || "");
        } else if (lastInitial) {
          return lastInitial + (getValidChar(lastName.slice(1)) || "");
        }
        return "";
      };

      const formattedContacts = contacts.map((contact) => ({
        ...contact,
        initials: getInitials(contact["First Name"], contact["Last Name"]),
        name: `${contact["First Name"]} ${contact["Last Name"]}`.trim(),
        phone: contact["Phone 1 - Value"],
      }));

      const filteredContacts = formattedContacts.filter((contact) => {
        const matchesCategory =
          selectedCategory === "All" || contact.category === selectedCategory;
        const matchesSearch = (contact.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      setFilteredContacts(filteredContacts);
    } catch (error) {
      console.error('Error uploading CSV:', error);
      setShowErrorModal(true);
    }
  }, [contacts, selectedCategory, searchTerm]);

  const toggleSelect = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((contactId) => contactId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact.id));
    }
    setSelectAll(!selectAll);
  };

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
              The CSV you imported doesn&apos;t meet our criteria. Kindly upload a CSV file using our template.
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
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Select Contacts</h2>
              <FiX
                className="cursor-pointer text-gray-600"
                size={20}
                onClick={onClose}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Select contacts to import</p>

            {/* Search Bar */}
            <div className="relative mt-4">
              <FiSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
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
                      selectedContacts.includes(contact.id) ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        className="outline-none"
                      />
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{
                          backgroundColor: selectedContacts.includes(contact.id)
                            ? "#751423"
                            : "#C4C4C4"
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
                    Try adjusting your search or filter to find what you&apos;re looking
                    for.
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
                  selectedContacts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={selectedContacts.length === 0}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactModal;











































// import React, { useState } from "react";
  // import { FiSearch, FiX } from "react-icons/fi";

  // interface Contact {
  //   id: number;
  //   name: string;
  //   phone: string;
  //   category: string;
  //   initials: string;
  //   "First Name": string;
  //   "Last Name": string;
  //   "Phone 1 - Value": string;
  // }

  // interface ContactModalProps {
  //   onClose: () => void;
  //   contacts: Contact[];
  // }

  // const ContactModal: React.FC<ContactModalProps> = ({ onClose, contacts }) => {
  //   const [selectedCategory, setSelectedCategory] = useState("All");
  //   const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [selectAll, setSelectAll] = useState(false);

  //   const getInitials = (firstName: string, lastName: string): string => {
  //     const getValidChar = (name: string) => {
  //       for (const char of name) {
  //         if (/[a-zA-Z]/.test(char)) {
  //           return char.toUpperCase();
  //         }
  //       }
  //       return "";
  //     };

  //     const firstInitial = getValidChar(firstName);
  //     const lastInitial = lastName ? getValidChar(lastName) : "";

  //     if (firstInitial && lastInitial) {
  //       return firstInitial + lastInitial;
  //     } else if (firstInitial) {
  //       return firstInitial + (getValidChar(firstName.slice(1)) || "");
  //     } else if (lastInitial) {
  //       return lastInitial + (getValidChar(lastName.slice(1)) || "");
  //     }
  //     return "";
  //   };

  //   const formattedContacts = contacts.map((contact) => ({
  //     ...contact,
  //     initials: getInitials(contact["First Name"], contact["Last Name"]),
  //     name: `${contact["First Name"]} ${contact["Last Name"]}`.trim(),
  //     phone: contact["Phone 1 - Value"],
  //   }));

  //   const filteredContacts = formattedContacts.filter((contact) => {
  //     const matchesCategory =
  //       selectedCategory === "All" || contact.category === selectedCategory;
  //     const matchesSearch = (contact.name || "")
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());
  //     return matchesCategory && matchesSearch;
  //   });

  //   console.log(filteredContacts);

  //   const toggleSelect = (id: number) => {
  //     setSelectedContacts((prev) =>
  //       prev.includes(id)
  //         ? prev.filter((contactId) => contactId !== id)
  //         : [...prev, id]
  //     );
  //   };

  //   const handleSelectAll = () => {
  //     if (selectAll) {
  //       setSelectedContacts([]);
  //     } else {
  //       setSelectedContacts(filteredContacts.map((contact) => contact.id));
  //     }
  //     setSelectAll(!selectAll);
  //   };

  //   return (
  //     <div className="fixed overflow-y-auto no-scrollbar inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
  //       <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mt-44">
  //         {/* Header */}
  //         <div className="flex justify-between items-center border-b pb-3">
  //           <h2 className="text-lg font-semibold">Select Contacts</h2>
  //           <FiX
  //             className="cursor-pointer text-gray-600"
  //             size={20}
  //             onClick={onClose}
  //           />
  //         </div>
  //         <p className="text-sm text-gray-500 mt-2">Select contacts to import</p>

  //         {/* Search Bar */}
  //         <div className="relative mt-4">
  //           <FiSearch
  //             className="absolute left-3 top-2.5 text-gray-400"
  //             size={16}
  //           />
  //           <input
  //             type="text"
  //             placeholder="Search contacts"
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
  //           />
  //         </div>

  //         {/* Category Tabs */}
  //         <div className="relative flex space-x-3 mt-4 px-2 text-sm">
  //           <hr className="h-[2px] bg-[#EAECF0] absolute right-0 -bottom-0 w-full" />
  //           <span
  //             onClick={() => setSelectedCategory("All")}
  //             className={`cursor-pointer px-1 !pb-2 ${
  //               selectedCategory === "All"
  //                 ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
  //                 : "text-gray-500"
  //             }`}
  //           >
  //             All{" "}
  //             <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
  //               {contacts.length}
  //             </span>
  //           </span>
  //           <span
  //             onClick={() => setSelectedCategory("Work")}
  //             className={`cursor-pointer px-1 !pb-2 ${
  //               selectedCategory === "Work"
  //                 ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
  //                 : "text-gray-500"
  //             }`}
  //           >
  //             Work{" "}
  //             <span className="text-xs  bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
  //               {contacts.filter((c) => c.category === "Work").length}
  //             </span>
  //           </span>
  //           <span
  //             onClick={() => setSelectedCategory("Family")}
  //             className={`cursor-pointer px-1 !pb-2 ${
  //               selectedCategory === "Family"
  //                 ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
  //                 : "text-gray-500"
  //             }`}
  //           >
  //             Family{" "}
  //             <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
  //               {contacts.filter((c) => c.category === "Family").length}
  //             </span>
  //           </span>
  //           {selectedContacts.length > 0 && (
  //             <span className="ml-auto">
  //               <input
  //                 type="checkbox"
  //                 id="selectAll"
  //                 checked={selectAll}
  //                 onChange={handleSelectAll}
  //               />{" "}
  //               <label htmlFor="selectAll">Select All</label>
  //             </span>
  //           )}
  //         </div>

  //         {/* Contact List */}
  //         <div className="mt-4 space-y-3 max-h-64 overflow-y-auto no-scrollbar">
  //           {filteredContacts.length > 0 ? (
  //             filteredContacts.map((contact) => (
  //               <div
  //                 key={contact.id}
  //                 className={`flex items-center justify-between p-3 rounded-lg ${
  //                   selectedContacts.includes(contact.id) ? "bg-gray-100" : ""
  //                 }`}
  //               >
  //                 <div className="flex items-center space-x-3">
  //                   <input
  //                     type="checkbox"
  //                     id="checkbox"
  //                     checked={selectedContacts.includes(contact.id)}
  //                     onChange={() => toggleSelect(contact.id)}
  //                     className="outline-none"
  //                   />
  //                   <div
  //                     className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
  //                     style={{
  //                       backgroundColor: selectedContacts.includes(contact.id)
  //                         ? "#751423"
  //                         : "#C4C4C4"
  //                     }}
  //                   >
  //                     {contact.initials}
  //                   </div>
  //                   <div>
  //                     <p className="text-sm font-medium">{contact.name}</p>
  //                     <p className="text-xs text-gray-500">{contact.phone}</p>
  //                   </div>
  //                 </div>
  //                 {contact.category !== "All" && (
  //                   <span className="text-xs text-gray-500">
  //                     {contact.category}
  //                   </span>
  //                 )}
  //               </div>
  //             ))
  //           ) : (
  //             <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
  //               <FiSearch size={48} className="mb-4" />
  //               <p className="text-lg font-semibold">No contacts found</p>
  //               <p className="text-sm">
  //                 Try adjusting your search or filter to find what you&apos;re looking
  //                 for.
  //               </p>
  //             </div>
  //           )}
  //         </div>

  //         {/* Footer Buttons */}
  //         <div className="flex justify-end space-x-3 mt-5">
  //           <button
  //             onClick={onClose}
  //             className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
  //               selectedContacts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
  //             }`}
  //             disabled={selectedContacts.length === 0}
  //           >
  //             Import
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default ContactModal;









































// import React, { useState } from "react";
// import { FiSearch, FiX } from "react-icons/fi";

// const contactsData = [
//   {
//     id: 1,
//     name: "James Paul-smith",
//     phone: "08174628463",
//     category: "All",
//     initials: "JP"
//   },
//   {
//     id: 2,
//     name: "Darcy Patterson",
//     phone: "+2348174628463",
//     category: "Family",
//     initials: "DP"
//   },
//   {
//     id: 3,
//     name: "Alex Hamilton",
//     phone: "+2348174628463",
//     category: "Family",
//     initials: "AH"
//   },
//   {
//     id: 4,
//     name: "Bowen Group",
//     phone: "+2348174628463",
//     category: "Work",
//     initials: "BG"
//   },
//   {
//     id: 5,
//     name: "Taylor Smith",
//     phone: "08174628463",
//     category: "All",
//     initials: "TS"
//   }
// ];

// interface ContactModalProps {
//   onClose: () => void;
// }

// const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredContacts = contactsData.filter((contact) => {
//     const matchesCategory =
//       selectedCategory === "All" || contact.category === selectedCategory;
//     const matchesSearch = contact.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const toggleSelect = (id: number) => {
//     setSelectedContacts((prev) =>
//       prev.includes(id)
//         ? prev.filter((contactId) => contactId !== id)
//         : [...prev, id]
//     );
//   };

//   return (
//     <div className="fixed overflow-y-auto no-scrollbar inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mt-44">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-lg font-semibold">Select Contacts</h2>
//           <FiX
//             className="cursor-pointer text-gray-600"
//             size={20}
//             onClick={onClose}
//           />
//         </div>
//         <p className="text-sm text-gray-500 mt-2">Select contacts to import</p>

//         {/* Search Bar */}
//         <div className="relative mt-4">
//           <FiSearch
//             className="absolute left-3 top-2.5 text-gray-400"
//             size={16}
//           />
//           <input
//             type="text"
//             placeholder="Search contacts"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
//           />
//         </div>

//         {/* Category Tabs */}
//         <div className="relative flex space-x-3 mt-4 px-2 text-sm">
//           <hr className="h-[2px] bg-[#EAECF0] absolute right-0 -bottom-0 w-full" />
//           <span
//             onClick={() => setSelectedCategory("All")}
//             className={`cursor-pointer px-1 !pb-2 ${
//               selectedCategory === "All"
//                 ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
//                 : "text-gray-500"
//             }`}
//           >
//             All{" "}
//             <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
//               {contactsData.length}
//             </span>
//           </span>
//           <span
//             onClick={() => setSelectedCategory("Work")}
//             className={`cursor-pointer px-1 !pb-2 ${
//               selectedCategory === "Work"
//                 ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
//                 : "text-gray-500"
//             }`}
//           >
//             Work{" "}
//             <span className="text-xs  bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
//               {contactsData.filter((c) => c.category === "Work").length}
//             </span>
//           </span>
//           <span
//             onClick={() => setSelectedCategory("Family")}
//             className={`cursor-pointer px-1 !pb-2 ${
//               selectedCategory === "Family"
//                 ? "font-semibold border-b-2 border-primary pb-1 text-primary z-10"
//                 : "text-gray-500"
//             }`}
//           >
//             Family{" "}
//             <span className="text-xs bg-[#F4F8FB] px-3 py-1 rounded-[4px] text-center">
//               {contactsData.filter((c) => c.category === "Family").length}
//             </span>
//           </span>
//         </div>

//         {/* Contact List */}
//         <div className="mt-4 space-y-3 max-h-64 overflow-y-auto no-scrollbar">
//           {filteredContacts.map((contact) => (
//             <div
//               key={contact.id}
//               className={`flex items-center justify-between p-3 rounded-lg ${
//                 selectedContacts.includes(contact.id) ? "bg-gray-100" : ""
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   id="checkbox"
//                   checked={selectedContacts.includes(contact.id)}
//                   onChange={() => toggleSelect(contact.id)}
//                   className="outline-none"
//                 />
//                 <div
//                   className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
//                   style={{
//                     backgroundColor: selectedContacts.includes(contact.id)
//                       ? "#751423"
//                       : "#C4C4C4"
//                   }}
//                 >
//                   {contact.initials}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">{contact.name}</p>
//                   <p className="text-xs text-gray-500">{contact.phone}</p>
//                 </div>
//               </div>
//               {contact.category !== "All" && (
//                 <span className="text-xs text-gray-500">
//                   {contact.category}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex justify-end space-x-3 mt-5">
//           <button
//             onClick={onClose}
//             className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//           >
//             Cancel
//           </button>
//           <button
//             className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope`}
//           >
//             Import
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactModal;
