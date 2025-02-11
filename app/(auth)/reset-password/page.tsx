import React from 'react'

const ResetPass = () => {
  return (
    <div>
      Reset
    </div>
  )
}

export default ResetPass














// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { FiLock } from "react-icons/fi";
// import { BiLoaderCircle } from "react-icons/bi";
// import { useRouter } from "next/navigation";
// import logo from "@/public/icons/logo.svg";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import { AiOutlineMail } from "react-icons/ai";
// import axios from "axios";

// interface FormData {
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// const Reset = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState({
//     password: false,
//     confirmPassword: false,
//   });
//   const [formData, setFormData] = useState<FormData>({
//     email:  "",
//     password: "",
//     confirmPassword: "",
//   });

//   const validatePassword = (password: string) => {
//     const minLength = 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumber = /\d/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//     if (password.length < minLength) {
//       return "Password must be at least 8 characters long";
//     }
//     if (!hasUpperCase) {
//       return "Password must contain at least one uppercase letter";
//     }
//     if (!hasLowerCase) {
//       return "Password must contain at least one lowercase letter";
//     }
//     if (!hasNumber) {
//       return "Password must contain at least one number";
//     }
//     if (!hasSpecialChar) {
//       return "Password must contain at least one special character";
//     }
//     return null;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
//     setShowPassword(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate email presence
//     if (!formData.email) {
//       toast.error("Email is required");
//       return;
//     }

//     // Validate passwords match
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     // Validate password strength
//     const passwordError = validatePassword(formData.password);
//     if (passwordError) {
//       toast.error(passwordError);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axiosInstance.post("/reset-password", {
//         email: formData.email,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword
//       });

//       toast.success(response.data.message || "Password reset successful");
//       router.push("/");
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         toast.error(
//           error.response?.data?.message || 
//           "Failed to reset password. Please try again."
//         );
//       } else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
//       <div className="mb-8">
//         <Image src={logo} alt="logo" width={60} height={60} priority />
//       </div>

//       <div className="w-full max-w-md bg-white rounded-lg py-6">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
//           Reset Password
//         </h2>
//         <p className="text-center text-gray-600 mb-6">
//           Enter your new password below
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//         <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-600 mb-2"
//           >
//             Enter Email Address
//           </label>
//           <div className="relative">
//             {/* Email Input */}
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               disabled={loading}
//               required
//             />
//             {/* Icon */}
//             <AiOutlineMail
//               size={20}
//               className="absolute right-3 top-3 text-gray-500"
//             />
//           </div>
//         </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               New Password
//             </label>
//             <div className="relative mt-1">
//               <FiLock className="absolute inset-y-0 top-2 left-3 text-gray-400" />
//               <input
//                 type={showPassword.password ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
//                 placeholder="Enter New Password"
//                 disabled={loading}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility('password')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
//               >
//                 {showPassword.password ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Confirm Password
//             </label>
//             <div className="relative mt-1">
//               <FiLock className="absolute inset-y-0 top-2 left-3 text-gray-400" />
//               <input
//                 type={showPassword.confirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
//                 placeholder="Confirm New Password"
//                 disabled={loading}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility('confirmPassword')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
//               >
//                 {showPassword.confirmPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 px-4 bg-primary hover:bg-green-600 text-white font-semibold rounded-[8px] shadow focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {loading ? (
//               <>
//                 <BiLoaderCircle className="animate-spin mr-2" />
//                 Resetting Password...
//               </>
//             ) : (
//               "Reset Password"
//             )}
//           </button>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Reset;




