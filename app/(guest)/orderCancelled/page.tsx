"use client"

import Image from 'next/image'
import failure from "../../../assets/orderIcons/payment-failure.png"  // Change to failure icon
import HeaderLayout from '@/components/layout/HeaderLayout'
import logo from "../../../public/images/logo4.png"
import { useRouter } from 'next/navigation';

export default function FailurePage() {
  const Router = useRouter();

  return (
    <HeaderLayout>
      <div id="failure-container" className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20">
        <div id="failure-content" className="flex flex-col items-center justify-between p-4 bg-[#f9fafb] h-[675px]">
          {/* Order Failed Card */}
          <div id="order-failed-card" className="bg-white rounded-2xl shadow px-6 py-4 w-full h-[253px] max-w-sm text-center">
            <div id="failure-icon-container" className="flex justify-center mb-4">
              <div id="failure-icon-bg" className="bg-red-100 rounded-full p-3">
                <Image 
                  id="failure-icon"
                  src={failure} 
                  alt="Payment failure icon"
                  height={80}
                  width={80}
                />
              </div>
            </div>
            <h4 id="order-failed-title" className="text-2xl font-bold text-[#111827] font-general">Order Failed</h4>
            <p
                id="order-failed-description"
                className="text-sm text-[#718096] font-medium mt-1 w-[269px] h-[66px] leading-[160%] tracking-[0px]"
              >
                Unfortunately, your order could not be placed. Please try again or contact support.
            </p>
          </div>

          {/* Try Again Card */}
          <div id="try-again-card" className="flex flex-col gap-[10px] h-[240px] bg-white rounded-2xl shadow p-6 w-full max-w-sm text-center">
            <div id="logo-container" className="flex justify-center mb-3">
              <Image
                id="event-logo"
                src={logo} 
                alt="Event Parcel logo"
                width={62.8}
                height={28}
                style={{width:"62.8px", height:"28px"}}
              />
            </div>
            <h3 id="try-again-title" className="text-xl font-bold tracking-[0px] text-[#111827]">Need help with your order?</h3>
            <button 
              id="try-again-button"
              className="w-full h-14 rounded-[12px] mt-4 px-4 py-2 border border-[#751423] text-[#751423] text-sm font-semibold hover:bg-red-50 transition"
              onClick={() => Router.push("/guest-payment-details")}
            >
              Back To Payment Page
            </button>
          </div>
        </div>
      </div>
    </HeaderLayout>
  )
}
