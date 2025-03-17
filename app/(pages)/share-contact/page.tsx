"use client";

import { CSV, Doc, Done } from "@/components/icons/Icons";
import AccessError from "@/components/modals/AccessError";
import ContactSelection from "@/components/shareContact/ContactSelection";
import CsvModal from "@/components/shareContact/CsvModal";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import HeaderLayout from "@/components/layout/HeaderLayout";

// Types
type Contact = {
  name: string[];
  email?: string[];
  tel?: string[];
  group?: "Work" | "Family" | "Friends" | "Other";
};

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
  description
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
  const [selectedOption, setSelectedOption] = useState<
    "contact" | "csv" | null
  >(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isContactsSupported, setIsContactsSupported] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">(
    "All"
  );
  const [contactError, setContactError] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isImportingContacts, setIsImportingContacts] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const handleImportContacts = useCallback(async () => {
    setIsImportingContacts(true);
    try {
      await axiosInstance.post("/save-contacts", {
        contacts: selectedContacts.map((contact) => ({
          guestName: contact.name.join(" "),
          guestPhoneNumber: contact.tel?.join("").replace(/\D/g, "")
        }))
      });
      // console.log("Contacts saved:", response.data);
      // toast.success("Contacts imported successfully!");
      setIsContactModalOpen(false);
      setSelectedContacts([]);
      setShowModal(true);
    } catch (error: any) {
      console.error("Error saving contacts:", error);
      toast.error(
        error.response?.data?.message || "Failed to import contacts."
      );
    } finally {
      setIsImportingContacts(false);
    }
  }, [selectedContacts]);

  // Memoized computed values
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = contact.name?.some((n) =>
        n.toLowerCase().includes(term)
      );
      const emailMatch = contact.email?.some((e) =>
        e.toLowerCase().includes(term)
      );
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
          title="Nicely done,you're almost there"
          subtitle="Let's setup your payment process and delivery plans"
          route="/payment-delivery"
          buttonText="Continue"
        />
      )}
      {/* Main Page */}
      <div className="h-screen bg-gray-50 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center p-6 mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Share Invite & Import Contacts
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Get invite link and import contacts for direct share
          </p>

          <div className="mt-8 w-full max-w-md grid gap-4">
            <OptionCard
              option="contact"
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              Icon={Doc}
              title="Import from contact list"
              description={
                <>
                  You can import directly from your <br /> device linked
                  contacts
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
                  You can upload a csv file exported <br /> from your contact
                  list
                </>
              }
            />
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

      {/* Contact Selection Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            {/* Close Icon */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FiX size={20} />
            </button>

            {/* <h2 className="text-xl font-bold mb-4">Select Contacts</h2> */}
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
                subtitle="You need to grant us access to your google contact to import from contact"
                route="https://contacts.google.com/"
                buttonText="Grant Access Contact"
              />
            )}
          </div>
        </div>
      )}
      <ToastContainer />
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
//   description,
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
//   const [selectedOption, setSelectedOption] = useState<"contact" | "csv" | null>(
//     null
//   );
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
//   const [isContactsSupported, setIsContactsSupported] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">(
//     "All"
//   );
//   const [contactError, setContactError] = useState("");
//   const [isLoadingContacts, setIsLoadingContacts] = useState(false);

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

//   const handleImportContacts = useCallback(() => {
//     console.log("Selected Contacts:", selectedContacts);
//     // TODO: Send to backend API
//     setIsContactModalOpen(false);
//     setSelectedContacts([]);
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
//       const telMatch = contact.tel?.some((t) =>
//         t.toLowerCase().includes(term)
//       );
//       return nameMatch || emailMatch || telMatch;
//     });
//   }, [contacts, searchTerm]);

//   const tabFilteredContacts = useMemo(() => {
//     return selectedTab === "All"
//       ? filteredContacts
//       : filteredContacts.filter((contact) => contact.group === selectedTab);
//   }, [filteredContacts, selectedTab]);

