"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin } from "lucide-react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { PiCalendarMinus } from "react-icons/pi";
import { BiLoaderCircle } from "react-icons/bi";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import axiosInstance from "@/lib/axiosInstance";
import { useCallback } from "react";
import { debounce } from "lodash";
import Container from "@/components/dashboard/Container";
import dynamic from "next/dynamic";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const PickupDeliveryLoationPicker = dynamic(
  () => import("@/components/aboutEvent/PickupDeliveryLoationPicker"),
  { ssr: false }
);

const PickupDetails = () => {
  const router = useRouter();
  const firstEventId =
    typeof window !== "undefined" ? localStorage.getItem("eventId") : null;

  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoadingPaymentData, setIsLoadingPaymentData] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [noGroup, setNoGroup] = useState(false);
  const [formData, setFormData] = useState({
    contactName: "",
    contactPhoneNumber: "",
    pickupLocation: "",
    pickupLatitude: "",
    pickupLongitude: "",
    deliveryDate: new Date(),
    deliveryTime: new Date(),
    deliveryTimeZone: "WAT"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
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
    "AWST"
  ];

  // Add these helper functions near your other utility functions
  const parseAPIDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const parseAPITime = (
    timeString: string | undefined,
    referenceDate: Date = new Date()
  ): Date | null => {
    if (!timeString) return null;

    // Parse time in "08:36 AM" format
    const timeParts = timeString.match(/(\d+):(\d+) (AM|PM)/i);
    if (!timeParts) return null;

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const period = timeParts[3].toUpperCase();

    // Convert 12-hour to 24-hour format
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const timeDate = new Date(referenceDate);
    timeDate.setHours(hours, minutes, 0, 0);
    return timeDate;
  };
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const storedEventId = localStorage.getItem("eventId");
        const groupLength = localStorage.getItem("groupLength");

        if (!storedEventId && !firstEventId) {
          setIsLoadingPaymentData(false);
          return;
        }

        if (groupLength === "0") {
          setNoGroup(true);
        }

        const eventIdToUse = storedEventId || firstEventId;
        const response = await axiosInstance.get(
          `/view-a-payment/${eventIdToUse}`
        );
        const deliveryData = response.data.data;

        // Check if delivery data exists
        const hasDeliveryData = [
          deliveryData?.contactName,
          deliveryData?.contactPhoneNumber,
          deliveryData?.pickupLocation,
          deliveryData?.pickupLatitude,
          deliveryData?.pickupLongitude,
          deliveryData?.deliveryDate,
          deliveryData?.deliveryTime,
          deliveryData?.deliveryTimeZone
        ].some(
          (field) => field !== undefined && field !== null && field !== ""
        );

        if (!hasDeliveryData) {
          // toast.error("Record not found");
          setIsLoadingPaymentData(false);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          contactName: deliveryData.contactName || prev.contactName,
          contactPhoneNumber:
            deliveryData.contactPhoneNumber || prev.contactPhoneNumber,
          pickupLocation: deliveryData.pickupLocation || prev.pickupLocation,
          pickupLatitude: deliveryData.pickupLatitude || prev.pickupLatitude,
          pickupLongitude: deliveryData.pickupLongitude || prev.pickupLongitude,
          deliveryDate:
            parseAPIDate(deliveryData.deliveryDate) || prev.deliveryDate,
          deliveryTime:
            parseAPITime(deliveryData.deliveryTime) || prev.deliveryTime,
          deliveryTimeZone:
            deliveryData.deliveryTimeZone || prev.deliveryTimeZone
        }));
      } catch (error: any) {
        console.log(error);
        // toast.error(error.response?.data?.message || "Please try again.");
      } finally {
        setIsLoadingPaymentData(false);
      }
    };

    fetchDeliveryData();
  }, [firstEventId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.pickupLocation.trim() !== "") {
        setErrors((prev) => ({ ...prev, pickupLocation: "" }));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.pickupLocation]);

  // Refactor validateForm to use useCallback
  const validateForm = useCallback(() => {
    const {
      contactName,
      contactPhoneNumber,
      pickupLocation,
      deliveryDate,
      deliveryTime
    } = formData;
    const isValid =
      contactName.trim() !== "" &&
      contactPhoneNumber.trim() !== "" &&
      pickupLocation.trim() !== "" &&
      deliveryDate instanceof Date &&
      deliveryTime instanceof Date;
    setIsFormValid(isValid);
  }, [formData]);

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
    const hasNoCoordinates =
      !formData.pickupLatitude && !formData.pickupLongitude;

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

  // Validate form whenever formData changes
  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
  const formatToYYYYMMDD = (date: Date) => date.toISOString().split("T")[0];

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
    e.preventDefault();
    if (!isFormValid) return;
    const storedEventId = localStorage.getItem("eventId");

