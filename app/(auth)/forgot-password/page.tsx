"use client";

import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";
import axiosInstance from "@/lib/axiosInstance";
import AuthLeft from "@/components/auth/AuthLeft";

const Page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
  const router = useRouter();

  // Handle input change and validation
  const handleChange = (name: string, value: string) => {
    if (name === "email") {
      setEmail(value);
    }

    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email address",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // Handle forgot password request
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        "/forgot-password",
        { email },
        {
          withCredentials: true,
        }
      );
        
      // Set email to localStorage with key "forgotPasswordEmail"
      localStorage.setItem("forgotPasswordEmail", email);
  
      // Simulate the timeout before redirecting to OTP verification page
      setTimeout(() => {
        router.push("/forgot-password-email-verification");
      }, 3000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && !errors.email;

  return (
    <>
      <main className="grid lg:grid-cols-2 min-h-screen mt-8 md:mt-4 lg:mt-0" role="main">
        {/* Left Side - Forgot Password Form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="max-w-md w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
              Forgot your password?
            </h2>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="forgot-email" className="sr-only">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                className="authInput"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                aria-required="true"
              />
              {errors.email && (
                <p id="email-desc" className="text-red-500 text-sm" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Send Reset Link Button */}
            <button
              className={`button_v1 mb-4 w-full flex justify-center items-center ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleForgotPassword}
              disabled={!isFormValid || loading}
              aria-disabled={!isFormValid || loading}
            >
              {loading ? (
                <BiLoaderCircle className="animate-spin mr-2" size={22} />
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-left text-sm text-gray-500 mt-6">
              Remember your password?{" "}
              <a
                href="#"
                className="text-primary font-bold"
                onClick={() => router.push("/")}
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Image & Carousel */}
        <AuthLeft />
      </main>

      {/* Toast Notifications */}
      <ToastContainer aria-live="polite" />
    </>
  );
};

export default Page;