//   return (
//     <>
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
//                   You can import directly from your <br /> device linked contacts
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
//                   You can upload a csv file exported <br /> from your contact list
//                 </>
//               }
//             />
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

//             <h2 className="text-xl font-bold mb-4">Select Contacts</h2>

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
//     </>
//   );
// };

// export default Page;

// "use client";

// import { CSV, Doc, Done } from "@/components/icons/Icons";
// import AccessError from "@/components/modals/AccessError";
// import CsvModal from "@/components/shareContact/CsvModal";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { FiX, FiSearch } from "react-icons/fi";

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
//   description,
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
//   const [selectedOption, setSelectedOption] = useState<"contact" | "csv" | null>(
//     null
//   );
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
//   const [isContactsSupported, setIsContactsSupported] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">(
//     "All"
//   );
//   const [contactError, setContactError] = useState("");
//   const [isLoadingContacts, setIsLoadingContacts] = useState(false);

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

//   const handleImportContacts = useCallback(() => {
//     console.log("Selected Contacts:", selectedContacts);
//     // TODO: Send to backend API
//     setIsContactModalOpen(false);
//     setSelectedContacts([]);
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
//       const telMatch = contact.tel?.some((t) =>
//         t.toLowerCase().includes(term)
//       );
//       return nameMatch || emailMatch || telMatch;
//     });
//   }, [contacts, searchTerm]);

//   const tabFilteredContacts = useMemo(() => {
//     return selectedTab === "All"
//       ? filteredContacts
//       : filteredContacts.filter((contact) => contact.group === selectedTab);
//   }, [filteredContacts, selectedTab]);

//   return (
//     <>
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
//                   You can import directly from your <br /> device linked contacts
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
//                   You can upload a csv file exported <br /> from your contact list
//                 </>
//               }
//             />
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

//             <h2 className="text-xl font-bold mb-4">Select Contacts</h2>

//             {isContactsSupported ? (
//               <>
//                 <button
//                   onClick={handleGetContacts}
//                   disabled={isLoadingContacts}
//                   className="w-full p-3 bg-primary text-white rounded-lg mb-4 disabled:opacity-50"
//                 >
//                   {isLoadingContacts ? "Loading Contacts..." : "Choose Contacts"}
//                 </button>
//                 {contactError && (
//                   <div className="text-red-500 text-sm mb-4">
//                     {contactError}
//                   </div>
//                 )}

//                 {/* Search Bar */}
//                 <div className="relative mb-4">
//                   <FiSearch className="absolute top-3 left-3 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search contacts..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                 </div>

//                 {/* Tabs for All / Work / Family */}
//                 <div className="flex gap-4 mb-4">
//                   {["All", "Work", "Family"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() =>
//                         setSelectedTab(tab as "All" | "Work" | "Family")
//                       }
//                       className={`px-3 py-1 rounded ${
//                         selectedTab === tab
//                           ? "bg-primary text-white"
//                           : "bg-gray-200 text-gray-700"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>

//                 {tabFilteredContacts.length > 0 ? (
//                   <div className="max-h-96 overflow-y-auto border rounded-lg">
//                     {tabFilteredContacts.map((contact) => {
//                       const displayName =
//                         contact.name?.join(", ") || "No Name";
//                       const firstLetter = displayName.charAt(0).toUpperCase();
//                       const contactKey = `${contact.name.join(
//                         "-"
//                       )}-${contact.email?.join("-") || ""}-${
//                         contact.tel?.join("-") || ""
//                       }`;
//                       const isChecked = selectedContacts.includes(contact);

//                       return (
//                         <div
//                           key={contactKey}
//                           className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
//                           onClick={() => handleContactSelect(contact)}
//                         >
//                           {/* Avatar and info */}
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
//                               {firstLetter}
//                             </div>
//                             <div>
//                               <p className="font-semibold">{displayName}</p>
//                               {contact.email && (
//                                 <p className="text-sm text-gray-600">
//                                   {contact.email.join(", ")}
//                                 </p>
//                               )}
//                               {contact.tel && (
//                                 <p className="text-sm text-gray-600">
//                                   {contact.tel.join(", ")}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                           {/* Checkbox */}
//                           <input
//                             type="checkbox"
//                             checked={isChecked}
//                             readOnly
//                             className="w-5 h-5"
//                           />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-gray-600 text-center">
//                     No contacts found.
//                   </div>
//                 )}

