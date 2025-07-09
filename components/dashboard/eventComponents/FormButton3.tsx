"use client";
import React, { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

interface FormButtonsProps {
  isFormValid: boolean;
  onContinue: () => void;
  onContinue2: () => void;
  onClose?: () => void;
  loading: boolean;
  loading2: boolean;
}

const FormButtons3: React.FC<FormButtonsProps> = ({
  isFormValid,
  onContinue,
  onContinue2,
  loading,
  loading2,
  onClose
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleCancel = () => setShowModal(true);

  const handleSaveForLater = () => {
    setShowModal(false);
    onContinue2();
  };



  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="relative bg-[#FFFF] pb-11 md:pb-3 pt-3 flex justify-center">
      <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full px-3 lg:px-0">
        <button
          id="cancel"
          type="button"
          disabled={loading}
          onClick={handleCancel}
          className="py-3 px-8 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={onContinue}
          disabled={!isFormValid || loading}
          className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <BiLoaderCircle className="animate-spin mr-2" size={22} />
          ) : (
            "Continue"
          )}
        </button>
      </div>
      {showModal && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 px-6 bg-black bg-opacity-40 flex items-center justify-center z-[99]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-[8px] p-8 shadow-lg max-w-md w-full"
          >
            {/* Close icon */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-4 text-xl text-black-100 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold hidden md:block">
              What would you like to do?
            </h2>
            <p className="mb-6 text-gray-600 hidden md:block">
              {" "}
              You can save your progress and come back later, or discard this
              event creation.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-end">
              <button
                onClick={handleSaveForLater}
                disabled={loading2}
                className="w-full md:p-3 md:border border-[#111827] md:rounded-[12px] font-medium text-left md:text-center text-[#000] whitespace-nowrap"
              >
                {loading2 ? "saving..." : "Save for later"}
              </button>
              <button
                onClick={onClose}
                className="w-full md:bg-primary text-red-500 md:text-white md:p-3 md:rounded-[12px] hover:text-white transition flex items-center md:justify-center font-medium whitespace-nowrap"
              >
                Discard event update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormButtons3;

// import React from "react";

// interface FormButtonsProps {
//   isFormValid: boolean;
//   onContinue: () => void;
//   onContinue2: () => void;
//   loading: boolean;
//   loading2: boolean;
// }

// const FormButtons3: React.FC<FormButtonsProps> = ({
//   isFormValid,
//   onContinue,
//   onContinue2,
//   loading,
//   loading2,
// }) => (
//   <div className="bg-[#FFFF] pb-11 md:pb-3 pt-3 flex justify-center">
//     <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full px-3 lg:px-0">
//       <button disabled={!isFormValid || loading} onClick={onContinue2} className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">

//         {loading2 ? "saving..." : "Save for later"}
//       </button>
//       <button
//         disabled={!isFormValid || loading}
//         className={`bg-primary text-white py-3 px-8 rounded-[12px] transition flex items-center justify-center font-extrabold font-manrope ${
//           !isFormValid || loading
//             ? "opacity-50 cursor-not-allowed"
//             : "hover:bg-red-800"
//         }`}
//         onClick={onContinue}
//       >
//         {loading ? "Loading..." : "Continue"}
//       </button>
//     </div>
//   </div>
// );

// export default FormButtons3;
