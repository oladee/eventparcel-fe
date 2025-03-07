import React from 'react'

const ForgotPassVerification = () => {
  return (
    <div>
      Forgot
    </div>
  )
}

export default ForgotPassVerification













// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next-nprogress-bar";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";
// import logo from "@/public/icons/logo.svg";
// import { z } from "zod";
// import axios from "axios";

// const otpSchema = z
//   .array(z.string().length(1, "Each digit must be 1 character"))
//   .length(5, "OTP must be exactly 5 digits");

// const Verification = () => {
//   const router = useRouter();
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleChange = (value: string, index: number) => {
//     if (value.length > 1 || !/\d/.test(value)) return;
//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < otp.length - 1) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleVerify = async () => {
//     try {
//       setLoading(true);
//       otpSchema.parse(otp);
//       const otpCode = otp.join("");
//       const email = localStorage.getItem("email");

//       if (!email) {
//         toast.error("Email not found. Please try again.");
//         return;
//       }

//       const response = await axiosInstance.post("/verify-otp", {
//         email,
//         otp: otpCode
//       });

//       toast.success(response?.data?.message || "OTP verified successfully!");
//       router.push("/reset-password");
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "OTP verification failed");
//       } else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     toast.info("Resending OTP");
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

//       toast.success(
//         response?.data?.message || "New OTP has been sent to your email/SMS"
//       );
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "OTP resend failed");
//       } else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
//       <div className="mb-6">
//         <Image src={logo} alt="logo" width={70} height={70} />
//       </div>
//       <div className="text-center mb-8">
//         <h1 className="text-2xl md:text-4xl font-bold text-[#0D0E0D]">
//           Enter OTP to Continue
//         </h1>
//         <p className="text-[#6B7280] font-normal">
//           Enter the OTP sent to your email
//         </p>
//       </div>
//       <div className="w-full max-w-md p-6">
//         <label
//           htmlFor="otp"
//           className="block text-sm font-medium text-[#475467] mb-4 text-left"
//         >
//           Enter verification code
//         </label>
//         <div className="grid grid-cols-5 gap-4 mb-4">
//           {otp.map((value, index) => (
//             <input
//               key={index}
//               id={`otp-${index}`}
//               type="text"
//               maxLength={1}
//               value={value}
//               onChange={(e) => handleChange(e.target.value, index)}
//               className="w-[43px] h-[53px] md:w-[63px] md:h-[73px] text-center text-xl border rounded-[10px] focus:ring-2 focus:ring-primary focus:outline-none"
//             />
//           ))}
//         </div>
//         <div className="flex justify-between items-center mb-6">
//           <p className="text-xs text-[#43564B]">
//             Resend code in{" "}
//             <span className="text-primary font-medium">2 min</span>
//           </p>
//           <button
//             onClick={handleResendCode}
//             className="text-primary text-sm font-medium flex items-center underline underline-offset-4 transition"
//           >
//             RESEND CODE
//           </button>
//         </div>
//         <button
//           onClick={handleVerify}
//           disabled={loading}
//           className="w-full bg-primary text-white py-2 px-4 rounded-[8px] hover:bg-green-600 transition flex justify-center items-center"
//         >
//           {loading ? (
//             <BiLoaderCircle className="mr-2 animate-spin" size={22} />
//           ) : (
//             "Verify to Continue"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Verification;
