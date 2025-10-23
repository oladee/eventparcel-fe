"use client";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { useState, useRef, useEffect, Suspense } from "react";
import check from "../../../public/images/check.png";
import uncheck from "../../../public/images/unchecked.png";
import Image from "next/image";
import { nigerianStates } from "@/utils/data";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import { MapPin } from "lucide-react";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import PickupDeliveryLoationPicker from "@/components/aboutEvent/PickupDeliveryLoationPicker";
import { debounce } from "lodash";
import { trackEvent } from "@/lib/mixpanel";
import InfoModal from "@/components/modals/InfoModal";

function DeliveryDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartItems = searchParams.get("cartItems");
  const eventData = searchParams.get("eventData");
  const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
  const parsedEventData = eventData ? JSON.parse(eventData) : [];
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);

  // Extract the packageDelivery array
  const packageDelivery = parsedCartItems
    ?.map((item: any) => item.packageDelivery)
    .flat();

  console.log("Package Delivery Options:", packageDelivery);

  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [dispatchDropdownOpen, setDispatchDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    deliveryType,
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhoneNumber: "",
    shippingAddress: "",
    addressLatitude: "",
    addressLongitude: "",
    state: "",
    city: "",
    dispatchType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const dispatchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredStates = nigerianStates.filter((state) =>
    state.value.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const selectedState = nigerianStates.find(
    (state) => state.value === formData.state
  );
  const filteredCities = selectedState
    ? selectedState.cities.filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase())
      )
    : [];

  // Debounce the address input
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedAddress(formData.shippingAddress);
    }, 500);

    if (formData.shippingAddress) {
      handler();
    }

    return () => handler.cancel();
  }, [formData.shippingAddress]);

  // update the form data with the corresponding latitude and longitude when user type the address
  useEffect(() => {
    const address = debouncedAddress?.trim();

    const isValidAddress = address && address.length >= 5;
    const hasNoCoordinates =
      !formData.addressLatitude && !formData.addressLongitude;

    if (isValidAddress && hasNoCoordinates) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          console.log("status", status);
          console.log("results", results);
          const location = results[0].geometry.location;
          setFormData((prev) => ({
            ...prev,
            addressLatitude: location.lat().toString(),
            addressLongitude: location.lng().toString()
          }));
        } else {
          console.error("Geocode failed: " + status);
        }
      });
    }
  }, [debouncedAddress, formData.addressLatitude, formData.addressLongitude]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDispatchTypeSelection = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      dispatchType: type
    }));
    setDispatchDropdownOpen(false);
  };

  // Map UI selection to backend submission strings (component scope)
  // Backend requires camelCase, no-space strings: pickUp, platformDelivery, selfManagedDelivery
  const mapSelectionToSubmission = (sel: string) => {
    if (!sel) return "";
    if (sel === "pickup") return "pickUp";
    if (sel === "platformDelivery") return "platformDelivery";
    if (sel === "selfManaged") return "selfManagedDelivery";
    if (sel === "home") {
      const needsPlatform = packageDelivery?.some((pd: string) => pd === "homeDelivery:platformDelivery" || pd === "platformDelivery");
      const needsSelf = packageDelivery?.some((pd: string) => pd === "homeDelivery:selfManaged" || pd === "selfManaged");
      if (needsPlatform) return "platformDelivery";
      if (needsSelf) return "selfManagedDelivery";
      // default home fallback — prefer platformDelivery
      return "platformDelivery";
    }
    return "";
  };

  const perItemMethodFromSelection = (sel: string) => {
    const submission = mapSelectionToSubmission(sel);
    // For per-item deliveryMethod, backend expects camelCase no-space keys too
    if (submission === "pickUp") return "pickUp";
    if (submission === "platformDelivery") return "platformDelivery";
    if (submission === "selfManagedDelivery") return "selfManagedDelivery";
    return "pickUp";
  };

  // When guest clicks Platform Delivery, show the coverage InfoModal before finalizing
  const handlePlatformDeliveryClick = () => {
    // Immediately mark platform delivery selection so the form shows the state/city inputs
    setDeliveryType("platformDelivery");
    setFormData((prev) => ({ ...prev, deliveryType: "platformDelivery" }));

    const state = formData.state;
    const coveredStates = ["Lagos", "Oyo", "Abuja", "Osun", "Ogun"];

    // If state is not selected yet, show a friendly modal prompting the user to pick a state
    if (!state) {
      setGuestInfoModalData({
        title: "Some of your guest addresses may fall outside our delivery partner’s coverage.",
        des: "Please select your state on the form to check if we cover it. You can continue and provide your state now.",
        actionBtnTxt: "Continue",
        isCovered: true,
        context: "selection",
      });
    } else {
      const isCovered = coveredStates.includes(state);
      setGuestInfoModalData({
        title: isCovered
          ? "Some of your guest addresses may fall outside our delivery partner’s coverage."
          : `We are currently unable to cover ${state}`,
        des: isCovered
          ? "In such cases, our internal team will work with you directly to arrange delivery to those specific guests."
          : `Platform delivery is currently not available in ${state}. Please choose pickup or choose another address.`,
        actionBtnTxt: isCovered ? "Continue" : "Go Back",
        isCovered,
        context: "selection",
      });
    }

    trackEvent("Guest Delivery Disclaimer Shown", {
      state: formData.state,
      city: formData.city,
    });

    setShowGuestInfoModal(true);
  };

  //validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Common validations for both delivery types
    if (!formData.guestFirstName)
      errors.guestFirstName = "First name is required";
    if (!formData.guestLastName) errors.guestLastName = "Last name is required";

    if (!formData.guestEmail) {
      errors.guestEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
      errors.guestEmail = "Invalid email format";
    }

    // Home delivery specific validations
    if (deliveryType === "home") {
      if (!formData.shippingAddress)
        errors.shippingAddress = "Address is required";
      if (!formData.state) errors.state = "State is required";
      if (!formData.city) errors.city = "City is required";

      const includesPlatformDelivery = 
        packageDelivery.includes("homeDelivery:platformDelivery") || 
        packageDelivery.includes("platformDelivery");

      if (includesPlatformDelivery && !formData.dispatchType) {
        errors.dispatchType = "Dispatch type is required for platform delivery";
      }
    }

    return errors;
  };

  // Handle input change
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [id]: "This field is required" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { deliveryType } = formData;

      // Validate required fields based on delivery type
      if (deliveryType === "home") {
        const includesPlatformDelivery = 
          packageDelivery.includes("homeDelivery:platformDelivery") || 
          packageDelivery.includes("platformDelivery");
        
        if (
          !formData.guestFirstName ||
          !formData.guestLastName ||
          !formData.guestEmail ||
          !formData.guestPhoneNumber ||
          !formData.shippingAddress ||
          !formData.state ||
          !formData.city ||
          (includesPlatformDelivery && !formData.dispatchType)
        ) {
          throw new Error("Please fill all required fields");
        }
      } else {
        if (
          !formData.guestFirstName ||
          !formData.guestLastName ||
          !formData.guestEmail ||
          !formData.guestPhoneNumber
        ) {
          throw new Error("Please fill all required fields");
        }
      }

      // Remove empty or null fields
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_key, value]) =>
            value !== null && value !== "" && value !== undefined
        )
      );