<<<<<<< HEAD
    
      setLoading(true);
    
      try {
        const formattedData = {
          ...formData,
          deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
          deliveryTime: formatTime12Hour(formData.deliveryTime),
        }
    
        await axiosInstance.put(`/update/${storedEventId}`, formattedData);
        toast.success("Details submitted successfully!");

        setTimeout(() => {
          router.back();
        }, 1000);

      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false); 
=======
    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
        deliveryTime: formatTime12Hour(formData.deliveryTime)
      };

      await axiosInstance.put(`/update/${storedEventId}`, formattedData);
      toast.success("Details submitted successfully!");
      setTimeout(() => {
        router.back();
      }, 1000);
      // router.push("/dashboard/events");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
>>>>>>> 82147df80b9ba5b29a119c874acf08cc000a6168
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles saving form data for later completion
   */
  const handleCancel = async () => {
<<<<<<< HEAD
    router.back();
    };
=======
    router.push("/dashboard/events");
  };
>>>>>>> 82147df80b9ba5b29a119c874acf08cc000a6168

  const handleMapLocationSelect = () => {
    setShowMapPickerModal(true);
  };

  if (isLoadingPaymentData) {
    return (
      <div className="flex justify-center items-center bg-[#FFFFFF] w-full h-screen">
        Loading pick-up details...
      </div>
    );
  }

  if (noGroup) {
    return (
      <section className="flex flex-col justify-center items-center bg-white w-full h-screen text-center px-4">
        <p className="text-lg font-semibold text-red-600">
          You don’t have any groups yet.
        </p>
        <p>
          Please create a group to get started.{" "}
          <a
            href={`/dashboard/events/${firstEventId}`}
            className="whitespace-nowrap text-blue-600 underline hover:text-blue-800"
          >
            Click Here!!
          </a>
        </p>
      </section>
    );
  }

  if (!isClient) {
    return null;
  }
  return (
    <Container>
      <ToastContainer />
      {showMapPickerModal && (
        <PickupDeliveryLoationPicker
          onLocationSelect={(location) => {
            setFormData({
              ...formData,
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
            <h4
              id="deliveryDetailsHeader"
              className="text-2xl font-semibold text-[#111827] mb-2"
            >
              Pickup Details
            </h4>
            <span
              id="deliveryDetailsDesc"
              className="text-sm text-[#718096] font-medium"
            >
              Add pickup contact details and when you want to start the delivery
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-[#FFFFFF] grid grid-cols-1 gap-6 p-5 rounded-xl">
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

              <div className="flex flex-col" id="contactPhoneNumber">
                <label
                  htmlFor="contactPhoneNumber"
                  className="block mb-2 font-semibold text-[#111827]"
                >
                  Contact Phone Number
                </label>
                <div className="pb-3 w-full">
                  <PhoneNumberInput
                    onPhoneChange={(value: string) => {
                      setFormData((prev) => ({
                        ...prev,
                        contactPhoneNumber: value
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        contactPhoneNumber: ""
                      }));
                    }}
                    phoneValue={formData.contactPhoneNumber}
                  />
                </div>
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactPhone}
                  </p>
                )}
              </div>

              <div className="flex flex-col -mt-5">
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
                    className="input-field outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
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
                    Pickup Start Date
                  </label>
                  <div className="relative">
                    <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                    <div className="bg-[#FAFAFA]">
                      <DatePicker
                        selected={formData.deliveryDate}
                        minDate={today}
                        id="deliveryDate"
                        onChange={(date) =>
                          handleDateChange(date, "deliveryDate")
                        }
                        dateFormat="yyyy-MM-dd"
                        className="pl-10 px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
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
            {/* cancel and save*/}

            <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
              <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
                <button
                  id="save"
                  type="button"
                  className="w-[142.24px] p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
                  onClick={() => handleCancel()}
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
                    "Save"
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
