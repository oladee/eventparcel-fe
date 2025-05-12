import React from "react";
import { FiX } from "react-icons/fi";

interface ErrorModalProps {
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">Error</h2>
          <FiX
            className="cursor-pointer text-gray-600"
            size={20}
            onClick={onClose}
          />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          The CSV you imported doesn&apos;t meet our criteria. Kindly upload a CSV
          file using our template.
        </p>
        <div className="flex justify-end space-x-3 mt-5">
          <button
            onClick={onClose}
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;