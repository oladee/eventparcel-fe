"use client";
import React from "react";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useRouter } from "next-nprogress-bar";

const AlreadyVerify = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.replace("/login");
  };

  return (
    <HeaderLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            You&apos;re Already Verified!
          </h1>
          <p className="text-gray-600 mt-4">
            Your account has already been verified. You can proceed to log in and start using our platform.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="mt-6 bg-primary text-white py-3 px-6 rounded-[8px] text-lg font-semibold hover:bg-red-800 transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default AlreadyVerify;