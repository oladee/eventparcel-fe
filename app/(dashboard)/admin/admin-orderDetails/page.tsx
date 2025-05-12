"use client"

import React, { useEffect, useState } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import Image from "next/image";
import BoxTime from "../../../../assets/orderIcons/box-time-orange.png";
import { Mail, Phone, MapPin, CircleDollarSign, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {

    const [order, setOrder] = useState<any>(null);
    const Router = useRouter();

    useEffect(() => {
      const storedOrder = localStorage.getItem("selectedOrder");
      if (storedOrder) {
        setOrder(JSON.parse(storedOrder));
      }
    }, []);

    const itemTotalAmount = (order?.totalAmount || 0) - (order?.tax || 0) - (order?.homeDeliveryFee || 0);
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      
      const day = date.toLocaleString("en-GB", { day: "2-digit" });
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear();
    
      return `${day} ${month}, ${year}`;
    };
    
    const handleClick = (id: any) => {
      Router.push(`admin-events/${id}`); 
    };
      
  
  return (
    <AdminContainer>
      <div className="w-full h-full flex items-center">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 w-full">
          <div className="flex-[1.5]">
            <div className="rounded-[12px]">
              <div id="order-status-card" className='w-full h-auto bg-[#FFFFFF] rounded-[16px] p-4 mb-5'>
                <div id="status-container" className='flex items-center gap-2'>
                  <div id="status-icon-container" className='bg-[#FFF0E6] p-2 rounded-[20px]'>
                    <Image id="status-icon" src={BoxTime} alt='box' width={16} height={16} />
                  </div>
                  <span id="status-text" 
                    className='font-general font-medium text-base text-[#FE964A]'
                  >
                    {order?.orderStatus
                      ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                      : "Status"}
                  </span>
                </div>
                <div id="status-divider" className="w-full border-t border-[#EEEFF2] my-3"></div>
                
                {order?.items.map((item: any, index: any) => (
                  <div 
                    key={item._id} 
                    id={`order-content-${item._id}-${index}`} 
                    className="flex items-center gap-3 mb-2 h-[91px] bg-[#FAFAFA] rounded-[12px] space-x-4 px-4 py-2"
                  >
                    {/* Order Image */}
                    <Image 
                      id={`order-image-${order._id}-${index}`}
                      src={item.packageId?.packageImgUrls?.[0] || item?.packageImgUrls?.[0] || "no img"}
                      alt={item.packageId?.packageTitle || "Order Image"} 
                      width={42} 
                      height={42} 
                      className="rounded-[2px] object-cover"
                      style={{width:"42px", height:"42px"}}
                    />
    
                    {/* Order Details */}
                    <div id={`order-details-${order._id}-${index}`} className="flex-1">
                      <p id={`order-title-${order._id}-${index}`} className="font-semibold text-sm text-[#111827]">
                        {String(item?.packageTitle || item?.packageId?.packageTitle || "")
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </p>
                      <p 
                        id={`order-price-${order._id}-${index}`} 
                        className="text-[#718096] font-normal font-general text-sm"
                      >
                        {item?.packagePriceCurrency === "NGN" ? "₦" : "$"}{item.packagePrice.toLocaleString() ?? "N/A"} 
                      </p>
                    </div>

                    {/* Order Quantity */}
                    <div id={`order-quantity-${order._id}-${index}`} className="flex items-center text-[#718096] text-xs">
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div id="payment-info-card" className='bg-[#FFFFFF] rounded-[16px] p-5 mt-5 flex flex-col gap-5'>
                <div id="payment-status" className='flex items-center gap-3 -mb-6'>
                    <div id="payment-icon-container" className='bg-green-50 p-2 rounded-[20px]'>
                    <CircleDollarSign id="payment-icon" className='h-[24px] w-[24px] text-green-600'/>
                    </div>
                    <span id="payment-status-text" className='text-green-600 font-general font-semibold text-base'>Paid</span>
                </div>
                <div id="payment-divider" className="border-t border-[#EEEFF2] my-3"></div>
                
                <div id="item-cost" className='flex items-center justify-between'>
                    <div className="flex items-center gap-6">
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            Subtotal
                        </span>
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            {order?.items.length} Item
                        </span>
                    </div>
                    <span id="item-price" className='text-[#718096] font-general font-medium text-[14px]'>
                    {order?.totalAmountCurrency === "NGN" ? "₦" : "$"} {itemTotalAmount.toLocaleString()}
                    </span>
                </div>
                
                <div id="delivery-cost" className='flex items-center justify-between'>
                    <div className="flex items-center gap-5">
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            Shipping
                        </span>
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            {order?.deliveryType === "homeDelivery" ? "Home Delivery" : "Pickup"}
                        </span>
                    </div>
                    <span id="delivery-price" className='text-[#718096] font-general font-medium text-[14px]'>
                      {order?.deliveryType === "homeDelivery" ? (
                        <>
                          {order?.totalAmountCurrency === "NGN" ? "₦" : "$"}
                          {order?.homeDeliveryFee?.toLocaleString()}
                        </>
                      ) : "No Fee"}
                    </span>
                </div>
                
                <div id="delivery-cost" className='flex items-center justify-between'>
                    <div className="flex items-center gap-12">
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            Fee
                        </span>
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>
                            Service
                        </span>
                    </div>                   
                     <span id="tax-price" className='text-[#718096] font-general font-medium text-[14px]'>
                    {order?.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.tax.toLocaleString()}
                    </span>
                </div>
                
                <div id="total-cost" className='flex items-center justify-between'>
                    <span id="total-label" className='font-general font-bold text-[14px] text-[#111827]'>Total</span>
                    <span id="total-price" className='font-general font-bold text-[16px] text-[#111827]'>
                    {order?.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.totalAmount.toLocaleString()}
                    </span>
                </div>

                <div id="payment-divider" className="border-t border-[#EEEFF2]"></div>
                
                <div id="payment-method" className='flex items-center justify-between'>
                    <span id="method-label" className='text-[#718096] font-general font-medium text-[14px]'>Paid by Guest</span>
                    <span id="method-amount" className='font-general font-bold text-[16px] text-[#111827]'>
                    {order?.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.totalAmount.toLocaleString()}
                    </span>
                </div>
                </div>
            </div>
          </div>

          <div id="guest-details-container" className="flex-[1]">
            <div id="guest-card" className="max-w-md mx-auto rounded-xl overflow-hidden flex flex-col gap-6 bg-white shadow-sm p-6 mb-6 lg:ml-4">
              {/* Guest Header */}
              <div id="guest-header">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Guest Details</h1>
                <div className="flex items-center gap-4">
                  <div id="guest-avatar" className="bg-purple-100 text-purple-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    {order?.guestFirstName.charAt(0).toUpperCase()}{order?.guestLastName.charAt(0).toUpperCase()}
                  </div>
                  <div id="guest-name-container">
                    <h2 id="guest-fullname" className="font-semibold text-gray-900">
                      {`${order?.guestFirstName.charAt(0).toUpperCase()}${order?.guestFirstName.slice(1)} ${order?.guestLastName.charAt(0).toUpperCase()}${order?.guestLastName.slice(1)}`}
                    </h2>
                    <p id="order-id" className="text-gray-500 text-sm">
                      {order?.orderId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Contact Information */}
              <div id="contact-info-section">
                <h2 className="font-bold text-[#111827] text-[16px] mb-3">Contact Information</h2>
                <div className="space-y-3">
                  <div id="email-info" className="flex items-center gap-3">
                    <Mail className="text-gray-400 h-5 w-5" />
                    <span className="text-gray-600">
                      {order?.guestEmail}
                    </span>
                  </div>
                  <div id="phone-info" className="flex items-center gap-3">
                    <Phone className="text-gray-400 h-5 w-5" />
                    <span className="text-gray-600">
                      {order?.guestPhoneNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Shipping Address */}
              <div id="shipping-address-section">
                <h2 className="font-bold text-[#111827] text-[16px] mb-3">Shipping Address</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 h-5 w-5 mt-1" />
                  <span id="address-text" className="text-gray-600 w-[255px]">
                    {order?.shippingAddress
                      ?.split(" ")
                      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Event */}
            <div id="event-card" className="max-w-md mx-auto rounded-xl overflow-hidden flex flex-col gap-6 bg-white shadow-sm p-6 lg:ml-4">
              <div id="event-section">
                <h2 className="font-bold text-[#111827] text-[18px] mb-3">Event</h2>
                <div id="event-header" className="flex items-center gap-3 mb-3">
                  <Image
                    id="event-image"
                    src={order?.eventId?.eventImgUrl || "/images/placeholder_eventCover3.jpg"}
                    alt="Event Cover"
                    className="w-full h-full rounded-[12px]"
                    width={100} 
                    height={100} 
                    quality={100}
                    priority
                    style={{width: "80px", height: "80px"}}
                  />
                  <div id="event-name-container" className="w-[195px] cursor-pointer">
                    <span  onClick={() => handleClick(order?.eventId?._id)} id="event-name" className="text-[#111827] font-bold text-base">
                      {order?.eventId?.eventName
                        .split(" ")
                        .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ")}
                    </span>
                  </div>
                </div>

                <div id="payment-divider" className="border-t border-[#EEEFF2]"></div>

                {/* Event Details */}
                <div id="event-details" className="p-4 rounded-lg">
                  <div id="event-date-time" className="flex items-center gap-2 font-medium text mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium text-sm text-[#111827]">
                      {formatDate(order?.eventId?.date)} at {order?.eventId?.time} WAT
                    </span>
                  </div>
                  <p id="event-location" className="font-medium text-sm text-[#78858F]">
                    {order?.eventId?.eventLocation
                      .split(" ")
                      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </AdminContainer>
  );
};

export default Page;