// Use the component-scope mapping helpers (mapSelectionToSubmission and perItemMethodFromSelection)
// so the submission payload uses the backend-expected labels.

// Construct payload
const submissionDeliveryType = mapSelectionToSubmission(deliveryType || formData.deliveryType || "");
const submissionData = {
  ...cleanedFormData,
  items: parsedCartItems.map((item: any) => ({
    packageId: item._id,
    quantity: item.quantity,
    deliveryMethod: perItemMethodFromSelection(deliveryType || formData.deliveryType || "")
  })),
  deliveryType: submissionDeliveryType
};

      // Check platform coverage for home delivery when platform delivery is required by package
      const includesPlatformDelivery = 
        packageDelivery.includes("homeDelivery:platformDelivery") || 
        packageDelivery.includes("platformDelivery");

      // If platform delivery is required, ensure state is supported. If unsupported, show modal and DO NOT call backend.
      if (includesPlatformDelivery && (deliveryType === "home" || deliveryType === "platformDelivery")) {
        const coveredStates = ["Lagos", "Oyo", "Abuja", "Osun", "Ogun"];
        if (!formData.state) {
          // Prompt user to select state before proceeding
          setErrors((prev) => ({ ...prev, state: "State is required" }));
          setIsSubmitting(false);
          return;
        }

        const isCovered = coveredStates.includes(formData.state);
        if (!isCovered) {
          // Show modal informing guest platform delivery not available and prevent backend call
          setGuestInfoModalData({
            title: `We are currently unable to cover ${formData.state}`,
            des: `Platform delivery is currently not available in ${formData.state}. Please choose pickup or choose another address.`,
            actionBtnTxt: "Go Back",
            isCovered: false,
            context: "submission",
          });
          setShowGuestInfoModal(true);
          trackEvent("Guest Delivery Disclaimer Shown", {
            state: formData.state,
            city: formData.city,
            context: "submission",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const res = await axiosInstance.post(
        `/guest-checkout/${parsedEventData?.eventId}/${parsedEventData?.eventGroupId}`,
        submissionData
      );

      const successCheckout = JSON.parse(localStorage.getItem('checkoutPackageOrder') || '{}');
      trackEvent("Checkout started", {
        ...successCheckout.data,
        guestFirstName: formData.guestFirstName,
        guestLastName: formData.guestLastName,
        guestEmail: formData.guestEmail,
        guestPhoneNumber: formData.guestPhoneNumber,
      });
      
      const query = new URLSearchParams({
        orderData: JSON.stringify(res.data)
      }).toString();
      

      router.push(`/guest-payment-details?${query}`);
    } catch (err:any) {
      console.error("Submission error:", err);
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guest InfoModal state and handlers
  const [showGuestInfoModal, setShowGuestInfoModal] = useState(false);
  const [guestInfoModalData, setGuestInfoModalData] = useState<any>(null);

  // Initialize deliveryType based on packageDelivery contents
  useEffect(() => {
    console.log("Initializing delivery type with:", packageDelivery);
    
    const hasHomeDelivery = 
      packageDelivery.includes("homeDelivery:platformDelivery") ||
      packageDelivery.includes("homeDelivery:selfManaged") ||
      packageDelivery.includes("platformDelivery") || 
      packageDelivery.includes("selfManaged");
    
    const hasPickup = packageDelivery.includes("pickUp");

    if (hasHomeDelivery && hasPickup) {
      setDeliveryType((prevType) => prevType || "home");
    } else if (hasHomeDelivery) {
      setDeliveryType((prevType) => prevType || "home");
    } else if (hasPickup) {
      setDeliveryType("pickup");
    } else {
      setDeliveryType("");
    }
  }, [packageDelivery]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      deliveryType: deliveryType
    }));
  }, [deliveryType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateInputRef.current &&
        !stateInputRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node) &&
        dispatchInputRef.current &&
        !dispatchInputRef.current.contains(event.target as Node)
      ) {
        setStateDropdownOpen(false);
        setCityDropdownOpen(false);
        setDispatchDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMapLocationSelect = () => {
    setShowMapPickerModal(true);
  };

  return (
    <>
      <ToastContainer />
      <HeaderLayout>
        {showMapPickerModal && (
          <PickupDeliveryLoationPicker
            onLocationSelect={(location) => {
              setFormData((prev) => ({
                ...prev,
                shippingAddress: location.address,
                addressLatitude: location?.lat?.toString(),
                addressLongitude: location?.lng?.toString(),
              }));
            
              // Clear the address error if present
              setErrors((prev) => {
                const updated = { ...prev };
                if (updated.shippingAddress) {
                  delete updated.shippingAddress;
                }
                return updated;
              });
            
              setShowMapPickerModal(false);
            }}
            onCancel={() => setShowMapPickerModal(false)}
          />
        )}
        <div className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20">
          <div className="p-6 mt-5 bg-[#FFFFFF] rounded-[16px]">
            <h2 className="font-bold text-xl text-[#111827]">
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="w-[311px]">
                <label className="text-base font-medium text-[#718096] mt-6 mb-3 block">
                  Delivery Type
                </label>
                <div className="flex justify-between gap-3">
                  {/* Home Delivery Button */}
                  {(packageDelivery.includes("homeDelivery:platformDelivery") ||
                    packageDelivery.includes("homeDelivery:selfManaged")) && (
                    <button
                      type="button"
                      onClick={() => setDeliveryType("home")}
                      className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
                        deliveryType === "home"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={deliveryType === "home" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      Home Delivery
                    </button>
                  )}
                  
                  {/* Platform Delivery Button */}
                  {(packageDelivery.includes("platformDelivery") || 
                    packageDelivery.includes("homeDelivery:platformDelivery")) && (
                    <button
                      type="button"
                      onClick={handlePlatformDeliveryClick}
                      className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
                        deliveryType === "platformDelivery"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={deliveryType === "platformDelivery" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      Platform Delivery
                    </button>
                  )}

                  {/* Self Managed Button */}
                  {(packageDelivery.includes("selfManaged") || 
                    packageDelivery.includes("homeDelivery:selfManaged")) && (
                    <button
                      type="button"
                      onClick={() => setDeliveryType("selfManaged")}
                      className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
                        deliveryType === "selfManaged"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={deliveryType === "selfManaged" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      Self Managed
                    </button>
                  )}

                  {/* Pickup Button */}
                  {packageDelivery.includes("pickUp") && (
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
                        deliveryType === "pickup"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={deliveryType === "pickup" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      Pickup
                    </button>
                  )}
                </div>
              </div>

              {/* Show home delivery form for both "home" and specific home delivery types */}
              {(deliveryType === "home" || deliveryType === "platformDelivery" || deliveryType === "selfManaged") ? (
                /* Home Delivery Form */
                <div className="grid gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="home-first-name"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      First Name
                    </label>
                    <input
                      id="home-first-name"
                      name="guestFirstName"
                      required
                      value={formData.guestFirstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
                        errors.guestFirstName
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
                    />
                    {errors.guestFirstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="home-last-name"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Last Name
                    </label>
                    <input
                      id="home-last-name"
                      name="guestLastName"
                      required
                      value={formData.guestLastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
                        errors.guestLastName
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
                    />
                    {errors.guestLastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestLastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="home-email"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Email
                    </label>
                    <input
                      id="home-email"
                      name="guestEmail"
                      type="email"
                      required
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
                        errors.guestEmail
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
                    />
                    {errors.guestEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="home-phone"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      onPhoneChange={(value: string) =>
                        handleChange("guestPhoneNumber", value)
                      }
                    />
                    {errors.guestPhoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestPhoneNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="pickupLocation"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Address
                    </label>
                    <div className="relative">
                      <MapPin
                        onClick={handleMapLocationSelect}
                        className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer z-30"
                        size={20}
                      />
                      <input
                        type="text"
                        id="shippingAddress"
                        placeholder="Click the map icon to add address"
                        // disabled
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="input-field placeholder:text-[15px] outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
                        required
                      />
                      {errors.shippingAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.shippingAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* State and City Dropdowns */}
                  <div className="grid grid-cols-2 gap-4 relative">
                    {/* State Dropdown */}
                    <div className="relative">
                      <label
                        htmlFor="home-state"
                        className="font-general font-medium text-base block mb-1 text-[#718096]"
                      >
                        State
                      </label>
                      <input
                        id="home-state"
                        ref={stateInputRef}
                        name="state"
                        type="text"
                        autoComplete="new-state"
                        placeholder="Search states..."
                        spellCheck="false"
                        autoCorrect="off"
                        className="w-full px-3 h-14 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] outline-none"
                        value={stateSearch}
                        required
                        onChange={(e) => {
                          setStateSearch(e.target.value);
                        }}
                        onClick={() => setStateDropdownOpen(true)}
                      />
                      {stateDropdownOpen && (
                        <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
                          {filteredStates.map((state) => (
                            <div
                              key={state.value}
                              className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                              onClick={() => {
                                setStateSearch(state.value);
                                setFormData((prev) => ({
                                  ...prev,
                                  state: state.value
                                }));
                                setStateDropdownOpen(false);
                              }}
                            >
                              {state.value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* City Dropdown */}
                    <div className="relative">
                      <label
                        htmlFor="home-city"
                        className="font-general font-medium text-base block mb-1 text-[#718096]"
                      >
                        City
                      </label>
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
                        className="w-full h-14 rounded-[12px] px-3 py-2 border border-[#E5E7EB] bg-[#FAFAFA] text-sm outline-none"
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
                                setFormData((prev) => ({ ...prev, city }));
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

                  {/* Dispatch Type Dropdown - Show for platform delivery types */}
                  {(packageDelivery.includes("homeDelivery:platformDelivery") || 
                    packageDelivery.includes("platformDelivery")) && 
                    (deliveryType === "home" || deliveryType === "platformDelivery") && (
                    <div className="relative">
                      <label
                        htmlFor="home-dispatch-type"
                        className="font-general font-medium text-base block mb-1 text-[#718096]"
                      >
                        Dispatch Type
                      </label>
                      <input
                        id="home-dispatch-type"
                        name="dispatchType"
                        ref={dispatchInputRef}
                        type="text"
                        required
                        placeholder="Select dispatch type"
                        className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                        value={formData.dispatchType}
                        onChange={() => {}}
                        onClick={() =>
                          setDispatchDropdownOpen(!dispatchDropdownOpen)
                        }
                      />
                      {dispatchDropdownOpen && (
                        <div className="absolute left-0 right-0 bg-white border shadow-lg mt-1 rounded-md z-10">
                          <div
                            onClick={() => handleDispatchTypeSelection("Bike")}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            Bike
                          </div>
                          <div
                            onClick={() => handleDispatchTypeSelection("Van")}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            Van
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Pickup Form */
                <div className="grid gap-4 mt-4">
                  <div className="w-[311px] h-[60px] bg-[#FFF7F2] px-3 py-2 rounded-[12px]">
                    <span className="font-general font-medium text-[13px] text-[#718096]">
                      <span className="font-semibold text-[#111827] h-[36px]">
                        P.S {" "}
                      </span>
                      Full pickup details will be shared after payment
                    </span>
                  </div>
                  <div>
                    <label
                      htmlFor="pickup-first-name"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      First Name
                    </label>
                    <input
                      id="pickup-first-name"
                      name="guestFirstName"
                      value={formData.guestFirstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
                        errors.guestFirstName
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
                    />
                    {errors.guestFirstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="pickup-last-name"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Last Name
                    </label>
                    <input
                      id="pickup-last-name"
                      name="guestLastName"
                      value={formData.guestLastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
                        errors.guestLastName
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
                    />
                    {errors.guestLastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestLastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="pickup-email"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Email
                    </label>
                    <input
                      id="pickup-email"
                      name="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
                        errors.guestEmail
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
                    />
                    {errors.guestEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="pickup-phone"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      onPhoneChange={(value: string) =>
                        handleChange("guestPhoneNumber", value)
                      }
                    />
                    {errors.guestPhoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestPhoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="flex justify-center w-full mt-4 py-3 rounded-[8px] bg-[#7A1626] text-white font-semibold"
              >
                {isSubmitting ? (
                  <BiLoaderCircle
                    className="animate-spin h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  <span>Proceed to Payment</span>
                )}
              </button>
            </form>
            {/* Guest Info Modal */}
            {showGuestInfoModal && guestInfoModalData && (
              <InfoModal
                title={guestInfoModalData.title}
                des={guestInfoModalData.des}
                actionBtnTxt={guestInfoModalData.actionBtnTxt}
                loading={false}
                handleActionBtn={async () => {
                  const isSelection = guestInfoModalData?.context === "selection";

                  // Track user action
                  trackEvent(
                    guestInfoModalData.isCovered
                      ? isSelection
                        ? "Guest Delivery Disclaimer - Continue"
                        : "Guest Delivery Disclaimer - Continue"
                      : "Guest Delivery Disclaimer - Go Back",
                    {
                      state: formData.state,
                      city: formData.city,
                    }
                  );

                  setShowGuestInfoModal(false);

                  if (isSelection) {
                    // Finalize selection if covered
                    if (guestInfoModalData.isCovered) {
                      setDeliveryType("platformDelivery");
                      setFormData((prev) => ({ ...prev, deliveryType: "platformDelivery" }));
                    }
                    return;
                  }

                  // Otherwise, run the original submission retry flow
                  if (!guestInfoModalData.isCovered) {
                    // Go back: simply return user to the form (modal closed)
                    return;
                  }

                  try {
                    setIsSubmitting(true);
                    const cleanedFormData = Object.fromEntries(
                      Object.entries(formData).filter(([_key, value]) =>
                        value !== null && value !== "" && value !== undefined
                      )
                    );

                    const submissionData = {
                      ...cleanedFormData,
                      items: parsedCartItems.map((item: any) => ({
                        packageId: item._id,
                        quantity: item.quantity,
                        deliveryMethod: perItemMethodFromSelection(deliveryType || formData.deliveryType || "")
                      })),
                      deliveryType: mapSelectionToSubmission(deliveryType || formData.deliveryType || "")
                    };

                    const res = await axiosInstance.post(
                      `/guest-checkout/${parsedEventData?.eventId}/${parsedEventData?.eventGroupId}`,
                      submissionData
                    );

                    const successCheckout = JSON.parse(localStorage.getItem('checkoutPackageOrder') || '{}');
                    trackEvent("Checkout started", {
                      ...successCheckout.data,
                      guestFirstName: formData.guestFirstName,
                      guestLastName: formData.guestLastName,
                      guestEmail: formData.guestEmail,
                      guestPhoneNumber: formData.guestPhoneNumber,
                    });

                    const query = new URLSearchParams({ orderData: JSON.stringify(res.data) }).toString();
                    router.push(`/guest-payment-details?${query}`);
                  } catch (err:any) {
                    console.error("Submission error:", err);
                    toast.error(err.response?.data?.message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                handleClose={() => setShowGuestInfoModal(false)}
              />
            )}
          </div>
        </div>
      </HeaderLayout>
    </>
  );
}

export default function DeliveryDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeliveryDetailsForm />
    </Suspense>
  );
}




















// "use client";

// import HeaderLayout from "@/components/layout/HeaderLayout";
// import { useState, useRef, useEffect, Suspense } from "react";
// import check from "../../../public/images/check.png";
// import uncheck from "../../../public/images/unchecked.png";
// import Image from "next/image";
// import { nigerianStates } from "@/utils/data";
// import { useRouter, useSearchParams } from "next/navigation";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import { BiLoaderCircle } from "react-icons/bi";
// import { MapPin } from "lucide-react";
// import PhoneNumberInput from "@/components/PhoneNumberInput";
// import PickupDeliveryLoationPicker from "@/components/aboutEvent/PickupDeliveryLoationPicker";
// import { debounce } from "lodash";
// import { trackEvent } from "@/lib/mixpanel";
// import InfoModal from "@/components/modals/InfoModal";

// function DeliveryDetailsForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const cartItems = searchParams.get("cartItems");
//   const eventData = searchParams.get("eventData");
//   const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
//   const parsedEventData = eventData ? JSON.parse(eventData) : [];
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);

//   // Extract the packageDelivery array
//   const packageDelivery = parsedCartItems
//     ?.map((item: any) => item.packageDelivery)
//     .flat();

//     console.log("del",packageDelivery)
//     console.log("del2",packageDelivery)

//   const [debouncedAddress, setDebouncedAddress] = useState("");
//   const [deliveryType, setDeliveryType] = useState("");
//   const [stateSearch, setStateSearch] = useState("");
//   const [citySearch, setCitySearch] = useState("");
//   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
//   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
//   const [dispatchDropdownOpen, setDispatchDropdownOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     deliveryType,
//     guestFirstName: "",
//     guestLastName: "",
//     guestEmail: "",
//     guestPhoneNumber: "",
//     shippingAddress: "",
//     addressLatitude: "",
//     addressLongitude: "",
//     state: "",
//     city: "",
//     dispatchType: ""
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const stateInputRef = useRef<HTMLInputElement | null>(null);
//   const cityInputRef = useRef<HTMLInputElement | null>(null);
//   const dispatchInputRef = useRef<HTMLInputElement | null>(null);

//   const filteredStates = nigerianStates.filter((state) =>
//     state.value.toLowerCase().includes(stateSearch.toLowerCase())
//   );

//   const selectedState = nigerianStates.find(
//     (state) => state.value === formData.state
//   );
//   const filteredCities = selectedState
//     ? selectedState.cities.filter((city) =>
//         city.toLowerCase().includes(citySearch.toLowerCase())
//       )
//     : [];

//   // Debounce the address input
//   useEffect(() => {
//     const handler = debounce(() => {
//       setDebouncedAddress(formData.shippingAddress);
//     }, 500);

//     if (formData.shippingAddress) {
//       handler();
//     }

//     return () => handler.cancel();
//   }, [formData.shippingAddress]);

//   // update the form data with the corresponding latitude and longitude when user type the address
//   useEffect(() => {
//     const address = debouncedAddress?.trim();

//     const isValidAddress = address && address.length >= 5;
//     const hasNoCoordinates =
//       !formData.addressLatitude && !formData.addressLongitude;

//     if (isValidAddress && hasNoCoordinates) {
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ address }, (results, status) => {
//         if (status === "OK" && results && results[0]) {
//           console.log("status", status);
//           console.log("results", results);
//           const location = results[0].geometry.location;
//           setFormData((prev) => ({
//             ...prev,
//             addressLatitude: location.lat().toString(),
//             addressLongitude: location.lng().toString()
//           }));
//         } else {
//           console.error("Geocode failed: " + status);
//         }
//       });
//     }
//   }, [debouncedAddress, formData.addressLatitude, formData.addressLongitude]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDispatchTypeSelection = (type: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       dispatchType: type
//     }));
//     setDispatchDropdownOpen(false);
//   };

//   //validate form
//   const validateForm = () => {
//     const errors: Record<string, string> = {};

//     // Common validations for both delivery types
//     if (!formData.guestFirstName)
//       errors.guestFirstName = "First name is required";
//     if (!formData.guestLastName) errors.guestLastName = "Last name is required";

//     if (!formData.guestEmail) {
//       errors.guestEmail = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
//       errors.guestEmail = "Invalid email format";
//     }

//     // Home delivery specific validations
//   if (deliveryType === "home") {
//       if (!formData.shippingAddress)
//         errors.shippingAddress = "Address is required";
//       if (!formData.state) errors.state = "State is required";
//       if (!formData.city) errors.city = "City is required";

//       const includesPlatformDelivery = packageDelivery.includes("homeDelivery:platformDelivery");

//       if (includesPlatformDelivery && !formData.dispatchType) {
//         errors.dispatchType = "Dispatch type is required for platform delivery";
//       }
//     }

//     return errors;
//   };

//   // Handle input change
//   const handleChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     validateForm();
//   };

//   // const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//   //   const { id, value } = e.target;
//   //   setFormData((prev) => ({ ...prev, [id]: value }));
//   //   setErrors((prev) => ({ ...prev, [id]: "" }));
//   // };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     if (!value.trim()) {
//       setErrors((prev) => ({ ...prev, [id]: "This field is required" }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const { deliveryType } = formData;

//       // Validate required fields based on delivery type
//       if (deliveryType === "home") {
//        const includesPlatformDelivery = packageDelivery.includes("homeDelivery:platformDelivery");
//         if (
//           !formData.guestFirstName ||
//           !formData.guestLastName ||
//           !formData.guestEmail ||
//           !formData.guestPhoneNumber ||
//           !formData.shippingAddress ||
//           !formData.state ||
//           !formData.city ||
//           (includesPlatformDelivery && !formData.dispatchType)
//         ) {
//           throw new Error("Please fill all required fields");
//         }
//       } else {
//         if (
//           !formData.guestFirstName ||
//           !formData.guestLastName ||
//           !formData.guestEmail ||
//           !formData.guestPhoneNumber
//         ) {
//           throw new Error("Please fill all required fields");
//         }
//       }

//       // Remove empty or null fields
//       const cleanedFormData = Object.fromEntries(
//         Object.entries(formData).filter(
//           ([_key, value]) =>
//             value !== null && value !== "" && value !== undefined
//         )
//       );

//       // Construct payload
//       const submissionData = {
//         ...cleanedFormData,
//         items: parsedCartItems.map((item: any) => ({
//           packageId: item._id,
//           quantity: item.quantity,
//           deliveryMethod: deliveryType === "home" ? "homeDelivery" : "pickUp"
//         })),
//         deliveryType: deliveryType === "home" ? "homeDelivery" : "pickUp"
//       };

//       // Check platform coverage for home delivery when platform delivery is required by package
//       const includesPlatformDelivery = packageDelivery.includes("homeDelivery:platformDelivery");

//       // If platform delivery is required, ensure state is supported. If unsupported, show modal.
//       if (includesPlatformDelivery) {
//         const coveredStates = ["Lagos", "Oyo", "Abuja", "Osun", "Ogun"];
//         if (!formData.state) {
//           setErrors((prev) => ({ ...prev, state: "State is required" }));
//           setIsSubmitting(false);
//           return;
//         }
//         const isCovered = coveredStates.includes(formData.state);
//         if (!isCovered) {
//           // Show modal informing guest platform delivery not available
//           setGuestInfoModalData({
//             title: `We are currently unable to cover ${formData.state}`,
//             des: `Platform delivery is currently not available in ${formData.state}. Please choose pickup or choose another address.`,
//             actionBtnTxt: "Go Back",
//             isCovered: false,
//           });
//           setShowGuestInfoModal(true);
//           trackEvent("Guest Delivery Disclaimer Shown", {
//             state: formData.state,
//             city: formData.city,
//           });
//           setIsSubmitting(false);
//           return;
//         }
//       }

//       const res = await axiosInstance.post(
//         `/guest-checkout/${parsedEventData?.eventId}/${parsedEventData?.eventGroupId}`,
//         submissionData
//       );

//       const successCheckout = JSON.parse(localStorage.getItem('checkoutPackageOrder') || '{}');
//       trackEvent("Checkout started", {
//         ...successCheckout.data,
//         guestFirstName: formData.guestFirstName,
//         guestLastName: formData.guestLastName,
//         guestEmail: formData.guestEmail,
//         guestPhoneNumber: formData.guestPhoneNumber,
//       });
      
//       const query = new URLSearchParams({
//         orderData: JSON.stringify(res.data)
//       }).toString();
      

//       router.push(`/guest-payment-details?${query}`);
//     } catch (err:any) {
//       console.error("Submission error:", err);
//       toast.error(err.response?.data?.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Guest InfoModal state and handlers
//   const [showGuestInfoModal, setShowGuestInfoModal] = useState(false);
//   const [guestInfoModalData, setGuestInfoModalData] = useState<any>(null);

//   // Initialize deliveryType based on packageDelivery contents
//   useEffect(() => {
//     if (
//       (packageDelivery.includes("homeDelivery:platformDelivery") ||
//         packageDelivery.includes("homeDelivery:selfManaged")) &&
//       packageDelivery.includes("pickUp")
//     ) {
//       setDeliveryType((prevType) => prevType || "home");
//     } else if (
//       packageDelivery.includes("homeDelivery:platformDelivery") ||
//       packageDelivery.includes("homeDelivery:selfManaged")
//     ) {
//       setDeliveryType((prevType) => prevType || "pickup");
//     } else if (packageDelivery.includes("pickUp")) {
//       setDeliveryType("pickup");
//     } else {
//       setDeliveryType("");
//     }
//   }, [packageDelivery]);

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       deliveryType: deliveryType
//     }));
//   }, [deliveryType]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         stateInputRef.current &&
//         !stateInputRef.current.contains(event.target as Node) &&
//         cityInputRef.current &&
//         !cityInputRef.current.contains(event.target as Node) &&
//         dispatchInputRef.current &&
//         !dispatchInputRef.current.contains(event.target as Node)
//       ) {
//         setStateDropdownOpen(false);
//         setCityDropdownOpen(false);
//         setDispatchDropdownOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   console.log("package delivery", packageDelivery)

//   return (
//     <>
//       <ToastContainer />
//       <HeaderLayout>
//         {showMapPickerModal && (
//           <PickupDeliveryLoationPicker
//           onLocationSelect={(location) => {
//             setFormData((prev) => ({
//               ...prev,
//               shippingAddress: location.address,
//               addressLatitude: location?.lat?.toString(),
//               addressLongitude: location?.lng?.toString(),
//             }));
          
//             // Clear the address error if present
//             setErrors((prev) => {
//               const updated = { ...prev };
//               if (updated.shippingAddress) {
//                 delete updated.shippingAddress;
//               }
//               return updated;
//             });
          
//             setShowMapPickerModal(false);
//           }}
          
//             onCancel={() => setShowMapPickerModal(false)}
//           />
//         )}
//         <div className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20">
//           <div className="p-6 mt-5 bg-[#FFFFFF] rounded-[16px]">
//             <h2 className="font-bold text-xl text-[#111827]">
//               Delivery Details
//             </h2>

//             <form onSubmit={handleSubmit}>
//               <div className="w-[311px]">
//                 <label className="text-base font-medium text-[#718096] mt-6 mb-3 block">
//                   Delivery Type
//                 </label>
//                 <div className="flex justify-between gap-3">
//                   {(packageDelivery.includes("homeDelivery:platformDelivery") ||
//                     packageDelivery.includes("homeDelivery:selfManaged")) && (
//                     <button
//                       type="button"
//                       onClick={() => setDeliveryType("home")}
//                       className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
//                         deliveryType === "home"
//                           ? "border-[#7A1626] bg-[#FDF4F5]"
//                           : "border-[#EEEFF2]"
//                       }`}
//                     >
//                       <Image
//                         src={deliveryType === "home" ? check : uncheck}
//                         alt="check status"
//                         className="w-5 h-5"
//                       />
//                       Home Delivery
//                     </button>
//                   )}
//                   {(packageDelivery.includes("platformDelivery")) && (
//                     <button
//                       type="button"
//                       onClick={() => setDeliveryType("platformDelivery")}
//                       className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
//                         deliveryType === "platformDelivery"
//                           ? "border-[#7A1626] bg-[#FDF4F5]"
//                           : "border-[#EEEFF2]"
//                       }`}
//                     >
//                       <Image
//                         src={deliveryType === "platformDelivery" ? check : uncheck}
//                         alt="check status"
//                         className="w-5 h-5"
//                       />
//                       Platform Delivery
//                     </button>
//                   )}

//                   {(packageDelivery.includes("selfManaged")) && (
//                     <button
//                       type="button"
//                       onClick={() => setDeliveryType("selfManaged")}
//                       className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
//                         deliveryType === "selfManaged"
//                           ? "border-[#7A1626] bg-[#FDF4F5]"
//                           : "border-[#EEEFF2]"
//                       }`}
//                     >
//                       <Image
//                         src={deliveryType === "selfManaged" ? check : uncheck}
//                         alt="check status"
//                         className="w-5 h-5"
//                       />
//                       Self Managed
//                     </button>
//                   )}

//                   {packageDelivery.includes("pickUp") && (
//                     <button
//                       type="button"
//                       onClick={() => setDeliveryType("pickup")}
//                       className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
//                         deliveryType === "pickup"
//                           ? "border-[#7A1626] bg-[#FDF4F5]"
//                           : "border-[#EEEFF2]"
//                       }`}
//                     >
//                       <Image
//                         src={deliveryType === "pickup" ? check : uncheck}
//                         alt="check status"
//                         className="w-5 h-5"
//                       />
//                       Pickup
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {deliveryType === "home" ? (
//                 /* Home Delivery Form */
//                 <div className="grid gap-4 mt-4">
//                   <div>
//                     <label
//                       htmlFor="home-first-name"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       First Name
//                     </label>
//                     <input
//                       id="home-first-name"
//                       name="guestFirstName"
//                       required
//                       value={formData.guestFirstName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your first name"
//                       className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
//                         errors.guestFirstName
//                           ? "border-red-500"
//                           : "border-[#E5E7EB]"
//                       } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     />
//                     {errors.guestFirstName && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestFirstName}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="home-last-name"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Last Name
//                     </label>
//                     <input
//                       id="home-last-name"
//                       name="guestLastName"
//                       required
//                       value={formData.guestLastName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your last name"
//                       className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
//                         errors.guestLastName
//                           ? "border-red-500"
//                           : "border-[#E5E7EB]"
//                       } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     />
//                     {errors.guestLastName && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestLastName}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="home-email"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Email
//                     </label>
//                     <input
//                       id="home-email"
//                       name="guestEmail"
//                       type="email"
//                       required
//                       value={formData.guestEmail}
//                       onChange={handleInputChange}
//                       placeholder="Enter your email address"
//                       className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
//                         errors.guestEmail
//                           ? "border-red-500"
//                           : "border-[#E5E7EB]"
//                       } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     />
//                     {errors.guestEmail && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestEmail}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="home-phone"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Phone Number
//                     </label>
//                     <PhoneNumberInput
//                       onPhoneChange={(value: string) =>
//                         handleChange("guestPhoneNumber", value)
//                       }
//                     />
//                     {errors.guestPhoneNumber && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestPhoneNumber}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex flex-col">
//                     <label
//                       htmlFor="pickupLocation"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Address
//                     </label>
//                     <div className="relative">
//                       <MapPin
//                         onClick={handleMapLocationSelect}
//                         className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer z-30"
//                         size={20}
//                       />
//                       <input
//                         type="text"
//                         id="shippingAddress"
//                         placeholder="Click the map icon to add address"
//                         disabled
//                         name="shippingAddress"
//                         value={formData.shippingAddress}
//                         onChange={handleInputChange}
//                         onBlur={handleBlur}
//                         className="input-field placeholder:text-[15px] outline-primary pl-12 w-full p-2 rounded-[8px] bg-[#FAFAFA]"
//                         required
//                       />
//                       {errors.shippingAddress && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.shippingAddress}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   {/* State and City Dropdowns */}
//                   <div className="grid grid-cols-2 gap-4 relative">
//                     {/* State Dropdown */}
//                     <div className="relative">
//                       <label
//                         htmlFor="home-state"
//                         className="font-general font-medium text-base block mb-1 text-[#718096]"
//                       >
//                         State
//                       </label>
//                       <input
//                         id="home-state"
//                         ref={stateInputRef}
//                         name="state"
//                         type="text"
//                         autoComplete="new-state"
//                         placeholder="Search states..."
//                         spellCheck="false"
//                         autoCorrect="off"
//                         className="w-full px-3 h-14 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] outline-none"
//                         value={stateSearch}
//                         required
//                         onChange={(e) => {
//                           // setStateDropdownOpen(true);
//                           setStateSearch(e.target.value);
//                         }}
//                         // onFocus={() => setStateDropdownOpen(true)}
//                         onClick={() => setStateDropdownOpen(true)}
//                       />
//                       {stateDropdownOpen && (
//                         <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
//                           {filteredStates.map((state) => (
//                             <div
//                               key={state.value}
//                               className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
//                               onClick={() => {
//                                 setStateSearch(state.value);
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   state: state.value
//                                 }));
//                                 setStateDropdownOpen(false);
//                               }}
//                             >
//                               {state.value}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* City Dropdown */}
//                     <div className="relative">
//                       <label
//                         htmlFor="home-city"
//                         className="font-general font-medium text-base block mb-1 text-[#718096]"
//                       >
//                         City
//                       </label>
//                       <input
//                         id="home-city"
//                         ref={cityInputRef}
//                         name="city"
//                         type="text"
//                         autoComplete="new-city"
//                         placeholder="Search cities..."
//                         spellCheck="false"
//                         autoCorrect="off"
//                         required
//                         className="w-full h-14 rounded-[12px] px-3 py-2 border border-[#E5E7EB] bg-[#FAFAFA] text-sm outline-none"
//                         value={citySearch}
//                         onChange={(e) => {
//                           setCitySearch(e.target.value);
//                           setCityDropdownOpen(true);
//                         }}
//                         // onFocus={() => setCityDropdownOpen(true)}
//                         onClick={() => setCityDropdownOpen((prev) => !prev)}
//                       />
//                       {cityDropdownOpen && (
//                         <div className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-[99] rounded-[12px]">
//                           {filteredCities.map((city) => (
//                             <div
//                               key={city}
//                               className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
//                               onClick={() => {
//                                 setCitySearch(city);
//                                 setFormData((prev) => ({ ...prev, city }));
//                                 setCityDropdownOpen(false);
//                               }}
//                             >
//                               {city}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Dispatch Type Dropdown */}
//                   {packageDelivery.includes("homeDelivery:platformDelivery") && <div className="relative">
//                     <label
//                       htmlFor="home-dispatch-type"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Dispatch Type
//                     </label>
//                     <input
//                       id="home-dispatch-type"
//                       name="dispatchType"
//                       ref={dispatchInputRef}
//                       type="text"
//                       required
//                       placeholder="Select dispatch type"
//                       className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
//                       value={formData.dispatchType}
//                       onChange={() => {}}
//                       onClick={() =>
//                         setDispatchDropdownOpen(!dispatchDropdownOpen)
//                       }
//                     />
//                     {dispatchDropdownOpen && (
//                       <div className="absolute left-0 right-0 bg-white border shadow-lg mt-1 rounded-md z-10">
//                         <div
//                           onClick={() => handleDispatchTypeSelection("Bike")}
//                           className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
//                         >
//                           Bike
//                         </div>
//                         <div
//                           onClick={() => handleDispatchTypeSelection("Van")}
//                           className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
//                         >
//                           Van
//                         </div>
//                       </div>
//                     )}
//                   </div>}
//                 </div>
//               ) : (
//                 /* Pickup Form */
//                 <div className="grid gap-4 mt-4">
//                   <div className="w-[311px] h-[60px] bg-[#FFF7F2] px-3 py-2 rounded-[12px]">
//                     <span className="font-general font-medium text-[13px] text-[#718096]">
//                       <span className="font-semibold text-[#111827] h-[36px]">
//                         P.S {" "}
//                       </span>
//                       {/* : The pickup location is{" "}
//                       <span className="font-semibold text-[#111827]">
//                         Lagos
//                       </span> */}
//                       Full pickup details will be shared after payment
//                     </span>
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="pickup-first-name"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       First Name
//                     </label>
//                     <input
//                       id="pickup-first-name"
//                       name="guestFirstName"
//                       value={formData.guestFirstName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your first name"
//                       className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
//                         errors.guestFirstName
//                           ? "border-red-500"
//                           : "border-[#E5E7EB]"
//                       } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     />
//                     {errors.guestFirstName && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestFirstName}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="pickup-last-name"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Last Name
//                     </label>
//                     <input
//                       id="pickup-last-name"
//                       name="guestLastName"
//                       value={formData.guestLastName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your last name"
//                       className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
//                         errors.guestLastName
//                           ? "border-red-500"
//                           : "border-[#E5E7EB]"
//                       } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     />
//                     {errors.guestLastName && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestLastName}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="pickup-email"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Email
//                     </label>
//                     <input
//                       id="pickup-email"
//                       name="guestEmail"
//                       type="email"
//                       value={formData.guestEmail}
//                       onChange={handleInputChange}
//                       placeholder="Enter your email address"
//                       className={`w-full h-14 px-4 py-2 rounded-[12px] border ${
//                         errors.guestEmail
//                           ? "border-red-500"
//                           : "border-[#E5E7EB]"
//                       } bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     />
//                     {errors.guestEmail && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestEmail}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="pickup-phone"
//                       className="font-general font-medium text-base block mb-1 text-[#718096]"
//                     >
//                       Phone Number
//                     </label>
//                     {/* <input
//                     id="pickup-phone"
//                     name="guestPhoneNumber"
//                     value={formData.guestPhoneNumber}
//                     onChange={handleInputChange}
//                     type="tel"
//                     placeholder="Enter your phone number"
//                     className={`w-full h-14 px-4 py-2 rounded-[12px] border ${errors.guestPhoneNumber ? 'border-red-500' : 'border-[#E5E7EB]'} bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]`}
//                     /> */}
//                     <PhoneNumberInput
//                       onPhoneChange={(value: string) =>
//                         handleChange("guestPhoneNumber", value)
//                       }
//                     />
//                     {errors.guestPhoneNumber && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.guestPhoneNumber}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 className="flex justify-center w-full mt-4 py-3 rounded-[8px] bg-[#7A1626] text-white font-semibold"
//               >
//                 {isSubmitting ? (
//                   <BiLoaderCircle
//                     className="animate-spin h-6 w-6"
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   <span>Proceed to Payment</span>
//                 )}
//               </button>
//             </form>
//             {/* Guest Info Modal */}
//             {showGuestInfoModal && guestInfoModalData && (
//               <InfoModal
//                 title={guestInfoModalData.title}
//                 des={guestInfoModalData.des}
//                 actionBtnTxt={guestInfoModalData.actionBtnTxt}
//                 loading={false}
//                 handleActionBtn={async () => {
//                   // Guest clicked Continue/Go Back action
//                   trackEvent(
//                     guestInfoModalData.isCovered ? "Guest Delivery Disclaimer - Continue" : "Guest Delivery Disclaimer - Go Back",
//                     {
//                       state: formData.state,
//                       city: formData.city,
//                     }
//                   );

//                   setShowGuestInfoModal(false);

//                   if (!guestInfoModalData.isCovered) {
//                     // Go back: simply return user to the form (modal closed)
//                     return;
//                   }

//                   // If covered and guest chose to continue, attempt submit again
//                   try {
//                     setIsSubmitting(true);
//                     const cleanedFormData = Object.fromEntries(
//                       Object.entries(formData).filter(([_key, value]) =>
//                         value !== null && value !== "" && value !== undefined
//                       )
//                     );

//                     const submissionData = {
//                       ...cleanedFormData,
//                       items: parsedCartItems.map((item: any) => ({
//                         packageId: item._id,
//                         quantity: item.quantity,
//                         deliveryMethod: deliveryType === "home" ? "homeDelivery" : "pickUp"
//                       })),
//                       deliveryType: deliveryType === "home" ? "homeDelivery" : "pickUp"
//                     };

//                     const res = await axiosInstance.post(
//                       `/guest-checkout/${parsedEventData?.eventId}/${parsedEventData?.eventGroupId}`,
//                       submissionData
//                     );

//                     const successCheckout = JSON.parse(localStorage.getItem('checkoutPackageOrder') || '{}');
//                     trackEvent("Checkout started", {
//                       ...successCheckout.data,
//                       guestFirstName: formData.guestFirstName,
//                       guestLastName: formData.guestLastName,
//                       guestEmail: formData.guestEmail,
//                       guestPhoneNumber: formData.guestPhoneNumber,
//                     });

//                     const query = new URLSearchParams({ orderData: JSON.stringify(res.data) }).toString();
//                     router.push(`/guest-payment-details?${query}`);
//                   } catch (err:any) {
//                     console.error("Submission error:", err);
//                     toast.error(err.response?.data?.message);
//                   } finally {
//                     setIsSubmitting(false);
//                   }
//                 }}
//                 handleClose={() => setShowGuestInfoModal(false)}
//               />
//             )}
//           </div>
//         </div>
//       </HeaderLayout>
//     </>
//   );
// }

// export default function DeliveryDetailsPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <DeliveryDetailsForm />
//     </Suspense>
//   );
// }
