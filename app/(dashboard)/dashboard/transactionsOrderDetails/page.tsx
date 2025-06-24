"use client";

import Container from '@/components/dashboard/Container';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import BoxTime from "../../../../assets/orderIcons/box-time-orange.png";
import { Mail, Phone, MapPin, CircleDollarSign } from "lucide-react";
import { MdOutlineCalendarToday } from "react-icons/md";
import useUpdateOrderStatus from '@/hooks/useUpdateOrderStatus';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Circle } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { ChevronLeft } from 'lucide-react';

const Page = () => {
    const [orders, setOrders] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
      const storedOrder = localStorage.getItem("selectedOrder");
      if (storedOrder) {
        setOrders(JSON.parse(storedOrder));
      }
    }, []);

    const { updateOrderStatus } = useUpdateOrderStatus();
    const handleStatusChange = async (status: string) => {
        try {
            if (!orders?.orderId) {
                toast.error("Invalid order. Please try again.");
                return;
            }

            const paymentStatus: string = orders.paymentStatus ?? "Unknown";

            // Update the order status through your API
            const response = await updateOrderStatus(orders?._id, paymentStatus, status);

            // If the API call succeeds, update the UI (localStorage + state)
            if (response?.success) {  // Assuming the API returns a `success` flag
                // Retrieve and update the selected order in localStorage
                const storedOrder = JSON.parse(localStorage.getItem("selectedOrder") || "{}");

                if (!storedOrder || Object.keys(storedOrder).length === 0) {
                    console.warn("No selected order found in local storage.");
                    return;
                }

                // Update orderStatus in the localStorage object
                storedOrder.orderStatus = status;

                // Save the updated object back to localStorage
                localStorage.setItem("selectedOrder", JSON.stringify(storedOrder));

                // Update the state to trigger a re-render
                setOrders((prevOrders: any) => ({
                    ...prevOrders,
                    orderStatus: status
                }));
            }
            
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update order status.");
        }
    };

    const handleViewOneEvent = (eventId: any) => {
        router.push(`/dashboard/events/${eventId}`);
      };

    const getInitials = (name: string) => {
        if (!name) return "E"; 
        const nameParts = name.split(" ");
        return nameParts
          .map(part => part[0])
          .join("")
          .toUpperCase();
      };

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        const day = date.toLocaleString("en-GB", { day: "2-digit" });
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear();
      
        return `${day} ${month}, ${year}`;
      };
      

      const itemTotalAmount = (orders?.totalAmount || 0) - (orders?.tax || 0) - (orders?.homeDeliveryFee || 0);

    const getBgStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            return 'bg-green-100';  
            case 'pending':
            return 'bg-yellow-100';  
            case 'failed':
            return 'bg-red-100';    
            default:
            return 'bg-gray-100';    
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
          case 'paid':
            return 'text-green-600';
          case 'pending':
            return 'text-yellow-500';
          case 'failed':
            return 'text-red-600';
          default:
            return 'text-gray-500';
        }
    };

    const capitalizeFirstLetter = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    const NairaCircleIcon = () => (
    <div className="relative w-6 h-6">
        <Circle className={`${getStatusClass(orders?.paymentStatus || '')} w-full h-full`} />
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getStatusClass(orders?.paymentStatus || '')}`}>₦</span>
    </div>
    );
          
    if (!orders) {
        return (
            <Container>
                <div id="order-not-found-container" className="min-h-screen mt-2">
                    <h4 id="order-not-found-heading" className="text-2xl font-general font-bold text-[#111827] mb-6">
                        Getting Orders...
                    </h4>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <ToastContainer />
              <div
                className="fixed top-16 w-[90%] md:w-[80%] h-auto py-3 bg-gray-100"
                id="back-button"
                >
                    <button className="w-[20%] md:w-[5%] -ml-2 cursor-pointer flex flex-row items-center" onClick={() => window.history.back()}>
                        <ChevronLeft className="w-6 h-6 " />
                        <span className="font-medium text-base text-[#111827] ml-1">Back</span>
                    </button>
                </div>
            <div id="order-details-container" className="min-h-screen mt-11">
                {/* Heading */}
                <h4 id="order-details-heading" className="text-2xl font-general font-bold text-[#111827] mb-6">
                    Order details
                </h4>

                <div id="order-status-card" className='w-[348px] h-auto bg-[#FFFFFF] rounded-[16px] p-4 mb-5'>
                    <div id="status-container" className='flex items-center gap-2'>
                        <div id="status-icon-container" className='bg-[#FFF0E6] p-2 rounded-[20px]'>
                            <Image id="status-icon" src={BoxTime} alt='box' width={16} height={16} />
                        </div>
                        <span id="status-text" 
                            className='font-general font-medium text-base text-[#FE964A]'
                        >
                            {orders?.orderStatus
                                ? orders.orderStatus.charAt(0).toUpperCase() + orders.orderStatus.slice(1)
                                : "Status"}
                        </span>
                    </div>
                    <div id="status-divider" className="border-t border-[#EEEFF2] my-3"></div>
                    
                    {orders.items.map((item: { _id: React.Key | null | undefined; packageId: { packageImgUrls: any[]; packageTitle: string; }; packageImgUrls: any[]; packageTitle: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; packagePriceCurrency: string; packagePrice: { toLocaleString: () => any; }; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: any) => (
                        <div 
                            key={item._id} 
                            id={`order-content-${orders._id}-${index}`} 
                            className="flex items-center gap-3  mb-2 h-[91px] bg-[#FAFAFA] rounded-[12px] space-x-4 px-4 py-2"
                        >
                            {/* Order Image */}
                            <Image 
                                id={`order-image-${orders._id}-${index}`}
                                src={item.packageId?.packageImgUrls?.[0] || item?.packageImgUrls?.[0]}
                                alt={item.packageId?.packageTitle || "Order Image"} 
                                width={42} 
                                height={42} 
                                className="rounded-md h-[42px] w-[42px] object-contain"
                            />
        
                            {/* Order Details */}
                            <div id={`order-details-${orders._id}-${index}`} className="flex-1">
                                <p id={`order-title-${orders._id}-${index}`} className="font-semibold text-sm text-[#111827]">
                                {String(item?.packageTitle || item?.packageId?.packageTitle || "")
                                    .split(" ")
                                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                </p>
                                <p 
                                    id={`order-price-${orders._id}-${index}`} 
                                    className="text-[#718096] font-normal font-general text-sm"
                                >
                                    {item?.packagePriceCurrency  === "NGN" ? "₦" : "$"}{item.packagePrice.toLocaleString() ?? "N/A"} 
                                </p>
                            </div>

                            {/* Order Quantity */}
                            <div id={`order-quantity-${orders._id}-${index}`} className="flex items-center text-[#718096] text-xs">
                                <span>Qty: {item.quantity}</span>
                            </div>
                        </div>
                    ))}
                    <div id="product-divider" className="border-t border-[#EEEFF2] my-3"></div>

                    
                    <div id="mark-shipped-button" className='border border-[#111827] w-[311px] h-[48px] flex justify-center items-center rounded-[12px] mt-6'>
                    {/* Home Delivery Flow */}
                    {orders?.deliveryType === "homeDelivery" && (
                        <>
                        {orders?.orderStatus === "pending" && (
                            <p 
                            id="mark-shipped-text" 
                            onClick={() => handleStatusChange("shipped")} 
                            className="font-manrope font-extrabold text-sm text-[#111827] cursor-pointer"
                            >
                            Mark as Shipped
                            </p>
                        )}
                        {orders?.orderStatus === "shipped" && (
                            <p 
                            id="mark-delivered-text" 
                            onClick={() => handleStatusChange("delivered")} 
                            className="font-manrope font-extrabold text-sm text-[#111827] cursor-pointer"
                            >
                            Mark as Delivered
                            </p>
                        )}
                        {(orders?.orderStatus === "delivered" || orders?.orderStatus === "pickedUp") && (
                            <p 
                            id="order-completed-text"  
                            className="font-manrope font-extrabold text-sm text-gray-400 cursor-not-allowed"
                            >
                            Order Completed
                            </p>
                        )}
                        </>
                    )}

                    {/* Pickup Flow */}
                    {orders?.deliveryType === "pickUp" && (
                        <>
                        {orders?.orderStatus === "pending" && (
                            <p 
                            id="mark-pickedup-text" 
                            onClick={() => handleStatusChange("pickedUp")} 
                            className="font-manrope font-extrabold text-sm text-[#111827] cursor-pointer"
                            >
                            Mark as Picked Up
                            </p>
                        )}
                        {orders?.orderStatus === "pickedUp" && (
                            <p 
                            id="order-completed-text"  
                            className="font-manrope font-extrabold text-sm text-gray-400 cursor-not-allowed"
                            >
                            Order Completed
                            </p>
                        )}
                        </>
                    )}
                    </div>
                </div>

                <div id="guest-info-card" className='bg-[#FFFFFF] rounded-[16px] p-5'>
                    <span id="guest-section-title" className='font-general font-bold text-[18px] text-[#111827]'>Guest</span>
                    <div id="guest-profile" className='w-[190px] h-[50px] flex items-center gap-4 mt-4'>
                        <div id="guest-avatar-container">
                        <p
                            id="guest-avatar"
                            className="bg-[#9BB3E366] rounded-[20px] p-2 flex items-center justify-center text-[#3C5C98] font-semibold text-base"
                            >
                            {getInitials(orders.guestFirstName)}{getInitials(orders.guestLastName)}
                            </p>                        
                        </div>
                        <div id="guest-details" className='flex flex-col gap-1'>
                            <span id="guest-name" className='font-general font-semibold text-base text-[#111827]'>
                            <p className="font-bold text-gray-900">
                            {orders?.guestName
                                ? orders.guestName.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())
                                : orders?.guestFirstName || orders?.guestLastName
                                ? `${orders?.guestFirstName ?? ''} ${orders?.guestLastName ?? ''}`
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                    .trim()
                                : "Guest Name"}
                            </p>
                            </span>
                            <span id="guest-id" className='font-general font-medium text-sm text-[#718096]'>{orders._id}</span>
                        </div>
                    </div>
                    <div id="guest-divider" className="border-t border-[#EEEFF2] my-4"></div>
                    
                    <div id="contact-info-section">
                        <p id="contact-info-title" className='font-general font-bold text-[14px] text-[#111827]'>Contact Information</p>
                        <div id="email-info" className='flex items-center gap-2 mt-3'>
                            <Mail id="email-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="email-text" className='text-[#718096] font-general font-medium text-[14px]'>{orders.guestEmail}</p>
                        </div>
                        <div id="phone-info" className='flex items-center gap-2 mt-3'>
                            <Phone id="phone-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="phone-text" className='text-[#718096] font-general font-medium text-[14px]'>{orders.guestPhoneNumber}</p>
                        </div>
                    </div>
                    <div id="contact-divider" className="border-t border-[#EEEFF2] my-3"></div>

                    <div id="shipping-address-section">
                        <p id="shipping-title" className='font-general font-bold text-[14px] text-[#111827]'>Shipping Address</p>
                        <div id="shipping-address" className='flex items-center gap-2 mt-3'>
                            <MapPin id="shipping-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="shipping-text" className='text-[#718096] font-general font-medium text-[14px]'>
                            {orders.shippingAddress
                                ? orders.shippingAddress
                                    .split(" ")
                                    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(" ")
                                : "Not Applicable For PickUp"}
                            </p>
                        </div>
                    </div>
                   
                </div>

                <div id="payment-info-card" className='bg-[#FFFFFF] rounded-[16px] p-5 mt-5 flex flex-col gap-5'>
                       <div id="payment-status" className='flex items-center gap-3 -mb-6'>
                            <div id="payment-icon-container" className={`${getBgStatusClass(orders?.paymentStatus || '')} p-2 rounded-[20px]`}>
                                {orders?.totalAmountCurrency === "NGN" ? <NairaCircleIcon /> : <CircleDollarSign id="payment-icon" className={`h-[24px] w-[24px] ${getStatusClass(orders?.paymentStatus || '')}`}/>}
                            </div>
                            <span
                                id="payment-status-text"
                                className={`${getStatusClass(orders?.paymentStatus || '')} font-general font-semibold text-base`}
                                >
                                {capitalizeFirstLetter(orders?.paymentStatus || '')}
                            </span>
                        </div>
                    <div id="payment-divider" className="border-t border-[#EEEFF2] my-3"></div>
                    
                    <div id="item-cost" className='flex items-center justify-between'>
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            {orders?.items ? orders.items.reduce((total: any, item: { quantity: any; }) => total + item.quantity, 0) : 0} item
                        </span>
                        <span id="item-price" className='text-[#718096] font-general font-medium text-[14px]'>
                            {orders?.totalAmountCurrency === "NGN" ? "₦" : "$"}{itemTotalAmount.toLocaleString()}
                        </span>
                    </div>
                    
                    {orders?.homeDeliveryFee && (
                        <div id="delivery-cost" className='flex items-center justify-between'>
                            <span id="delivery-label" className='text-[#718096] font-general font-medium text-[14px]'>Home Delivery</span>
                            <span id="delivery-price" className='text-[#718096] font-general font-medium text-[14px]'>{orders.totalAmountCurrency === "NGN" ? "₦" : "$"}{orders?.homeDeliveryFee}</span>
                        </div>
                    )}
                    {/* <div id="delivery-cost" className='flex items-center justify-between'>
                        <span id="tax-label" className='text-[#718096] font-general font-medium text-[14px]'>Tax</span>
                        <span id="tax-price" className='text-[#718096] font-general font-medium text-[14px]'>{orders.totalAmountCurrency === "NGN" ? "₦" : "$"}{orders?.tax.toLocaleString()}</span>
                    </div> */}
                    <div id="total-cost" className='flex items-center justify-between'>
                        <span id="total-label" className='font-general font-bold text-[14px] text-[#111827]'>Total</span>
                        <span id="total-price" className='font-general font-bold text-[16px] text-[#111827]'>{orders.totalAmountCurrency === "NGN" ? "₦" : "$"}{orders?.totalAmount.toLocaleString()}</span>
                    </div>
                    
                    <div id="payment-method" className='flex items-center justify-between'>
                        <span id="method-label" className='text-[#718096] font-general font-medium text-[14px]'>Paid by Guest</span>
                        <span id="method-amount" className='font-general font-bold text-[16px] text-[#111827]'>
                            {orders?.totalAmountCurrency === "NGN" ? "₦" : "$"}{orders?.totalAmount?.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div id="final-divider" className="border-t border-[#EEEFF2] my-3"></div>

                <div id="event-info-section">
                    <div id="event-card" className="bg-[#fff4ed] p-4 rounded-2xl mb-4">
                        <div id="event-header" className="flex items-center gap-4">
                            <div id="event-image-container" className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    id="event-image"
                                    src={orders?.event?.eventImgUrl || "/images/placeholder_eventCover3.jpg"}
                                    alt="Event Cover"
                                    className="w-full h-full rounded-[12px]"
                                    width={100} 
                                    height={100} 
                                    quality={100}
                                    priority
                                    style={{width: "80px", height: "80px"}}
                                />
                            </div>
                            <p onClick={() => handleViewOneEvent(orders?.event?._id)} id="event-title" className="text-gray-700 font-general cursor-pointer font-bold text-[16px]">
                            {orders?.event?.eventName
                                ? orders.event.eventName
                                    .split(" ")
                                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")
                                : "No Event Name"}
                            </p>
                        </div>

                        <div id="event-details">
                            <div id="event-date" className="-mt-2 border-t pt-3 text-gray-700">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <MdOutlineCalendarToday id="calendar-icon" size={18} />
                                    <span id="date-text">
                                        {formatDate(orders.event.date)} at {orders.event.time} WAT
                                    </span>
                                </div>
                                <p id="event-location" className="text-sm mt-1 text-gray-500">
                                    {orders.event.eventLocation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Page;