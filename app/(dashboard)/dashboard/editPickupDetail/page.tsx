// app/(your-path)/editPickupDetail@page.tsx
"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin } from "lucide-react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { PiCalendarMinus } from "react-icons/pi";
import { BiLoaderCircle } from "react-icons/bi";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import axiosInstance from "@/lib/axiosInstance";
import { debounce } from "lodash";
import Container from "@/components/dashboard/Container";
import dynamic from "next/dynamic";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { nigerianStates } from "@/utils/data";
import { trackEvent } from "@/lib/mixpanel";
import InfoModal from "@/components/modals/InfoModal";

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
  const [isPlatformDeliveryEvent, setIsPlatformDeliveryEvent] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalData, setInfoModalData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    contactName: "",
    contactPhoneNumber: "",
    pickupLocation: "",
    pickupLatitude: "",
    pickupLongitude: "",
    deliveryDate: new Date(),
    deliveryTime: new Date(),
    deliveryTimeZone: "WAT",
    state: "",
    city: ""
  });

  // State/City visible inputs
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);

  // Filter states based on stateSearch
  const filteredStates = nigerianStates.filter((state) =>
    state.value.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Determine selected state based on the visible stateSearch (case-insensitive exact match)
  const selectedState = nigerianStates.find(
    (s) => s.value.toLowerCase() === stateSearch.toLowerCase()
  );

  // Filter cities from selectedState, or empty if none
  const filteredCities = selectedState
    ? selectedState.cities.filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase())
      )
    : [];

  // When user selects a state from dropdown
  const handleStateSelect = (stateValue: string) => {
    // set both visible input and the form model
    setStateSearch(stateValue);
    setFormData((prev: any) => ({ ...prev, state: stateValue, city: "" }));
    // clear city visible search
    setCitySearch("");
    setCityDropdownOpen(false);
  };

  // When user selects a city from dropdown
  const handleCitySelect = (cityValue: string) => {
    setCitySearch(cityValue);
    setFormData((prev: any) => ({ ...prev, city: cityValue }));
    setCityDropdownOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Fetch event to determine platform delivery availability
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const id = localStorage.getItem("eventId") || firstEventId;
        if (!id) return;
        const res = await axiosInstance.get(`/view-event/${id}`);
        setIsPlatformDeliveryEvent(res.data?.data?.isPlatformDelivery);
      } catch (e) {
        console.log(e);
        // ignore
      }
    };

    fetchEvent();
  }, [firstEventId]);

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

    const timeParts = timeString.match(/(\d+):(\d+) (AM|PM)/i);
    if (!timeParts) return null;

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const period = timeParts[3].toUpperCase();

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const timeDate = new Date(referenceDate);
    timeDate.setHours(hours, minutes, 0, 0);
    return timeDate;
  };

  // Fetch existing delivery data and populate form + visible inputs
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setIsLoadingPaymentData(true);
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
        const response = await axiosInstance.get(`/view-a-payment/${eventIdToUse}`);
        const deliveryData = response.data.data;

        const hasDeliveryData = [
          deliveryData?.contactName,
          deliveryData?.contactPhoneNumber,
          deliveryData?.pickupLocation,
          deliveryData?.pickupLatitude,
          deliveryData?.pickupLongitude,
          deliveryData?.deliveryDate,
          deliveryData?.deliveryTime,
          deliveryData?.deliveryTimeZone
        ].some((field) => field !== undefined && field !== null && field !== "");

        if (!hasDeliveryData) {
          setIsLoadingPaymentData(false);
          return;
        }

        setFormData((prev: any) => ({
          ...prev,
          contactName: deliveryData.contactName || prev.contactName,
          contactPhoneNumber: deliveryData.contactPhoneNumber || prev.contactPhoneNumber,
          pickupLocation: deliveryData.pickupLocation || prev.pickupLocation,
          pickupLatitude: deliveryData.pickupLatitude || prev.pickupLatitude,
          pickupLongitude: deliveryData.pickupLongitude || prev.pickupLongitude,
          state: deliveryData.state || prev.state,
          city: deliveryData.city || prev.city,
          deliveryDate: parseAPIDate(deliveryData.deliveryDate) || prev.deliveryDate,
          deliveryTime: parseAPITime(deliveryData.deliveryTime) || prev.deliveryTime,
          deliveryTimeZone: deliveryData.deliveryTimeZone || prev.deliveryTimeZone
        }));

        // populate visible inputs so they are editable immediately
        if (deliveryData.state) setStateSearch(deliveryData.state);
        if (deliveryData.city) setCitySearch(deliveryData.city);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoadingPaymentData(false);
      }
    };

    fetchDeliveryData();
  }, [firstEventId]);

  // keep form validation in a stable callback
  const validateForm = useCallback(() => {
    const {
      contactName,
      contactPhoneNumber,
      pickupLocation,
      deliveryDate,
      deliveryTime
    } = formData;
    const isValid =
      contactName?.toString().trim() !== "" &&
      contactPhoneNumber?.toString().trim() !== "" &&
      pickupLocation?.toString().trim() !== "" &&
      deliveryDate instanceof Date &&
      deliveryTime instanceof Date &&
      (formData.state?.toString().trim() !== "") && // require state and city
      (formData.city?.toString().trim() !== "");
    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedAddress(formData.pickupLocation);
    }, 500);

    if (formData.pickupLocation) {
      handler();
    }

    return () => handler.cancel();
  }, [formData.pickupLocation]);

  // Close dropdowns when clicking outside each input separately
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (stateInputRef.current && !stateInputRef.current.contains(target)) {
        setStateDropdownOpen(false);
      }
      if (cityInputRef.current && !cityInputRef.current.contains(target)) {
        setCityDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // geocode address only if no coordinates; keep your json google usage unchanged
  useEffect(() => {
    const address = debouncedAddress?.trim();

    const isValidAddress = address && address.length >= 5;
    const hasNoCoordinates = !formData.pickupLatitude && !formData.pickupLongitude;

    if (isValidAddress && hasNoCoordinates && typeof (window as any).google !== "undefined") {
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          setFormData((prev: any) => ({
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

  // Revalidate form whenever formData changes
  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) setFormData((prev: any) => ({ ...prev, [field]: date }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    // only update by id for inputs that have id set (e.g. contactName, pickupLocation, deliveryTimeZone)
    setFormData((prev: any) => ({ ...prev, [id]: value }));
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

    if (!isPlatformDeliveryEvent) {
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
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||error?.message ||
            "An error occurred. Please try again.";
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    const selectedStateVal = formData.state;
    const coveredStates = ["Lagos", "Oyo", "Osun", "Ogun", "Fct"];
    const isCovered = coveredStates.includes(selectedStateVal);

    if (isCovered) {
      setInfoModalData({
        title: "Some of your guest addresses may fall outside our delivery partner’s coverage.",
        des: "In such cases, our internal team will work with you directly to arrange delivery to those specific guests.",
        actionBtnTxt: "Save",
        isCovered: true
      });
      trackEvent("Host Pickup Disclaimer Shown", {
        event_id: localStorage.getItem("eventId") || firstEventId,
        state: formData.state,
        city: formData.city
      });
    } else {
      setInfoModalData({
        title: `We are currently unable to cover ${selectedStateVal}`,
        des: `Platform delivery is currently not available in ${selectedStateVal}, Please choose self-managed delivery under packages creation in groups to continue.`,
        actionBtnTxt: "Go To Groups",
        isCovered: false
      });
      trackEvent("Host Pickup Disclaimer Shown", {
        event_id: localStorage.getItem("eventId") || firstEventId,
        state: formData.state,
        city: formData.city
      });
    }

    setShowInfoModal(true);
  };

  const handleCancel = async () => {
    router.back();
  };

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

  if (!isClient) return null;

  return (
    <Container>
      {showInfoModal && infoModalData && (
        <InfoModal
          title={infoModalData.title}
          des={infoModalData.des}
          actionBtnTxt={infoModalData.actionBtnTxt}
          loading={loading}
          handleActionBtn={async () => {
            trackEvent("Host Pickup Disclaimer - Continue", {
              event_id: localStorage.getItem("eventId") || firstEventId,
              state: formData.state,
              city: formData.city
            });
            setShowInfoModal(false);
            if (infoModalData.isCovered) {
              try {
                setLoading(true);
                const storedEventId = localStorage.getItem("eventId");
                const formattedData = {
                  ...formData,
                  deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
                  deliveryTime: formatTime12Hour(formData.deliveryTime)
                };
                await axiosInstance.put(`/update/${storedEventId}`, formattedData);
                toast.success("Details saved");
                router.back();
              } catch (err) {
                console.log(err);
              } finally {
                setLoading(false);
              }
            } else {
              const eventId = localStorage.getItem("eventId") || firstEventId;
              router.push(`/dashboard/events/${eventId}`);
            }
          }}
          handleClose={() => setShowInfoModal(false)}
        />
      )}
      <ToastContainer />
      {showMapPickerModal && (
        <PickupDeliveryLoationPicker
          onLocationSelect={(location: any) => {
            setFormData((prev: any) => ({
              ...prev,
              pickupLocation: location.address,
              pickupLatitude: location?.lat?.toString(),
              pickupLongitude: location?.lng?.toString()
            }));
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}

      <div className="pb-24 lg:py-24 px-6 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar relative">
        <div className="mt-3">
          <div className="mb-5">
            <h4 className="text-2xl font-semibold text-[#111827] mb-2">
              Pickup Details
            </h4>
            <span className="text-sm text-[#718096] font-medium">
              Add pickup contact details and when you want to start the delivery
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-[#FFFFFF] grid grid-cols-1 gap-6 p-5 rounded-xl">
              {/* Contact Name */}
              <div className="flex flex-col">
                <label htmlFor="contactName" className="block mb-2 font-semibold text-[#111827]">Contact Name</label>
                <input
                  type="text"
                  id="contactName"
                  placeholder="Enter the name of the contact person"
                  value={formData.contactName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                />
                {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
              </div>

              {/* Phone */}
              <div className="flex flex-col" id="contactPhoneNumber">
                <label htmlFor="contactPhoneNumber" className="block mb-2 font-semibold text-[#111827]">Contact Phone Number</label>
                <div className="pb-3 w-full">
                  <PhoneNumberInput
                    onPhoneChange={(value: string) => {
                      setFormData((prev: any) => ({ ...prev, contactPhoneNumber: value }));
                      setErrors((prev) => ({ ...prev, contactPhoneNumber: "" }));
                    }}
                    phoneValue={formData.contactPhoneNumber}
                  />
                </div>
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>

              {/* Pickup location */}
              <div className="flex flex-col -mt-5">
                <label htmlFor="pickupLocation" className="block mb-2 font-semibold text-[#111827]">Pickup Location</label>
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
                    value={formData.pickupLocation}
                    onChange={(e) => {
                      setFormData((prev: any) => ({ ...prev, pickupLocation: e.target.value }));
                      setErrors((prev) => ({ ...prev, pickupLocation: "" }));
                    }}
                    onBlur={handleBlur}
                    className="input-field placeholder:text-[15px] outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
                    required
                  />
                  {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                </div>
              </div>

              {/* State & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State */}
                <div className="relative">
                  <label htmlFor="home-state" className="block mb-2 font-semibold text-[#111827]">State</label>
                  <div ref={stateInputRef}>
                    <input
                      id="home-state"
                      name="state"
                      type="text"
                      autoComplete="new-state"
                      placeholder="Search states..."
                      spellCheck="false"
                      autoCorrect="off"
                      className="w-full px-3 h-12 py-2 rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFA] outline-none"
                      value={stateSearch}
                      required
                      onChange={(e) => {
                        const v = e.target.value;
                        setStateSearch(v);
                        // update formData.state as user types (so the form model always reflects the visible text)
                        setFormData((prev: any) => ({ ...prev, state: v }));
                        setStateDropdownOpen(true);
                      }}
                      onClick={() => setStateDropdownOpen(true)}
                    />
                  </div>

                  {stateDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
                      {filteredStates.length > 0 ? (
                        filteredStates.map((state) => (
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
                        ))
                      ) : (
                        <div className="px-3 py-3 text-sm text-gray-500">No state found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="relative">
                  <label htmlFor="home-city" className="block mb-2 font-semibold text-[#111827]">City</label>
                  <div ref={cityInputRef}>
                    <input
                      id="home-city"
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
                        const v = e.target.value;
                        setCitySearch(v);
                        setFormData((prev: any) => ({ ...prev, city: v }));
                        setCityDropdownOpen(true);
                      }}
                      onClick={() => setCityDropdownOpen((prev) => !prev)}
                    />
                  </div>

                  {cityDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <div
                            key={city}
                            className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                            onClick={() => handleCitySelect(city)}
                          >
                            {city}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-sm text-gray-500">No city found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Date / Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="deliveryDate" className="block mb-2 font-semibold text-[#111827]">Pickup Start Date</label>
                  <div className="relative">
                    <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                    <div className="bg-[#FAFAFA]">
                      <DatePicker
                        selected={formData.deliveryDate}
                        minDate={today}
                        id="deliveryDate"
                        onChange={(date: any) => handleDateChange(date, "deliveryDate")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-10 px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
                  </div>
                  {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="deliveryTime" className="block mb-2 font-semibold text-[#111827]">Time</label>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
                      <DatePicker
                        selected={formData.deliveryTime}
                        id="deliveryTime"
                        onChange={(date: any) => handleDateChange(date, "deliveryTime")}
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
                      onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, deliveryTimeZone: e.target.value }))
                      }
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

            {/* Footer buttons */}
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
                  className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? <BiLoaderCircle className="animate-spin mr-2" size={22} /> : "Save"}
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





























// "use client";

// import { useState, useEffect, Suspense, useRef } from "react";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { MapPin } from "lucide-react";
// import { AiOutlineClockCircle } from "react-icons/ai";
// import { PiCalendarMinus } from "react-icons/pi";
// import { BiLoaderCircle } from "react-icons/bi";
// import PhoneNumberInput from "@/components/PhoneNumberInput";
// import axiosInstance from "@/lib/axiosInstance";
// import { useCallback } from "react";
// import { debounce } from "lodash";
// import Container from "@/components/dashboard/Container";
// import dynamic from "next/dynamic";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { nigerianStates } from "@/utils/data";
// import { trackEvent } from "@/lib/mixpanel";
// import InfoModal from "@/components/modals/InfoModal";

// const PickupDeliveryLoationPicker = dynamic(
//   () => import("@/components/aboutEvent/PickupDeliveryLoationPicker"),
//   { ssr: false }
// );

// const PickupDetails = () => {
//   const router = useRouter();
//   const firstEventId =
//     typeof window !== "undefined" ? localStorage.getItem("eventId") : null;

//   const [debouncedAddress, setDebouncedAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isLoadingPaymentData, setIsLoadingPaymentData] = useState(false);
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);
//   const [noGroup, setNoGroup] = useState(false);
//   const [isPlatformDeliveryEvent, setIsPlatformDeliveryEvent] = useState(true);
//   const [showInfoModal, setShowInfoModal] = useState(false);
//   const [infoModalData, setInfoModalData] = useState<any>(null);
//   const [formData, setFormData] = useState({
//     contactName: "",
//     contactPhoneNumber: "",
//     pickupLocation: "",
//     pickupLatitude: "",
//     pickupLongitude: "",
//     deliveryDate: new Date(),
//     deliveryTime: new Date(),
//     deliveryTimeZone: "WAT"
//   });

//   // State/City dropdown states (mirrors delivery-details page behavior)
//   const [stateSearch, setStateSearch] = useState("");
//   const [citySearch, setCitySearch] = useState("");
//   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
//   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
//   const stateInputRef = useRef<HTMLInputElement | null>(null);
//   const cityInputRef = useRef<HTMLInputElement | null>(null);

//   const filteredStates = nigerianStates.filter((state) =>
//     state.value.toLowerCase().includes(stateSearch.toLowerCase())
//   );

//   const selectedState = nigerianStates.find(
//     (s) => s.value === (formData as any).state
//   );
//   const filteredCities = selectedState
//     ? selectedState.cities.filter((city) =>
//         city.toLowerCase().includes(citySearch.toLowerCase())
//       )
//     : [];

//   // Show modal when a state is selected if conditions match
//   const handleStateSelect = (stateValue: string) => {
//     setStateSearch(stateValue);
//     setFormData((prev) => ({ ...(prev as any), state: stateValue }));
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsClient(true);
//     }
//   }, []);

//   // Fetch event details to determine whether platform delivery is available
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const id = localStorage.getItem("eventId") || firstEventId;
//         if (!id) return;
//         const res = await axiosInstance.get(`/view-event/${id}`);
//         setIsPlatformDeliveryEvent(res.data?.data?.isPlatformDelivery);
//       } catch (e) {
//         console.log(e)
//         // ignore
//       }
//     };

//     fetchEvent();
//   }, [firstEventId]);

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
//     "AWST"
//   ];

//   // Add these helper functions near your other utility functions
//   const parseAPIDate = (dateString: string | undefined): Date | null => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? null : date;
//   };

//   const parseAPITime = (
//     timeString: string | undefined,
//     referenceDate: Date = new Date()
//   ): Date | null => {
//     if (!timeString) return null;

//     // Parse time in "08:36 AM" format
//     const timeParts = timeString.match(/(\d+):(\d+) (AM|PM)/i);
//     if (!timeParts) return null;

//     let hours = parseInt(timeParts[1], 10);
//     const minutes = parseInt(timeParts[2], 10);
//     const period = timeParts[3].toUpperCase();

//     // Convert 12-hour to 24-hour format
//     if (period === "PM" && hours < 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;

//     const timeDate = new Date(referenceDate);
//     timeDate.setHours(hours, minutes, 0, 0);
//     return timeDate;
//   };
//   useEffect(() => {
//     const fetchDeliveryData = async () => {
//       try {
//         const storedEventId = localStorage.getItem("eventId");
//         const groupLength = localStorage.getItem("groupLength");

//         if (!storedEventId && !firstEventId) {
//           setIsLoadingPaymentData(false);
//           return;
//         }

//         if (groupLength === "0") {
//           setNoGroup(true);
//         }

//         const eventIdToUse = storedEventId || firstEventId;
//         const response = await axiosInstance.get(
//           `/view-a-payment/${eventIdToUse}`
//         );
//         const deliveryData = response.data.data;

//         // Check if delivery data exists
//         const hasDeliveryData = [
//           deliveryData?.contactName,
//           deliveryData?.contactPhoneNumber,
//           deliveryData?.pickupLocation,
//           deliveryData?.pickupLatitude,
//           deliveryData?.pickupLongitude,
//           deliveryData?.deliveryDate,
//           deliveryData?.deliveryTime,
//           deliveryData?.deliveryTimeZone
//         ].some(
//           (field) => field !== undefined && field !== null && field !== ""
//         );

//         if (!hasDeliveryData) {
//           // toast.error("Record not found");
//           setIsLoadingPaymentData(false);
//           return;
//         }

//         setFormData((prev) => ({
//           ...prev,
//           contactName: deliveryData.contactName || prev.contactName,
//           contactPhoneNumber:
//             deliveryData.contactPhoneNumber || prev.contactPhoneNumber,
//           pickupLocation: deliveryData.pickupLocation || prev.pickupLocation,
//           pickupLatitude: deliveryData.pickupLatitude || prev.pickupLatitude,
//           pickupLongitude: deliveryData.pickupLongitude || prev.pickupLongitude,
//           // populate state and city if present in delivery data
//           state: deliveryData.state || (prev as any).state,
//           city: deliveryData.city || (prev as any).city,
//           deliveryDate:
//             parseAPIDate(deliveryData.deliveryDate) || prev.deliveryDate,
//           deliveryTime:
//             parseAPITime(deliveryData.deliveryTime) || prev.deliveryTime,
//           deliveryTimeZone:
//             deliveryData.deliveryTimeZone || prev.deliveryTimeZone
//         }));
//         // Also populate the visible search inputs so the dropdowns show current values
//         if (deliveryData.state) setStateSearch(deliveryData.state);
//         if (deliveryData.city) setCitySearch(deliveryData.city);
//       } catch (error: any) {
//         console.log(error);
//         // toast.error(error.response?.data?.message || "Please try again.");
//       } finally {
//         setIsLoadingPaymentData(false);
//       }
//     };

//     fetchDeliveryData();
//   }, [firstEventId]);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       if (formData.pickupLocation.trim() !== "") {
//         setErrors((prev) => ({ ...prev, pickupLocation: "" }));
//       }
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [formData.pickupLocation]);

//   // Ensure the state/city search inputs show values when formData already has them
//   useEffect(() => {
//     const currentState = (formData as any).state;
//     const currentCity = (formData as any).city;

//     if (currentState && !stateSearch) setStateSearch(currentState);
//     if (currentCity && !citySearch) setCitySearch(currentCity);
//   }, [formData, stateSearch, citySearch]);

//   // Refactor validateForm to use useCallback
//   const validateForm = useCallback(() => {
//     const {
//       contactName,
//       contactPhoneNumber,
//       pickupLocation,
//       deliveryDate,
//       deliveryTime
//     } = formData;
//     const isValid =
//       contactName.trim() !== "" &&
//       contactPhoneNumber.trim() !== "" &&
//       pickupLocation.trim() !== "" &&
//       deliveryDate instanceof Date &&
//       deliveryTime instanceof Date;
//     setIsFormValid(isValid);
//   }, [formData]);

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

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         stateInputRef.current &&
//         !stateInputRef.current.contains(event.target as Node) &&
//         cityInputRef.current &&
//         !cityInputRef.current.contains(event.target as Node)
//       ) {
//         setStateDropdownOpen(false);
//         setCityDropdownOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // update the form data with the corresponding latitude and longitude when user type the address
//   useEffect(() => {
//     const address = debouncedAddress?.trim();

//     const isValidAddress = address && address.length >= 5;
//     const hasNoCoordinates =
//       !formData.pickupLatitude && !formData.pickupLongitude;

//     if (isValidAddress && hasNoCoordinates) {
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ address }, (results:any, status:any) => {
//         if (status === "OK" && results && results[0]) {
//           const location = results[0].geometry.location;
//           setFormData((prev) => ({
//             ...prev,
//             pickupLatitude: location.lat().toString(),
//             pickupLongitude: location.lng().toString()
//           }));
//         } else {
//           console.error("Geocode failed: " + status);
//         }
//       });
//     }
//   }, [debouncedAddress, formData.pickupLatitude, formData.pickupLongitude]);

//   // Validate form whenever formData changes
//   useEffect(() => {
//     validateForm();
//   }, [formData, validateForm]);

//   const handleDateChange = (date: Date | null, field: string) => {
//     if (date) setFormData((prev) => ({ ...prev, [field]: date }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
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
//   const formatToYYYYMMDD = (date: Date) => date.toISOString().split("T")[0];

//   const formatTime12Hour = (date: Date): string => {
//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12;
//     const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
//     const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
//     return `${paddedHours}:${paddedMinutes} ${ampm}`;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("show platform delivery event", isPlatformDeliveryEvent)
//     if (!isFormValid) return;
//     const storedEventId = localStorage.getItem("eventId");

//     // If platform delivery is not part of the event, proceed to save immediately
//     if (!isPlatformDeliveryEvent) {
//       setLoading(true);
//       try {
//         const formattedData = {
//           ...formData,
//           deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
//           deliveryTime: formatTime12Hour(formData.deliveryTime)
//         };

//         await axiosInstance.put(`/update/${storedEventId}`, formattedData);
//         toast.success("Details submitted successfully!");
//         setTimeout(() => {
//           router.back();
//         }, 1000);
//       } catch (error: any) {
//         if (axios.isAxiosError(error)) {
//           const errorMessage =
//             error.response?.data?.message ||
//             "An error occurred. Please try again.";
//           toast.error(errorMessage);
//         }
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     // For platform delivery events, show the InfoModal on submit
//     const selectedState = (formData as any).state;
//     const coveredStates = ["Lagos", "Oyo", "Abuja", "Osun", "Ogun"];
//     const isCovered = coveredStates.includes(selectedState);

//     if (isCovered) {
//         setInfoModalData({
//               title: "Some of your guest addresses may fall outside our delivery partner’s coverage.",
//               des: "In such cases, our internal team will work with you directly to arrange delivery to those specific guests.",
//               actionBtnTxt: "Save",
//               isCovered: true
//             });
//         trackEvent("Host Pickup Disclaimer Shown", {
//           event_id: localStorage.getItem("eventId") || firstEventId,
//           state: (formData as any).state,
//           city: (formData as any).city,
//         });
//     } else {
//         setInfoModalData({
//               title: `We are currently unable to cover ${selectedState}`,
//               des: `Platform delivery is currently not available in ${selectedState}, Please choose self-managed delivery under packages creation in groups to continue.`,
//               actionBtnTxt: "Go To Groups",
//               isCovered: false
//             });
//         trackEvent("Host Pickup Disclaimer Shown", {
//           event_id: localStorage.getItem("eventId") || firstEventId,
//           state: (formData as any).state,
//           city: (formData as any).city,
//         });
//     }

//     setShowInfoModal(true);
//   };

//   /**
//    * Handles saving form data for later completion
//    */
//   const handleCancel = async () => {
//     router.back();
//   };

//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   if (isLoadingPaymentData) {
//     return (
//       <div className="flex justify-center items-center bg-[#FFFFFF] w-full h-screen">
//         Loading pick-up details...
//       </div>
//     );
//   }

//   if (noGroup) {
//     return (
//       <section className="flex flex-col justify-center items-center bg-white w-full h-screen text-center px-4">
//         <p className="text-lg font-semibold text-red-600">
//           You don’t have any groups yet.
//         </p>
//         <p>
//           Please create a group to get started.{" "}
//           <a
//             href={`/dashboard/events/${firstEventId}`}
//             className="whitespace-nowrap text-blue-600 underline hover:text-blue-800"
//           >
//             Click Here!!
//           </a>
//         </p>
//       </section>
//     );
//   }

//   if (!isClient) {
//     return null;
//   }
//   return (
//     <Container>
//       {showInfoModal && infoModalData && (
//         <InfoModal
//           title={infoModalData.title}
//           des={infoModalData.des}
//           actionBtnTxt={infoModalData.actionBtnTxt}
//           loading={loading}
//           handleActionBtn={async () => {
//             trackEvent("Host Pickup Disclaimer - Continue", {
//               event_id: localStorage.getItem("eventId") || firstEventId,
//               state: (formData as any).state,
//               city: (formData as any).city,
//             });
//             setShowInfoModal(false);
//             if (infoModalData.isCovered) {
//               // Save and continue
//               try {
//                 setLoading(true);
//                 const storedEventId = localStorage.getItem("eventId");
//                 const formattedData = {
//                   ...formData,
//                   deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
//                   deliveryTime: formatTime12Hour(formData.deliveryTime)
//                 };
//                 await axiosInstance.put(`/update/${storedEventId}`, formattedData);
//                 toast.success("Details saved");
//                 // proceed to next step if any — here we go back
//                 router.back();
//               } catch (err) {
//                 // ignore
//                 console.log(err)
//               } finally {
//                 setLoading(false);
//               }
//             } else {
//               // Go To Groups
//               const eventId = localStorage.getItem("eventId") || firstEventId;
//               router.push(`/dashboard/events/${eventId}`);
//             }
//           }}
//           handleClose={() => setShowInfoModal(false)}
//         />
//       )}
//       <ToastContainer />
//       {showMapPickerModal && (
//         <PickupDeliveryLoationPicker
//           onLocationSelect={(location:any) => {
//             setFormData({
//               ...formData,
//               pickupLocation: location.address,
//               pickupLatitude: location?.lat?.toString(),
//               pickupLongitude: location?.lng?.toString()
//             });
//             setShowMapPickerModal(false);
//           }}
//           onCancel={() => setShowMapPickerModal(false)}
//         />
//       )}
//       <div className="pb-24 lg:py-24 px-6 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar relative">
//         <div className="mt-3">
//           <div className="mb-5">
//             <h4
//               id="deliveryDetailsHeader"
//               className="text-2xl font-semibold text-[#111827] mb-2"
//             >
//               Pickup Details
//             </h4>
//             <span
//               id="deliveryDetailsDesc"
//               className="text-sm text-[#718096] font-medium"
//             >
//               Add pickup contact details and when you want to start the delivery
//             </span>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="bg-[#FFFFFF] grid grid-cols-1 gap-6 p-5 rounded-xl">
//               <div className="flex flex-col">
//                 <label
//                   htmlFor="contactName"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
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
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.contactName}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col" id="contactPhoneNumber">
//                 <label
//                   htmlFor="contactPhoneNumber"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Contact Phone Number
//                 </label>
//                 <div className="pb-3 w-full">
//                   <PhoneNumberInput
//                     onPhoneChange={(value: string) => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         contactPhoneNumber: value
//                       }));
//                       setErrors((prev) => ({
//                         ...prev,
//                         contactPhoneNumber: ""
//                       }));
//                     }}
//                     phoneValue={formData.contactPhoneNumber}
//                   />
//                 </div>
//                 {errors.contactPhone && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.contactPhone}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col -mt-5">
//                 <label
//                   htmlFor="pickupLocation"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
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
//                     value={formData.pickupLocation}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="input-field placeholder:text-[15px] outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
//                     required
//                     // disabled
//                   />
//                   {errors.pickupLocation && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.pickupLocation}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* State and City Dropdowns (added to match delivery-details) */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* State Dropdown */}
//                 <div className="relative">
//                   <label
//                     htmlFor="home-state"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     State
//                   </label>
//                   <input
//                     id="home-state"
//                     ref={stateInputRef}
//                     name="state"
//                     type="text"
//                     autoComplete="new-state"
//                     placeholder="Search states..."
//                     spellCheck="false"
//                     autoCorrect="off"
//                     className="w-full px-3 h-12 py-2 rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFA] outline-none"
//                     value={stateSearch}
//                     required
//                     onChange={(e) => {
//                       setStateSearch(e.target.value);
//                     }}
//                     onClick={() => setStateDropdownOpen(true)}
//                   />
//                   {stateDropdownOpen && (
//                     <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
//                       {filteredStates.map((state) => (
//                         <div
//                           key={state.value}
//                           className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
//                           onClick={() => {
//                             handleStateSelect(state.value);
//                             setStateDropdownOpen(false);
//                           }}
//                         >
//                           {state.value}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* City Dropdown */}
//                 <div className="relative">
//                   <label
//                     htmlFor="home-city"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     City
//                   </label>
//                   <input
//                     id="home-city"
//                     ref={cityInputRef}
//                     name="city"
//                     type="text"
//                     autoComplete="new-city"
//                     placeholder="Search cities..."
//                     spellCheck="false"
//                     autoCorrect="off"
//                     required
//                     className="w-full h-12 rounded-[8px] px-3 py-2 border border-[#E5E7EB] bg-[#FAFAFA] text-sm outline-none"
//                     value={citySearch}
//                     onChange={(e) => {
//                       setCitySearch(e.target.value);
//                       setCityDropdownOpen(true);
//                     }}
//                     onClick={() => setCityDropdownOpen((prev) => !prev)}
//                   />
//                   {cityDropdownOpen && (
//                     <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
//                       {filteredCities.map((city) => (
//                         <div
//                           key={city}
//                           className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
//                           onClick={() => {
//                             setCitySearch(city);
//                             setFormData((prev) => ({ ...(prev as any), city }));
//                             setCityDropdownOpen(false);
//                           }}
//                         >
//                           {city}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="deliveryDate"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Pickup Start Date
//                   </label>
//                   <div className="relative">
//                     <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
//                     <div className="bg-[#FAFAFA]">
//                       <DatePicker
//                         selected={formData.deliveryDate}
//                         minDate={today}
//                         id="deliveryDate"
//                         onChange={(date:any) =>
//                           handleDateChange(date, "deliveryDate")
//                         }
//                         dateFormat="yyyy-MM-dd"
//                         className="pl-10 px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
//                         popperClassName="custom-datepicker"
//                       />
//                     </div>
//                   </div>
//                   {errors.deliveryDate && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.deliveryDate}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="deliveryTime"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Time
//                   </label>
//                   <div className="flex space-x-3">
//                     <div className="relative">
//                       <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
//                       <DatePicker
//                         selected={formData.deliveryTime}
//                         id="deliveryTime"
//                         onChange={(date:any) =>
//                           handleDateChange(date, "deliveryTime")
//                         }
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
//             {/* cancel and save*/}

//             <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
//               <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
//                 <button
//                   id="save"
//                   type="button"
//                   className="w-[142.24px] p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//                   onClick={() => handleCancel()}
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
//                     "Save"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
//       <PickupDetails />
//     </Suspense>
//   );
// }

















// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { MapPin } from "lucide-react";
// import { AiOutlineClockCircle } from "react-icons/ai";
// import { PiCalendarMinus } from "react-icons/pi";
// import { BiLoaderCircle } from "react-icons/bi";
// import PhoneNumberInput from "@/components/PhoneNumberInput";
// import axiosInstance from "@/lib/axiosInstance";
// import { useCallback } from "react";
// import { debounce } from "lodash";
// import Container from "@/components/dashboard/Container";
// import dynamic from "next/dynamic";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const PickupDeliveryLoationPicker = dynamic(
//   () => import("@/components/aboutEvent/PickupDeliveryLoationPicker"),
//   { ssr: false }
// );

// const PickupDetails = () => {
//   const router = useRouter();
//   const firstEventId =
//     typeof window !== "undefined" ? localStorage.getItem("eventId") : null;

//   const [debouncedAddress, setDebouncedAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isLoadingPaymentData, setIsLoadingPaymentData] = useState(false);
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);
//   const [noGroup, setNoGroup] = useState(false);
//   const [formData, setFormData] = useState({
//     contactName: "",
//     contactPhoneNumber: "",
//     pickupLocation: "",
//     pickupLatitude: "",
//     pickupLongitude: "",
//     deliveryDate: new Date(),
//     deliveryTime: new Date(),
//     deliveryTimeZone: "WAT"
//   });

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsClient(true);
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
//     "AWST"
//   ];

//   // Add these helper functions near your other utility functions
//   const parseAPIDate = (dateString: string | undefined): Date | null => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? null : date;
//   };

//   const parseAPITime = (
//     timeString: string | undefined,
//     referenceDate: Date = new Date()
//   ): Date | null => {
//     if (!timeString) return null;

//     // Parse time in "08:36 AM" format
//     const timeParts = timeString.match(/(\d+):(\d+) (AM|PM)/i);
//     if (!timeParts) return null;

//     let hours = parseInt(timeParts[1], 10);
//     const minutes = parseInt(timeParts[2], 10);
//     const period = timeParts[3].toUpperCase();

//     // Convert 12-hour to 24-hour format
//     if (period === "PM" && hours < 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;

//     const timeDate = new Date(referenceDate);
//     timeDate.setHours(hours, minutes, 0, 0);
//     return timeDate;
//   };
//   useEffect(() => {
//     const fetchDeliveryData = async () => {
//       try {
//         const storedEventId = localStorage.getItem("eventId");
//         const groupLength = localStorage.getItem("groupLength");

//         if (!storedEventId && !firstEventId) {
//           setIsLoadingPaymentData(false);
//           return;
//         }

//         if (groupLength === "0") {
//           setNoGroup(true);
//         }

//         const eventIdToUse = storedEventId || firstEventId;
//         const response = await axiosInstance.get(
//           `/view-a-payment/${eventIdToUse}`
//         );
//         const deliveryData = response.data.data;

//         // Check if delivery data exists
//         const hasDeliveryData = [
//           deliveryData?.contactName,
//           deliveryData?.contactPhoneNumber,
//           deliveryData?.pickupLocation,
//           deliveryData?.pickupLatitude,
//           deliveryData?.pickupLongitude,
//           deliveryData?.deliveryDate,
//           deliveryData?.deliveryTime,
//           deliveryData?.deliveryTimeZone
//         ].some(
//           (field) => field !== undefined && field !== null && field !== ""
//         );

//         if (!hasDeliveryData) {
//           // toast.error("Record not found");
//           setIsLoadingPaymentData(false);
//           return;
//         }

//         setFormData((prev) => ({
//           ...prev,
//           contactName: deliveryData.contactName || prev.contactName,
//           contactPhoneNumber:
//             deliveryData.contactPhoneNumber || prev.contactPhoneNumber,
//           pickupLocation: deliveryData.pickupLocation || prev.pickupLocation,
//           pickupLatitude: deliveryData.pickupLatitude || prev.pickupLatitude,
//           pickupLongitude: deliveryData.pickupLongitude || prev.pickupLongitude,
//           deliveryDate:
//             parseAPIDate(deliveryData.deliveryDate) || prev.deliveryDate,
//           deliveryTime:
//             parseAPITime(deliveryData.deliveryTime) || prev.deliveryTime,
//           deliveryTimeZone:
//             deliveryData.deliveryTimeZone || prev.deliveryTimeZone
//         }));
//       } catch (error: any) {
//         console.log(error);
//         // toast.error(error.response?.data?.message || "Please try again.");
//       } finally {
//         setIsLoadingPaymentData(false);
//       }
//     };

//     fetchDeliveryData();
//   }, [firstEventId]);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       if (formData.pickupLocation.trim() !== "") {
//         setErrors((prev) => ({ ...prev, pickupLocation: "" }));
//       }
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [formData.pickupLocation]);

//   // Refactor validateForm to use useCallback
//   const validateForm = useCallback(() => {
//     const {
//       contactName,
//       contactPhoneNumber,
//       pickupLocation,
//       deliveryDate,
//       deliveryTime
//     } = formData;
//     const isValid =
//       contactName.trim() !== "" &&
//       contactPhoneNumber.trim() !== "" &&
//       pickupLocation.trim() !== "" &&
//       deliveryDate instanceof Date &&
//       deliveryTime instanceof Date;
//     setIsFormValid(isValid);
//   }, [formData]);

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

//   // update the form data with the corresponding latitude and longitude when user type the address
//   useEffect(() => {
//     const address = debouncedAddress?.trim();

//     const isValidAddress = address && address.length >= 5;
//     const hasNoCoordinates =
//       !formData.pickupLatitude && !formData.pickupLongitude;

//     if (isValidAddress && hasNoCoordinates) {
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ address }, (results, status) => {
//         if (status === "OK" && results && results[0]) {
//           const location = results[0].geometry.location;
//           setFormData((prev) => ({
//             ...prev,
//             pickupLatitude: location.lat().toString(),
//             pickupLongitude: location.lng().toString()
//           }));
//         } else {
//           console.error("Geocode failed: " + status);
//         }
//       });
//     }
//   }, [debouncedAddress, formData.pickupLatitude, formData.pickupLongitude]);

//   // Validate form whenever formData changes
//   useEffect(() => {
//     validateForm();
//   }, [formData, validateForm]);

//   const handleDateChange = (date: Date | null, field: string) => {
//     if (date) setFormData((prev) => ({ ...prev, [field]: date }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
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
//   const formatToYYYYMMDD = (date: Date) => date.toISOString().split("T")[0];

//   const formatTime12Hour = (date: Date): string => {
//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12;
//     const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
//     const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
//     return `${paddedHours}:${paddedMinutes} ${ampm}`;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isFormValid) return;
//     const storedEventId = localStorage.getItem("eventId");

    
//       setLoading(true);
    
//       try {
//         const formattedData = {
//           ...formData,
//           deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
//           deliveryTime: formatTime12Hour(formData.deliveryTime),
//         }
    
//         await axiosInstance.put(`/update/${storedEventId}`, formattedData);
//         toast.success("Details submitted successfully!");

//         setTimeout(() => {
//           router.back();
//         }, 1000);

//       } catch (error: any) {
//         if (axios.isAxiosError(error)) {
//           const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
//           toast.error(errorMessage);
//         }
//       } finally {
//         setLoading(false); 
//     setLoading(true);

//     try {
//       const formattedData = {
//         ...formData,
//         deliveryDate: formatToYYYYMMDD(new Date(formData.deliveryDate)),
//         deliveryTime: formatTime12Hour(formData.deliveryTime)
//       };

//       await axiosInstance.put(`/update/${storedEventId}`, formattedData);
//       toast.success("Details submitted successfully!");
//       setTimeout(() => {
//         router.back();
//       }, 1000);
//       // router.push("/dashboard/events");
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         const errorMessage =
//           error.response?.data?.message ||
//           "An error occurred. Please try again.";
//         toast.error(errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Handles saving form data for later completion
//    */
//   const handleCancel = async () => {
//     router.back();
//     };
//     router.push("/dashboard/events");
//   };

//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   if (isLoadingPaymentData) {
//     return (
//       <div className="flex justify-center items-center bg-[#FFFFFF] w-full h-screen">
//         Loading pick-up details...
//       </div>
//     );
//   }

//   if (noGroup) {
//     return (
//       <section className="flex flex-col justify-center items-center bg-white w-full h-screen text-center px-4">
//         <p className="text-lg font-semibold text-red-600">
//           You don’t have any groups yet.
//         </p>
//         <p>
//           Please create a group to get started.{" "}
//           <a
//             href={`/dashboard/events/${firstEventId}`}
//             className="whitespace-nowrap text-blue-600 underline hover:text-blue-800"
//           >
//             Click Here!!
//           </a>
//         </p>
//       </section>
//     );
//   }

//   if (!isClient) {
//     return null;
//   }
//   return (
//     <Container>
//       <ToastContainer />
//       {showMapPickerModal && (
//         <PickupDeliveryLoationPicker
//           onLocationSelect={(location) => {
//             setFormData({
//               ...formData,
//               pickupLocation: location.address,
//               pickupLatitude: location?.lat?.toString(),
//               pickupLongitude: location?.lng?.toString()
//             });
//             setShowMapPickerModal(false);
//           }}
//           onCancel={() => setShowMapPickerModal(false)}
//         />
//       )}
//       <div className="lg:py-24 px-6 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar relative">
//         <div className="mt-3">
//           <div className="mb-5">
//             <h4
//               id="deliveryDetailsHeader"
//               className="text-2xl font-semibold text-[#111827] mb-2"
//             >
//               Pickup Details
//             </h4>
//             <span
//               id="deliveryDetailsDesc"
//               className="text-sm text-[#718096] font-medium"
//             >
//               Add pickup contact details and when you want to start the delivery
//             </span>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="bg-[#FFFFFF] grid grid-cols-1 gap-6 p-5 rounded-xl">
//               <div className="flex flex-col">
//                 <label
//                   htmlFor="contactName"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
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
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.contactName}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col" id="contactPhoneNumber">
//                 <label
//                   htmlFor="contactPhoneNumber"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Contact Phone Number
//                 </label>
//                 <div className="pb-3 w-full">
//                   <PhoneNumberInput
//                     onPhoneChange={(value: string) => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         contactPhoneNumber: value
//                       }));
//                       setErrors((prev) => ({
//                         ...prev,
//                         contactPhoneNumber: ""
//                       }));
//                     }}
//                     phoneValue={formData.contactPhoneNumber}
//                   />
//                 </div>
//                 {errors.contactPhone && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.contactPhone}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col -mt-5">
//                 <label
//                   htmlFor="pickupLocation"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Pickup Location
//                 </label>
//                 <div className="relative">
//                   <MapPin
//                     onClick={handleMapLocationSelect}
//                     className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
//                     size={20}
//                   />
//                   <input
//                     type="text"
//                     id="pickupLocation"
//                     placeholder="Enter location"
//                     value={formData.pickupLocation}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="input-field outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
//                     required
//                   />
//                   {errors.pickupLocation && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.pickupLocation}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="deliveryDate"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Pickup Start Date
//                   </label>
//                   <div className="relative">
//                     <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
//                     <div className="bg-[#FAFAFA]">
//                       <DatePicker
//                         selected={formData.deliveryDate}
//                         minDate={today}
//                         id="deliveryDate"
//                         onChange={(date) =>
//                           handleDateChange(date, "deliveryDate")
//                         }
//                         dateFormat="yyyy-MM-dd"
//                         className="pl-10 px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
//                         popperClassName="custom-datepicker"
//                       />
//                     </div>
//                   </div>
//                   {errors.deliveryDate && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.deliveryDate}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="deliveryTime"
//                     className="block mb-2 font-semibold text-[#111827]"
//                   >
//                     Time
//                   </label>
//                   <div className="flex space-x-3">
//                     <div className="relative">
//                       <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
//                       <DatePicker
//                         selected={formData.deliveryTime}
//                         id="deliveryTime"
//                         onChange={(date) =>
//                           handleDateChange(date, "deliveryTime")
//                         }
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
//             {/* cancel and save*/}

//             <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
//               <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
//                 <button
//                   id="save"
//                   type="button"
//                   className="w-[142.24px] p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
//                   onClick={handleCancel}
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
//                     "Save"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
//       <PickupDetails />
//     </Suspense>
//   );
// }
