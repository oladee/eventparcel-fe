"use client";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { useState, useRef, useEffect } from "react";
import check from "../../../public/images/check.png";
import uncheck from "../../../public/images/unchecked.png";
import Image from "next/image";
import { nigerianstates } from "@/utils/data";
import { nigeriancities } from "@/utils/data";
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";

export default function DeliveryDetailsForm() {
  const searchParams = useSearchParams();
  const cartItems = searchParams.get('cartItems');
  const eventData = searchParams.get('eventData')
  const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
  const parsedEventData = eventData ? JSON.parse(eventData) : [];
  const router = useRouter();

  // Extract the packageDelivery array
  const packageDelivery = parsedCartItems?.map((item: any) => item.packageDelivery).flat();

  const [deliveryType, setDeliveryType] = useState("home");
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
    state: "",
    city: "",
    dispatchType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const dispatchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredStates = nigerianstates.filter((state) =>
    state.value.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = nigeriancities.filter((city) =>
    city.value.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDispatchTypeSelection = (type: string) => {
    setFormData(prev => ({
      ...prev,
      dispatchType: type,
    }));
    setDispatchDropdownOpen(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    try {
      const { deliveryType } = formData;
  
      // Validate required fields based on delivery type
      if (deliveryType === "home") {
        if (
          !formData.guestFirstName || !formData.guestLastName || !formData.guestEmail ||
          !formData.guestPhoneNumber || !formData.shippingAddress ||
          !formData.state || !formData.city || !formData.dispatchType
        ) {
          throw new Error("Please fill all required fields");
        }
      } else {
        if (
          !formData.guestFirstName || !formData.guestLastName ||
          !formData.guestEmail || !formData.guestPhoneNumber
        ) {
          throw new Error("Please fill all required fields");
        }
      }
  
      // Remove empty or null fields
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_key, value]) => value !== null && value !== "" && value !== undefined
        )
      );
      
  
      // Construct payload
      const submissionData = {
        ...cleanedFormData,
        items: parsedCartItems.map((item: any) => ({
          packageId: item._id,
          quantity: item.quantity,
          deliveryMethod: deliveryType === "home" ? "homeDelivery" : "pickUp",
        })),
        deliveryType: deliveryType === "home" ? "homeDelivery" : "pickUp",
      };
  
      const res = await axiosInstance.post(
        `/guest-checkout/${parsedEventData?.eventId}/${parsedEventData?.eventGroupId}`,
        submissionData
      );
  
      toast("Your order has been placed successfully");
  
      const query = new URLSearchParams({
        orderData: JSON.stringify(res.data),
      }).toString();
  
      router.push(`/guest-payment-details?${query}`);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Initialize deliveryType based on packageDelivery contents
  useEffect(() => {
    if (
      (packageDelivery.includes("homeDelivery:platformDelivery") || packageDelivery.includes("homeDelivery:selfManaged")) 
      && packageDelivery.includes("pickUp")
    ) {

      setDeliveryType((prevType) => prevType || "home"); 
    } else if (packageDelivery.includes("homeDelivery:platformDelivery") || packageDelivery.includes("homeDelivery:selfManaged")) {
      setDeliveryType((prevType) => prevType || "pickup");
    } else if (packageDelivery.includes("pickUp")) {
      setDeliveryType("pickup");
    } else {
      setDeliveryType(""); 
    }
  }, [packageDelivery]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      deliveryType: deliveryType
    }));
  }, [deliveryType]);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateInputRef.current && !stateInputRef.current.contains(event.target as Node) &&
        cityInputRef.current && !cityInputRef.current.contains(event.target as Node) &&
        dispatchInputRef.current && !dispatchInputRef.current.contains(event.target as Node)
      ) {
        setStateDropdownOpen(false);
        setCityDropdownOpen(false);
        setDispatchDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  console.log(error)

  return (
    <>
    <ToastContainer />
    <HeaderLayout>
      <div className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20">
        <div className="p-6 mt-5 bg-[#FFFFFF] rounded-[16px]">
          <h2 className="font-bold text-xl text-[#111827]">Delivery Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="w-[311px]">
              <label className="text-base font-medium text-[#718096] mt-6 mb-3 block">
                Delivery Type
              </label>
              <div className="flex justify-between gap-3">
              {(packageDelivery.includes("homeDelivery:platformDelivery") || packageDelivery.includes("homeDelivery:selfManaged")) && (
                <button
                type="button"
                  onClick={() => setDeliveryType("home")}
                  className={`w-[147.5px] h-[45px] flex items-center gap-2 border rounded-[8px] p-1.5 text-[#111827] font-general text-sm ${
                    deliveryType === "home" ? "border-[#7A1626] bg-[#FDF4F5]" : "border-[#EEEFF2]"
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

            {deliveryType === "home" ? (
              /* Home Delivery Form */
              <div className="grid gap-4 mt-4">
                <div>
                  <label htmlFor="home-first-name" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    First Name
                  </label>
                  <input
                    id="home-first-name"
                    name="guestFirstName"
                    value={formData.guestFirstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="home-last-name" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Last Name
                  </label>
                  <input
                    id="home-last-name"
                    name="guestLastName"
                    value={formData.guestLastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="home-email" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Email
                  </label>
                  <input
                    id="home-email"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="home-phone" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Phone Number
                  </label>
                  <input
                    id="home-phone"
                    name="guestPhoneNumber"
                    value={formData.guestPhoneNumber}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="home-address" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Address
                  </label>
                  <input
                    id="home-address"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                    />
                </div>
                {/* State and City Dropdowns */}
                <div className="grid grid-cols-2 gap-4 relative">
                  {/* State Dropdown */}
                  <div className="relative">
                    <label htmlFor="home-state" className="font-general font-medium text-base block mb-1 text-[#718096]">State</label>
                    <input
                      id="home-state"
                      ref={stateInputRef}
                      name="state"
                      type="text"
                      placeholder="Search states..."
                      className="w-full px-3 h-14 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] outline-none"
                      value={stateSearch}
                      onChange={(e) => {
                        setStateSearch(e.target.value);
                        setStateDropdownOpen(true);
                      }}
                      onFocus={() => setStateDropdownOpen(true)}
                    />
                    {stateDropdownOpen && (
                      <div className="absolute left-0 right-0 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-10 mt-1 rounded-[12px]">
                        {filteredStates.map((state) => (
                           <div
                           key={state.value}
                           className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                           onClick={() => {
                             setStateSearch(state.value);
                             setFormData(prev => ({ ...prev, state: state.value }));
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
                    <label htmlFor="home-city" className="font-general font-medium text-base block mb-1 text-[#718096]">City</label>
                    <input
                      id="home-city"
                      ref={cityInputRef}
                      name="city"
                      type="text"
                      placeholder="Search cities..."
                      className="w-full h-14 rounded-[12px] px-3 py-2 border border-[#E5E7EB] bg-[#FAFAFA] text-sm outline-none"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setCityDropdownOpen(true);
                      }}
                      onFocus={() => setCityDropdownOpen(true)}
                    />
                    {cityDropdownOpen && (
                      <div className="absolute left-0 right-0 max-h-60 overflow-y-auto bg-white border border-[#E5E7EB] shadow-lg z-10 mt-1 rounded-[12px]">
                        {filteredCities.map((city) => (
                           <div
                           key={city.value}
                           className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                           onClick={() => {
                             setCitySearch(city.value);
                             setFormData(prev => ({ ...prev, city: city.value }));
                             setCityDropdownOpen(false);
                           }}
                         >
                            {city.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Dispatch Type Dropdown */}
                <div className="relative">
                  <label htmlFor="home-dispatch-type" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Dispatch Type
                  </label>
                  <input
                      id="home-dispatch-type"
                      name="dispatchType"
                      ref={dispatchInputRef}
                      type="text"
                      placeholder="Select dispatch type"
                      className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                      value={formData.dispatchType}  // Changed from dispatchType to formData.dispatchType
                      readOnly
                      onClick={() => setDispatchDropdownOpen(!dispatchDropdownOpen)}
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
              </div>
            ) : (
              /* Pickup Form */
              <div className="grid gap-4 mt-4">
                <div className="w-[311px] h-[60px] bg-[#FFF7F2] px-3 py-2 rounded-[12px]">
                  <span className="font-general font-medium text-[13px] text-[#718096]">
                    <span className="font-semibold text-[#111827] h-[36px]">P.S</span>: The pickup location is <span className="font-semibold text-[#111827]">Lagos</span>, full pickup details will be shared after payment
                  </span>
                </div>
                <div>
                  <label htmlFor="pickup-first-name" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    First Name
                  </label>
                  <input
                    id="pickup-first-name"
                    name="guestFirstName"
                    value={formData.guestFirstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                    />
                </div>
                <div>
                  <label htmlFor="pickup-last-name" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Last Name
                  </label>
                  <input
                    id="pickup-last-name"
                    name="guestLastName"
                    value={formData.guestLastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                    />
                </div>
                <div>
                  <label htmlFor="pickup-email" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Email
                  </label>
                  <input
                    id="pickup-email"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="pickup-phone" className="font-general font-medium text-base block mb-1 text-[#718096]">
                    Phone Number
                  </label>
                  <input
                    id="pickup-phone"
                    name="guestPhoneNumber"
                    value={formData.guestPhoneNumber}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full h-14 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] focus:outline-none focus:border-[#8B1E3F]"
                    />
                </div>
              </div>
            )}
          
            <button type="submit" className="flex justify-center w-full mt-4 py-3 rounded-[8px] bg-[#7A1626] text-white font-semibold">
              {isSubmitting ? (
                <BiLoaderCircle
                className="animate-spin h-6 w-6"
                aria-hidden="true"
              />
              ) : (
                <span>
                  Proceed to Payment
                </span>
              )}
            </button>
          </form>
        </div>        
      </div>
    </HeaderLayout>
                    </>
  );
}