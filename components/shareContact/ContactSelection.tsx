import React from "react";
import { FiSearch } from "react-icons/fi";

export type Contact = {
  name: string[];
  email?: string[];
  tel?: string[];
  group?: "Work" | "Family" | "Friends" | "Other";
};

export type ContactSelectionProps = {
  handleGetContacts: () => void;
  isLoadingContacts: boolean;
  contactError: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTab: "All" | "Work" | "Family";
  setSelectedTab: (tab: "All" | "Work" | "Family") => void;
  tabFilteredContacts: Contact[];
  selectedContacts: Contact[];
  handleContactSelect: (contact: Contact) => void;
  setIsContactModalOpen: (isOpen: boolean) => void;
  handleImportContacts: () => void;
  isImportingContacts: boolean;
};

const ContactSelection: React.FC<ContactSelectionProps> = ({
  handleGetContacts,
  isLoadingContacts,
  contactError,
  searchTerm,
  setSearchTerm,
  selectedTab,
  setSelectedTab,
  tabFilteredContacts,
  selectedContacts,
  handleContactSelect,
  setIsContactModalOpen,
  handleImportContacts,
  isImportingContacts,
}) => {
  return (
    <>
      <button
        onClick={handleGetContacts}
        disabled={isLoadingContacts}
        className="w-full p-3 bg-primary text-white rounded-lg mb-4 disabled:opacity-50"
      >
        {isLoadingContacts ? "Loading Contacts..." : "Choose Contacts"}
      </button>
      {contactError && (
        <div className="text-red-500 text-sm mb-4">{contactError}</div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          id="seearchBarContact"
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Tabs for All / Work / Family */}
      <div className="flex gap-4 mb-4">
        {["All", "Work", "Family"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as "All" | "Work" | "Family")}
            className={`px-3 py-1 rounded ${
              selectedTab === tab
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {tabFilteredContacts.length > 0 ? (
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          {tabFilteredContacts.map((contact) => {
            const displayName = contact.name?.join(", ") || "No Name";
            const firstLetter = displayName.charAt(0).toUpperCase();
            const contactKey = `${contact.name.join("-")}-${
              contact.email?.join("-") || ""
            }-${contact.tel?.join("-") || ""}`;
            const isChecked = selectedContacts.includes(contact);

            return (
              <div
                key={contactKey}
                className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleContactSelect(contact)}
              >
                {/* Avatar and info */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                    {firstLetter}
                  </div>
                  <div>
                    <p className="font-semibold">{displayName}</p>
                    {contact.email && (
                      <p className="text-sm text-gray-600">
                        {contact.email.join(", ")}
                      </p>
                    )}
                    {contact.tel && (
                      <p className="text-sm text-gray-600">
                        {contact.tel.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                {/* Checkbox */}
                <input
                  id="checkbox"
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="w-5 h-5"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-600 text-center">No contacts found.</div>
      )}

      {/* Footer buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          id="cancel"
          onClick={() => setIsContactModalOpen(false)}
          className="p-2 px-4 border border-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          id="import"
          onClick={handleImportContacts}
          disabled={selectedContacts.length === 0 || isImportingContacts}
          className="p-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          {isImportingContacts
            ? "Importing..."
            : `Import ${selectedContacts.length} Contacts`}
        </button>
      </div>
    </>
  );
};

export default ContactSelection;













// import React from "react";
// import { FiSearch } from "react-icons/fi";

// export type Contact = {
//   name: string[];
//   email?: string[];
//   tel?: string[];
//   group?: "Work" | "Family" | "Friends" | "Other";
// };

// export type ContactSelectionProps = {
//   handleGetContacts: () => void;
//   isLoadingContacts: boolean;
//   contactError: string;
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   selectedTab: "All" | "Work" | "Family";
//   setSelectedTab: (tab: "All" | "Work" | "Family") => void;
//   tabFilteredContacts: Contact[];
//   selectedContacts: Contact[];
//   handleContactSelect: (contact: Contact) => void;
//   setIsContactModalOpen: (isOpen: boolean) => void;
//   handleImportContacts: () => void;
//   isImportingContacts: boolean;
// };

// const ContactSelection: React.FC<ContactSelectionProps> = ({
//   handleGetContacts,
//   isLoadingContacts,
//   contactError,
//   searchTerm,
//   setSearchTerm,
//   selectedTab,
//   setSelectedTab,
//   tabFilteredContacts,
//   selectedContacts,
//   handleContactSelect,
//   setIsContactModalOpen,
//   handleImportContacts,
//   isImportingContacts,
// }) => {
//   return (
//     <>
//       <button
//         onClick={handleGetContacts}
//         disabled={isLoadingContacts}
//         className="w-full p-3 bg-primary text-white rounded-lg mb-4 disabled:opacity-50"
//       >
//         {isLoadingContacts ? "Loading Contacts..." : "Choose Contacts"}
//       </button>
//       {contactError && (
//         <div className="text-red-500 text-sm mb-4">{contactError}</div>
//       )}

//       {/* Search Bar */}
//       <div className="relative mb-4">
//         <FiSearch className="absolute top-3 left-3 text-gray-400" />
//         <input
//           id="seearchBarContact"
//           type="text"
//           placeholder="Search contacts..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
//         />
//       </div>

//       {/* Tabs for All / Work / Family */}
//       <div className="flex gap-4 mb-4">
//         {["All", "Work", "Family"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setSelectedTab(tab as "All" | "Work" | "Family")}
//             className={`px-3 py-1 rounded ${
//               selectedTab === tab
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {tabFilteredContacts.length > 0 ? (
//         <div className="max-h-96 overflow-y-auto border rounded-lg">
//           {tabFilteredContacts.map((contact) => {
//             const displayName = contact.name?.join(", ") || "No Name";
//             const firstLetter = displayName.charAt(0).toUpperCase();
//             const contactKey = `${contact.name.join("-")}-${
//               contact.email?.join("-") || ""
//             }-${contact.tel?.join("-") || ""}`;
//             const isChecked = selectedContacts.includes(contact);

//             return (
//               <div
//                 key={contactKey}
//                 className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleContactSelect(contact)}
//               >
//                 {/* Avatar and info */}
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
//                     {firstLetter}
//                   </div>
//                   <div>
//                     <p className="font-semibold">{displayName}</p>
//                     {contact.email && (
//                       <p className="text-sm text-gray-600">
//                         {contact.email.join(", ")}
//                       </p>
//                     )}
//                     {contact.tel && (
//                       <p className="text-sm text-gray-600">
//                         {contact.tel.join(", ")}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 {/* Checkbox */}
//                 <input
//                   id="checkbox"
//                   type="checkbox"
//                   checked={isChecked}
//                   readOnly
//                   className="w-5 h-5"
//                 />
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-gray-600 text-center">No contacts found.</div>
//       )}

//       {/* Footer buttons */}
//       <div className="flex justify-end gap-4 mt-6">
//         <button
//           id="cancel"
//           onClick={() => setIsContactModalOpen(false)}
//           className="p-2 px-4 border border-gray-300 rounded-lg"
//         >
//           Cancel
//         </button>
//         <button
//           id="import"
//           onClick={handleImportContacts}
//           disabled={selectedContacts.length === 0 || isImportingContacts}
//           className="p-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50"
//         >
//           {isImportingContacts
//             ? "Importing..."
//             : `Import ${selectedContacts.length} Contacts`}
//         </button>
//       </div>
//     </>
//   );
// };

// export default ContactSelection;
