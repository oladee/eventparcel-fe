"use client";
import React, { useState } from "react";
import Image from "next/image";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useRouter } from "next-nprogress-bar";

const Page: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    console.log("Login button clicked");
    router.push("/admin/admin-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] px-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          {/* Place your logo.svg in /public */}
          <Image
            src="/images/logo4.png"
            alt="Event Parcel"
            width={70}
            height={70}
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-lg font-bold text-gray-900 mb-6">
          Login to your admin account
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="grid gap-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full py-3 px-4 bg-gray-100 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#7E1C2B] focus:bg-white"
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full py-3 px-4 bg-gray-100 pr-12 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#7E1C2B] focus:bg-white"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? (
                <HiOutlineEyeOff size={20} color="gray" />
              ) : (
                <HiOutlineEye size={20} color="gray" />
              )}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                id="checkbox"
                className="rounded-checkbox"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a
              href="/forgot-password"
              className="text-primary text-xs font-semibold hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="button_v1">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
