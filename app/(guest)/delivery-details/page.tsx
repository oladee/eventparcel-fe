"use client";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { useState, useRef, useEffect, Suspense, useMemo } from "react";
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
  
  // Fallback delivery options when no cart data is present - Platform, Self-managed and Pickup
  const fallbackDeliveryOptions = [
    "homeDelivery:platformDelivery", 
    "homeDelivery:selfManaged",
    "pickUp"
  ];
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);

  // Extract the packageDelivery array
  let packageDelivery = parsedCartItems?.length > 0 
    ? parsedCartItems.map((item: any) => item.packageDelivery).flat().filter(Boolean)
    : fallbackDeliveryOptions ;

  packageDelivery = packageDelivery.length > 0 ? packageDelivery : fallbackDeliveryOptions; // Ensure we have options to show

  const [debouncedAddress, setDebouncedAddress] = useState("");
  type DeliveryType = "platform" | "selfManaged" | "pickup";

  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<DeliveryType>("platform");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    selectedDeliveryType: '',
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhoneNumber: "",
    shippingAddress: "",
    addressLatitude: "",
    addressLongitude: "",
    state: "",
    city: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);

  const availableDeliveryOptions: DeliveryType[] = useMemo(() => {
    const options: DeliveryType[] = [];

    if (
      packageDelivery.includes("platformDelivery") ||
      packageDelivery.includes("homeDelivery:platformDelivery")
    ) {
      options.push("platform");
    }

    if (
      packageDelivery.includes("selfManaged") ||
      packageDelivery.includes("homeDelivery:selfManaged")
    ) {
      options.push("selfManaged");
    }

    if (packageDelivery.includes("pickUp")) {
      options.push("pickup");
    }

    return options;
  }, [packageDelivery]);

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

  // Map UI selection to backend submission strings (component scope)
  // Backend requires camelCase, no-space strings: pickUp, platformDelivery, selfManagedDelivery
  const perItemMethodFromSelection = (selection: string) => {
    // For multiple selections, we need to determine primary delivery method
    // Priority: platform > selfManaged > pickup
    if (selection =="platform") return "platformDelivery";
    if (selection =="selfManaged") return "selfManagedDelivery";
    if (selection =="pickup") return "pickUp";
    return "pickUp";
  };

  // Handle delivery type selection with validation rules
  const handleSelect = (type: DeliveryType) => {
    console.log('type: ',type)
    if (!availableDeliveryOptions.includes(type)) return;
    setSelectedDeliveryType(type);
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

    // Address validations for platform and self-managed delivery
    if (selectedDeliveryType == "platform" || selectedDeliveryType  == "selfManaged") {
      if (!formData.shippingAddress)
        errors.shippingAddress = "Address is required";
      if (!formData.state) errors.state = "State is required";
      if (!formData.city) errors.city = "City is required";
    }

    // Ensure at least one delivery type is selected
    if (!selectedDeliveryType) {
      errors.deliveryType = "Please select at least one delivery option";
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

    // Check if we need to show delivery area modal for platform/self-managed delivery
    if ((selectedDeliveryType == "platform" || selectedDeliveryType == "selfManaged") && formData.state) {
      const coveredStates = ["Lagos", "Oyo", "Fct", "Osun", "Ogun", "FCT - Abuja","Ondo"];
      const isStateCovered = coveredStates.includes(formData.state);
      
      // Show modal for both covered and uncovered states
      if (!isStateCovered) {
        setGuestInfoModalData({
          title: "Delivery Information",
          des: `
          Your selected state (${formData.state}) is outside the standard delivery zone for our Logistics Partners. You will not be charged for delivery now. We will reach out to coordinate delivery with you to ensure your item reaches you safely`,
          actionBtnTxt: "Proceed to Payment",
          isCovered: false,
          context: "checkout",
        });
        setShowGuestInfoModal(true);
        setIsSubmitting(false);
        return;
      } else {
        setGuestInfoModalData({
          title: "Doorstep delivery might not cover some remote locations",
          des: `In such instance, we will contact you to ensure that we manage the item delivery from you without hassles.`,
          actionBtnTxt: "Proceed to Payment",
          isCovered: true,
          context: "checkout",
        });
        setShowGuestInfoModal(true);
        setIsSubmitting(false);
        return;
      }
    }

    // Continue with normal submission
    await processCheckout();
  };

  const processCheckout = async () => {
    try {
      // Validate required fields based on delivery type
      const requiresAddress = selectedDeliveryType == "platform" || selectedDeliveryType == "selfManaged";
      
      if (requiresAddress) {
        if (
          !formData.guestFirstName ||
          !formData.guestLastName ||
          !formData.guestEmail ||
          !formData.guestPhoneNumber ||
          !formData.shippingAddress ||
          !formData.state ||
          !formData.city
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

      if (!selectedDeliveryType) {
        throw new Error("Please select at least one delivery option");
      }

      // Check if state is uncovered and adjust delivery method accordingly
      const coveredStates = ["Lagos", "Oyo", "Fct", "Osun", "Ogun", "FCT - Abuja"];
      const isStateCovered = formData.state ? coveredStates.includes(formData.state) : true;
      
      // For uncovered states, force delivery method to pickup to bypass backend validation
      let finalDeliveryType = selectedDeliveryType;
      if (!isStateCovered && (selectedDeliveryType == "platform")){
        finalDeliveryType = "selfManaged";
      }

      // Remove empty or null fields
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            key !== "selectedDeliveryTypes" && // Exclude selectedDeliveryTypes from submission
            value !== null && value !== "" && value !== undefined
        )
      );

      // Use the component-scope mapping helpers (mapSelectionToSubmission and perItemMethodFromSelection)
      // so the submission payload uses the backend-expected labels.

      let paymentDeliveryType;
      if ( finalDeliveryType == "platform") {

        paymentDeliveryType = "homeDelivery"; 

      } else if (finalDeliveryType == "selfManaged" ){
        paymentDeliveryType = "selfManaged"; 
      }else{
        paymentDeliveryType = "pickUp";
      }

const submissionData = {
  ...cleanedFormData,
  items: parsedCartItems.map((item: any) => ({
    packageId: item._id,
    quantity: item.quantity,
    deliveryMethod: perItemMethodFromSelection(finalDeliveryType)
  })),
  deliveryType: paymentDeliveryType // Use compatible delivery type for payment page
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

  // Sync selectedDeliveryTypes to formData
  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     selectedDeliveryType: selectedDeliveryType!
  //   }));
  //   console.log("Updated formData with selectedDeliveryTypes:", selectedDeliveryType);
  // }, [selectedDeliveryType]);

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
            {/* Warning when no cart data */}
            {parsedCartItems?.length === 0 && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ <strong>Demo Mode:</strong> This page is typically accessed through the cart checkout flow.
                  Showing default delivery options for testing.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="w-full max-w-2xl">
                <label className="text-base font-medium text-[#718096] mt-6 mb-1 block">
                  Delivery Types
                </label>
                <div className="flex flex-wrap gap-3 justify-start">
                  {/* Platform Delivery Button */}
                  {(packageDelivery.includes("platformDelivery") || packageDelivery.includes("selfManaged")) && (
                    <button
                      type="button"
                      onClick={() => handleSelect("platform")}
                      className={`flex-1 min-w-[160px] h-[60px] flex items-center gap-3 border rounded-[8px] p-3 text-[#111827] font-general text-sm ${
                        selectedDeliveryType == "platform"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={selectedDeliveryType == "platform" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      <div className="flex flex-col items-start">
                        <span>Home Delivery</span>
                        {/* <span className="text-xs text-[#718096]">We handle delivery for you</span> */}
                      </div>
                    </button>
                  )}
                  
                  {/* Self-Managed Delivery Button */}
                  {/* {(packageDelivery.includes("selfManaged")) && (
                    <button
                      type="button"
                      onClick={() => handleSelect("selfManaged")}
                      className={`flex-1 min-w-[160px] h-[60px] flex items-center gap-3 border rounded-[8px] p-3 text-[#111827] font-general text-sm ${
                        selectedDeliveryType =="selfManaged"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={selectedDeliveryType =="selfManaged" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      <div className="flex flex-col items-start">
                        <span>Self-Managed</span>
                      </div>
                    </button>
                  )} */}
                  
                  {/* Pickup Button */}
                  {packageDelivery.includes("pickUp") && (
                    <button
                      type="button"
                      onClick={() => handleSelect("pickup")}
                      className={`flex-1 min-w-[160px] h-[60px] flex items-center gap-3 border rounded-[8px] p-3 text-[#111827] font-general text-sm ${
                        selectedDeliveryType == "pickup"
                          ? "border-[#7A1626] bg-[#FDF4F5]"
                          : "border-[#EEEFF2]"
                      }`}
                    >
                      <Image
                        src={selectedDeliveryType == "pickup" ? check : uncheck}
                        alt="check status"
                        className="w-5 h-5"
                      />
                      <div className="flex flex-col items-start">
                        <span>Pickup</span>
                        {/* <span className="text-xs text-[#718096]">Collect from designated location</span> */}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Show address form for platform/self-managed, show contact form for pickup only */}
              {(selectedDeliveryType == "platform" || selectedDeliveryType == "selfManaged") ? (
                /* Address Delivery Form (Platform & Self-Managed) */
                <div className="grid gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="delivery-first-name"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      First Name
                    </label>
                    <input
                      id="delivery-first-name"
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
                      htmlFor="delivery-last-name"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Last Name
                    </label>
                    <input
                      id="delivery-last-name"
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
                      htmlFor="delivery-email"
                      className="font-general font-medium text-base block mb-1 text-[#718096]"
                    >
                      Email
                    </label>
                    <input
                      id="delivery-email"
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

                </div>
              ) : selectedDeliveryType == "pickup" ? (
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
              ) : (
                /* No delivery type selected */
                <div className="grid gap-4 mt-4">
                  <div className="w-full h-[60px] bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-2 rounded-[12px] flex items-center">
                    <span className="font-general font-medium text-[13px] text-[#B91C1C]">
                      Please select at least one delivery option above
                    </span>
                  </div>
                </div>
              )}

              {/* Delivery type validation error */}
              {errors.deliveryType && (
                <div className="mt-2">
                  <p className="text-red-500 text-sm">{errors.deliveryType}</p>
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
                  // Track user action
                  trackEvent(
                    "Guest Delivery Disclaimer - Proceed",
                    {
                      state: formData.state,
                      city: formData.city,
                      isCovered: guestInfoModalData.isCovered
                    }
                  );

                  setShowGuestInfoModal(false);
                  
                  // Proceed to checkout regardless of state coverage
                  setIsSubmitting(true);
                  await processCheckout();
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

