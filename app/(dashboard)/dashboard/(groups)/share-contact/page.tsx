"use client";

import { CSV, Doc, Done } from "@/components/icons/Icons";
import CsvModal from "@/components/shareContact/CsvModal";
import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
// import HeaderLayout from "@/components/layout/HeaderLayout";
import ContactModal, { Contact } from "@/components/shareContact/ContactModal";
import SendContactModal from "@/components/shareContact/SendContactModal";
import Container from "@/components/dashboard/Container";
import { useSearchParams } from "next/navigation";
// import CSVContactModal from "@/components/shareContact/CSVContactModal";
// import DisplayGoogleContactModal from "@/components/shareContact/DisplayGoogleContactModal";
import DisplayGoogleContactModal, {
  Contact as DisplayContact,
} from "@/components/shareContact/DisplayGoogleContactModal";
import { trackEvent } from "@/lib/mixpanel";

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



const ShareContact: React.FC = () => {
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
  const [isImportingContacts] = useState(false);
  // const [showModal] = useState<boolean>(false);
  const [optionModal, setOptionModal] = useState(false);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const popUpParam = searchParams.get("popUp");
  // const [popupContacts, setPopupContacts] = useState<APICONTACT[]>([]);
  const [popupContacts, setPopupContacts] = useState<DisplayContact[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [, setPopupError] = useState<string>("");
  const [popupModalOpen, setPopupModalOpen] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    // This code runs only on the client side
    const storedData = localStorage.getItem('eventData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setEventData(parsedData);
      } catch (error) {
        console.error('Failed to parse eventData:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (popUpParam === "true") {
      setPopupLoading(true);

      const delayAndFetch = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        try {
          const res = await fetch(
            "https://api-eventparcel.onrender.com/auth/fetch-contacts",
            {
              method: "GET",
              credentials: "include"
            }
          );
          const data = await res.json();

          if (data.success && Array.isArray(data.data)) {
            // right after fetch, transform:
            const formatted = data.data.map((c:any, i:any) => ({
              id: i + 1,
              name: c.name,
              phone: c.phoneNumber,
              category: "All",
              initials: c.name
                .split(" ")
                .slice(0, 2)
                .map((n:any) => n[0].toUpperCase())
                .join("")
            }));
            setPopupContacts(formatted);

            // setPopupContacts(data.data);
          } else {
            setPopupError(data.message || "Failed to fetch contacts");
          }
        } catch (err) {
          console.error(err);
          setPopupError("Network error while fetching contacts");
        } finally {
          setPopupLoading(false);
          setPopupModalOpen(true);
        }
      };

      delayAndFetch();
    }
  }, [popUpParam]);

  // Check if Contact Picker API is supported
  useEffect(() => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      setIsContactsSupported(true);
    }
    if (groupId) {
      localStorage.setItem("sendGroupId", groupId);
    }
  }, [groupId]);

  // Handlers using useCallback
  const handleOptionSelect = useCallback((option: "contact" | "csv") => {
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
      trackEvent("Import Contact Start", {
        source: "share-contact page",
        event_id: eventData?._id,
        event_name: eventData?.eventName,
        timestamp: new Date().toISOString(),
        page_name: "Share-contact Page",
        route: "Google"
      });
    setSelectedContacts((prev) =>
      prev.includes(contact)
        ? prev.filter((c) => c !== contact)
        : [...prev, contact]
    );
  }, [eventData?._id, eventData?.eventName]);

  const handleImportContacts = () => {
    // Toggle the option modal to show the SendContactModal.
    setOptionModal((prev) => !prev);
  };

  // Extract contacts for SMS invites:
  // For each selected contact with at least one tel, return an object with guestName and phoneNumber.
  const extractedContacts = useMemo(() => {
    return selectedContacts
      .filter((contact) => contact.tel?.length)
      .map((contact) => ({
        guestName: contact.name.join(" "),
        phoneNumber: contact.tel![0].replace(/\D/g, "")
      }));
  }, [selectedContacts]);

  // Also extract plain phone numbers for WhatsApp/Both invites.
  const extractedPhoneNumbers = useMemo(() => {
    return selectedContacts
      .filter((contact) => contact.tel?.length)
      .map((contact) => contact.tel![0].replace(/\D/g, ""))
      .filter((num) => num.length > 0);
  }, [selectedContacts]);

  // Memoized computed values for filtering contacts
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

  const handleClosePopup = () => {
    setPopupModalOpen(false);
    // optionally clear popupContacts...
  };

  // if (popupContacts.length > 0) {
  //   return (
  //     <DisplayGoogleContactModal onClose={onClose} contacts={popupContacts} />
  //   );
  // }

  if (popupContacts.length > 0 && popupModalOpen) {
    return (
      <DisplayGoogleContactModal
        onClose={handleClosePopup}
        contacts={popupContacts}
      />
    );
  }

  return (
    <Container>
      {popupLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white px-6 py-4 rounded-md shadow-md text-center">
            <p className="text-lg font-medium">Fetching your contacts...</p>
            <p className="text-sm text-gray-500 mt-1">
              This may take a few seconds
            </p>
          </div>
        </div>
      )}
      {/* Main Page */}
      <div className="h-screen bg-gray-50 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center p-6 mt-28">
          <div className="w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] md:text-center capitalize">
              Import Contacts
            </h2>
            <p className="text-gray-600 md:text-center mt-2">
              Import contacts to send a unique invite to each of your imported
              contacts
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
          {/* <div className="mt-8 w-full max-w-md bg-[#FFF7F2] p-4">
            <span className="font-semibold text-black-100">P.S</span>
            <span className="italic text-[#718096] text-sm font-semibold">
              : Data retention policy will apply – we will nudge them after a period asking if they want us to keep the data. If no consent is given, we will expunge it.
            </span>
          </div> */}
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

      {/* SendContactModal now receives the new contacts payload and phone numbers */}
      <SendContactModal
        isOpen={optionModal}
        onClose={handleImportContacts}
        eventGroupId={groupId || ""}
        contacts={extractedContacts}
        phoneNumbers={extractedPhoneNumbers}
      />
    </Container>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShareContact />
    </Suspense>
  );
}

