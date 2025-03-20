"use client"; 

import { Group } from "@/app/interface/Group";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormButtonsProps {
  isFormValid: boolean;
  groups: Group[] | null
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, groups }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleContinue = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);

    const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  
    try {
      if (authToken) {
        const groupQuery = encodeURIComponent(JSON.stringify(groups));
        router.push(`/payment-setup?groups=${groupQuery}`);
      } else {
        router.push("/signup")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
      <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
        <button
          id="save"
          className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
        >
          Save for later
        </button>
        <button
          id="continue"
          disabled={!isFormValid || loading}
          className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleContinue}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default FormButtons;






















// // components/FormButtons.tsx
// import React from "react";

// interface FormButtonsProps {
//   isFormValid: boolean;
//   onContinue: () => void;
// }

// const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, onContinue }) => (
//   <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
//     <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
//       <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//         Save for later
//       </button>
//       <button
//         disabled={!isFormValid}
//         className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//           !isFormValid ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         onClick={onContinue}
//       >
//         Continue
//       </button>
//     </div>
//   </div>
// );

// export default FormButtons;
