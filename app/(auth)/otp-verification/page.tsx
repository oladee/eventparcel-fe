"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { z } from "zod";
import Success from "@/components/auth/Success";
import Cookies from "js-cookie";
import HeaderLayout from "@/components/layout/HeaderLayout";

const otpSchema = z
  .array(z.string().length(1, "Each digit must be 1 character"))
  .length(6, "OTP must be exactly 6 digits");

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  const maskedName = name.slice(0, 5) + "*****";
  return `${maskedName}@${domain}`;
};

const Verification = () => {
  // Variables
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [myEmail, setMyEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = Cookies.get("email") || "";

      if (!email) {
        router.push("/signup");
        return;
      }

      setMyEmail(email);
      setIsLoading(false);
    }
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking Email Exist...
      </div>
    );
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/\d/.test(value) && value !== "") return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (index === otp.length - 1 && value) {
      handleVerify(updatedOtp); // Pass the updated array here
    }
  };

  const handleVerify = async (otpArray?: string[]) => {
    try {
      setLoading(true);
      const currentOtp = otpArray || otp; // Use the passed array or state
      otpSchema.parse(currentOtp);
      const otpCode = currentOtp.join("");
      const email = Cookies.get("email");

      if (!email) {
        toast.error("Email is required. Redirecting to signup.");
        router.push("/signup");
        return;
      }

      const response = await axiosInstance.post("/verify-otp", {
        email,
        otp: otpCode
      });

      setOnSuccess(true);
      console.log(response);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      console.error("Verification error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      // const email = localStorage.getItem("email");
      const email = Cookies.get("email");

      if (!email) {
        toast.error("Email is required. Redirecting to signup.");
        router.push("/signup");
        return;
      }

      const response = await axiosInstance.post("/resend-otp", {
        email
      });

      toast.success(
        response?.data?.message || "New OTP has been sent to your email/SMS"
      );
      setOtp(["", "", "", "", "", ""]); // Clear the OTP inputs
      setCountdown(60); // Reseting the countdown timer
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "OTP resend failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <HeaderLayout>
      <ToastContainer role="alert" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] px-4">
        {!onSuccess && (
          <div
            className="bg-white p-6 rounded-[24px]"
            role="form"
            aria-labelledby="verification-title"
          >
            <div className="text-left mb-8">
              <h1
                id="verification-title"
                className="text-xl md:text-2xl font-bold text-[#0D0E0D]"
              >
                Enter verification code
              </h1>
              <p className="text-[#718096] font-normal mt-2">
                We have just sent a verification code to <br />{" "}
                {myEmail && maskEmail(myEmail)}
              </p>
            </div>

            <div className="w-full max-w-md">
              <fieldset>
                <legend className="sr-only">
                  Enter 6-digit verification code
                </legend>
                <div className="grid grid-cols-6 gap-4 mb-4">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="w-[43px] h-[43px] md:w-[53px] md:h-[63px] text-center text-xl border rounded-[10px] focus:ring-2 focus:ring-primary focus:outline-none"
                      aria-label={`Digit ${index + 1} of verification code`}
                      aria-required="true"
                    />
                  ))}
                </div>
              </fieldset>

              <div className="flex justify-between items-center text-xs mb-6">
                <div>
                  {/* {countdown > 0 && (
                  <p>
                    Resend code in{" "}
                    <span className="font-medium">{countdown}</span> seconds
                  </p>
                )} */}
                  <p>
                    Resend code in{" "}
                    <span className="font-medium">{countdown}</span> seconds
                  </p>
                </div>
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className={`${
                    countdown > 0 ? "text-[#751423a0]" : "text-primary"
                  } font-bold text-sm flex items-center  hover:underline underline-offset-4 transition`}
                  aria-disabled={countdown > 0}
                >
                  Send the code again
                </button>
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={loading}
                className="button_v1"
                aria-disabled={loading}
              >
                {loading ? (
                  <BiLoaderCircle
                    className="mr-2 animate-spin"
                    size={22}
                    aria-hidden="true"
                  />
                ) : (
                  "Verify to Continue"
                )}
              </button>
            </div>
          </div>
        )}

        {onSuccess && <Success />}
      </div>
    </HeaderLayout>
  );
};

export default Verification;
