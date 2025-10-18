"use client"; 

import { Group } from "@/app/interface/Group";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Cookies from "js-cookie";
import EventSaveSuccess from "./EventSaveSuccess";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next-nprogress-bar";


interface FormButtonsProps {
  isFormValid: boolean;
  groups: Group[] | null
  fromDashboard: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, groups, fromDashboard }) => {

  const router = useRouter();
  const pathname = usePathname();
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showSuccess2, setShowSuccess2] = useState(false);
  
  const handleCancel = () => setShowModal(true);

   const callSaveForLater = () => {
    setShowModal(false);
    handleSaveForLater();
  };

  const handleDiscard = () => {
    // setShowModal(false);

    if (pathname === "/dashboard/create-group") {
      router.push("/dashboard/events");
    } else {
      router.push("https://eventparcel.com"); 
    }
  };

  const handleContinue = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      Cookies.set("redirectAfterLogin", pathname); 
      setTimeout(() => {
        router.push("/login");
      },1000);
    }

    if (!isFormValid || loading) return;
  
    setLoading(true);
  
    const groupQuery = encodeURIComponent(JSON.stringify(groups));
  
    try {
      if (fromDashboard) {
        const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        
        if (authToken) {
          router.push(`/dashboard/payment-setup?groups=${groupQuery}`);
        } else {
          router.push("/signup");
        }
      } else {
        router.push(`/payment-setup?groups=${groupQuery}`);
      }
    } finally {
      setLoading(false); 
    }
  };
  

  const handleSaveForLater = async() => {
    setIsSaveLoading(true);
    const authToken = localStorage.getItem("authToken");
    const storedEventId = localStorage.getItem("eventId");

  
    if (!authToken) {
      Cookies.set("redirectAfterLogin", pathname); 
      setShowSuccess2(true);
      return;
    }

    try{
      await axiosInstance.put(`save-for-later/${storedEventId}`, {
        isDraft: true
      });
      toast.success("Saved! Continue from your dashboard.");
      router.push("/dashboard");    
    }catch(error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to save event");
    }finally{
      setIsSaveLoading(false);
    }
  };

  return (
    <>
    <div>{showSuccess2 && <EventSaveSuccess />}</div>
    <div className="bg-[#FFFF] pt-4 pb-11 flex justify-center fixed z-10 left-0 bottom-0 w-full">
      <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
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
       {showModal && (
        <div
          // onClick={handleCloseModal}
          className="fixed inset-0 px-6 bg-black bg-opacity-40 flex items-center justify-center z-[999]"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-[8px] p-8 shadow-lg max-w-md w-full">
               {/* Close icon */}
            <button
              onClick={() => setShowModal(false)}
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
                onClick={callSaveForLater}
                disabled={isSaveLoading}
                className="w-full md:p-3 md:border border-[#111827] md:rounded-[12px] font-medium text-left md:text-center text-[#000] whitespace-nowrap"
              >
                {isSaveLoading ? "saving..." : "Save for later"}
              </button>
              <button
                onClick={handleDiscard}
                className="w-full md:bg-primary text-red-500 md:text-white md:p-3 md:rounded-[12px] hover:text-red-800 transition flex items-center md:justify-center font-medium whitespace-nowrap"
              >
                Discard event creation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default FormButtons;
