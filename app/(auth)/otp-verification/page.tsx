"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/lib/axiosInstance";
import { useForm, Controller } from "react-hook-form";
import AuthLeft from "@/components/auth/AuthLeft";
import { BiLoaderCircle } from "react-icons/bi";
import SocialSignup from "@/components/auth/SocialSignup";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch, trigger, setError } = useForm<SignupFormData>();
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/signup', data);
      toast.success(response.data.message || "Signup successful!");
      localStorage.setItem("email", data.email);
      router.push("/otp-verification");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allFieldsFilled = watch("firstName") && watch("lastName") && watch("email") && watch("phoneNumber") && watch("password");

  const handleValidation = async (name:  keyof SignupFormData) => {
    const result = await trigger(name);
    if (!result) {
      setError(name, { type: "manual", message: `${name} is required` });
    }
  };

  return (
    <>
      <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Signup Form */}
        <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
          <div className="max-w-md w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
              Create an Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-4">
                {/* FirstName Input */}
                <div className="mb-4">
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "First name is required",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "First name can only contain letters"
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="First Name"
                        className="authInput"
                        onChange={(e) => {
                          field.onChange(e);
                          handleValidation("firstName");
                        }}
                        onBlur={() => trigger("firstName")}
                      />
                    )}
                  />
                  {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                </div>

                {/* Lastname Input */}
                <div className="mb-4">
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Last name is required",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Last name can only contain letters"
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Last Name"
                        className="authInput"
                        onChange={(e) => {
                          field.onChange(e);
                          handleValidation("lastName");
                        }}
                        onBlur={() => trigger("lastName")}
                      />
                    )}
                  />
                  {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Email"
                      className="authInput"
                      onChange={(e) => {
                        field.onChange(e);
                        handleValidation("email");
                      }}
                      onBlur={() => trigger("email")}
                    />
                  )}
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              {/* Phone Input */}
              <div className="mb-4">
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      country={"ng"}
                      inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
                      buttonClass="!border-none !rounded-l-[12px]"
                      onChange={(value) => {
                        field.onChange(value);
                        handleValidation("phoneNumber");
                      }}
                      onBlur={() => trigger("phoneNumber")}
                    />
                  )}
                />
                {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
              </div>

              {/* Password Input */}
              <div className="mb-4 relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long"
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must contain uppercase, lowercase, number, and special character"
                    }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="authInput"
                      onChange={(e) => {
                        field.onChange(e);
                        handleValidation("password");
                      }}
                      onBlur={() => trigger("password")}
                    />
                  )}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-[16px] text-gray-500 outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              {/* Terms and conditions Link */}
              <div className="text-left text-black-100 mb-4 text-sm md:text-base">
                By proceeding, you agree to the <a href="/terms" className="text-primary font-bold">Terms and Conditions</a>
              </div>

              {/* Signup Button */}
              <button type="submit" className="button_v1 mb-4" disabled={loading || !allFieldsFilled}>
                {loading ? <BiLoaderCircle className="animate-spin text-center" /> : "Sign up"}
              </button>
            </form>

            {/* Or Signup With */}
            <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

            {/* Social Signup Buttons */}
            <SocialSignup />

            {/* Login Link */}
            <div className="text-left text-sm text-gray-500 mt-6">
              Already have an account? <a href="#" className="text-primary font-bold" onClick={() => router.push("/")}>sign In</a>
            </div>
          </div>
        </div>

        {/* Right Side - Image & Carousel */}
        <AuthLeft />
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;













// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "@/lib/axiosInstance";
// import { useForm, Controller } from "react-hook-form";
// import AuthLeft from "@/components/auth/AuthLeft";
// import { BiLoaderCircle } from "react-icons/bi";
// import SocialSignup from "@/components/auth/SocialSignup";

// interface SignupFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
// }

// const Signup: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { control, handleSubmit, formState: { errors }, watch, trigger } = useForm<SignupFormData>();
//   const router = useRouter();

//   const onSubmit = async (data: SignupFormData) => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.post('/signup', data);
//       toast.success(response.data.message || "Signup successful!");
//       localStorage.setItem("email", data.email);
//       router.push("/otp-verification");
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Signup failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const allFieldsFilled = watch("firstName") && watch("lastName") && watch("email") && watch("phoneNumber") && watch("password");

//   return (
//     <>
//       <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
//         {/* Left Side - Signup Form */}
//         <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
//           <div className="max-w-md w-full">
//             <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Create an Account
//             </h2>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {/* FirstName Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="firstName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "First name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "First name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="First Name"
//                         className="authInput"
//                         onBlur={() => trigger("firstName")}
//                       />
//                     )}
//                   />
//                   {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
//                 </div>

//                 {/* Lastname Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="lastName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "Last name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "Last name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="Last Name"
//                         className="authInput"
//                         onBlur={() => trigger("lastName")}
//                       />
//                     )}
//                   />
//                   {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="email"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                       message: "Invalid email address"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type="email"
//                       placeholder="Email"
//                       className="authInput"
//                       onBlur={() => trigger("email")}
//                     />
//                   )}
//                 />
//                 {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//               </div>

//               {/* Phone Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="phoneNumber"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "Phone number is required" }}
//                   render={({ field }) => (
//                     <PhoneInput
//                       {...field}
//                       country={"ng"}
//                       inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
//                       buttonClass="!border-none !rounded-l-[12px]"
//                       onBlur={() => trigger("phoneNumber")}
//                     />
//                   )}
//                 />
//                 {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
//               </div>

