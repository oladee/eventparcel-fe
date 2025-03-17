"use client"

import { Checked } from '@/components/icons/Icons'
import HeaderLayout from '@/components/layout/HeaderLayout';
import { useRouter } from "next-nprogress-bar";


const SuccessPage: React.FC = () => {
  const router = useRouter();
  return (
    <HeaderLayout>
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] px-4" role="main">
      <div className="bg-white p-6 rounded-[24px] w-full max-w-md grid place-items-center text-center gap-4">
        <Checked width={100} height={100} />
        <p className="font-bold text-3xl" aria-live="polite">
          Your email address has been verified
        </p>
        <p className="font-medium text-[#718096]">
          You have successfully verified your email address on <br /> Event Parcel, you can now create an event
        </p>
        <button 
          onClick={() => router.push("/")} 
          className="button_v1"
          aria-label="Continue to Login"
        >
          Continue to Login
        </button>
      </div>
    </main>
    </HeaderLayout>
  );   
}

export default SuccessPage
