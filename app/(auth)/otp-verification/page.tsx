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


const otpSchema = z
  .array(z.string().length(1, "Each digit must be 1 character"))
  .length(6, "OTP must be exactly 6 digits");

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  const maskedName = name.slice(0, 5) + "*****";
  return `${maskedName}@${domain}`;
};


const Verification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [myEmail, setMyEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(120); // 2 minutes countdown


  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email");
      setMyEmail(email);
    }
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);


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
      const email = localStorage.getItem("email");

      if (!email) {
        toast.error("Email not found. Please try again.");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post("/verify-otp", {
        email,
        otp: otpCode,
      });

      setOnSuccess(true);
      console.log(response);

      setTimeout(() => {
        router.push("/");
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
      const email = localStorage.getItem("email");

      if (!email) {
        toast.error("Email not found. Please try again.");
        return;
      }

      const response = await axiosInstance.post("/resend-otp", {
        email
      });

      toast.success(response?.data?.message || "New OTP has been sent to your email/SMS");
      setOtp(["", "", "", "", "", ""]); // Clear the OTP inputs
      setCountdown(120); // Reset the countdown timer
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "OTP resend failed");
      }
      else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] px-4">
        {
          !onSuccess && <div className="bg-white p-6 rounded-[24px]">
            <div className="text-left mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-[#0D0E0D]">
                Enter verification code
              </h1>
              <p className="text-[#718096] font-normal mt-2">
                We have just sent a verification code to <br /> {myEmail && maskEmail(myEmail)}
              </p>
            </div>

            <div className="w-full max-w-md ">
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
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs text-[#43564B]">
                  Resend code in{" "}
                  <span className="text-primary font-medium">{countdown}</span>
                </p>
                <button
                  onClick={handleResendCode}
                  className="text-primary font-bold text-sm flex items-center hover:underline underline-offset-4 transition"
                >
                  Send the code again
                </button>
              </div>
              <button
                // onClick={handleVerify}
                onClick={() => handleVerify()}
                disabled={loading}
                className="button_v1"
              >
                {loading ? (
                  <BiLoaderCircle className="mr-2 animate-spin" size={22} />
                ) : (
                  "Verify to Continue"
                )}
              </button>
            </div>
          </div>
        }

        {
          onSuccess && <Success />
        }

      </div>
    </>
  );
};

export default Verification;

















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


//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const email = localStorage.getItem("email");
//       setMyEmail(email);
//     }
//     inputRefs.current[0]?.focus();
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

//   // const handleChange = (value: string, index: number) => {
//   //   if (!/\d/.test(value) && value !== "") return;
//   //   const updatedOtp = [...otp];
//   //   updatedOtp[index] = value;
//   //   setOtp(updatedOtp);

//   //   if (value && index < otp.length - 1) {
//   //     inputRefs.current[index + 1]?.focus();
//   //   } else if (index === otp.length - 1 && value) {
//   //     handleVerify();
//   //   }
//   // };



//   // const handleVerify = async () => {
//   //   try {
//   //     setLoading(true);
//   //     otpSchema.parse(otp);
//   //     const otpCode = otp.join("");
//   //     const email = localStorage.getItem("email");

//   //     if (!email) {
//   //       toast.error("Email not found. Please try again.");
//   //       setLoading(false); // Ensure loading is set to false
//   //       return;
//   //     }

//   //     const response = await axiosInstance.post("/verify-otp", {
//   //       email,
//   //       otp: otpCode
//   //     });

//   //     setOnSuccess(true);
//   //     console.log(response);

//   //     setTimeout(() => {
//   //       router.push("/");
//   //     }, 3000);

//   //   } catch (error: unknown) {
//   //     console.error("Verification error:", error); // Log the error for debugging
//   //     if (axios.isAxiosError(error)) {
//   //       toast.error(error.response?.data?.message || "OTP verification failed");
//   //     }
//   //      else {
//   //       toast.error("An unexpected error occurred");
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

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
//                   <span className="text-primary font-medium">2 min</span>
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
