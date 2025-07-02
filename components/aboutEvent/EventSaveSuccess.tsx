import React from 'react';
import Checked  from '../../public/images/goldenIcon.png';
import Link from "next/link";
import Image from 'next/image';

const EventSaveSuccess: React.FC = () => {
  return (
    <div className="fixed p-4 w-screen inset-0  overflow-y-auto  bg-[#00000098] h-screen left-0 top-0 z-30 flex items-center justify-center md:justify-center px-2">
    <div className="bg-white p-6 rounded-[24px] w-full  max-w-md grid place-items-center text-center gap-4">
      <Image 
        src={Checked}
        alt=''
        width={100}
        height={100}
      />
      <p className="font-bold text-2xl md:text-3xl">
        You need to signup or login to save for later
      </p>
      <p className="font-medium text-[#718096]">
        Create an account or login to your account to complete this action
      </p>
      
      <Link href="/signup" className="button_v1">
        <button className="">Create Account</button>
      </Link>
      <Link href="/login" className="w-full bg-[#FFFFFF] text-[#111827] border border-[#111827] py-3 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center">
        <button className="">login</button>
      </Link>
    </div>
  </div>
  );
};

export default EventSaveSuccess;