"use client";

import RightBar from "@/components/Rightbar";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import BankDropdown from "@/components/BankDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormEvent } from "react";
// import TimeZoneDropdown from "@/components/TimeZoneDropdown";
import { PiCalendarMinus } from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";

const LocationPickerModal = dynamic(
  () => import("@/components/aboutEvent/LocationPickerModal"),
  { ssr: false }
);

interface Bank {
  name: string;
  code: string;
  url: string;
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

const Page = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    paymentDate: new Date(),
    paymentTime: new Date(),
    paymentTimeZone: "WAT",
    contactName: "",
    pickupLocation: "",
    deliveryDate: new Date(),
    deliveryTime: new Date(),
    deliveryTimeZone: "WAT"
  });

  // Initialize error messages as strings, not dates.
  const [errors, setErrors] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
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

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (formData.paymentDate < currentDate) {
      setErrors((prev) => ({
        ...prev,
        paymentDate: "Payment date cannot be in the past"
      }));
      toast.error("Payment date cannot be in the past");
      return;
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: validateField(id, value) });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleMapLocationSelect = () => {
    setShowMapPickerModal(true);
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
    if (!isFormValid) return;

    try {
      setLoading(true);

      const formattedPaymentTime = formatTime12Hour(formData.paymentTime);
      const formattedDeliveryTime = formatTime12Hour(formData.deliveryTime);

      const submissionData = {
        ...formData,
        paymentDate: formData.paymentDate.toISOString().split("T")[0],
        deliveryDate: formData.deliveryDate.toISOString().split("T")[0],
        paymentTime: formattedPaymentTime,
        deliveryTime: formattedDeliveryTime
      };

      const response = await axiosInstance.post("/create", submissionData);
      console.log("Response:", response.data);
      setShowModal(true);
    } catch (error: any) {
      console.error("Error:", error);

      if (error.isAxiosError && !error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setErrors((prev) => ({ ...prev, [key]: serverErrors[key] }));
        });
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error(
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {showMapPickerModal && (
        <LocationPickerModal
          onLocationSelect={(pickupLocation: string) => {
            setFormData({ ...formData, pickupLocation });
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <section className="bg-[#F9FAFB] !overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
          <div className="mb-4 md:mb-12 text-center p-3 sm:p-0 space-y-3">
            <h1
              id="payment_deliveryHeader"
              className="text-2xl sm:text-3xl font-bold text-[#111827]"
            >
              Payment & Delivery
            </h1>
            <p id="payment_deliveryDesc" className="gap-3">
              <span className="mr-2">
                Let&apos;s setup your payment process and delivery plans
              </span>
              <span
                onClick={() => setIsRightBarOpen(true)}
                className="px-2 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
              >
                !
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
          >
            <div>
              <div className="mb-5">
                <h2
                  id="paymentDetailsHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Payment Details
                </h2>
                <span
                  id="paymentDetailsDesc"
                  className="text-sm text-[#718096] font-medium"
                >
                  Add your bank account details and payment deadline
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="accountNumber"
                    className="block mb-2 font-semibold text-[#111827]"
                    aria-required="true"
                  >
                    Account Number
                  </label>
                  <input
                    type="number"
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    maxLength={10}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    aria-describedby="accountNumberError"
                    aria-invalid={!!errors.accountNumber}
                    required
                  />
                  {errors.accountNumber && (
                    <p
                      id="accountNumberError"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#111827]">
                    Bank Name
                  </label>
                  <BankDropdown
                    selectedBank={selectedBank}
                    setSelectedBank={setSelectedBank}
                    setFormData={setFormData}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="accountName"
                  className="block mb-2 font-semibold text-[#111827]"
                >
                  Account Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  placeholder="Account name"
                  value={formData.accountName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                />
                {errors.accountName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountName}
                  </p>
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
                  {/* <DatePicker
                    selected={formData.paymentDate}
                    id="paymentDate"
                    onChange={(date) => handleDateChange(date, "paymentDate")}
                    dateFormat="yyyy-MM-dd"
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    popperClassName="custom-datepicker"
                  /> */}
                  <div className="relative">
                    <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                    <DatePicker
                      selected={formData.paymentDate}
                      id="paymentDate"
                      onChange={(date) => handleDateChange(date, "paymentDate")}
                      dateFormat="yyyy-MM-dd"
                      className="pl-10 px-3 py-2 z-20 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                      popperClassName="custom-datepicker"
                    />
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
                        onChange={(date) =>
                          handleDateChange(date, "paymentTime")
                        }
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

                    {/* <TimeZoneDropdown
                      value={formData.paymentTimeZone}
                      onChange={(value) =>
                        setFormData({ ...formData, paymentTimeZone: value })
                      }
                      options={validTimeZones}
                    /> */}

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

            <div className="mt-8">
              <div className="mb-5">
                <h2
                  id="deliveryDetailsHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Delivery Details
                </h2>
                <span
                  id="deliveryDetailsDesc"
                  className="text-sm text-[#718096] font-medium"
                >
                  Add pickup contact details and when you want to start the
                  delivery
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="contactName"
                    className="block mb-2 font-semibold text-[#111827]"
                  >
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    placeholder="Enter the name of the contact person"
                    value={formData.contactName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="pickupLocation"
                    className="block mb-2 font-semibold text-[#111827]"
                  >
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin
                      onClick={handleMapLocationSelect}
                      className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      size={20}
                    />
                    <input
                      type="text"
                      id="pickupLocation"
                      placeholder="Enter location"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-slate-50"
                      required
                    />
                    {errors.pickupLocation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pickupLocation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="deliveryDate"
                      className="block mb-2 font-semibold text-[#111827]"
                    >
                      Date
                    </label>
                    <div className="relative">
                      <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                      <DatePicker
                        selected={formData.deliveryDate}
                        id="deliveryDate"
                        onChange={(date) =>
                          handleDateChange(date, "deliveryDate")
                        }
                        dateFormat="yyyy-MM-dd"
                        className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
                    {errors.deliveryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.deliveryDate}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="deliveryTime"
                      className="block mb-2 font-semibold text-[#111827]"
                    >
                      Time
                    </label>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
                        <DatePicker
                          selected={formData.deliveryTime}
                          id="deliveryTime"
                          onChange={(date) =>
                            handleDateChange(date, "deliveryTime")
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="hh:mm aa"
                          popperClassName="custom-datepicker"
                          className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                        />
                      </div>
                      <select
                        id="deliveryTimeZone"
                        value={formData.deliveryTimeZone}
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
            </div>

            <div className="bg-[#FFFF] py-4 flex justify-center md:absolute z-10 right-0 bottom-0 w-full">
              <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full">
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
    </>
  );
};

export default Page;

// "use client";

// import RightBar from "@/components/Rightbar";
// import { MapPin } from "lucide-react";
// import dynamic from "next/dynamic";
// import React, { useState, useEffect } from "react";
// import axiosInstance from "@/lib/axiosInstance";
// import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
// import { toast, ToastContainer } from "react-toastify";
// import { BiLoaderCircle } from "react-icons/bi";
// import BankDropdown from "@/components/BankDropdown";

// const LocationPickerModal = dynamic(
//   () => import("@/components/aboutEvent/LocationPickerModal"),
//   { ssr: false }
// );

// interface Bank {
//   name: string;
//   code: string;
//   url: string;
// }

// const validTimeZones = [
//   "UTC",
//   "GMT",
//   "WAT",
//   "CAT",
//   "EAT",
//   "PST",
//   "CST",
//   "EST",
//   "MST",
//   "AKST",
//   "HST",
//   "IST",
//   "CET",
//   "EET",
//   "BST",
//   "AST",
//   "NST",
//   "JST",
//   "KST",
//   "AEST",
//   "ACST",
//   "AWST"
// ];

// const Page = () => {
//   const [isRightBarOpen, setIsRightBarOpen] = useState(false);
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);
//   const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);

//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     accountName: "",
//     bankName: "",
//     paymentDate: "",
//     paymentTime: "",
//     paymentTimeZone: "WAT",
//     contactName: "",
//     pickupLocation: "",
//     deliveryDate: "",
//     deliveryTime: "",
//     deliveryTimeZone: "WAT"
//   });

//   const [errors, setErrors] = useState({
//     accountNumber: "",
//     accountName: "",
//     bankName: "",
//     paymentDate: "",
//     paymentTime: "",
//     contactName: "",
//     pickupLocation: "",
//     deliveryDate: "",
//     deliveryTime: ""
//   });

//   const [isFormValid, setIsFormValid] = useState(false);

//   useEffect(() => {
//     const isAllFieldsFilled = Object.values(formData).every(
//       (value) => value.trim() !== ""
//     );
//     const isAllFieldsValid = Object.values(errors).every(
//       (error) => error === ""
//     );
//     setIsFormValid(isAllFieldsFilled && isAllFieldsValid);
//   }, [formData, errors]);

//   const validateField = (id: string, value: any) => {
//     switch (id) {
//       case "accountNumber":
//         if (!/^\d+$/.test(value)) return "Account number must be a number";
//         if (value.length != 10) return "Account number must be 10 digits";
//         return "";
//       case "accountName":
//         if (!/^[A-Za-z\s]+$/.test(value))
//           return "Account name must only contain letters and spaces";
//         if (value.length < 3 || value.length > 50)
//           return "Account name must be between 3 and 50 characters";
//         return "";
//       case "paymentDate":
//       case "deliveryDate":
//         const selectedDate = new Date(value);
//         const currentDate = new Date();
//         selectedDate.setHours(0, 0, 0, 0);
//         currentDate.setHours(0, 0, 0, 0);
//         if (selectedDate < currentDate) return "Date cannot be in the past";
//         return "";
//       case "contactName":
//         if (!/^[A-Za-z\s]+$/.test(value))
//           return "Contact name must only contain letters and spaces";
//         if (value.length < 3 || value.length > 50)
//           return "Contact name must be between 3 and 50 characters";
//         return "";
//       default:
//         return "";
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//     setErrors({ ...errors, [id]: validateField(id, value) });
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
//   };

//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   // Helper function to convert 24-hour time (HH:mm) to 12-hour format (hh:mm AM/PM) matching the regex
//   const convertTo12Hour = (time24: string): string => {
//     const [hourStr, minute] = time24.split(":");
//     let hours = parseInt(hourStr, 10);
//     const ampm = hours >= 12 ? "PM" : "AM";
//     // Convert hour '0' to '12'
//     hours = hours % 12 || 12;
//     // Pad hours with a leading zero if necessary
//     const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
//     return `${paddedHours}:${minute} ${ampm}`;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isFormValid) return;

//     try {
//       setLoading(true);

//       // Convert paymentTime and deliveryTime to 12-hour format if needed
//       let formattedPaymentTime = formData.paymentTime;
//       if (/^\d{2}:\d{2}$/.test(formData.paymentTime)) {
//         formattedPaymentTime = convertTo12Hour(formData.paymentTime);
//       }

//       let formattedDeliveryTime = formData.deliveryTime;
//       if (/^\d{2}:\d{2}$/.test(formData.deliveryTime)) {
//         formattedDeliveryTime = convertTo12Hour(formData.deliveryTime);
//       }

//       const submissionData = {
//         ...formData,
//         paymentTime: formattedPaymentTime,
//         deliveryTime: formattedDeliveryTime
//       };

//       const response = await axiosInstance.post("/create", submissionData);
//       console.log("Response:", response.data);
//       setShowModal(true);
//     } catch (error: any) {
//       console.error("Error:", error);

//       // Handle network errors
//       if (error.isAxiosError && !error.response) {
//         toast.error("Network error. Please check your internet connection.");
//       } else if (error.response?.data?.errors) {
//         // Handle server-side validation errors
//         const serverErrors = error.response.data.errors;
//         Object.keys(serverErrors).forEach((key) => {
//           setErrors((prev) => ({ ...prev, [key]: serverErrors[key] }));
//         });
//         toast.error("Please fix the errors in the form.");
//       } else {
//         // Handle generic errors
//         toast.error(
//           error.response?.data?.message || "An unexpected error occurred."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       {showMapPickerModal && (
//         <LocationPickerModal
//           onLocationSelect={(pickupLocation) => {
//             setFormData({ ...formData, pickupLocation });
//             setShowMapPickerModal(false);
//           }}
//           onCancel={() => setShowMapPickerModal(false)}
//         />
//       )}
//       <section className="bg-[#F9FAFB] !overflow-hidden relative">
//         <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
//           <div className="mb-4 md:mb-12 text-center p-3 sm:p-0 space-y-3">
//             <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
//               Payment & Delivery
//             </h1>
//             <p className="gap-3">
//               <span className="mr-2">
//                 Let&apos;s setup your payment process and delivery plans
//               </span>
//               <span
//                 onClick={() => setIsRightBarOpen(true)}
//                 className="px-2 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
//               >
//                 !
//               </span>
//             </p>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
//           >
//             <div>
//               <div className="mb-5">
//                 <h2 className="text-xl font-semibold text-[#111827] mb-2">
//                   Payment Details
//                 </h2>
//                 <span className="text-sm text-[#718096] font-medium">
//                   Add your bank account details and payment deadline
//                 </span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="accountNumber"
//                     className="block mb-2 font-semibold text-[#111827]"
//                     aria-required="true"
//                   >
//                     Account Number
//                   </label>
//                   <input
//                     type="number"
//                     id="accountNumber"
//                     placeholder="Enter account number"
//                     value={formData.accountNumber}
//                     maxLength={10}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                     aria-describedby="accountNumberError"
//                     aria-invalid={!!errors.accountNumber}
//                     required
//                   />
//                   {errors.accountNumber && (
//                     <p
//                       id="accountNumberError"
//                       className="text-red-500 text-sm mt-1"
//                       role="alert"
//                     >
//                       {errors.accountNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold text-[#111827]">
//                     Bank Name
//                   </label>
//                   <BankDropdown
//                     selectedBank={selectedBank}
//                     setSelectedBank={setSelectedBank}
//                     setFormData={setFormData}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col">
//                 <label
//                   htmlFor="accountName"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Account Name
//                 </label>
//                 <input
//                   type="text"
//                   id="accountName"
//                   placeholder="Account name"
//                   value={formData.accountName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                 />
//                 {errors.accountName && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.accountName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-8">
//               <div className="mb-5">
//                 <h2 className="text-xl font-semibold text-[#111827] mb-2">
//                   Payment Deadline
//                 </h2>
//                 <span className="text-sm text-[#718096] font-medium">
//                   Select the payment deadline date and time
//                 </span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="paymentDate"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     id="paymentDate"
//                     value={formData.paymentDate}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                   />
//                   {errors.paymentDate && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.paymentDate}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="paymentTime"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Time
//                   </label>
//                   <div className="flex space-x-3">
//                     <input
//                       type="time"
//                       id="paymentTime"
//                       value={formData.paymentTime}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//                     />
//                     <select
//                       id="paymentTimeZone"
//                       value={formData.paymentTimeZone}
//                       onChange={handleChange}
//                       className="px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50"
//                     >
//                       {validTimeZones.map((zone) => (
//                         <option key={zone} value={zone}>
//                           {zone}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8">
//               <div className="mb-5">
//                 <h2 className="text-xl font-semibold text-[#111827] mb-2">
//                   Delivery Details
//                 </h2>
//                 <span className="text-sm text-[#718096] font-medium">
//                   Add pickup contact details and when you want to start the
//                   delivery
//                 </span>
//               </div>
//               <div className="grid grid-cols-1 gap-6">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="contactName"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Contact Name
//                   </label>
//                   <input
//                     type="text"
//                     id="contactName"
//                     placeholder="Enter the name of the contact person"
//                     value={formData.contactName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                   />
//                   {errors.contactName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.contactName}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="pickupLocation"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Pickup Location
//                   </label>
//                   <div className="relative">
//                     <MapPin
//                       onClick={handleMapLocationSelect}
//                       className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
//                       size={20}
//                     />
//                     <input
//                       type="text"
//                       id="pickupLocation"
//                       placeholder="Enter location"
//                       value={formData.pickupLocation}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-slate-50"
//                       required
//                     />
//                     {errors.pickupLocation && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.pickupLocation}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="flex flex-col">
//                     <label
//                       htmlFor="deliveryDate"
//                       className="block mb-2 font-semibold text-[#111827]"
//                     >
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       id="deliveryDate"
//                       value={formData.deliveryDate}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                     />
//                     {errors.deliveryDate && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.deliveryDate}
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label
//                       htmlFor="deliveryTime"
//                       className="block mb-2 font-semibold text-[#111827]"
//                     >
//                       Time
//                     </label>
//                     <div className="flex space-x-3">
//                       <input
//                         type="time"
//                         id="deliveryTime"
//                         value={formData.deliveryTime}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         className="px-3 py-2 input-field outline-primar w-full rounded-[5px] bg-slate-50"
//                       />
//                       <select
//                         id="deliveryTimeZone"
//                         value={formData.deliveryTimeZone}
//                         onChange={handleChange}
//                         className="px-3 py-2 input-field outline-primar rounded-[5px] bg-slate-50"
//                       >
//                         {validTimeZones.map((zone) => (
//                           <option key={zone} value={zone}>
//                             {zone}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-[#FFFF] py-4 flex justify-center md:absolute z-10 right-0 bottom-0 w-full">
//               <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full">
//                 <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//                   Save for later
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!isFormValid}
//                   className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//                     !isFormValid ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {loading ? (
//                     <BiLoaderCircle className="animate-spin mr-2" size={22} />
//                   ) : (
//                     "Continue"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>

//           <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
//         </div>
//       </section>
//       {showModal && (
//         <ReusuableSuccess
//           title="You've successfully uploaded your details"
//           subtitle="Congratulations you have successfully created your Payment details"
//           route="/"
//           buttonText="Continue"
//         />
//       )}
//     </>
//   );
// };

// export default Page;