//               {/* Password Input */}
//               <div className="mb-4 relative">
//                 <Controller
//                   name="password"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters long"
//                     },
//                     pattern: {
//                       value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                       message: "Password must contain uppercase, lowercase, number, and special character"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className="authInput"
//                       onBlur={() => trigger("password")}
//                     />
//                   )}
//                 />
//                 <button
//                   type="button"
//                   aria-label="Toggle password visibility"
//                   className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//               </div>

//               {/* Terms and conditions Link */}
//               <div className="text-left text-black-100 mb-4 text-sm md:text-base">
//                 By proceeding, you agree to the <a href="/terms" className="text-primary font-bold">Terms and Conditions</a>
//               </div>

//               {/* Signup Button */}
//               <button type="submit" className="button_v1 mb-4" disabled={loading || !allFieldsFilled}>
//                 {loading ? <BiLoaderCircle className="animate-spin text-center" /> : "Sign up"}
//               </button>
//             </form>

//             {/* Or Signup With */}
//             <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

//             {/* Social Signup Buttons */}
//             <SocialSignup />

//             {/* Login Link */}
//             <div className="text-left text-sm text-gray-500 mt-6">
//               Already have an account? <a href="#" className="text-primary font-bold" onClick={() => router.push("/")}>sign In</a>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Signup;


























// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next-nprogress-bar";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";
// import axios from "axios";
// import { z } from "zod";
// import Success from "@/components/auth/Success";


// const otpSchema = z
//   .array(z.string().length(1, "Each digit must be 1 character"))
//   .length(6, "OTP must be exactly 6 digits");

// const maskEmail = (email: string) => {
//   const [name, domain] = email.split("@");
//   const maskedName = name.slice(0, 5) + "*****";
//   return `${maskedName}@${domain}`;
// };


// const Verification = () => {
//   const router = useRouter();
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [onSuccess, setOnSuccess] = useState<boolean>(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const [myEmail, setMyEmail] = useState<string | null>(null);
//   const [countdown, setCountdown] = useState<number>(120); // 2 minutes countdown


//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const email = localStorage.getItem("email");
//       setMyEmail(email);
//     }
//     inputRefs.current[0]?.focus();

//     const timer = setInterval(() => {
//       setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);


//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };



//   const handleChange = (value: string, index: number) => {
//     if (!/\d/.test(value) && value !== "") return;
//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < otp.length - 1) {
//       inputRefs.current[index + 1]?.focus();
//     } else if (index === otp.length - 1 && value) {
//       handleVerify(updatedOtp); // Pass the updated array here
//     }
//   };

//   const handleVerify = async (otpArray?: string[]) => {
//     try {
//       setLoading(true);
//       const currentOtp = otpArray || otp; // Use the passed array or state
//       otpSchema.parse(currentOtp);
//       const otpCode = currentOtp.join("");
//       const email = localStorage.getItem("email");

//       if (!email) {
//         toast.error("Email not found. Please try again.");
//         setLoading(false);
//         return;
//       }

//       const response = await axiosInstance.post("/verify-otp", {
//         email,
//         otp: otpCode,
//       });

//       setOnSuccess(true);
//       console.log(response);

//       setTimeout(() => {
//         router.push("/");
//       }, 3000);
//     } catch (error: unknown) {
//       console.error("Verification error:", error);
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "OTP verification failed");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleResendCode = async () => {
//     try {
//       setLoading(true);
//       const email = localStorage.getItem("email");

//       if (!email) {
//         toast.error("Email not found. Please try again.");
//         return;
//       }

//       const response = await axiosInstance.post("/resend-otp", {
//         email
//       });

//       toast.success(response?.data?.message || "New OTP has been sent to your email/SMS");
//       setOtp(["", "", "", "", "", ""]); // Clear the OTP inputs
//       setCountdown(120); // Reset the countdown timer
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "OTP resend failed");
//       }
//       else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] px-4">
//         {
//           !onSuccess && <div className="bg-white p-6 rounded-[24px]">
//             <div className="text-left mb-8">
//               <h1 className="text-xl md:text-2xl font-bold text-[#0D0E0D]">
//                 Enter verification code
//               </h1>
//               <p className="text-[#718096] font-normal mt-2">
//                 We have just sent a verification code to <br /> {myEmail && maskEmail(myEmail)}
//               </p>
//             </div>

//             <div className="w-full max-w-md ">
//               <div className="grid grid-cols-6 gap-4 mb-4">
//                 {otp.map((value, index) => (
//                   <input
//                     key={index}
//                     id={`otp-${index}`}
//                     type="text"
//                     maxLength={1}
//                     value={value}
//                     onChange={(e) => handleChange(e.target.value, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     ref={(el) => {
//                       inputRefs.current[index] = el;
//                     }}
//                     className="w-[43px] h-[43px] md:w-[53px] md:h-[63px] text-center text-xl border rounded-[10px] focus:ring-2 focus:ring-primary focus:outline-none"
//                   />
//                 ))}
//               </div>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-xs text-[#43564B]">
//                   Resend code in{" "}
//                   <span className="text-primary font-medium">{countdown}</span>
//                 </p>
//                 <button
//                   onClick={handleResendCode}
//                   className="text-primary font-bold text-sm flex items-center hover:underline underline-offset-4 transition"
//                 >
//                   Send the code again
//                 </button>
//               </div>
//               <button
//                 // onClick={handleVerify}
//                 onClick={() => handleVerify()}
//                 disabled={loading}
//                 className="button_v1"
//               >
//                 {loading ? (
//                   <BiLoaderCircle className="mr-2 animate-spin" size={22} />
//                 ) : (
//                   "Verify to Continue"
//                 )}
//               </button>
//             </div>
//           </div>
//         }

//         {
//           onSuccess && <Success />
//         }

//       </div>
//     </>
//   );
// };

// export default Verification;