//                 {/* Footer buttons */}
//                 <div className="flex justify-end gap-4 mt-6">
//                   <button
//                     onClick={() => setIsContactModalOpen(false)}
//                     className="p-2 px-4 border border-gray-300 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleImportContacts}
//                     disabled={selectedContacts.length === 0}
//                     className="p-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50"
//                   >
//                     Import {selectedContacts.length} Contacts
//                   </button>
//                 </div>
//               </>
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
//     </>
//   );
// };

// export default Page;

//  This is for the contact API

// "use client";

// import { CSV, Doc, Done } from "@/components/icons/Icons";
// import CsvModal from "@/components/shareContact/CsvModal";
// import { useState, useEffect } from "react";
// import { FiX, FiSearch } from "react-icons/fi";

// type Contact = {
//   name: string[];
//   email?: string[];
//   tel?: string[];
//   group?: "Work" | "Family" | "Friends" | "Other";
// };

// type ContactProperty = "name" | "email" | "tel";

// const Page: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<
//     "contact" | "csv" | null
//   >(null);
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
//   const [isContactsSupported, setIsContactsSupported] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Check if Contacts API is supported
//   useEffect(() => {
//     if ("contacts" in navigator && "ContactsManager" in window) {
//       setIsContactsSupported(true);
//     }
//   }, []);

//   const handleContainerClick = (option: "contact" | "csv") => {
//     setSelectedOption(option);
//   };

//   const handleContinueClick = () => {
//     if (selectedOption === "csv") {
//       setIsModalOpen(true);
//     } else if (selectedOption === "contact") {
//       setIsContactModalOpen(true);
//     }
//   };

//   // Access contacts programmatically using the Contacts API
//   const handleGetContactsProgrammatically = async () => {
//     try {
//       const props: ContactProperty[] = ["name", "email", "tel"];
//       const opts = { multiple: true };

//       // @ts-expect-error - Experimental API
//       const fetchedContacts = await navigator.contacts.get(props, opts);

//       // Set the contacts and automatically select them all
//       setContacts(fetchedContacts);
//       setSelectedContacts(fetchedContacts);
//     } catch (err) {
//       console.error("Error accessing contacts:", err);
//       alert(
//         "Failed to access contacts. Please check browser support and permissions."
//       );
//     }
//   };

//   const handleContactSelect = (contact: Contact) => {
//     if (selectedContacts.includes(contact)) {
//       setSelectedContacts(selectedContacts.filter((c) => c !== contact));
//     } else {
//       setSelectedContacts([...selectedContacts, contact]);
//     }
//   };

//   const handleImportContacts = () => {
//     console.log("Selected Contacts:", selectedContacts);
//     // TODO: Send to backend API
//     setIsContactModalOpen(false);
//     setSelectedContacts([]);
//   };

//   // Filter contacts by search term
//   const filteredContacts = contacts.filter((contact) => {
//     const nameMatch = contact.name?.some((n) =>
//       n.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const emailMatch = contact.email?.some((e) =>
//       e.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const telMatch = contact.tel?.some((t) =>
//       t.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     return nameMatch || emailMatch || telMatch;
//   });

//   const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">(
//     "All"
//   );
//   const tabFilteredContacts =
//     selectedTab === "All"
//       ? filteredContacts
//       : filteredContacts.filter((contact) => contact.group === selectedTab);

