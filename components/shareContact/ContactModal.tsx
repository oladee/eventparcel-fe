"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import ContactSelection from "@/components/shareContact/ContactSelection";
import AccessError from "@/components/modals/AccessError";

export type Contact = {
  name: string[];
  email?: string[];
  tel?: string[];
  group?: "Work" | "Family" | "Friends" | "Other";
};

type ContactModalProps = {
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isContactsSupported: boolean;
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
  handleImportContacts: () => void;
  isImportingContacts: boolean;
};

const ContactModal: React.FC<ContactModalProps> = ({
  isContactModalOpen,
  setIsContactModalOpen,
  isContactsSupported,
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
  handleImportContacts,
  isImportingContacts,
}) => {
  if (!isContactModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsContactModalOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FiX size={20} />
        </button>

        <div className="border-b pb-3">
          <h2
            id="importContactHeader"
            className="text-lg lg:text-xl font-bold text-[#111827]"
          >
            Import From Contact List
          </h2>
          <p id="importContactDesc" className="text-sm text-[#718096] mt-2">
            Select the contacts you’d like to invite for the event
          </p>
        </div>

        {isContactsSupported ? (
          <ContactSelection
            handleGetContacts={handleGetContacts}
            isLoadingContacts={isLoadingContacts}
            contactError={contactError}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabFilteredContacts={tabFilteredContacts}
            selectedContacts={selectedContacts}
            handleContactSelect={handleContactSelect}
            setIsContactModalOpen={setIsContactModalOpen}
            handleImportContacts={handleImportContacts}
            isImportingContacts={isImportingContacts}
          />
        ) : (
          <AccessError
            title="We couldn't access your contact"
            subtitle="You need to grant us access to your google contacts to import from contacts"
            route="https://api-eventparcel.onrender.com/auth/google/contacts"
            buttonText="Grant Access Contact"
          />
        )}
      </div>
    </div>
  );
};

export default ContactModal;



































// "use client";

// import React from "react";
// import { FiX } from "react-icons/fi";
// import ContactSelection from "@/components/shareContact/ContactSelection";
// import AccessError from "@/components/modals/AccessError";

// export type Contact = {
//   name: string[];
//   email?: string[];
//   tel?: string[];
//   group?: "Work" | "Family" | "Friends" | "Other";
// };

// type ContactModalProps = {
//   isContactModalOpen: boolean;
//   setIsContactModalOpen: (open: boolean) => void;
//   isContactsSupported: boolean;
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
//   handleImportContacts: () => void;
//   isImportingContacts: boolean;
// };

// const ContactModal: React.FC<ContactModalProps> = ({
//   isContactModalOpen,
//   setIsContactModalOpen,
//   isContactsSupported,
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
//   handleImportContacts,
//   isImportingContacts,
// }) => {
//   if (!isContactModalOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
//         <button
//           onClick={() => setIsContactModalOpen(false)}
//           aria-label="Close modal"
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//         >
//           <FiX size={20} />
//         </button>

//         <div className="border-b pb-3">
//           <h2
//             id="importContactHeader"
//             className="text-lg lg:text-xl font-bold text-[#111827]"
//           >
//             Import From Contact List
//           </h2>
//           <p id="importContactDesc" className="text-sm text-[#718096] mt-2">
//             Select the contacts you’d like to invite for the event
//           </p>
//         </div>

//         {isContactsSupported ? (
//           <ContactSelection
//             handleGetContacts={handleGetContacts}
//             isLoadingContacts={isLoadingContacts}
//             contactError={contactError}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             selectedTab={selectedTab}
//             setSelectedTab={setSelectedTab}
//             tabFilteredContacts={tabFilteredContacts}
//             selectedContacts={selectedContacts}
//             handleContactSelect={handleContactSelect}
//             setIsContactModalOpen={setIsContactModalOpen}
//             handleImportContacts={handleImportContacts}
//             isImportingContacts={isImportingContacts}
//           />
//         ) : (
//           <AccessError
//             title="We couldn't access your contact"
//             subtitle="You need to grant us access to your google contacts to import from contacts"
//             route="https://contacts.google.com/"
//             buttonText="Grant Access Contact"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContactModal;