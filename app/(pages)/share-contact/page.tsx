"use client";

import { CSV, Doc, Done } from "@/components/icons/Icons";
import CsvModal from "@/components/shareContact/CsvModal";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import HeaderLayout from "@/components/layout/HeaderLayout";
import ContactModal, { Contact } from "@/components/shareContact/ContactModal";
import SendContactModal from "@/components/shareContact/SendContactModal";

// Types
type ContactProperty = "name" | "email" | "tel";

// Reusable OptionCard component
type OptionCardProps = {
  option: "contact" | "csv";
  selectedOption: "contact" | "csv" | null;
  onSelect: (option: "contact" | "csv") => void;
  Icon: React.ComponentType<{ width: number; height: number }>;
  title: string;
  description: React.ReactNode;
};

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  selectedOption,
  onSelect,
  Icon,
  title,
  description,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(option)}
      onKeyPress={(e) => {
        if (e.key === "Enter") onSelect(option);
      }}
      className="relative flex items-center p-4 bg-white rounded-[10px] gap-4 border border-[#1118271F] cursor-pointer transition"
    >
      <div className="hidden sm:block">
        <Icon width={60} height={60} />
      </div>
      <div className="sm:hidden">
        <Icon width={40} height={40} />
      </div>
      <div>
        <h3 className="text-[#111827] font-semibold">{title}</h3>
        <p className="text-xs md:text-sm text-gray-500">{description}</p>
      </div>
      {selectedOption === option && (
        <div className="max-[500px]:-top-2 -right-2 absolute md:right-2">
          <Done width={30} height={30} />
        </div>
      )}
    </div>
  );
};

const Page: React.FC = () => {
  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"contact" | "csv" | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isContactsSupported, setIsContactsSupported] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">("All");
  const [contactError, setContactError] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isImportingContacts] = useState(false);
  const [showModal] = useState<boolean>(false);
  const [optionModal, setOptionModal] = useState(false);

  // Check if Contact Picker API is supported
  useEffect(() => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      setIsContactsSupported(true);
    }
  }, []);

  // Handlers using useCallback
  const handleOptionSelect = useCallback((option: "contact" | "csv") => {
    console.log("Option selected:", option);
    setSelectedOption(option);
  }, []);

  const handleContinueClick = useCallback(() => {
    if (selectedOption === "csv") {
      setIsModalOpen(true);
    } else if (selectedOption === "contact") {
      setIsContactModalOpen(true);
    }
  }, [selectedOption]);

  const handleGetContacts = useCallback(async () => {
    setContactError("");
    setIsLoadingContacts(true);
    try {
      const props: ContactProperty[] = ["name", "email", "tel"];
      const opts = { multiple: true };
      // @ts-expect-error - TypeScript doesn't recognize ContactsManager yet
      const fetchedContacts = await navigator.contacts.select(props, opts);
      setContacts(fetchedContacts);
      setSelectedContacts(fetchedContacts);
    } catch (err) {
      console.error("Error accessing contacts:", err);
      setContactError(
        "Failed to access contacts. Please check browser support and permissions."
      );
    } finally {
      setIsLoadingContacts(false);
    }
  }, []);

  const handleContactSelect = useCallback((contact: Contact) => {
    setSelectedContacts((prev) =>
      prev.includes(contact)
        ? prev.filter((c) => c !== contact)
        : [...prev, contact]
    );
  }, []);



  const handleImportContacts = () => {
    // Toggle the option modal which will show the SendContactModal.
    setOptionModal((prev) => !prev);
  };

  // Extract phone numbers from selected contacts.
  // For each contact, we pick the first telephone number (if any) and remove non-digit characters.
  const extractedPhoneNumbers = useMemo(() => {
    return selectedContacts
      .map((contact) =>
        contact.tel && contact.tel.length > 0
          ? contact.tel[0].replace(/\D/g, "")
          : ""
      )
      .filter((number) => number.length > 0);
  }, [selectedContacts]);

  // Memoized computed values
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = contact.name?.some((n) => n.toLowerCase().includes(term));
      const emailMatch = contact.email?.some((e) => e.toLowerCase().includes(term));
      const telMatch = contact.tel?.some((t) => t.toLowerCase().includes(term));
      return nameMatch || emailMatch || telMatch;
    });
  }, [contacts, searchTerm]);

  const tabFilteredContacts = useMemo(() => {
    return selectedTab === "All"
      ? filteredContacts
      : filteredContacts.filter((contact) => contact.group === selectedTab);
  }, [filteredContacts, selectedTab]);

  return (
    <HeaderLayout>
      {showModal && (
        <ReusuableSuccess
          title="Nicely done, you're almost there"
          subtitle="Let's setup your payment process and delivery plans"
          route="/dashboard/events"
          buttonText="Continue"
        />
      )}
      {/* Main Page */}
      <div className="h-screen bg-gray-50 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center p-6 mt-28">
          <div className="w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] md:text-center capitalize">
              Import Contacts
            </h2>
            <p className="text-gray-600 md:text-center mt-2">
              Import contacts to send a unique invite to each of your imported contacts
            </p>
          </div>

          <div className="mt-8 w-full max-w-md grid gap-4">
            <OptionCard
              option="contact"
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              Icon={Doc}
              title="Import from contact list"
              description={
                <>
                  You can import directly from your <br /> device linked contacts
                </>
              }
            />
            <OptionCard
              option="csv"
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              Icon={CSV}
              title="Upload CSV"
              description={
                <>
                  You can upload a csv file exported <br /> from your contact list
                </>
              }
            />
          </div>
          <div className="mt-8 w-full max-w-md bg-[#FFF7F2] p-4">
            <span className="font-semibold text-black-100">P.S</span>
            <span className="italic text-[#718096] text-sm font-semibold">
              : Data retention policy will apply – we will nudge them after a period asking if they want us to keep the data. If no consent is given, we will expunge it.
            </span>
          </div>
        </div>
        <div className="bg-white py-10 flex justify-center">
          <div className="max-w-md flex gap-4 items-center justify-center sm:justify-end w-full">
            <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
              Save for later
            </button>
            <button
              disabled={!selectedOption}
              className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                !selectedOption ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleContinueClick}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* CSV Modal */}
      {isModalOpen && <CsvModal onClose={() => setIsModalOpen(false)} />}

      {/* Contact Modal */}
      <ContactModal
        isContactModalOpen={isContactModalOpen}
        setIsContactModalOpen={setIsContactModalOpen}
        isContactsSupported={isContactsSupported}
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
        handleImportContacts={handleImportContacts}
        isImportingContacts={isImportingContacts}
      />

      <ToastContainer />

      {/* SendContactModal now receives eventGroupId and extracted phone numbers */}
      <SendContactModal
        isOpen={optionModal}
        onClose={handleImportContacts}
        eventGroupId="67eeab0c65b211b0e9281b9b"
        phoneNumbers={extractedPhoneNumbers}
      />
    </HeaderLayout>
  );
};

export default Page;





// "use client";

// import { CSV, Doc, Done } from "@/components/icons/Icons";
// import AccessError from "@/components/modals/AccessError";
// import ContactSelection from "@/components/shareContact/ContactSelection";
// import CsvModal from "@/components/shareContact/CsvModal";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { FiX } from "react-icons/fi";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
// import HeaderLayout from "@/components/layout/HeaderLayout";

// // Types
// type Contact = {
//   name: string[];
//   email?: string[];
//   tel?: string[];
//   group?: "Work" | "Family" | "Friends" | "Other";
// };

// type ContactProperty = "name" | "email" | "tel";

// // Reusable OptionCard component
// type OptionCardProps = {
//   option: "contact" | "csv";
//   selectedOption: "contact" | "csv" | null;
//   onSelect: (option: "contact" | "csv") => void;
//   Icon: React.ComponentType<{ width: number; height: number }>;
//   title: string;
//   description: React.ReactNode;
// };

// const OptionCard: React.FC<OptionCardProps> = ({
//   option,
//   selectedOption,
//   onSelect,
//   Icon,
//   title,
//   description
// }) => {
//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       onClick={() => onSelect(option)}
//       onKeyPress={(e) => {
//         if (e.key === "Enter") onSelect(option);
//       }}
//       className="relative flex items-center p-4 bg-white rounded-[10px] gap-4 border border-[#1118271F] cursor-pointer transition"
//     >
//       <div className="hidden sm:block">
//         <Icon width={60} height={60} />
//       </div>
//       <div className="sm:hidden">
//         <Icon width={40} height={40} />
//       </div>
//       <div>
//         <h3 className="text-[#111827] font-semibold">{title}</h3>
//         <p className="text-xs md:text-sm text-gray-500">{description}</p>
//       </div>
//       {selectedOption === option && (
//         <div className="max-[500px]:-top-2 -right-2 absolute md:right-2">
//           <Done width={30} height={30} />
//         </div>
//       )}
//     </div>
//   );
// };

// const Page: React.FC = () => {
//   // State declarations
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<
//     "contact" | "csv" | null
//   >(null);
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
//   const [isContactsSupported, setIsContactsSupported] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">(
//     "All"
//   );
//   const [contactError, setContactError] = useState("");
//   const [isLoadingContacts, setIsLoadingContacts] = useState(false);
//   const [isImportingContacts, setIsImportingContacts] = useState(false);
//   const [showModal, setShowModal] = useState<boolean>(false);

//   // Check if Contact Picker API is supported
//   useEffect(() => {
//     if ("contacts" in navigator && "ContactsManager" in window) {
//       setIsContactsSupported(true);
//     }
//   }, []);

//   // Handlers using useCallback
//   const handleOptionSelect = useCallback((option: "contact" | "csv") => {
//     console.log("Option selected:", option);
//     setSelectedOption(option);
//   }, []);

//   const handleContinueClick = useCallback(() => {
//     if (selectedOption === "csv") {
//       setIsModalOpen(true);
//     } else if (selectedOption === "contact") {
//       setIsContactModalOpen(true);
//     }
//   }, [selectedOption]);

//   const handleGetContacts = useCallback(async () => {
//     setContactError("");
//     setIsLoadingContacts(true);
//     try {
//       const props: ContactProperty[] = ["name", "email", "tel"];
//       const opts = { multiple: true };
//       // @ts-expect-error - TypeScript doesn't recognize ContactsManager yet
//       const fetchedContacts = await navigator.contacts.select(props, opts);
//       setContacts(fetchedContacts);
//       setSelectedContacts(fetchedContacts);
//     } catch (err) {
//       console.error("Error accessing contacts:", err);
//       setContactError(
//         "Failed to access contacts. Please check browser support and permissions."
//       );
//     } finally {
//       setIsLoadingContacts(false);
//     }
//   }, []);

//   const handleContactSelect = useCallback((contact: Contact) => {
//     setSelectedContacts((prev) =>
//       prev.includes(contact)
//         ? prev.filter((c) => c !== contact)
//         : [...prev, contact]
//     );
//   }, []);

//   const handleImportContacts = useCallback(async () => {
//     setIsImportingContacts(true);
//     try {
//       await axiosInstance.post("/save-contacts", {
//         contacts: selectedContacts.map((contact) => ({
//           guestName: contact.name.join(" "),
//           guestPhoneNumber: contact.tel?.join("").replace(/\D/g, "")
//         }))
//       });
//       // console.log("Contacts saved:", response.data);
//       // toast.success("Contacts imported successfully!");
//       setIsContactModalOpen(false);
//       setSelectedContacts([]);
//       setShowModal(true);
//     } catch (error: any) {
//       console.error("Error saving contacts:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to import contacts."
//       );
//     } finally {
//       setIsImportingContacts(false);
//     }
//   }, [selectedContacts]);

//   // Memoized computed values
//   const filteredContacts = useMemo(() => {
//     return contacts.filter((contact) => {
//       const term = searchTerm.toLowerCase();
//       const nameMatch = contact.name?.some((n) =>
//         n.toLowerCase().includes(term)
//       );
//       const emailMatch = contact.email?.some((e) =>
//         e.toLowerCase().includes(term)
//       );
//       const telMatch = contact.tel?.some((t) => t.toLowerCase().includes(term));
//       return nameMatch || emailMatch || telMatch;
//     });
//   }, [contacts, searchTerm]);

//   const tabFilteredContacts = useMemo(() => {
//     return selectedTab === "All"
//       ? filteredContacts
//       : filteredContacts.filter((contact) => contact.group === selectedTab);
//   }, [filteredContacts, selectedTab]);

//   return (
//     <HeaderLayout>
//       {showModal && (
//         <ReusuableSuccess
//           title="Nicely done,you're almost there"
//           subtitle="Let's setup your payment process and delivery plans"
//           route="/dashboard/events"
//           buttonText="Continue"
//         />
//       )}
//       {/* Main Page */}
//       <div className="h-screen bg-gray-50 flex flex-col justify-between">
//         <div className="flex flex-col items-center justify-center p-6 mt-28">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
//             Share Invite & Import Contacts
//           </h2>
//           <p className="text-gray-600 text-center mt-2">
//             Get invite link and import contacts for direct share
//           </p>

//           <div className="mt-8 w-full max-w-md grid gap-4">
//             <OptionCard
//               option="contact"
//               selectedOption={selectedOption}
//               onSelect={handleOptionSelect}
//               Icon={Doc}
//               title="Import from contact list"
//               description={
//                 <>
//                   You can import directly from your <br /> device linked
//                   contacts
//                 </>
//               }
//             />
//             <OptionCard
//               option="csv"
//               selectedOption={selectedOption}
//               onSelect={handleOptionSelect}
//               Icon={CSV}
//               title="Upload CSV"
//               description={
//                 <>
//                   You can upload a csv file exported <br /> from your contact
//                   list
//                 </>
//               }
//             />
//           </div>
//           <div className="mt-8 w-full max-w-md bg-[#FFF7F2] p-4">
//             <span className="font-semibold text-black-100"> P.S</span>
//             <span className="italic text-[#718096] text-sm font-semibold">
//               : Data retention policy will apply i.e we will nudge them after a
//               period asking if they want us to keep the data. If no consent is
//               given, we will expunge it.
//             </span>
//           </div>
//         </div>
//         <div className="bg-white py-10 flex justify-center">
//           <div className="max-w-md flex gap-4 items-center justify-center sm:justify-end w-full">
//             <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//               Save for later
//             </button>
//             <button
//               disabled={!selectedOption}
//               className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//                 !selectedOption ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               onClick={handleContinueClick}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* CSV Modal */}
//       {isModalOpen && <CsvModal onClose={() => setIsModalOpen(false)} />}

//       {/* Contact Selection Modal */}
//       {isContactModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
//             {/* Close Icon */}
//             <button
//               onClick={() => setIsContactModalOpen(false)}
//               aria-label="Close modal"
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//             >
//               <FiX size={20} />
//             </button>

//             {/* <h2 className="text-xl font-bold mb-4">Select Contacts</h2> */}
//             <div className="border-b pb-3">
//               <h2
//                 id="importContactHeader"
//                 className="text-lg lg:text-xl font-bold text-[#111827]"
//               >
//                 Import From Contact List
//               </h2>

//               <p id="importContactDesc" className="text-sm text-[#718096] mt-2">
//                 Select the contacts you’d like to invite for the event
//               </p>
//             </div>

//             {isContactsSupported ? (
//               <ContactSelection
//                 handleGetContacts={handleGetContacts}
//                 isLoadingContacts={isLoadingContacts}
//                 contactError={contactError}
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 selectedTab={selectedTab}
//                 setSelectedTab={setSelectedTab}
//                 tabFilteredContacts={tabFilteredContacts}
//                 selectedContacts={selectedContacts}
//                 handleContactSelect={handleContactSelect}
//                 setIsContactModalOpen={setIsContactModalOpen}
//                 handleImportContacts={handleImportContacts}
//                 isImportingContacts={isImportingContacts}
//               />
//             ) : (
//               <AccessError
//                 title="We couldn't access your contact"
//                 subtitle="You need to grant us access to your google contact to import from contact"
//                 route="https://contacts.google.com/"
//                 buttonText="Grant Access Contact"
//               />
//             )}
//           </div>
//         </div>
//       )}
//       <ToastContainer />
//     </HeaderLayout>
//   );
// };

// export default Page;
