"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
import { ChevronLeft } from 'lucide-react';
import { nigerianStates } from "@/utils/data";
import InfoModal from "@/components/modals/InfoModal";

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
  const [showModal, setShowModal] = useState(false);
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

  const [isPlatformDeliveryEvent, setIsPlatformDeliveryEvent] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalData, setInfoModalData] = useState<any>(null);

  // State/City dropdown states
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);

  const filteredStates = nigerianStates.filter((state) =>
    state.value.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const selectedState = nigerianStates.find(
    (s) => s.value === (formData as any).state
  );
  const filteredCities = selectedState
    ? selectedState.cities.filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase())
      )
    : [];

  const handleStateSelect = (stateValue: string) => {
    setStateSearch(stateValue);
    setFormData((prev) => ({ ...prev, state: stateValue }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Fetch event to determine platform delivery presence
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!isClient) return;

        const data = searchParams.get("data");
        if (!data) return;

        let parsedData: any = null;
        try {
          parsedData = JSON.parse(data);
        } catch (err) {
          console.error("Failed to parse 'data' search param:", err);
          return;
        }

        const id = parsedData?.event;
        if (!id) return;

        const res = await axiosInstance.get(`/view-event/${id}`);
        setIsPlatformDeliveryEvent(Boolean(res.data?.data?.isPlatformDelivery));
      } catch (e) {
        console.error("fetchEvent error:", e);
      }
    };

    fetchEvent();
  }, [isClient, searchParams]);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateInputRef.current &&
        !stateInputRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setStateDropdownOpen(false);
        setCityDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


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
  console.log("data from query params:", parsedData.event);

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

    const cleanObject = (obj: Record<string, any>) =>
      Object.fromEntries(
        Object.entries(obj).filter(([_k, v]) => v !== null && v !== undefined && v !== "")
      );

    
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
          // If platform delivery not part of event, submit immediately
          if (!isPlatformDeliveryEvent) {
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
            return;
          }

          // For platform delivery events, show modal with appropriate message
          const selectedState = (formData as any).state;
          const coveredStates = ["Lagos", "Oyo", "Abuja", "Osun", "Ogun"];
          const isCovered = coveredStates.includes(selectedState);

          if (isCovered) {
            setInfoModalData({
              title: "Some of your guest addresses may fall outside our delivery partner’s coverage.",
              des: "In such cases, our internal team will work with you directly to arrange delivery to those specific guests.",
              actionBtnTxt: "Continue",
              isCovered: true
            });
          // Log modal shown with state/city
          trackEvent("Host Pickup Disclaimer Shown", {
            event_id: eventDetails?.event_id,
            state: (formData as any).state,
            city: (formData as any).city,
          });
          } else {
            setInfoModalData({
              title: `We are currently unable to cover ${selectedState}`,
              des: `Platform delivery is currently not available in ${selectedState}, Please choose self-managed delivery under packages creation in groups to continue.`,
              actionBtnTxt: "Go To Groups",
              isCovered: false
            });
            // Log modal shown with state/city
            trackEvent("Host Pickup Disclaimer Shown", {
              event_id: eventDetails?.event_id,
              state: (formData as any).state,
              city: (formData as any).city,
            });
          }

          setShowInfoModal(true);
          return;
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

  const handleCancel = () => setShowModal(true);
  const callSaveForLater = () => {
    // setShowModal(false);
    handleSaveForLater();
  };

  const handleDiscard = () => {
    // setShowModal(false);
    router.push("/dashboard/events");
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
    <section className="!overflow-hidden relative">
      <div
        className="fixed top-16 w-[90%] md:w-[80%] h-auto py-3 bg-gray-100"
        id="back-button"
      >
        <button className="w-[20%] md:w-[5%] cursor-pointer flex flex-row items-center" onClick={() => window.history.back()}>
          <ChevronLeft className="w-6 h-6 " />
          <span className="font-medium text-base text-[#111827] ml-1">Back</span>
        </button>
      </div>
      <div className="mt-6 pb-20 lg:py-10 px-3 sm:px-4 mx-auto max-w-screen-md h-[98vh] overflow-y-auto no-scrollbar">
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
                    className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer z-30"
                    size={20}
                  />
                  <input
                    type="text"
                    id="pickupLocation"
                    placeholder="Click the map icon to add address"
                    // disabled
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input-field placeholder:text-[15px] outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
                    required
                  />
                  {errors.pickupLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
                  )}
                </div>
              </div>

              {/* State and City Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="home-state" className="block mb-2 font-semibold text-[#111827]">State</label>
                  <input
                    id="home-state"
                    ref={stateInputRef}
                    name="state"
                    type="text"
                    autoComplete="new-state"
                    placeholder="Search states..."
                    spellCheck="false"
                    autoCorrect="off"
                    className="w-full px-3 h-12 py-2 rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFA] outline-none"
                    value={stateSearch}
                    required
                    onChange={(e) => setStateSearch(e.target.value)}
                    onClick={() => setStateDropdownOpen(true)}
                  />
                  {stateDropdownOpen && (
                    <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
                      {filteredStates.map((state) => (
                        <div
                          key={state.value}
                          className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => {
                            handleStateSelect(state.value);
                            setStateDropdownOpen(false);
                          }}
                        >
                          {state.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="home-city" className="block mb-2 font-semibold text-[#111827]">City</label>
                  <input
                    id="home-city"
                    ref={cityInputRef}
                    name="city"
                    type="text"
                    autoComplete="new-city"
                    placeholder="Search cities..."
                    spellCheck="false"
                    autoCorrect="off"
                    required
                    className="w-full h-12 rounded-[8px] px-3 py-2 border border-[#E5E7EB] bg-[#FAFAFA] text-sm outline-none"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setCityDropdownOpen(true);
                    }}
                    onClick={() => setCityDropdownOpen((prev) => !prev)}
                  />
                  {cityDropdownOpen && (
                    <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
                      {filteredCities.map((city) => (
                        <div
                          key={city}
                          className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => {
                            setCitySearch(city);
                            setFormData((prev) => ({ ...(prev as any), city }));
                            setCityDropdownOpen(false);
                          }}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
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
        {showInfoModal && infoModalData && (
          <InfoModal
            title={infoModalData.title}
            des={infoModalData.des}
            actionBtnTxt={infoModalData.actionBtnTxt}
            loading={loading}
            handleActionBtn={async () => {
              // Host clicked Continue on modal
              trackEvent("Host Pickup Disclaimer - Continue", {
                event_id: eventDetails?.event_id,
                state: (formData as any).state,
                city: (formData as any).city,
              });
              setShowInfoModal(false);
              if (infoModalData.isCovered) {
                // Continue: submit the form (same as non-platform flow)
                try {
                  setLoading(true);
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
                } catch (err: any) {
                  if (axios.isAxiosError(err)) {
                    toast.error(err.response?.data?.message || "An error occurred. Please try again.");
                  }
                } finally {
                  setLoading(false);
                }
              } else {
                // Go To Groups
                const eventId = localStorage.getItem("eventId");
                router.push(`/dashboard/events/${eventId}`);
              }
            }}
            handleClose={() => setShowInfoModal(false)}
          />
        )}
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
      </ section>
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




























// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { MapPin } from "lucide-react";
// import { AiOutlineClockCircle } from "react-icons/ai";
// import { PiCalendarMinus } from "react-icons/pi";
// import toast from "react-hot-toast";
// import { BiLoaderCircle } from "react-icons/bi";
// import PhoneNumberInput from "@/components/PhoneNumberInput";
// import axiosInstance from "@/lib/axiosInstance";
// import { useCallback } from "react";
// import { debounce } from "lodash";
// import Container from "@/components/dashboard/Container";
// import dynamic from "next/dynamic";
// import axios from "axios";
// import { trackEvent } from "@/lib/mixpanel";
// import { EventDetails } from "@/app/(pages)/pickup-details/PickupDetailsContent";
// import { ChevronLeft } from 'lucide-react';

// const PickupDeliveryLoationPicker = dynamic(
//   () => import("@/components/aboutEvent/PickupDeliveryLoationPicker"),
//   { ssr: false }
// );

// const PickupDetails = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [debouncedAddress, setDebouncedAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [showModal, setShowModal] = useState(false);
//   const [isSaveLoading, setIsSaveLoading] = useState(false);
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);
//   const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
//   const [formData, setFormData] = useState({
//     nairaAccount: {
//       accountNumber: "",
//       accountName: "",
//       bankName: "",
//     },
//     dollarAccount: {
//       usAccountNumber: "",
//       routingNumber: "",
//       usBankName: "",
//       usAccountName: "",
//     },
//     isDraft: false,
//     paymentDate: new Date(),
//     paymentTime: new Date(),
//     paymentTimeZone: "WAT",
//     contactName: "",
//     contactPhoneNumber: "",
//     pickupLocation: "",
//     pickupLatitude: "",
//     pickupLongitude: "",
//     deliveryDate: new Date(),
//     deliveryTime: new Date(),
//     deliveryTimeZone: "WAT",
//   });

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsClient(true);
//     }
//   }, []);

//   useEffect(() => {
//     const stored = localStorage.getItem("parsedEventDetails");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         setEventDetails(parsed);
//       } catch (error) {
//         console.error("Failed to parse event details:", error);
//       }
//     }
//   }, []);

//   const today = new Date();

//   const validTimeZones = [
//     "UTC",
//     "GMT",
//     "WAT",
//     "CAT",
//     "EAT",
//     "PST",
//     "CST",
//     "EST",
//     "MST",
//     "AKST",
//     "HST",
//     "IST",
//     "CET",
//     "EET",
//     "BST",
//     "AST",
//     "NST",
//     "JST",
//     "KST",
//     "AEST",
//     "ACST",
//     "AWST",
//   ];

  
// // Refactor validateForm to use useCallback
// const validateForm = useCallback(() => {
//   const { contactName, contactPhoneNumber, pickupLocation, deliveryDate, deliveryTime } = formData;
//   const isValid =
//     contactName.trim() !== "" &&
//     contactPhoneNumber.trim() !== "" &&
//     pickupLocation.trim() !== "" &&
//     deliveryDate instanceof Date &&
//     deliveryTime instanceof Date;
//   setIsFormValid(isValid);
// }, [formData]);

// useEffect(() => {
//   const handler = setTimeout(() => {
//     if (formData.pickupLocation.trim() !== "") {
//       setErrors(prev => ({ ...prev, pickupLocation: "" }));
//     }
//   }, 500);
  
//   return () => clearTimeout(handler);
// }, [formData.pickupLocation]);

//   // Debounce the address input
//   useEffect(() => {
//     const handler = debounce(() => {
//       setDebouncedAddress(formData.pickupLocation);
//     }, 500); 

//     if (formData.pickupLocation) {
//       handler();
//     }

//     return () => handler.cancel();
//   }, [formData.pickupLocation]);


// // update the form data with the corresponding latitude and longitude when user type the address
// useEffect(() => {
//   const address = debouncedAddress?.trim();
  
//   const isValidAddress = address && address.length >= 5;
//   const hasNoCoordinates = !formData.pickupLatitude && !formData.pickupLongitude;


//   if (isValidAddress && hasNoCoordinates) {
//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address }, (results, status) => {
//       if (status === "OK" && results && results[0]) {
//         const location = results[0].geometry.location;
//         setFormData((prev) => ({
//           ...prev,
//           pickupLatitude: location.lat().toString(),
//           pickupLongitude: location.lng().toString()
//         }));
//       } else {
//         console.error("Geocode failed: " + status);
//       }
//     });
//   }
// }, [debouncedAddress, formData.pickupLatitude, formData.pickupLongitude]);

// const toDateString = (dateInput: string | Date | undefined): string | undefined => {
//   if (!dateInput) return undefined;

//   const date = new Date(dateInput);
//   if (isNaN(date.getTime())) return undefined;

//   const year = date.getFullYear();
//   const month = `${date.getMonth() + 1}`.padStart(2, "0");
//   const day = `${date.getDate()}`.padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };



// // Retrieve formData from query parameters
// useEffect(() => {
//   if (!isClient) return;

//   const data = searchParams.get("data");
//   if (data) {
//     try {
//       const parsedData = JSON.parse(data);
//       setEventDetails(parsedData);

//       // Convert time string like "10:40AM" to a Date object
//       const convertToDate = (timeStr: string | undefined): Date | undefined => {
//         if (!timeStr) return undefined;

//         // Use today's date
//         const today = new Date().toISOString().split("T")[0]; // "2025-06-04"
//         const dateTimeString = `${today} ${timeStr}`;

//         const parsed = new Date(dateTimeString);

//         return isNaN(parsed.getTime()) ? undefined : parsed;
//       };
      

//       setFormData((prev) => ({
//         ...prev,
//         ...parsedData,
//         nairaAccount: { ...prev.nairaAccount, ...parsedData.nairaAccount },
//         dollarAccount: { ...prev.dollarAccount, ...parsedData.dollarAccount },
//         paymentDate: toDateString(parsedData.paymentDate) ? new Date(parsedData.paymentDate) : prev.paymentDate,
//         paymentTime: convertToDate(parsedData.paymentTime) || prev.paymentTime,
//         deliveryDate: parsedData.deliveryDate ? new Date(parsedData.deliveryDate) : prev.deliveryDate,
//         deliveryTime: convertToDate(parsedData.deliveryTime) || prev.deliveryTime,
//       }));
//     } catch (error) {
//       console.error("Error parsing form data:", error);
//     }
//   }
// }, [searchParams, isClient]);

// // Validate form whenever formData changes
// useEffect(() => {
//   validateForm();
// }, [formData, validateForm]);

//   const handleDateChange = (date: Date | null, field: string) => {
//     if (date) setFormData((prev) => ({ ...prev, [field]: date }));
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     setErrors((prev) => ({ ...prev, [id]: "" }));
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     if (!value.trim()) {
//       setErrors((prev) => ({ ...prev, [id]: "This field is required" }));
//     }
//   };

//   // Helper function to format a Date object to a 12-hour time string.
//   const formatTime12Hour = (date: Date): string => {
//     if (isNaN(date.getTime())) {
//       // Return a fallback value if the date is invalid
//       return "12:00 AM";
//     }
//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12; 
//     const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
//     const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
//     return `${paddedHours}:${paddedMinutes} ${ampm}`;
//   };

  
//     const isFilled = (obj: Record<string, any>) =>
//       Object.values(obj).some((val) => val && val.toString().trim() !== "");

    
//     const pickupAddress = formData.pickupLocation;
//     const parts = pickupAddress.split(',').map(part => part.trim());

//     // Safely get the second-to-the-last item
//     const pickupRegion = parts.length >= 2 ? parts[parts.length - 2] : "";
  
//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!isFormValid) return;
//       console.log(eventDetails)
    
//       setLoading(true);
    
//       const cleanObject = (obj: Record<string, any>) =>
//         Object.fromEntries(
//           Object.entries(obj).filter(
//             ([_, v]) => v !== null && v !== undefined && v !== ""
//           )
//         );
//       try {
//         const { nairaAccount, dollarAccount, ...rest } = formData;
    
//         const formattedData = {
//           ...rest,
//           ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
//           ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
//           deliveryDate:
//             formData.deliveryDate instanceof Date
//               ? formData.deliveryDate.toISOString().split("T")[0]
//               : "",
//           deliveryTime:
//             formData.deliveryTime instanceof Date
//               ? formatTime12Hour(formData.deliveryTime)
//               : "",
//           paymentTime:
//             formData.paymentTime instanceof Date
//               ? formatTime12Hour(formData.paymentTime)
//               : "",
//           paymentDate:
//             formData.paymentDate instanceof Date
//               ? `${formData.paymentDate.getFullYear()}-${(formData.paymentDate.getMonth() + 1).toString().padStart(2, "0")}-${formData.paymentDate.getDate().toString().padStart(2, "0")}`
//               : "",            
//         };
    
//         const cleanedData = cleanObject(formattedData);
//         // console.log("cleanedData",cleanedData)
    
//         await axiosInstance.post("/add-payment", cleanedData);
//         toast.success("Details submitted successfully!");
//         trackEvent("Add Pickup Information", {
//             source: "Pickup-details Page",
//             timestamp: new Date().toISOString(),
//             page_name: "add pickup page",
//             event_id: eventDetails?.event_id,
//             event_name: eventDetails?.event_name,
//             pickup_region: pickupRegion,
//             status: "Successful"
//           });
//         router.push("/dashboard/events");
//       } catch (error: any) {
//         trackEvent("Add Pickup Information Failed", {
//           source: "Pickup-details Page",
//           timestamp: new Date().toISOString(),
//           page_name: "add pickup page",
//           event_id: eventDetails?.event_id,
//           event_name: eventDetails?.event_name,
//           pickup_region: pickupRegion,
//           status: "Failed"
//         });
//         if (axios.isAxiosError(error)) {
//           const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
//           toast.error(errorMessage);
//         }
//       } finally {
//         setLoading(false); 
//       }
//     };
    
//   /**
//    * Handles saving form data for later completion
//    */
//   const handleSaveForLater = async () => {
//     setIsSaveLoading(true);

//     const authToken = localStorage.getItem("authToken");
//     if (!authToken) {
//       setIsSaveLoading(false);
//       return;
//     }
  
//     try {
//       const { nairaAccount, dollarAccount, ...rest } = formData;
//       const fullFormData = {
//         ...rest,
//         ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
//         ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
//         paymentTime: formatTime12Hour(formData.paymentTime),
//         isDraft: true
//       };
  
//       await axiosInstance.post(`/payment-save-for-later`, fullFormData);
//       toast.success("Saved! Continue from your dashboard.");
//       router.push("/dashboard/events");
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to save event");
//     } finally {
//       setIsSaveLoading(false);
//     }
//   };

//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   const handleCancel = () => setShowModal(true);
//   const callSaveForLater = () => {
//     // setShowModal(false);
//     handleSaveForLater();
//   };

//   const handleDiscard = () => {
//     // setShowModal(false);
//     router.push("/dashboard/events");
//   };

    
//   if (!isClient) {
//     return null; 
//   }
//   return (
//     <Container>
//     {showMapPickerModal && (
//         <PickupDeliveryLoationPicker
//           onLocationSelect={(location) => {
//             setFormData({ ...formData, 
//               pickupLocation: location.address,
//               pickupLatitude: location?.lat?.toString(),
//               pickupLongitude: location?.lng?.toString()
//             });
//             setShowMapPickerModal(false);
//           }}
//           onCancel={() => setShowMapPickerModal(false)}
//         />
//       )}
//     <section className="!overflow-hidden relative">
//       <div
//         className="fixed top-16 w-[90%] md:w-[80%] h-auto py-3 bg-gray-100"
//         id="back-button"
//       >
//         <button className="w-[20%] md:w-[5%] cursor-pointer flex flex-row items-center" onClick={() => window.history.back()}>
//           <ChevronLeft className="w-6 h-6 " />
//           <span className="font-medium text-base text-[#111827] ml-1">Back</span>
//         </button>
//       </div>
//       <div className="mt-6 pb-20 lg:py-10 px-3 sm:px-4 mx-auto max-w-screen-md h-[98vh] overflow-y-auto no-scrollbar">
//         <div className="mt-3">
//           <div className="mb-5">
//             <h4 id="deliveryDetailsHeader" className="text-2xl font-semibold text-[#111827] mb-2">
//               Pickup Details
//             </h4>
//             <span id="deliveryDetailsDesc" className="text-sm text-[#718096] font-medium">
//               Add pickup contact details and when you want to start the delivery
//             </span>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="bg-[#FFFFFF] grid grid-cols-1 gap-6 p-5 rounded-xl">
//               <div className="flex flex-col">
//                 <label htmlFor="contactName" className="block mb-2 font-semibold text-[#111827]">
//                   Contact Name
//                 </label>
//                 <input
//                   type="text"
//                   id="contactName"
//                   placeholder="Enter the name of the contact person"
//                   value={formData.contactName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
//                 />
//                 {errors.contactName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
//                 )}
//               </div>

//               <div className="flex flex-col" id="contactPhoneNumber">
//                 <label htmlFor="contactPhoneNumber" className="block mb-2 font-semibold text-[#111827]">
//                   Contact Phone Number
//                 </label>
//                 <div className="pb-3 w-full">
//                   <PhoneNumberInput
//                     onPhoneChange={(value: string) => {
//                       setFormData((prev) => ({ ...prev, contactPhoneNumber: value }));
//                       setErrors((prev) => ({ ...prev, contactPhoneNumber: "" }));
//                     }}
//                   />
//                 </div>
//                 {errors.contactPhone && (
//                   <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
//                 )}
//               </div>

//               <div className="flex flex-col -mt-5">
//                 <label htmlFor="pickupLocation" className="block mb-2 font-semibold text-[#111827]">
//                   Pickup Location
//                 </label>
//                 <div className="relative">
//                   <MapPin
//                     onClick={handleMapLocationSelect}
//                     className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer z-30"
//                     size={20}
//                   />
//                   <input
//                     type="text"
//                     id="pickupLocation"
//                     placeholder="Click the map icon to add address"
//                     // disabled
//                     value={formData.pickupLocation}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="input-field placeholder:text-[15px] outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
//                     required
//                   />
//                   {errors.pickupLocation && (
//                     <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex flex-col">
//                   <label htmlFor="deliveryDate" className="block mb-2 font-semibold text-[#111827]">
//                     Pickup Start Date
//                   </label>
//                   <div className="relative">
//                     <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
//                     <div className="bg-[#FAFAFA]">
//                       <DatePicker
//                         selected={formData.deliveryDate}
//                         minDate={today}
//                         id="deliveryDate"
//                         onChange={(date) => handleDateChange(date, "deliveryDate")}
//                         dateFormat="yyyy-MM-dd"
//                         className="pl-10 px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
//                         popperClassName="custom-datepicker"
//                       />
//                     </div>
//                   </div>
//                   {errors.deliveryDate && (
//                     <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="deliveryTime" className="block mb-2 font-semibold text-[#111827]">
//                     Time
//                   </label>
//                   <div className="flex space-x-3">
//                     <div className="relative">
//                       <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
//                       <DatePicker
//                         selected={formData.deliveryTime}
//                         id="deliveryTime"
//                         onChange={(date) => handleDateChange(date, "deliveryTime")}
//                         showTimeSelect
//                         showTimeSelectOnly
//                         timeIntervals={15}
//                         timeCaption="Time"
//                         dateFormat="hh:mm aa"
//                         popperClassName="custom-datepicker"
//                         className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[8px] bg-slate-50"
//                       />
//                     </div>
//                     <select
//                       id="deliveryTimeZone"
//                       value={formData.deliveryTimeZone}
//                       onChange={handleChange}
//                       className="px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
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
//             {/* Save and continue */}
          
//             <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
//               <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
//                 <button
//                   id="cancel"
//                   type="button"
//                   disabled={loading}
//                   onClick={handleCancel}
//                   className="py-3 px-8 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!isFormValid}
//                   className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
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
//         </div>
//          {showModal && (
//         <div
//           // onClick={handleCloseModal}
//           className="fixed inset-0 px-6 bg-black bg-opacity-40 flex items-center justify-center z-[999]"
//         >
//           <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-[8px] p-8 shadow-lg max-w-md w-full">
//                {/* Close icon */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-4 text-xl text-black-100 hover:text-gray-800"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold hidden md:block">
//               What would you like to do?
//             </h2>
//             <p className="mb-6 text-gray-600 hidden md:block">
//               {" "}
//               You can save your progress and come back later, or discard this
//               event creation.
//             </p>
//             <div className="flex flex-col md:flex-row gap-4 justify-end">
//               <button
//                 onClick={callSaveForLater}
//                 disabled={isSaveLoading}
//                 className="w-full md:p-3 md:border border-[#111827] md:rounded-[12px] font-medium text-left md:text-center text-[#000] whitespace-nowrap"
//               >
//                 {isSaveLoading ? "saving..." : "Save for later"}
//               </button>
//               <button
//                 onClick={handleDiscard}
//                 className="w-full md:bg-primary text-red-500 md:text-white md:p-3 md:rounded-[12px] hover:text-red-800 transition flex items-center md:justify-center font-medium whitespace-nowrap"
//               >
//                 Discard event creation
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       </div>
//       </ section>
//       </Container>
//   );
// };

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
//       <PickupDetails />
//     </Suspense>
//   );
// }

