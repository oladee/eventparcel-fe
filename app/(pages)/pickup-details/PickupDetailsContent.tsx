"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin } from "lucide-react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { PiCalendarMinus } from "react-icons/pi";
import toast from "react-hot-toast";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { BiLoaderCircle } from "react-icons/bi";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import axiosInstance from "@/lib/axiosInstance";
import { useCallback } from "react";
import LocationPickerModal from "@/components/aboutEvent/LocationPickerModal";

const PickupDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [formData, setFormData] = useState({
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
    contactName: "",
    contactPhoneNumber: "",
    pickupLocation: "",
    deliveryDate: new Date(),
    deliveryTime: new Date(),
    deliveryTimeZone: "WAT",
  });

  const today = new Date();

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
    "AWST",
  ];

  
  // Retrieve formData from query parameters
  // useEffect(() => {
  //   const data = searchParams.get("data");
  //   if (data) {
  //     try {
  //       const parsedData = JSON.parse(data);

  //       setFormData((prev) => ({
  //         ...prev,
  //         ...parsedData,
  //         nairaAccount: { ...prev.nairaAccount, ...parsedData.nairaAccount },
  //         dollarAccount: { ...prev.dollarAccount, ...parsedData.dollarAccount },
  //         paymentDate: formData.paymentDate.toISOString().split("T")[0],
  //         paymentTime: parsedData.paymentTime,
  //         deliveryDate: parsedData.deliveryDate,
  //         deliveryTime: parsedData.deliveryTime,
  //       }));
  //     } catch (error) {
  //       console.error("Error parsing form data:", error);
  //     }
  //   }
  // }, [searchParams]);


  // // Validate form whenever formData changes
  // useEffect(() => {
  //   validateForm();
  // }, [formData]);

  // const validateForm = () => {
  //   const { contactName, contactPhoneNumber, pickupLocation, deliveryDate, deliveryTime } = formData;
  //   const isValid =
  //     contactName.trim() !== "" &&
  //     contactPhoneNumber.trim() !== "" &&
  //     pickupLocation.trim() !== "" &&
  //     deliveryDate instanceof Date &&
  //     deliveryTime instanceof Date;
  //   setIsFormValid(isValid);
  // };



  
// Refactor validateForm to use useCallback
const validateForm = useCallback(() => {
  const { contactName, contactPhoneNumber, pickupLocation, deliveryDate, deliveryTime } = formData;
  const isValid =
    contactName.trim() !== "" &&
    contactPhoneNumber.trim() !== "" &&
    pickupLocation.trim() !== "" &&
    deliveryDate instanceof Date &&
    deliveryTime instanceof Date;
  setIsFormValid(isValid);
}, [formData]);

// Retrieve formData from query parameters
useEffect(() => {
  const data = searchParams.get("data");
  if (data) {
    try {
      const parsedData = JSON.parse(data);

      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        nairaAccount: { ...prev.nairaAccount, ...parsedData.nairaAccount },
        dollarAccount: { ...prev.dollarAccount, ...parsedData.dollarAccount },
        paymentDate: formData.paymentDate.toISOString().split("T")[0],
        paymentTime: parsedData.paymentTime,
        deliveryDate: parsedData.deliveryDate,
        deliveryTime: parsedData.deliveryTime,
      }));
    } catch (error) {
      console.error("Error parsing form data:", error);
    }
  }
}, [searchParams, formData.paymentDate]);

// Validate form whenever formData changes
useEffect(() => {
  validateForm();
}, [formData, validateForm]);

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [id]: "This field is required" }));
    }
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
  

  const handleSubmit = async (e: React.FormEvent) => {

    console.log("formData:", formData)
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        deliveryDate: formData.deliveryDate.toISOString().split("T")[0],
        deliveryTime: formatTime12Hour(formData.deliveryTime), 
      };

      console.log("formattedData",formattedData)

      await axiosInstance.post("/add-payment", formattedData);
      toast.success("Payment and Delivery details submitted successfully!");
      router.push("/dashboard/events");
    } catch (error) {
      toast.error("Error submitting Payment and delivery details");
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapLocationSelect = () => {
    setShowMapPickerModal(true);
  };

  return (
    <HeaderLayout>
       {showMapPickerModal && (
        <LocationPickerModal
          onLocationSelect={(location) => {
            setFormData({ ...formData, pickupLocation: location });
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <div className="py-20 bg-[#EEEFF2] lg:py-24 px-6 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar relative">
        <div className="mt-8">
          <div className="mb-5">
            <h4 id="deliveryDetailsHeader" className="text-2xl font-semibold text-[#111827] mb-2">
              Pickup Details
            </h4>
            <span id="deliveryDetailsDesc" className="text-sm text-[#718096] font-medium">
              Add pickup contact details and when you want to start the delivery
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-[#FFFFFF] grid grid-cols-1 gap-6 p-5 rounded-xl">
              <div className="flex flex-col">
                <label htmlFor="contactName" className="block mb-2 font-semibold text-[#111827]">
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
                  <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                )}
              </div>

              <div className="flex flex-col" id="contactPhoneNumber">
                <label htmlFor="contactPhoneNumber" className="block mb-2 font-semibold text-[#111827]">
                  Contact Phone Number
                </label>
                <div className="pb-3 w-full">
                  <PhoneNumberInput
                    onPhoneChange={(value: string) => {
                      setFormData((prev) => ({ ...prev, contactPhoneNumber: value }));
                      setErrors((prev) => ({ ...prev, contactPhoneNumber: "" }));
                    }}
                  />
                </div>
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                )}
              </div>

              <div className="flex flex-col -mt-5">
                <label htmlFor="pickupLocation" className="block mb-2 font-semibold text-[#111827]">
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
                    className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-[#FAFAFA]"
                    required
                  />
                  {errors.pickupLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="deliveryDate" className="block mb-2 font-semibold text-[#111827]">
                    Pickup Start Date
                  </label>
                  <div className="relative">
                    <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                    <div className="bg-[#FAFAFA]">
                      <DatePicker
                        selected={formData.deliveryDate}
                        minDate={today}
                        id="deliveryDate"
                        onChange={(date) => handleDateChange(date, "deliveryDate")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-10 px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
                  </div>
                  {errors.deliveryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="deliveryTime" className="block mb-2 font-semibold text-[#111827]">
                    Time
                  </label>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
                      <DatePicker
                        selected={formData.deliveryTime}
                        id="deliveryTime"
                        onChange={(date) => handleDateChange(date, "deliveryTime")}
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
            {/* Save and continue */}
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
        </div>
      </div>
    </HeaderLayout>
  );
};

export default PickupDetails;

