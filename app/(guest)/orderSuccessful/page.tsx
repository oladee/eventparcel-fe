"use client";

import Image from 'next/image';
import success from "../../../assets/orderIcons/payment-success.png";
import HeaderLayout from '@/components/layout/HeaderLayout';
import logo from "../../../public/images/logo4.png";
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/store/useCartStore';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/mixpanel';

export default function ConfirmationCards() {
  const Router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const successEvent = JSON.parse(localStorage.getItem('lastSuccessfulEvent') || '{}');
     trackEvent("Purchase Successful", successEvent.data);

  }, []);

  return (
    <HeaderLayout>
      <div id="confirmation-container" className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20">
        <div id="confirmation-content" className="flex flex-col items-center justify-between p-4 bg-[#f9fafb] h-[675px]">
          {/* Order Placed Card */}
          <div id="order-placed-card" className="bg-white rounded-2xl shadow px-6 py-4 w-full h-[280px] max-w-sm text-center">
            <div id="success-icon-container" className="flex justify-center mb-4">
              <div id="success-icon-bg" className="bg-green-100 rounded-full p-3">
                <Image 
                  id="success-icon"
                  src={success} 
                  alt="Payment success icon"
                  height={80}
                  width={80}
                />
              </div>
            </div>
            <h4 id="order-placed-title" className="text-2xl font-bold text-[#111827] font-general">Order placed</h4>
            <p
              id="order-placed-description"
              className="text-sm w-full text-[#718096] font-medium mt-1 leading-[160%] tracking-[0px] text-center"
            >
             You have successfully placed an order, your delivery update will be sent via email and phone
            </p>
          </div>

          {/* Create Event Card */}
          <div id="create-event-card" className="flex flex-col gap-[10px] h-[240px] bg-white rounded-2xl shadow p-6 w-full max-w-sm text-center">
            <div id="logo-container" className="flex justify-center mb-3">
              <Image
                id="event-logo"
                src={logo} 
                alt="Event Parcel logo"
                width={62.8}
                height={28}
                style={{ width: "62.8px", height: "28px" }}
              />
            </div>
            <h3 id="create-event-title" className="text-xl font-bold tracking-[0px] text-[#111827]">Want to create an event package like this?</h3>
            <button 
              id="create-event-button"
              className="w-full h-14 rounded-[12px] mt-4 px-4 py-2 border border-[#751423] text-[#751423] text-sm font-semibold hover:bg-red-50 transition"
              onClick={() => Router.push("/event-creation")}
            >
              Create an Event
            </button>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
