"use client"
import HeaderLayout from '@/components/layout/HeaderLayout'
import { useRouter } from 'next/navigation';

export default function FailurePage() {
  const Router = useRouter();

  return (
    <HeaderLayout>
      <div id="failure-container" className="h-full rounded-xl bg-white p-4 space-y-4 mt-20">
        <div id="failure-content" className="flex flex-col items-center p-4 h-full">
            <h4 id="order-failed-title" className="text-2xl font-bold text-[#111827] font-general">Order Failed</h4>
          </div>

          <button 
              id="try-again-button"
              className="w-full h-14 rounded-[12px] mt-4 px-4 py-2 border border-[#751423] text-[#751423] text-sm font-semibold hover:bg-red-50 transition"
              onClick={() => Router.push("/guest-payment-details")}
            >
              Back To Payment Page
            </button>
        </div>
    </HeaderLayout>
  )
}
