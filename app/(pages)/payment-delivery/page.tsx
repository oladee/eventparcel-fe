"use client";

import RightBar from "@/components/Rightbar";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { banks } from "@/data/banks";
// import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";

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
  "UTC", "GMT", "WAT", "CAT", "EAT", "PST", "CST", "EST", "MST",
  "AKST", "HST", "IST", "CET", "EET", "BST", "AST", "NST", "JST",
  "KST", "AEST", "ACST", "AWST"
];

const Page = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false)

  const filteredBanks = banks.filter((bank: Bank) =>
    bank.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    paymentDate: "",
    paymentTime: "",
    paymentTimeZone: "WAT",
    contactName: "",
    pickupLocation: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryTimeZone: "WAT"
  });

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
    const isAllFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );
    setIsFormValid(isAllFieldsFilled && isAllFieldsValid);
  }, [formData, errors]);

  const validateField = (id: string, value: any) => {
    switch (id) {
      case "accountNumber":
        if (!/^\d+$/.test(value)) return "Account number must be a number";
        if (value.length != 10)
          return "Account number must be 10 digits";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setShowModal(true)

    // try {
    //   const response = await axiosInstance.post("/payment-delivery", formData);
    //   console.log("Response:", response.data);
    //   // Handle successful submission
    // } catch (error) {
    //   console.error("Error:", error);
    //   // Handle error
    // }
  };

  return (
    <>
      {showMapPickerModal && (
        <LocationPickerModal
          onLocationSelect={(pickupLocation) => {
            setFormData({ ...formData, pickupLocation });
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <section className="bg-[#F9FAFB] !overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
          <div className="mb-4 md:mb-12 text-center p-3 sm:p-0 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Payment & Delivery
            </h1>
            <p className="gap-3">
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
                <h2 className="text-xl font-semibold text-[#111827] mb-2">
                  Payment Details
                </h2>
                <span className="text-sm text-[#718096] font-medium">
                  Add your bank account details and payment deadline
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="accountNumber"
                    className="block mb-2 font-semibold text-[#111827]"
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
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#111827]">
                    Bank Name
                  </label>
                  <div className="relative mb-6">
                    <div
                      className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {selectedBank ? (
                        <div className="flex items-center">
                          <Image
                            src={selectedBank.url}
                            alt={selectedBank.name}
                            className="w-6 h-6 mr-2"
                            width={24}
                            height={24}
                          />
                          <span>{selectedBank.name}</span>
                          <span className="ml-auto">({selectedBank.code})</span>
                        </div>
                      ) : (
                        <span>Select Bank</span>
                      )}
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full bg-white border rounded mt-2 max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search for a bank..."
                          className="w-full p-2 border-b"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                        />
                        {filteredBanks.length > 0 ? (
                          filteredBanks.map((bank: Bank) => (
                            <div
                              key={bank.code}
                              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedBank(bank);
                                setIsDropdownOpen(false);
                                setFormData({
                                  ...formData,
                                  bankName: bank.name
                                });
                              }}
                            >
                              <Image
                                src={bank.url}
                                alt={bank.name}
                                className="w-6 h-6 mr-2"
                                width={24}
                                height={24}
                              />
                              <span>{bank.name}</span>
                              <span className="ml-auto">({bank.code})</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center">Not found</div>
                        )}
                      </div>
                    )}
                  </div>
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
                <h2 className="text-xl font-semibold text-[#111827] mb-2">
                  Payment Deadline
                </h2>
                <span className="text-sm text-[#718096] font-medium">
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
                  <input
                    type="date"
                    id="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                  />
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
                    <input
                      type="time"
                      id="paymentTime"
                      value={formData.paymentTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
                    />
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
                <h2 className="text-xl font-semibold text-[#111827] mb-2">
                  Delivery Details
                </h2>
                <span className="text-sm text-[#718096] font-medium">
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
                    <input
                      type="date"
                      id="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    />
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
                      <input
                        type="time"
                        id="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="px-3 py-2 input-field outline-primar w-full rounded-[5px] bg-slate-50"
                      />
                      <select
                        id="deliveryTimeZone"
                        value={formData.deliveryTimeZone}
                        onChange={handleChange}
                        className="px-3 py-2 input-field outline-primar rounded-[5px] bg-slate-50"
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
                  Continue
                </button>
              </div>
            </div>
          </form>

          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
      </section>
      {
        showModal && <ReusuableSuccess title="You&apos;ve successfully uploaded your details" subtitle="Congratulations you have successfully created your Payment details" route="/" buttonText="continue" />
      }
    </>
  );
};

export default Page;



























// "use client";

// import RightBar from "@/components/Rightbar";
// import { MapPin } from "lucide-react";
// import dynamic from "next/dynamic";
// import React, { useState } from "react";
// import { FiInfo } from "react-icons/fi";

// const LocationPickerModal = dynamic(
//   () => import("@/components/aboutEvent/LocationPickerModal"),
//   { ssr: false }
// );
// const Page = () => {
//   const [isRightBarOpen, setIsRightBarOpen] = useState(false);
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);
//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     bankName: "",
//     paymentDate: "",
//     paymentTime: "",
//     contactName: "",
//     pickupLocation: "",
//     deliveryDate: "",
//     deliveryTime: ""
//   });

//   const [errors, setErrors] = useState({
//     accountNumber: "",
//     bankName: "",
//     paymentDate: "",
//     paymentTime: "",
//     contactName: "",
//     pickupLocation: "",
//     deliveryDate: "",
//     deliveryTime: ""
//   });
//   // Handlers for input changes and validations
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//     setErrors({ ...errors, [e.target.id]: "" });
//   };

//   const validateField = (id: string, value: any) => {
//     console.log("Validation Logic");
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
//   };

//   // Map location handler
//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   return (
//     <>
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
//         <div className="py-11 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
//           {/* Page Header */}
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
//             action=""
//             className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
//           >
//             {/* Payment Details */}
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
//                 {/* Account Number */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="accountNumber"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Account Number
//                   </label>
//                   <input
//                     type="text"
//                     id="accountNumber"
//                     placeholder="Enter account number"
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                   />
//                 </div>

//                 {/* Bank Name */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="bankName"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Bank Name
//                   </label>
//                   <select
//                     id="bankName"
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                   >
//                     <option value="">Select bank</option>
//                     <option value="bankA">Bank A</option>
//                     <option value="bankB">Bank B</option>
//                     <option value="bankC">Bank C</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Deadline */}
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
//                 {/* Date */}
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
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                   />
//                 </div>

//                 {/* Time + Time Zone Dropdown */}
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
//                       className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//                     />
//                     <select className="px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50">
//                       <option value="WAT">WAT</option>
//                       <option value="GMT">GMT</option>
//                       <option value="UTC">UTC</option>
//                       <option value="EST">EST</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Details */}
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
//                 {/* Contact Name */}
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
//                     className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                   />
//                 </div>

//                 {/* Pickup Location */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="pickupLocation"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Pickup Location
//                   </label>
//                   {/* <input
//                     type="text"
//                     id="pickupLocation"
//                     placeholder="Enter location"
//                     className="px-3 py-2 input-field outline-primar w-full rounded-[5px] bg-slate-50"
//                   /> */}
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
//                   {/* Delivery Date */}
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
//                       className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                     />
//                   </div>

//                   {/* Delivery Time + Time Zone Dropdown */}
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
//                         className="px-3 py-2 input-field outline-primar w-full rounded-[5px] bg-slate-50"
//                       />
//                       <select className="px-3 py-2 input-field outline-primar rounded-[5px] bg-slate-50">
//                         <option value="WAT">WAT</option>
//                         <option value="GMT">GMT</option>
//                         <option value="UTC">UTC</option>
//                         <option value="EST">EST</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="bg-[#FFFF] py-4 flex justify-center absolute z-10 right-0 bottom-0 w-full">
//               <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full">
//                 <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//                   Save for later
//                 </button>
//                 <button
//                   disabled={true}
//                   className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//                     true ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                   onClick={() => {}}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </form>

//           <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
//         </div>
//       </section>
//     </>
//   );
// };

// export default Page;
