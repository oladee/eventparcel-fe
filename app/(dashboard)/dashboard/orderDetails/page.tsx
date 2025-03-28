"use client";

import Container from '@/components/dashboard/Container';
import Image from 'next/image';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import BoxTime from "../../../../assets/orderIcons/box-time-orange.png";
import { Mail, Phone, MapPin, CircleDollarSign } from "lucide-react";
import { MdOutlineCalendarToday } from "react-icons/md";

const Page = () => {
    const searchParams = useSearchParams();
    const orderParam = searchParams.get('order');
    const order = orderParam ? JSON.parse(orderParam) : null;

    if (!order) {
        return (
            <Container>
                <div id="order-not-found-container" className="min-h-screen mt-2">
                    <h4 id="order-not-found-heading" className="text-2xl font-general font-bold text-[#111827] mb-6">
                        Order not found
                    </h4>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div id="order-details-container" className="min-h-screen mt-2">
                {/* Heading */}
                <h4 id="order-details-heading" className="text-2xl font-general font-bold text-[#111827] mb-6">
                    Order details
                </h4>

                <div id="order-status-card" className='w-[343px] h-[267px] bg-[#FFFFFF] rounded-[16px] p-4 mb-5'>
                    <div id="status-container" className='flex items-center gap-2'>
                        <div id="status-icon-container" className='bg-[#FFF0E6] p-2 rounded-[20px]'>
                            <Image id="status-icon" src={BoxTime} alt='box' width={16} height={16} />
                        </div>
                        <span id="status-text" className='font-general font-medium text-base text-[#FE964A]'>Pending</span>
                    </div>
                    <div id="status-divider" className="border-t border-[#EEEFF2] my-3"></div>
                    
                    <div id="product-summary" className="w-[311px] h-[91px] flex items-center gap-3 bg-[#FAFAFA] rounded-[12px] space-x-4 px-2 py-2">
                        <Image 
                            id="product-image"
                            src={order.image} 
                            alt={order.title} 
                            width={42} 
                            height={42} 
                            className="rounded-md mb-6 ml-1"
                            objectFit="cover" 
                        />
                        <div id="product-info" className="flex-1">
                            <p id="product-title" className="font-semibold text-sm mb-2 text-[#111827]">{order.title}</p>
                            <p id="product-price" className="text-[#718096] font-medium font-general text-xs">{order.price}</p>
                        </div>
                        <div id="product-quantity" className="flex items-center text-[#718096] text-xs font-medium">
                            <span>Qty: {order.quantity}</span>
                        </div>
                    </div>
                    <div id="product-divider" className="border-t border-[#EEEFF2] my-3"></div>
                    
                    <div id="mark-shipped-button" className='border border-[#111827] w-[311px] h-[48px] flex justify-center items-center rounded-[12px] mt-6'>
                        <p id="mark-shipped-text" className='font-manrope font-extrabold text-sm text-[#111827]'>Mark as Shipped</p>
                    </div>
                </div>

                <div id="guest-info-card" className='bg-[#FFFFFF] rounded-[16px] p-5'>
                    <span id="guest-section-title" className='font-general font-bold text-[18px] text-[#111827]'>Guest</span>
                    <div id="guest-profile" className='w-[190px] h-[50px] flex items-center gap-4 mt-4'>
                        <div id="guest-avatar-container">
                            <p id="guest-avatar" className='bg-[#9BB3E366] rounded-[20px] p-2 flex items-center justify-center text-[#3C5C98] font-semibold text-base'>BG</p>
                        </div>
                        <div id="guest-details" className='flex flex-col gap-1'>
                            <span id="guest-name" className='font-general font-semibold text-base text-[#111827]'>Darcel Ballentine</span>
                            <span id="guest-id" className='font-general font-medium text-sm text-[#718096]'>#342242</span>
                        </div>
                    </div>
                    <div id="guest-divider" className="border-t border-[#EEEFF2] my-4"></div>
                    
                    <div id="contact-info-section">
                        <p id="contact-info-title" className='font-general font-bold text-[14px] text-[#111827]'>Contact Information</p>
                        <div id="email-info" className='flex items-center gap-2 mt-3'>
                            <Mail id="email-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="email-text" className='text-[#718096] font-general font-medium text-[14px]'>darcelballentine@mail.com</p>
                        </div>
                        <div id="phone-info" className='flex items-center gap-2 mt-3'>
                            <Phone id="phone-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="phone-text" className='text-[#718096] font-general font-medium text-[14px]'>(671) 555-0110</p>
                        </div>
                    </div>
                    <div id="contact-divider" className="border-t border-[#EEEFF2] my-3"></div>

                    <div id="shipping-address-section">
                        <p id="shipping-title" className='font-general font-bold text-[14px] text-[#111827]'>Shipping Address</p>
                        <div id="shipping-address" className='flex items-center gap-2 mt-3'>
                            <MapPin id="shipping-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="shipping-text" className='text-[#718096] font-general font-medium text-[14px]'>wrw wr wr wrw r</p>
                        </div>
                    </div>
                    <div id="shipping-divider" className="border-t border-[#EEEFF2] my-3"></div>

                    <div id="billing-address-section">
                        <p id="billing-title" className='font-general font-bold text-[14px] text-[#111827]'>Billing Address</p>
                        <div id="billing-address" className='flex items-center gap-2 mt-3'>
                            <MapPin id="billing-icon" className='text-[#A0AEC0] h-[24px] w-[24px]' />
                            <p id="billing-text" className='text-[#718096] font-general font-medium text-[14px]'>wrw wr wr wrw r</p>
                        </div>
                    </div>
                    <div id="billing-divider" className="border-t border-[#EEEFF2] my-3"></div>
                </div>

                <div id="payment-info-card" className='bg-[#FFFFFF] rounded-[16px] p-5 mt-5 flex flex-col gap-5'>
                    <div id="payment-status" className='flex items-center gap-3 -mb-6'>
                        <div id="payment-icon-container" className='bg-green-50 p-2 rounded-[20px]'>
                            <CircleDollarSign id="payment-icon" className='h-[24px] w-[24px] text-green-600'/>
                        </div>
                        <span id="payment-status-text" className='text-green-600 font-general font-semibold text-base'>Paid</span>
                    </div>
                    <div id="payment-divider" className="border-t border-[#EEEFF2] my-3"></div>
                    
                    <div id="item-cost" className='flex items-center justify-between'>
                        <span id="item-label" className='text-[#718096] font-general font-medium text-[14px]'>1 item</span>
                        <span id="item-price" className='text-[#718096] font-general font-medium text-[14px]'>#50000</span>
                    </div>
                    
                    <div id="delivery-cost" className='flex items-center justify-between'>
                        <span id="delivery-label" className='text-[#718096] font-general font-medium text-[14px]'>Home Delivery</span>
                        <span id="delivery-price" className='text-[#718096] font-general font-medium text-[14px]'>#50000</span>
                    </div>
                    
                    <div id="total-cost" className='flex items-center justify-between'>
                        <span id="total-label" className='font-general font-bold text-[14px] text-[#111827]'>Total</span>
                        <span id="total-price" className='font-general font-bold text-[16px] text-[#111827]'>#50000</span>
                    </div>
                    
                    <div id="payment-method" className='flex items-center justify-between'>
                        <span id="method-label" className='text-[#718096] font-general font-medium text-[14px]'>Paid by Guest</span>
                        <span id="method-amount" className='font-general font-bold text-[16px] text-[#111827]'>#50000</span>
                    </div>
                </div>
                <div id="final-divider" className="border-t border-[#EEEFF2] my-3"></div>

                <div id="event-info-section">
                    <div id="event-card" className="bg-[#fff4ed] p-4 rounded-2xl mb-4">
                        <div id="event-header" className="flex items-center gap-4">
                            <div id="event-image-container" className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    id="event-image"
                                    src="/images/placeholder_eventCover2.jpg"
                                    alt="Event Cover"
                                    className="object-contain w-full h-full rounded-[12px]"
                                    width={20} 
                                    height={25} 
                                    quality={100}
                                    priority
                                />
                            </div>
                            <p id="event-title" className="text-gray-700 font-general font-bold text-[16px]">
                                Get ready to party with us, Get ready 
                            </p>
                        </div>

                        <div id="event-details">
                            <div id="event-date" className="-mt-2 border-t pt-3 text-gray-700">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <MdOutlineCalendarToday id="calendar-icon" size={18} />
                                    <span id="date-text">
                                        12 MAR, 2025 at 10:30AM WAT
                                    </span>
                                </div>
                                <p id="event-location" className="text-sm mt-1 text-gray-500">
                                    3, djdks fksjfljf sfjjfs
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