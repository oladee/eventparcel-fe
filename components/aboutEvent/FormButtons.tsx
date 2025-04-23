"use client"; 

import { Group } from "@/app/interface/Group";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface FormButtonsProps {
  isFormValid: boolean;
  groups: Group[] | null
  fromDashboard: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, groups, fromDashboard }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleContinue = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);

    const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  
    try {
      if (authToken) {
        const groupQuery = encodeURIComponent(JSON.stringify(groups));
        if(fromDashboard) {
          router.push(`/dashboard/payment-setup?groups=${groupQuery}`);
        } else {
          router.push(`/payment-setup?groups=${groupQuery}`);
        }
        console.log("loading", loading)
      } else {
        router.push("/signup")
      }
    } finally {
      setLoading(true);
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
          className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleContinue}
        >
          {loading ? (
            <FaSpinner className="animate-spin mr-2" /> 
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default FormButtons;