// "use client";

// import { CSV, Doc, Done } from "@/components/icons/Icons";
// import CsvModal from "@/components/shareContact/CsvModal";
// import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
// // import HeaderLayout from "@/components/layout/HeaderLayout";
// import ContactModal, { Contact } from "@/components/shareContact/ContactModal";
// import SendContactModal from "@/components/shareContact/SendContactModal";
// import Container from "@/components/dashboard/Container";
// import { useSearchParams } from "next/navigation";

// // Types
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

// const ShareContact: React.FC = () => {
//   // State declarations
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<"contact" | "csv" | null>(null);
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
//   const [isContactsSupported, setIsContactsSupported] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTab, setSelectedTab] = useState<"All" | "Work" | "Family">("All");
//   const [contactError, setContactError] = useState("");
//   const [isLoadingContacts, setIsLoadingContacts] = useState(false);
//   const [isImportingContacts] = useState(false);
//   // const [showModal] = useState<boolean>(false);
//   const [optionModal, setOptionModal] = useState(false);
//   const searchParams = useSearchParams();
//   const groupId = searchParams.get('groupId');

//   // Check if Contact Picker API is supported
//   useEffect(() => {
//     if ("contacts" in navigator && "ContactsManager" in window) {
//       setIsContactsSupported(true);
//     }
//     if (groupId) {
//       localStorage.setItem("sendGroupId", groupId);
//     }
//   }, [groupId]);

//   // Handlers using useCallback
//   const handleOptionSelect = useCallback((option: "contact" | "csv") => {
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

//   const handleImportContacts = () => {
//     // Toggle the option modal to show the SendContactModal.
//     setOptionModal((prev) => !prev);
//   };

//   // Extract contacts for SMS invites:
//   // For each selected contact with at least one tel, return an object with guestName and phoneNumber.
//   const extractedContacts = useMemo(() => {
//     return selectedContacts
//       .filter((contact) => contact.tel?.length)
//       .map((contact) => ({
//         guestName: contact.name.join(" "),
//         phoneNumber: contact.tel![0].replace(/\D/g, ""),
//       }));
//   }, [selectedContacts]);

//   // Also extract plain phone numbers for WhatsApp/Both invites.
//   const extractedPhoneNumbers = useMemo(() => {
//     return selectedContacts
//       .filter((contact) => contact.tel?.length)
//       .map((contact) => contact.tel![0].replace(/\D/g, ""))
//       .filter((num) => num.length > 0);
//   }, [selectedContacts]);

//   // Memoized computed values for filtering contacts
//   const filteredContacts = useMemo(() => {
//     return contacts.filter((contact) => {
//       const term = searchTerm.toLowerCase();
//       const nameMatch = contact.name?.some((n) => n.toLowerCase().includes(term));
//       const emailMatch = contact.email?.some((e) => e.toLowerCase().includes(term));
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
//     <Container>
//       {/* {showModal && (
//         <ReusuableSuccess
//           title="Nicely done, you're almost there"
//           subtitle="Let's setup your payment process and delivery plans"
//           route="/dashboard/events"
//           buttonText="Continue"
//         />
//       )} */}
//       {/* Main Page */}
//       <div className="h-screen bg-gray-50 flex flex-col justify-between">
//         <div className="flex flex-col items-center justify-center p-6 mt-28">
//           <div className="w-full max-w-md">
//             <h2 className="text-2xl md:text-3xl font-bold text-[#111827] md:text-center capitalize">
//               Import Contacts
//             </h2>
//             <p className="text-gray-600 md:text-center mt-2">
//               Import contacts to send a unique invite to each of your imported contacts
//             </p>
//           </div>

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
//           {/* <div className="mt-8 w-full max-w-md bg-[#FFF7F2] p-4">
//             <span className="font-semibold text-black-100">P.S</span>
//             <span className="italic text-[#718096] text-sm font-semibold">
//               : Data retention policy will apply – we will nudge them after a period asking if they want us to keep the data. If no consent is given, we will expunge it.
//             </span>
//           </div> */}
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

//       {/* Contact Modal */}
//       <ContactModal
//         isContactModalOpen={isContactModalOpen}
//         setIsContactModalOpen={setIsContactModalOpen}
//         isContactsSupported={isContactsSupported}
//         handleGetContacts={handleGetContacts}
//         isLoadingContacts={isLoadingContacts}
//         contactError={contactError}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedTab={selectedTab}
//         setSelectedTab={setSelectedTab}
//         tabFilteredContacts={tabFilteredContacts}
//         selectedContacts={selectedContacts}
//         handleContactSelect={handleContactSelect}
//         handleImportContacts={handleImportContacts}
//         isImportingContacts={isImportingContacts}
//       />

//       <ToastContainer />

//       {/* SendContactModal now receives the new contacts payload and phone numbers */}
//       <SendContactModal
//         isOpen={optionModal}
//         onClose={handleImportContacts}
//         eventGroupId={groupId || ""}
//         contacts={extractedContacts}
//         phoneNumbers={extractedPhoneNumbers}
//       />
//     </Container>
//   );
// };

// export default function Page() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ShareContact />
//     </Suspense>
//   );
// }
