"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin } from "lucide-react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { PiCalendarMinus } from "react-icons/pi";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import axiosInstance from "@/lib/axiosInstance";
import { useCallback } from "react";
import { debounce } from "lodash";
import Container from "@/components/dashboard/Container";
import dynamic from "next/dynamic";
import axios from "axios";
import { trackEvent } from "@/lib/mixpanel";
import { EventDetails } from "@/app/(pages)/pickup-details/PickupDetailsContent";


const PickupDeliveryLoationPicker = dynamic(
  () => import("@/components/aboutEvent/PickupDeliveryLoationPicker"),
  { ssr: false }
);

const PickupDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
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
    isDraft: false,
    paymentDate: new Date(),
    paymentTime: new Date(),
    paymentTimeZone: "WAT",
    contactName: "",
    contactPhoneNumber: "",
    pickupLocation: "",
    pickupLatitude: "",
    pickupLongitude: "",
    deliveryDate: new Date(),
    deliveryTime: new Date(),
    deliveryTimeZone: "WAT",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("parsedEventDetails");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEventDetails(parsed);
      } catch (error) {
        console.error("Failed to parse event details:", error);
      }
    }
  }, []);

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

useEffect(() => {
  const handler = setTimeout(() => {
    if (formData.pickupLocation.trim() !== "") {
      setErrors(prev => ({ ...prev, pickupLocation: "" }));
    }
  }, 500);
  
  return () => clearTimeout(handler);
}, [formData.pickupLocation]);

  // Debounce the address input
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedAddress(formData.pickupLocation);
    }, 500); 

    if (formData.pickupLocation) {
      handler();
    }

    return () => handler.cancel();
  }, [formData.pickupLocation]);


// update the form data with the corresponding latitude and longitude when user type the address
useEffect(() => {
  const address = debouncedAddress?.trim();
  
  const isValidAddress = address && address.length >= 5;
  const hasNoCoordinates = !formData.pickupLatitude && !formData.pickupLongitude;


  if (isValidAddress && hasNoCoordinates) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        setFormData((prev) => ({
          ...prev,
          pickupLatitude: location.lat().toString(),
          pickupLongitude: location.lng().toString()
        }));
      } else {
        console.error("Geocode failed: " + status);
      }
    });
  }
}, [debouncedAddress, formData.pickupLatitude, formData.pickupLongitude]);

const toDateString = (dateInput: string | Date | undefined): string | undefined => {
  if (!dateInput) return undefined;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return undefined;

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};



