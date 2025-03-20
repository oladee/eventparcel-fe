"use client";

import RightBar from "@/components/Rightbar";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormEvent } from "react";
import { PiCalendarMinus } from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useRouter, useSearchParams } from "next/navigation";
import NairaPayoutForm from "@/components/NairaPayoutForm";
import DollarPayoutForm from "@/components/DollarPayoutForm";

const LocationPickerModal = dynamic(
  () => import("@/components/aboutEvent/LocationPickerModal"),
  { ssr: false }
);

interface Bank {
  name: string;
  code: string;
  url: string;
}

interface USBank {
  _id: {
    $oid: string;
  };
  bankId: string;
  name: string;
  country: string;
  currency: string;
  routingNumber: string[];
}


const validTimeZones = [
  "UTC",
  "GMT",
  "WAT",
  "CAT",
  "EAT",
  "PST",
  "CST",
  "EST",
  "MST",
  "AKST",
  "HST",
  "IST",
  "CET",
  "EET",
  "BST",
  "AST",
  "NST",
  "JST",
  "KST",
  "AEST",
  "ACST",
  "AWST"
];

const PaymentSetupContent = () => {
  const searchParams = useSearchParams();
  const groupsString = searchParams.get("groups");
  const groups = groupsString ? JSON.parse(decodeURIComponent(groupsString)) : [];
  const firstEventId = groups.length > 0 && groups[0].event ? groups[0].event._id : "";

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedUSBank, setSelectedUSBank] = useState<USBank | null>(null);
  const [showModal] = useState<boolean>(false);
  const [loading] = useState<boolean>(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    event: firstEventId,
    nairaAccount: {
      accountNumber: "",
      accountName: "",
      bankName: "",
    },
    dollarAccount: {
      usAccountNumber: "",
      routingNumber: "",
      usBankName: "",
      usAccountName: "",
    },

    paymentDate: new Date(),
    paymentTime: new Date(),
    paymentTimeZone: "WAT",
  });


  // Initialize error messages as strings, not dates.
  const [errors, setErrors] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    usAccountNumber: "",
    routingNumber: "",
    usBankName: "",
    usAccountName: "",
    paymentDate: "",
    paymentTime: "",
    contactName: "",
    pickupLocation: "",
    deliveryDate: "",
    deliveryTime: ""
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isAllFieldsFilled = Object.values(formData).every((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      } else if (value instanceof Date) {
        return !isNaN(value.getTime());
      }
      return true;
    });
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );
    setIsFormValid(isAllFieldsFilled && isAllFieldsValid);
  }, [formData, errors]);

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date })); 
    }
  };
  
  const validateField = (id: string, value: any) => {
    switch (id) {
      case "accountNumber":
        if (!/^\d+$/.test(value)) return "Account number must be a number";
        if (value.length !== 10) return "Account number must be 10 digits";
        return "";
      case "accountName":
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Account name must only contain letters and spaces";
        if (value.length < 3 || value.length > 50)
          return "Account name must be between 3 and 50 characters";
        return "";
      case "paymentDate":
      case "deliveryDate":
        const selectedDate = new Date(value);
        const currentDate = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        if (selectedDate < currentDate) return "Date cannot be in the past";
        return "";
      case "contactName":
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Contact name must only contain letters and spaces";
        if (value.length < 3 || value.length > 50)
          return "Contact name must be between 3 and 50 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
  
    if (id.includes(".")) {
      const [parentKey, childKey] = id.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...(prev[parentKey as keyof typeof formData] as object),
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  
    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value), 
    }));
  };
  

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };


  // Helper function to format a Date object to a 12-hour time string.
  const formatTime12Hour = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${paddedHours}:${paddedMinutes} ${ampm}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!isFormValid) {
      toast.error("Please fill out all required fields");
      return;
    }

  
    const formattedData = {
      ...formData,
      paymentTime: formatTime12Hour(formData.paymentTime), 
    };
    
    const queryString = new URLSearchParams({
      data: JSON.stringify(formattedData),
    }).toString();
  
    router.push(`/pickup-details?${queryString}`);
  };
  const hasNGN = groups.some((group: { groupCurrency: string; }) => group.groupCurrency === "NGN");
  const hasUSD = groups.some((group: { groupCurrency: string; }) => group.groupCurrency === "USD");

  const today = new Date();

  return (
    <HeaderLayout>
      <ToastContainer />
      {showMapPickerModal && (
        <LocationPickerModal
        onLocationSelect={() => {
          setShowMapPickerModal(false);
        }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <section className="bg-[#EEEFF2] !overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-[98vh] overflow-y-auto no-scrollbar">
          <div className="md:mb-12 text-center p-3 sm:p-0 space-y-3">
            <h2
              id="payment_deliveryHeader"
              className="flex justify-start text-xl sm:text-2xl font-bold text-[#111827]"
            >
              Payment Setup
            </h2>
            <div id="payment_deliveryDesc" className="flex justify-center items-center gap-3">
              <div className="flex flex-col">
                <span className="flex justify-start w-[313px] whitespace-nowrap h-6 font-general font-medium text-sm text-[#718096]">
                  Let&apos;s setup your payout process and payment
                </span>
                <span className="flex justify-start w-[313px] h-11 font-general font-medium text-sm text-[#718096]">
                  deadline
                </span>
              </div>
              <span
                onClick={() => setIsRightBarOpen(true)}
                className="px-2 mb-6 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
              >
                !
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
          >
            <div>
              <div className="mb-5">
                <h1
                  id="paymentDetailsHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Account Details
                </h1>
                <span
                  id="paymentDetailsDesc"
                  className="text-sm text-[#718096] font-medium"
                >
                  Add your payout bank details
                </span>
              </div>

              {/* NAIRA PAYOUT */}
              <div className=" rounded-[10px]">
              {hasNGN && (
                <div className="border border-[#CBD5E0] mb-7 p-4 rounded-[10px]">
                  <NairaPayoutForm
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    selectedBank={selectedBank}
                    setSelectedBank={setSelectedBank}
                    setFormData={setFormData}
                  />
                </div>
              )}


                {/* DOLLAR PAYOUT */}
                {hasUSD && (
                <div className="border border-[#CBD5E0] p-4 rounded-[10px]">
                  <DollarPayoutForm
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    selectedUSBank={selectedUSBank}
                    setSelectedUSBank={setSelectedUSBank}
                    setFormData={setFormData}
                  />
                </div> 
                )}        
              </div>
              </div>
            <div className="mt-8">
              <div className="mb-5">
                <h2
                  id="payment_deadlineHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Payment Deadline
                </h2>
                <span
                  id="payment_deadlineDesc"
                  className="text-sm text-[#718096] font-medium"
                >
                  Select the payment deadline date and time
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="paymentDate"
                    className="block mb-2 font-semibold text-[#111827]"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                    <div className="w-full bg-slate-50">
                    <DatePicker
                      selected={formData.paymentDate}
                      minDate={today}
                      id="paymentDate"
                      onChange={(date) => handleDateChange(date, "paymentDate")}
                      dateFormat="yyyy-MM-dd"
                      className="pl-10 px-3 py-2 z-20 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                      popperClassName="custom-datepicker"
                      />
                    </div>
                  </div>
                  {errors.paymentDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentDate}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="paymentTime"
                    className="block mb-2 font-semibold text-[#111827]"
                  >
                    Time
                  </label>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
                      <DatePicker
                        selected={formData.paymentTime} 
                        id="paymentTime"
                        onChange={(date) => handleDateChange(date, "paymentTime")}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="hh:mm aa"
                        placeholderText="Select Payment Time"
                        className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
                    <select
                      id="paymentTimeZone"
                      value={formData.paymentTimeZone}
                      onChange={handleChange}
                      className="px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50"
                    >
                      {validTimeZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
              <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
                <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
                  Save for later
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
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
            </div>
          </form>

          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
      </section>
      {showModal && (
        <ReusuableSuccess
          title="You've successfully uploaded your details"
          subtitle="Congratulations you have successfully created your Payment details"
          route="/event-creation"
          buttonText="continue"
        />
      )}
    </HeaderLayout>
  );
};

export default PaymentSetupContent;