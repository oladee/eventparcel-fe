"use client"

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import HeaderLayout from "@/components/layout/HeaderLayout";
import Image from "next/image";
import { LuCalendarDays } from "react-icons/lu";
import PackageDetailsModal from "@/components/GuestViewPackage";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useCartStore } from '../../store/useCartStore';
import { toast, ToastContainer } from "react-toastify";
import cart from "../../../assets/orderIcons/shopping-cart.png"
import { BiLoaderCircle } from "react-icons/bi";
import { identifyUser, trackEvent } from "@/lib/mixpanel";
import getBrowserType from "@/lib/getBrowserType";

const ViewEvent = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loadDeliveryDetails, setLoadDeliveryDetails] = useState(false);

  // Cart store functions
  const items = useCartStore((state) => state.items);
  // const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const total = useCartStore((state) => state.total);
  const currency = useCartStore((state) => state.currency());
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();

  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude},${longitude}`);
      });
    }
  }, []);

  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/invite-details?code=${code}`);
        setData(res.data.data);
        console.log("res", res.data.data)
        
        identifyUser(res.data.data.event.user._id,{
          location,
          browser_type: getBrowserType(),
        });

        trackEvent("Invite Link Clicked", {
          source: "preview page",
          invite_type: res.data.data.eventGroup.groupPrivacy,
          timestamp: new Date().toISOString(),
          page_name: "Preview Page",      
        });

      } catch (error: any) {
          setError(error.response?.data?.message);
          // toast.error(error.response?.data?.message);/
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, location]);

  // Don't render anything until data is loaded
  if (loading) {
    return (
      <HeaderLayout>
        <div className="flex justify-center items-center h-screen">
          <div>Loading event details...</div>
        </div>
      </HeaderLayout>
    );
  }

  // Show error if data fetching failed
  if (error || !data) {
    return (
      <HeaderLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">{error || "No event data found"}</div>
        </div>
      </HeaderLayout>
    );
  }

  // Format data only after we're sure it exists
  const eventData = data?.event;
  const eventGroupData = data?.eventGroup;

  const fullText = eventData?.eventDescription || "";
  const formattedText = fullText.charAt(0).toUpperCase() + fullText.slice(1);
  const isLong = formattedText.length > 120;
  const displayText = isExpanded ? formattedText : formattedText.slice(0, 120);

  const rawDate = eventData?.date;
  const formattedDate = rawDate
    ? (() => {
        const dateObj = new Date(rawDate);
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = dateObj.toLocaleString("default", { month: "short" });
        const year = dateObj.getFullYear();
        return `${day} ${month}, ${year}`;
      })()
    : "";

  const groupPrivacy = eventGroupData?.groupPrivacy;
  const availableTabs = groupPrivacy === "private" ? ["General", "Private"] : ["General"];

  const handleCheckout = () => {
    setLoadDeliveryDetails(true);
  
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
  
    try {
      // Track checkout event
      const { currency } = useCartStore.getState();
      const currentCurrency = currency() || "NGN";
  
      const totalPackageCount = cartItems.length; // or sum quantities if you want total units
  
      trackEvent("Checkout Started", {
        source: "preview page",
        event_id: eventData?._id,
        event_name: eventData?.name,
        package_count: totalPackageCount,
        currency: currentCurrency,
        timestamp: new Date().toISOString(),
        page_name: "Preview Page",
      });
  
      // Prepare data for routing
      const minimalEventData = {
        eventId: eventData?._id,
        eventGroupId: eventGroupData?._id
      };
  
      const query = new URLSearchParams({ 
        cartItems: JSON.stringify(cartItems),
        eventData: JSON.stringify(minimalEventData)
      }).toString();
  
      router.push(`/delivery-details?${query}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadDeliveryDetails(false);
    }
  };
  

  const addToCartHandler = (pkg: any) => {
    const { items, addToCart, currency } = useCartStore.getState();
  
    addToCart({ ...pkg, quantity: 1 });
  
    const updatedPackageCount = items.find(i => i._id === pkg._id)
      ? items.length
      : items.length + 1;
  
    const currentCurrency = currency() || pkg.packagePriceCurrency || "NGN";
  
    trackEvent("Added To Cart", {
      source: "preview page",
      event_id: data?.eventGroup?.event?._id,
      event_name: data?.eventGroup?.event?.name,
      package_count: updatedPackageCount,
      currency: currentCurrency,
      timestamp: new Date().toISOString(),
      page_name: "Preview Page",
    });
  };
  
  return (
    <HeaderLayout>
      <ToastContainer position="top-right" autoClose={5000} />

      <div id="event-container" className="bg-[#F9FAFB] mt-20 md:mt-10 text-black px-6 pt-6 pb-24">
        {/* Event Card */}
        <div id="event-card" className="rounded-[20px] bg-[#FFF7F2] p-4">
          <Image
            id="event-image"
            src={data?.event?.eventImgUrl || "/images/placeholder_eventCover2.jpg"}
            width={311}
            height={311}
            alt="Wedding Invite"
            className="rounded-2xl h-[311px] w-[311px]"
          />

          <div id="event-details" className="pt-5 ">
            <h3 id="event-title" className="text-xl font-general font-bold text-[#111827]">
            {data?.event?.eventName
              ?.split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            </h3>

            <p id="event-description" className="text-sm mt-1 font-medium text-[#718096] border-b border-[#CBD5E0] pb-4">
              {displayText}
              {isLong && (
                <span
                  id="read-more-toggle"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#751423] font-medium cursor-pointer ml-1"
                >
                  {isExpanded ? " Show Less" : " Read More"}
                </span>
              )}
            </p>

            <div id="event-date" className="flex items-center gap-2 text-sm text-gray-600 mt-4 py ">
              <LuCalendarDays id="calendar-icon" className="w-4 h-4" />
              <span id="date-text" className="font-medium text-sm text-[#111827]">{formattedDate} at {data?.event?.time} WAT</span>
            </div>

            <p id="event-location" className="text-sm text-[#78858F] font-normal mt-1">
            {data?.event?.eventLocation
              ?.split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            </p>
          </div>
        </div>

        {/* Packages Section */}
        <div id="packages-container" className="bg-white p-6 rounded-2xl max-w-md w-full mt-6 mb-6 shadow-sm">
          <h2 id="packages-title" className="text-xl font-bold text-[#111827]">Event Packages</h2>

          {/* Tabs */}
          <div id="package-tabs" className="flex gap-6 border-b mt-4 mb-6">
            {availableTabs.map((tab) => (
              <button
                  id={`${tab.toLowerCase()}-tab`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-base font-medium ${
                  activeTab === tab
                  ? tab === "General"
                      ? "text-[#0891B2] border-b-2 border-[#0891B2]"
                      : "text-[#751423] border-b-2 border-[#751423]"
                      : "text-gray-400"
                  }`}
              >
                  {tab}
              </button>
              ))}
          </div>

          {/* Package Content */}
          {activeTab === "General" && (
            data?.event?.eventGroups?.map((group: any) => (
              group.groupPrivacy === "general" && (
                <div
                 key={group._id} 
                 className="mb-10">
                <h3 id="general-package-title" className="text-xl font-bold text-[#111827]">
                {group.groupName
                  ?.split(" ")
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                </h3>
                <p id="general-package-description" className="text-sm text-[#718096] mb-4 font-medium">
                {group?.groupDescription
                  ?.split(' ')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                </p>


                {group?.packages.map((pkg: any) => (
                  <div  
                   key={pkg._id}               
                   id="general-package-item" 
                   className="flex gap-3 mb-3 p-3 border rounded-xl"
                  >
                  <div id="package-item-image-container" className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                      id="package-item-image"
                      src={pkg?.packageImgUrls[0]}
                      alt=""
                      width={50}
                      height={50}
                      style={{width:"50px", height:"50px"}}
                      className="rounded-[5px] h-16 object-cover"
                      />
                  </div>

                  <div id="package-item-details"  className="flex flex-col justify-between">
                    <div
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setModalOpen(true);
                      }}                      
                     id="package-item-info">
                      <h4 id="package-item-name" className="text-sm font-semibold font-general">
                      {pkg?.packageTitle
                          ?.split(' ')
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')
                          .slice(0, 25)}
                        {pkg?.packageTitle?.length > 25 ? '...' : ''}
                      </h4>
                      <p id="package-item-short-description" className="text-xs text-gray-500 line-clamp-1">
                      {pkg?.packageDescription
                          ?.split(' ')
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')
                          .slice(0, 70)}
                        {pkg?.packageDescription?.length > 70 ? '...' : ''}
                      </p>
                      <p id="package-item-price" className="text-sm text-[#751423] font-bold mt-1">
                      {pkg?.packagePriceCurrency === "NGN" ? "₦" : "$"}
                      {pkg?.packagePrice?.toLocaleString()}
                      </p>
                    </div>
                    <button 
                      id="add-to-cart-button" 
                      className="w-[137px] text-sm font-semibold text-[#751423] hover:text-[#FFFF] hover:bg-[#751423] border border-[#751423] px-3 py-1 mt-2 rounded-[8px]"
                      onClick={() => {
                        console.log("clicked add to cart")
                        setCartOpen(true)
                        addToCartHandler(pkg); 
                      }}
                      
                      >
                      Add to Cart
                    </button>
                  </div>
                </div>
                ))}
              </div>
              )
            ))
          )}

          {activeTab === "Private" && (
            <>
              <h3 id="private-package-title" className="text-xl font-bold text-[#111827]">
                  {data?.eventGroup?.groupName
                  ?.split(" ")
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h3>
              <p id="private-package-description" className="text-sm text-[#718096] mb-4 font-medium">
              {data?.eventGroup?.groupDescription
              ?.split(' ')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
              </p>
              {data?.eventGroup?.packages.map((pkg: any) => (
                <div key={pkg._id} id="private-package-item" className="flex gap-3 p-3 border rounded-xl">
                    <div id="private-package-image-container" className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                        id="private-package-image"
                        src={pkg?.packageImgUrls[0]}
                        width={50}
                        height={50}
                        alt=""
                        className="rounded-[5px] h-16 object-cover"
                    />
                    </div>

                    <div id="private-package-details" className="flex flex-col justify-between">
                        <div
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setModalOpen(true);
                          }}                          
                           id="private-package-info"
                          >
                            <h4 id="private-package-name" className="text-sm font-semibold font-general">
                            {pkg?.packageTitle
                              ?.split(' ')
                              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                              .join(' ')
                              .slice(0, 25)}
                            {pkg?.packageTitle?.length > 25 ? '...' : ''}
                            </h4>
                            <p id="private-package-short-description" className="text-xs text-gray-500 line-clamp-1">
                                {pkg?.packageDescription
                                  ?.split(' ')
                                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                  .join(' ')
                                  .slice(0, 70)}
                                {pkg?.packageDescription?.length > 70 ? '...' : ''}
                            </p>
                            <p id="private-package-price" className="text-sm text-[#751423] font-bold mt-1">
                              {pkg?.packagePriceCurrency === "NGN" ? "₦" : "$"}
                              {pkg?.packagePrice?.toLocaleString()}
                            </p>
                        </div>
                    <button 
                      id="private-add-to-cart-button" 
                      className="text-sm w-[137px] font-semibold text-[#751423] hover:text-[#FFFF] hover:bg-[#751423] border border-[#751423] px-3 py-1 mt-2 rounded-[8px]"
                      onClick={() => {
                        setCartOpen(true)
                        addToCartHandler(pkg); 
                      }}
                    >
                        Add to Cart
                    </button>
                    </div>
                </div>
              ))}
              </>
            )}
        </div>

        {/* Package Details Modal */}
        <PackageDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} packageDetails={selectedPackage} />

        {/* Cart Trigger */}
        <div
            onClick={() => setCartOpen(true)}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white h-[98px] rounded-t-[35px] border-t px-4 pt-4 pb-5 shadow-lg cursor-pointer"
        >
            <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-[#111827]">My Cart</h2>
                <span className="text-xl font-semibold text-[#111827]">
                    {currency === "NGN" ? "₦" 
                      : currency === "USD" ? "$" 
                      : ""
                    }{total().toLocaleString()}
                </span>
              </div>
        </div>

        {/* Cart Slider */}
        {cartOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "54%" }}
            exit={{ y: "100%" }}
            transition={{ 
                duration: 0.3, 
                ease: [0.32, 0.72, 0, 1], 
                when: "beforeChildren" 
              }}
            className="fixed inset-0 z-50 bg-white rounded-t-[35px] px-4 pt-4 pb-6 shadow-lg"
          >
            {/* Top Bar */}
            <div className="mb-4 relative">
                <div
                    onClick={() => setCartOpen(false)}
                    className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 cursor-pointer"
                />
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-base font-semibold text-[#111827]">My Cart</h2>
                    <span className="text-xl font-semibold text-[#111827]">
                      {currency === "NGN" ? "₦" 
                        : currency === "USD" ? "$" 
                        : ""
                      }{total().toLocaleString()}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 border-b border-[#E8EAED] p-3" />
            </div>

            {/* Item Info */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={cart}
                  alt="Empty cart"
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <p className="text-[#718096] text-center text-base font-medium w-[196px] h-[48px]">
                  You do not have any item in your cart
                </p>

                <button
                      disabled
                      className="h-[56px] bg-[#7D0021] text-[#FFFFFF] w-full rounded-[8px] py-3 mt-8 font-bold text-base"
                    >
                      Checkout
                </button>
              </div>
            ) : (
              <>
              <div
                className="h-[145px] overflow-y-auto scrollbar-hide flex flex-col gap-3"
                >
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between  h-[72px]"
                    >
                    <div className="flex flex-col gap-1">
                      <p className="text-base text-[#111827] font-medium w-[180px]">
                        {item.packageTitle
                          ?.split(" ")
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </p>

                      <span className="text-base text-[#751423] font-semibold">
                        {item.packagePriceCurrency === "NGN" ? "₦" : "$"}
                        {item?.packagePrice?.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"
                        >
                        <Minus size={14} />
                      </button>

                      <span className="text-xl font-medium text-[#000000]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="w-10 h-10 rounded bg-[#7D0021] text-white flex items-center justify-center"
                        >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                {/* {loading ? (
                    <BiLoaderCircle className="animate-spin mr-2" size={22} />
                  ) : (
                    "Continue"
                  )} */}
              <button
                onClick={handleCheckout}
                className={`h-[56px] bg-[#7D0021] text-[#FFFFFF] ${items.length === 1 ? "mt-2" : "mt-5"} w-full rounded-[8px] py-3 font-bold text-base`}
                >
                   {loadDeliveryDetails ? (
                    <BiLoaderCircle className="animate-spin mr-2" size={22} />
                  ) : (
                    "Checkout"
                  )}
              </button>
            </>
            )}
          </motion.div>
        )}
      </div>
    </HeaderLayout>
  );
};


export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <ViewEvent />
    </Suspense>
  );
}