// Retrieve formData from query parameters
useEffect(() => {
  if (!isClient) return;

  const data = searchParams.get("data");
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      setEventDetails(parsedData);

      // Convert time string like "10:40AM" to a Date object
      const convertToDate = (timeStr: string | undefined): Date | undefined => {
        if (!timeStr) return undefined;

        // Use today's date
        const today = new Date().toISOString().split("T")[0]; // "2025-06-04"
        const dateTimeString = `${today} ${timeStr}`;

        const parsed = new Date(dateTimeString);

        return isNaN(parsed.getTime()) ? undefined : parsed;
      };
      

      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        nairaAccount: { ...prev.nairaAccount, ...parsedData.nairaAccount },
        dollarAccount: { ...prev.dollarAccount, ...parsedData.dollarAccount },
        paymentDate: toDateString(parsedData.paymentDate) ? new Date(parsedData.paymentDate) : prev.paymentDate,
        paymentTime: convertToDate(parsedData.paymentTime) || prev.paymentTime,
        deliveryDate: parsedData.deliveryDate ? new Date(parsedData.deliveryDate) : prev.deliveryDate,
        deliveryTime: convertToDate(parsedData.deliveryTime) || prev.deliveryTime,
      }));
    } catch (error) {
      console.error("Error parsing form data:", error);
    }
  }
}, [searchParams, isClient]);

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
    if (isNaN(date.getTime())) {
      // Return a fallback value if the date is invalid
      return "12:00 AM";
    }
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; 
    const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${paddedHours}:${paddedMinutes} ${ampm}`;
  };

  
    const isFilled = (obj: Record<string, any>) =>
      Object.values(obj).some((val) => val && val.toString().trim() !== "");

    
    const pickupAddress = formData.pickupLocation;
    const parts = pickupAddress.split(',').map(part => part.trim());

    // Safely get the second-to-the-last item
    const pickupRegion = parts.length >= 2 ? parts[parts.length - 2] : "";
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;
      console.log(eventDetails)
    
      setLoading(true);
    
      const cleanObject = (obj: Record<string, any>) =>
        Object.fromEntries(
          Object.entries(obj).filter(
            ([_, v]) => v !== null && v !== undefined && v !== ""
          )
        );
      try {
        const { nairaAccount, dollarAccount, ...rest } = formData;
    
        const formattedData = {
          ...rest,
          ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
          ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
          deliveryDate:
            formData.deliveryDate instanceof Date
              ? formData.deliveryDate.toISOString().split("T")[0]
              : "",
          deliveryTime:
            formData.deliveryTime instanceof Date
              ? formatTime12Hour(formData.deliveryTime)
              : "",
          paymentTime:
            formData.paymentTime instanceof Date
              ? formatTime12Hour(formData.paymentTime)
              : "",
          paymentDate:
            formData.paymentDate instanceof Date
              ? `${formData.paymentDate.getFullYear()}-${(formData.paymentDate.getMonth() + 1).toString().padStart(2, "0")}-${formData.paymentDate.getDate().toString().padStart(2, "0")}`
              : "",            
        };
    
        const cleanedData = cleanObject(formattedData);
        // console.log("cleanedData",cleanedData)
    
        await axiosInstance.post("/add-payment", cleanedData);
        toast.success("Details submitted successfully!");
        trackEvent("Add Pickup Information", {
            source: "Pickup-details Page",
            timestamp: new Date().toISOString(),
            page_name: "add pickup page",
            event_id: eventDetails?.event_id,
            event_name: eventDetails?.event_name,
            pickup_region: pickupRegion,
            status: "Successful"
          });
        router.push("/dashboard/events");
      } catch (error: any) {
        trackEvent("Add Pickup Information Failed", {
          source: "Pickup-details Page",
          timestamp: new Date().toISOString(),
          page_name: "add pickup page",
          event_id: eventDetails?.event_id,
          event_name: eventDetails?.event_name,
          pickup_region: pickupRegion,
          status: "Failed"
        });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false); 
      }
    };
    
  /**
   * Handles saving form data for later completion
   */
  const handleSaveForLater = async () => {
    setIsSaveLoading(true);

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsSaveLoading(false);
      return;
    }
  
    try {
      const { nairaAccount, dollarAccount, ...rest } = formData;
      const fullFormData = {
        ...rest,
        ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
        ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
        paymentTime: formatTime12Hour(formData.paymentTime),
        isDraft: true
      };
  
      await axiosInstance.post(`/payment-save-for-later`, fullFormData);
      toast.success("Saved! Continue from your dashboard.");
      router.push("/dashboard/events");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save event");
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleMapLocationSelect = () => {
    setShowMapPickerModal(true);
  };
    
  if (!isClient) {
    return null; 
  }
  return (
    <Container>
    {showMapPickerModal && (
        <PickupDeliveryLoationPicker
          onLocationSelect={(location) => {
            setFormData({ ...formData, 
              pickupLocation: location.address,
              pickupLatitude: location?.lat?.toString(),
              pickupLongitude: location?.lng?.toString()
            });
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <div className="lg:py-24 px-6 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar relative">
        <div className="mt-3">
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
                    className="input-field outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
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
                        className="pl-10 px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
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
                        className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[8px] bg-slate-50"
                      />
                    </div>
                    <select
                      id="deliveryTimeZone"
                      value={formData.deliveryTimeZone}
                      onChange={handleChange}
                      className="px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
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
              <button
                id="save"
                type="button"
                className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
                onClick={() => handleSaveForLater()}
                >
                  {isSaveLoading ? "saving..." : "Save for later"}
              </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
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
            </div>
          </form>
        </div>
      </div>
      </Container>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <PickupDetails />
    </Suspense>
  );
}

