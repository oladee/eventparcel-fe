import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { XCircle } from "lucide-react";
import { FileUpload } from "../icons/Icons";
import ContactModal from "./ContactModal";

interface CsvModalProps {
  onClose: () => void;
}

const CsvModal: React.FC<CsvModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    }
  };

  // Handle drag-and-drop file selection
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    }
  };

  // Prevent default drag behavior
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
  };

  // A simple CSV parser: assumes first line is header
  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n").filter(line => line.trim() !== "");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(header => header.trim());
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(",").map(val => val.trim());
      const contact: any = {};
      headers.forEach((header, i) => {
        contact[header] = values[i];
      });
      // Generate an id if not provided in CSV
      contact.id = contact.id || index + 1;
      return contact;
    });
    return data;
  };

  const handleImport = () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsedContacts = parseCSV(text);
      setContacts(parsedContacts);
    };
    reader.readAsText(selectedFile);
  };

  // If contacts have been imported, render the ContactModal
  if (contacts.length > 0) {
    return (
      <ContactModal
        onClose={onClose}
        contacts={contacts}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Upload CSV File</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <IoClose size={24} />
          </button>
        </div>
        <p className="text-gray-500 mt-1">
          You can upload a csv file exported from your contact list
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative border border-dashed border-gray-300 rounded-[12px] p-6 mt-6 text-center space-y-2"
        >
          {selectedFile ? (
            <div className="text-center">
              <p className="text-green-600 font-medium">
                {selectedFile.name}{" "}
              </p>
              <XCircle
                className="text-red-500 absolute top-0 right-4 cursor-pointer mt-2"
                size={20}
                onClick={removeFile}
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
              />
              <p className="text-[#718096] text-xs hidden sm:block">or drag and drop it here</p>
            </>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-900 font-medium">
          Got a manually created CSV?{" "}
          <span className="text-primary cursor-pointer font-medium">
            Download Template
          </span>
        </p>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile}
            className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
              !selectedFile ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvModal;
