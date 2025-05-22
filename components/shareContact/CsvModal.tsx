import React, { useState, useEffect, useRef, useCallback } from "react";
import FocusLock from "react-focus-lock";
import { IoClose } from "react-icons/io5";
import { XCircle } from "lucide-react";
import { FileUpload } from "../icons/Icons";
import CSVContactModal from "./CSVContactModal";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { trackEvent } from "@/lib/mixpanel";
import BigNumber from 'bignumber.js';


interface Contact {
  id: number;
  name: string;
  phone: string;
  category: string;
  initials: string;
  firstName: string;
  lastName: string;
  phoneValue: string;
}

interface CsvModalProps {
  onClose: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

const CsvModal: React.FC<CsvModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [eventData, setEventData] = useState<null | any>(null);

  // Ref for modal for accessibility focus management.
  const modalRef = useRef<HTMLDivElement>(null);

  // Warn users if they try to close the modal with an unsaved file.
  const handleClose = useCallback(() => {
    if (selectedFile) {
      const confirmClose = window.confirm("You have an unsaved file. Are you sure you want to close?");
      if (!confirmClose) return;
    }
    onClose();
  }, [selectedFile, onClose]);

  useEffect(() => {
    const storedData = localStorage.getItem("eventData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setEventData(parsed);
      } catch (error) {
        console.error("Failed to parse eventData from localStorage", error);
      }
    }
  }, []);

  // Close modal on Escape key press.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Set initial focus on the modal container.
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const allowedMimeTypes = ["text/csv", "application/csv", "application/vnd.ms-excel"];

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) return;

    // Check for file size limit.
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size exceeds 2MB limit.");
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    if (
      allowedMimeTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".csv")
    ) {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please upload a valid CSV file.");
      toast.error("Please upload a valid CSV file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("csvData", selectedFile);

    trackEvent("Import Contact Start", {
      source: "share-contact page",
      event_id: eventData?._id,
      event_name: eventData?.eventName,
      timestamp: new Date().toISOString(),
      page_name: "Share-contact Page",
      route: "CSV"
    });

    try {
      setLoading(true);
      const response = await axiosInstance.post("/extract-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });  

 
      if (response.data?.data) {
        const parsedContacts: Contact[] = response.data.data.map(
          (contact: any, index: number) => ({
            id: index + 1,
            name: contact.name,
            phone: contact.phoneNumber,
            category: "", // Default category
            initials: contact.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase(),
            firstName: contact.name.split(" ")[0],
            lastName: contact.name.split(" ").slice(1).join(" "),
            phoneValue: contact.phoneNumber,
          })
        );

        const isNigerianNumber = (phone: string | number): boolean => {
          let raw = String(phone).trim();
        
          // Convert from scientific notation if necessary
          if (/e\+/i.test(raw)) {
            try {
              // Store the converted value and use it
              raw = new BigNumber(raw).toFixed(0);
            } catch {
              return false;
            }
          }
        
          // Remove any non-digit characters
          const cleaned = raw.replace(/\D/g, "");
        
          // Check international format first (234...)
          if (cleaned.startsWith("234")) {
            const withoutPrefix = cleaned.slice(3);
            return withoutPrefix.length === 10 && 
                   withoutPrefix.startsWith('0') && 
                   isValidNigerianPrefix(withoutPrefix.slice(1, 4));
          }
        
          // Check local format (0...)
          if (cleaned.startsWith("0") && cleaned.length === 11) {
            return isValidNigerianPrefix(cleaned.slice(1, 4));
          }
        
          // Check without prefix (10 digits)
          if (cleaned.length === 10) {
            return isValidNigerianPrefix(cleaned.slice(0, 3));
          }
        
          return false;
        };
        
        // Helper function for prefix validation
        const isValidNigerianPrefix = (prefix: string): boolean => {
          const nigerianPrefixes = new Set([
            "701", "703", "704", "705", "706", "707", "708", "709",
            "802", "803", "804", "805", "806", "807", "808", "809",
            "810", "811", "812", "813", "814", "815", "816", "817", "818", "819",
            "909", "908", "901", "902", "903", "904", "905", "906", "907",
            "915", "913", "912", "911"
          ]);
          return nigerianPrefixes.has(prefix);
        };
        
        // Usage
        const hasNonNigerianNumber = parsedContacts.some(
          (contact) => !isNigerianNumber(contact.phoneValue)
        );
        
        trackEvent("Import Contact Save", {
          source: "share-contact page",
          event_id: eventData?._id,
          event_name: eventData?.eventName,
          timestamp: new Date().toISOString(),
          page_name: "Share-contact Page",
          route: "CSV",
          count: parsedContacts.length,
          non_ngn_country_code: hasNonNigerianNumber ? "Yes" : "No",
        });
  
        setContacts(parsedContacts);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while uploading the CSV file."
      );
    } finally {
      setLoading(false);
    }
  };

  // When contacts are available, display the ContactModal.
  if (contacts.length > 0) {
    return <CSVContactModal onClose={onClose} contacts={contacts} />;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="uploadCSVHeader"
        aria-describedby="uploadCSVDesc"
        tabIndex={-1}
        ref={modalRef}
      >
        <FocusLock>
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center">
              <h2 id="uploadCSVHeader" className="text-xl font-bold text-gray-900">
                Upload CSV File
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
                aria-label="Close modal"
              >
                <IoClose size={24} />
              </button>
            </div>
            <p id="uploadCSVDesc" className="text-gray-500 mt-1">
              You can upload a CSV file exported from your contact list.
            </p>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={`relative border border-dashed rounded-[12px] p-6 mt-6 text-center space-y-2 ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              {selectedFile ? (
                <div className="text-center relative">
                  <p className="text-green-600 font-medium">{selectedFile.name}</p>
                  <XCircle
                    className="text-red-500 absolute top-0 right-4 cursor-pointer mt-2"
                    size={20}
                    onClick={removeFile}
                    aria-label="Remove file"
                  />
                </div>
              ) : (
                <>
                  <div className="flex justify-center p-3">
                    <FileUpload width={50} height={50} />
                  </div>
                  <p className="text-primary text-sm font-medium mt-2">
                    Select a CSV file to upload
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Select CSV file"
                  />
                  <p className="text-[#718096] text-xs hidden sm:block">
                    or drag and drop it here
                  </p>
                </>
              )}
            </div>
            {errorMessage && (
              <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}

            <p id="downloadTemplate" className="mt-4 text-sm text-gray-900 font-medium">
              Got a manually created CSV?{" "}
              <a
                href="/Event_Parcel_CSV_TemplateNew.csv.csv"
                download="Event_Parcel_CSV_TemplateNew.csv"
                className="text-primary cursor-pointer font-medium"
              >
                Download Template
              </a>
            </p>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                id="cancel"
                onClick={handleClose}
                className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827] focus:outline-none"
              >
                Cancel
              </button>
              <button
                id="import"
                onClick={handleImport}
                disabled={!selectedFile || loading}
                className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope focus:outline-none ${
                  !selectedFile || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Importing...
                  </>
                ) : (
                  "Import"
                )}
              </button>
            </div>
          </div>
        </FocusLock>
      </div>
      <ToastContainer />
    </>
  );
};

export default CsvModal;