//   return (
//     <>
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
//             <div
//               onClick={() => handleContainerClick("contact")}
//               className="relative flex items-center p-4 bg-white rounded-[10px] gap-4 border border-[#1118271F] cursor-pointer transition"
//             >
//               <div className="hidden sm:block">
//                 <Doc width={60} height={60} />
//               </div>
//               <div className="sm:hidden">
//                 <Doc width={30} height={30} />
//               </div>
//               <div>
//                 <h3 className="text-[#111827] font-semibold">
//                   Import from contact list
//                 </h3>
//                 <p className="text-xs md:text-sm text-gray-500">
//                   You can import directly from your device linked contacts
//                 </p>
//               </div>
//               {selectedOption === "contact" && (
//                 <div className="absolute right-2">
//                   <Done width={30} height={30} />
//                 </div>
//               )}
//             </div>

//             <div
//               onClick={() => handleContainerClick("csv")}
//               className="relative flex items-center p-4 bg-white rounded-[10px] gap-4 border border-[#1118271F] cursor-pointer transition"
//             >
//               <div className="hidden sm:block">
//                 <CSV width={60} height={60} />
//               </div>
//               <div className="sm:hidden">
//                 <CSV width={30} height={30} />
//               </div>
//               <div>
//                 <h3 className="text-[#111827] font-semibold">Upload CSV</h3>
//                 <p className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
//                   You can upload a csv file exported <br /> from your contact
//                   list
//                 </p>
//               </div>
//               {selectedOption === "csv" && (
//                 <div className="absolute right-2">
//                   <Done width={30} height={30} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="bg-[#FFFF] py-10 flex justify-center">
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
//             <button
//               onClick={() => setIsContactModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//             >
//               <FiX size={20} />
//             </button>

//             <h2 className="text-xl font-bold mb-4">Select Contacts</h2>

//             {isContactsSupported ? (
//               <>
//                 <button
//                   onClick={handleGetContactsProgrammatically}
//                   className="w-full p-3 bg-primary text-white rounded-lg mb-4"
//                 >
//                   Fetch Contacts
//                 </button>

//                 <div className="relative mb-4">
//                   <FiSearch className="absolute top-3 left-3 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search contacts..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                 </div>

//                 <div className="flex gap-4 mb-4">
//                   {["All", "Work", "Family"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() =>
//                         setSelectedTab(tab as "All" | "Work" | "Family")
//                       }
//                       className={`px-3 py-1 rounded ${
//                         selectedTab === tab
//                           ? "bg-primary text-white"
//                           : "bg-gray-200 text-gray-700"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>

//                 {tabFilteredContacts.length > 0 && (
//                   <div className="max-h-96 overflow-y-auto border rounded-lg">
//                     {tabFilteredContacts.map((contact, index) => {
//                       const isChecked = selectedContacts.includes(contact);
//                       const displayName = contact.name?.join(", ") || "No Name";
//                       const firstLetter = displayName.charAt(0).toUpperCase();

//                       return (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
//                           onClick={() => handleContactSelect(contact)}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
//                               {firstLetter}
//                             </div>
//                             <div>
//                               <p className="font-semibold">{displayName}</p>
//                               {contact.email && (
//                                 <p className="text-sm text-gray-600">
//                                   {contact.email.join(", ")}
//                                 </p>
//                               )}
//                               {contact.tel && (
//                                 <p className="text-sm text-gray-600">
//                                   {contact.tel.join(", ")}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                           <input
//                             type="checkbox"
//                             checked={isChecked}
//                             readOnly
//                             className="w-5 h-5"
//                           />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {selectedContacts.length > 0 && (
//                   <div className="flex justify-end gap-4 mt-6">
//                     <button
//                       onClick={() => setIsContactModalOpen(false)}
//                       className="p-2 px-4 border border-gray-300 rounded-lg"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleImportContacts}
//                       className="p-2 px-4 bg-primary text-white rounded-lg"
//                     >
//                       Import {selectedContacts.length} Contacts
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="text-red-500 p-4">
//                 Contact access is not supported in your browser. Please use:
//                 <ul className="list-disc pl-6 mt-2">
//                   <li>Chrome/Edge for Android</li>
//                   <li>
//                     Enable the flag:
//                     chrome://flags/#enable-experimental-web-platform-features
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Page;
