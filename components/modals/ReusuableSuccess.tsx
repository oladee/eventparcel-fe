"use client";

import React from "react";
import { Checked } from "../icons/Icons";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  title: string;
  subtitle: string;
  buttonText: string;
  route: string;
}

const ReusuableSuccess: React.FC<SuccessModalProps> = ({
  title,
  subtitle,
  buttonText,
  route
}) => {
  const router = useRouter();

  return (
    <div className="fixed p-4 w-screen inset-0 z-50  overflow-y-auto  bg-[#00000098] h-screen left-0 top-0 z-30 flex items-center justify-center md:justify-center px-2">
      <div className="bg-white p-6 rounded-[24px] w-full max-w-md grid place-items-center text-center gap-4">
        <Checked width={100} height={100} />
        <p className="font-bold text-2xl md:text-3xl">{title}</p>
        <p className="font-medium text-[#718096]">{subtitle}</p>
        <button
          onClick={() => {
            router.push(route);
          }}
          className="button_v1 !font-bold"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ReusuableSuccess;
