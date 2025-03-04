'use client'

import { CSV, Doc, Done } from "@/components/icons/Icons";
import CsvModal from "@/components/shareContact/CsvModal";
import { useState, useEffect } from "react";

type Contact = {
  name: string[];
  email?: string[];
  tel?: string[];
};
type ContactProperty = 'name' | 'email' | 'tel';

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"contact" | "csv" | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isContactsSupported, setIsContactsSupported] = useState(false);

  // Check if Contact Picker API is supported
  useEffect(() => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      setIsContactsSupported(true);
    }
  }, []);

  const handleContainerClick = (option: "contact" | "csv") => {
    setSelectedOption(option);
  };

  const handleContinueClick = () => {
    if (selectedOption === "csv") {
      setIsModalOpen(true);
    } else if (selectedOption === "contact") {
      setIsContactModalOpen(true);
    }
  };

  // Access real device contacts
  const handleGetContacts = async () => {
    try {
      const props: ContactProperty[] = ['name', 'email', 'tel'];
      const opts = { multiple: true };
      
      // @ts-ignore - TypeScript doesn't recognize ContactsManager yet
      const contacts = await navigator.contacts.select(props, opts);
      setContacts(contacts);
    } catch (err) {
      console.error('Error accessing contacts:', err);
      alert('Failed to access contacts. Please check browser support and permissions.');
    }
  };

  const handleContactSelect = (contact: Contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter(c => c !== contact));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleImportContacts = () => {
    console.log("Selected Contacts:", selectedContacts);
    // TODO: Send to backend API
    setIsContactModalOpen(false);
    setSelectedContacts([]);
  };

  return (
    <>
      {/* ... (previous JSX remains the same) ... */}
      <div className="h-screen bg-gray-50 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center p-6 mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Share Invite & Import Contacts
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Get invite link and import contacts for direct share
          </p>

          <div className="mt-8 w-full max-w-md grid gap-4">
            <div
              onClick={() => handleContainerClick("contact")}
              className="flex items-center p-4 bg-white shadow-md rounded-[10px] gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition"
            >
              <Doc width={60} height={60} />
              <div>
                <h3 className="text-[#111827] font-semibold">
                  Import from contact list
                </h3>
                <p className="text-sm text-gray-500">
                  You can import directly from your device linked contacts
                </p>
              </div>
              {selectedOption === "contact" && <Done width={30} height={30} />}
            </div>

            <div
              onClick={() => handleContainerClick("csv")}
              className="flex items-center p-4 bg-white shadow-md rounded-[10px] gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition"
            >
              <CSV width={60} height={60} />
              <div>
                <h3 className="text-[#111827] font-semibold">Upload CSV</h3>
                <p className="text-sm text-gray-500">
                  You can upload a csv file exported from your contact list
                </p>
              </div>
              {selectedOption === "csv" && <Done width={30} height={30} />}
            </div>
          </div>
        </div>
        <div className="bg-[#FFFF] py-10 flex justify-center">
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
      {isModalOpen && <CsvModal onClose={() => setIsModalOpen(false)} />}

      {/* Contact Selection Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Select Contacts</h2>
            
            {isContactsSupported ? (
              <>
                <button
                  onClick={handleGetContacts}
                  className="w-full p-3 bg-primary text-white rounded-lg mb-4"
                >
                  Choose Contacts
                </button>

                {contacts.length > 0 && (
                  <div className="max-h-96 overflow-y-auto border rounded-lg">
                    {contacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div>
                          <p className="font-semibold">
                            {contact.name?.join(', ')}
                          </p>
                          {contact.email && (
                            <p className="text-sm text-gray-600">
                              {contact.email.join(', ')}
                            </p>
                          )}
                          {contact.tel && (
                            <p className="text-sm text-gray-600">
                              {contact.tel.join(', ')}
                            </p>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact)}
                          readOnly
                          className="w-5 h-5"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedContacts.length > 0 && (
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setIsContactModalOpen(false)}
                      className="p-2 px-4 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportContacts}
                      className="p-2 px-4 bg-primary text-white rounded-lg"
                    >
                      Import {selectedContacts.length} Contacts
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-red-500 p-4">
                Contact access is not supported in your browser. Please use:
                <ul className="list-disc pl-6 mt-2">
                  <li>Chrome/Edge for Android</li>
                  <li>Enable the flag: chrome://flags/#enable-experimental-web-platform-features</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;









// 'use client'

// import { CSV, Doc, Done } from "@/components/icons/Icons";
// import CsvModal from "@/components/shareContact/CsvModal";
// import { useState } from "react";

// const Page: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<"contact" | "csv" | null>(null);

//   const handleContainerClick = (option: "contact" | "csv") => {
//     setSelectedOption(option);
//   };

//   const handleContinueClick = () => {
//     if (selectedOption === "csv") {
//       setIsModalOpen(true);
//     } else if (selectedOption === "contact") {
//       // Handle contact list import logic here
//       console.log("Import from contact list");
//     }
//   };

//   return (
//     <>
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
//               className="flex items-center p-4 bg-white shadow-md rounded-[10px] gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition"
//             >
//               <Doc width={60} height={60} />
//               <div>
//                 <h3 className="text-[#111827] font-semibold">
//                   Import from contact list
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   You can import directly from your device linked contacts
//                 </p>
//               </div>
//               {selectedOption === "contact" && <Done width={30} height={30} />}
//             </div>

//             <div
//               onClick={() => handleContainerClick("csv")}
//               className="flex items-center p-4 bg-white shadow-md rounded-[10px] gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition"
//             >
//               <CSV width={60} height={60} />
//               <div>
//                 <h3 className="text-[#111827] font-semibold">Upload CSV</h3>
//                 <p className="text-sm text-gray-500">
//                   You can upload a csv file exported from your contact list
//                 </p>
//               </div>
//               {selectedOption === "csv" && <Done width={30} height={30} />}
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
//       {isModalOpen && <CsvModal onClose={() => setIsModalOpen(false)} />}
//     </>
//   );
// };

// export default Page;