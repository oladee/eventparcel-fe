"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import AuthLeft from "@/components/auth/AuthLeft";
import SocialSignup from "@/components/auth/SocialSignup";
import axiosInstance from "@/lib/axiosInstance";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { CheckCircle, XCircle } from "lucide-react";
import Cookies from "js-cookie"

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // phoneNumber: "", //Phone number handling its own error
    password: ""
  });

  const router = useRouter();

  // Validate input fields
  const validateInput = (name: string, value: string) => {
    let errorMessage = "";

    if (name === "firstName" || name === "lastName") {
      if (!/^[A-Za-z]+$/.test(value)) {
        errorMessage = "Only letters are allowed";
      }
    }

    if (name === "email") {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        errorMessage = "Enter a valid email address";
      }
    }

    //New validation created in PhoneNumberInput file
    // if (name === "phoneNumber") {
    //   if (!/^\d{10,15}$/.test(value)) {
    //     errorMessage = "Enter a valid phone number";
    //   }
    // }

    //New requirement format created in requirements array
    // if (name === "password") {
    //   if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(value)) {
    //     errorMessage =
    //       "Password must contain uppercase, lowercase, number, and special character";
    //   }
    // }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  // Password validation checks
  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one number", regex: /[0-9]/ },
    { label: "At least one special character (!@#$%^&*)", regex: /[!@#$%^&*]/ }
  ];

  // Handle input change
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/signup", formData);
      toast.success(response.data.message || "Signup successful!");
      localStorage.setItem("email", formData.email);
      router.push("/otp-verification");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phoneNumber &&
    formData.password &&
    Object.values(errors).every((err) => err === "");

  return (
    <>
      <main
        role="main"
        className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen"
      >
        <div className="flex items-center justify-center px-6 py-6 lg:mt-12">
          <form onSubmit={handleSubmit} className="max-w-md w-full">
            <h2
              role="heading"
              className="text-2xl lg:text-3xl font-bold mb-6 text-black-100"
            >
              Create an Account
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="mb-4">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="authInput"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  aria-required="true"
                  aria-describedby="firstNameError"
                />
                {errors.firstName && (
                  <p
                    id="firstNameError"
                    className="text-red-500 text-sm"
                    role="alert"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Last name"
                  id="Last name"
                  className="authInput"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  aria-required="true"
                  aria-describedby="lastNameError"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <input
                type="email"
                id="Email"
                placeholder="Email"
                className="authInput"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                aria-required="true"
                aria-describedby="email-desc"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* <div className="mb-4 relative overflow-hidden"> */}
            <div className="pb-3 overflow-hidden w-full">
              {/* <PhoneInput
                country={"ng"}
                value={formData.phoneNumber}
                onChange={(value) => handleChange("phoneNumber", value)}
                inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
                buttonClass="!border-none !rounded-l-[12px]"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )} */}
              {/* <PhoneNumberInput /> */}
              <PhoneNumberInput
                onPhoneChange={(value: string) =>
                  handleChange("phoneNumber", value)
                }
              />
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                placeholder="Password"
                className="authInput"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                aria-required="true"
                aria-describedby="password-desc"
              />
              <button
                type="button"
                className="absolute right-3 top-[16px] text-gray-500 outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {/* {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )} */}
            </div>

            {/* Password Requirements */}
            <ul className="mt-2 text-sm">
              {requirements.map((req, index) => {
                const isValid = req.regex.test(formData.password);
                return (
                  <li
                    key={index}
                    className={`flex text-xs items-center gap-2 ${
                      isValid ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isValid ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}{" "}
                    {req.label}
                  </li>
                );
              })}
            </ul>

            <div className="text-left text-black-100 my-2 text-sm md:text-base">
              By proceeding, you agree to the{" "}
              <a href="/terms" className="text-primary font-bold">
                Terms and Conditions
              </a>
            </div>

            <button
              id="submit"
              type="submit"
              className={`button_v1 mb-4 w-full flex justify-center items-center ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isFormValid || isLoading}
              aria-disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <BiLoaderCircle
                  className="animate-spin h-6 w-6"
                  aria-hidden="true"
                />
              ) : (
                "Sign up"
              )}
            </button>

            <div className="text-center text-gray-500 text-sm mb-4">
              Or sign up with
            </div>

            <SocialSignup />

            <div className="text-left text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <a
                href="#"
                className="text-primary font-bold"
                onClick={() => router.push("/")}
              >
                Sign In
              </a>
            </div>
          </form>
        </div>

        <AuthLeft />
      </main>
      <ToastContainer role="alert" />
    </>
  );
};

export default Signup;
