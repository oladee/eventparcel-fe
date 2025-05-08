// pages/admin/change-pass.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AdminContainer from "@/components/admin/AdminContainer";
import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePass: React.FC = () => {
  // form fields
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // visibility toggles
  const [currentVisible, setCurrentVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // grab email from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.email) setEmail(u.email);
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.put("/change-admin-password", {
        email,
        currentPassword,
        password,
        confirmPassword,
      });
      toast.success("Password changed successfully");
      // clear form
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to change password";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 grid gap-6"
        >
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900">
            Change Password
          </h2>
          <div className="h-0.5 bg-gray-200 w-full" />

          {/* Current Password */}
          <div className="flex flex-col">
            <label className="text-gray-500 mb-2">Current Password</label>
            <div className="relative">
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type={currentVisible ? "text" : "password"}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setCurrentVisible((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {currentVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-gray-500 mb-2">New Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={newVisible ? "text" : "password"}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setNewVisible((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {newVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col">
            <label className="text-gray-500 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={confirmVisible ? "text" : "password"}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setConfirmVisible((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {confirmVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              mt-4 w-full 
              ${isSubmitting ? "bg-red-700" : "bg-red-900 hover:bg-red-800"} 
              text-white font-semibold py-4 rounded-xl transition-colors flex justify-center items-center
            `}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </AdminContainer>
  );
};

export default ChangePass;



















// // pages/admin/change-pass.tsx
// "use client";

// import React, { useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import AdminContainer from "@/components/admin/AdminContainer";
// import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'

// const ChangePass: React.FC = () => {
//   const [currentVisible, setCurrentVisible] = useState(false);
//   const [newVisible, setNewVisible] = useState(false);
//   const [confirmVisible, setConfirmVisible] = useState(false);

//   return (
//     <AdminContainer>
//       <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
//         <div className="w-full max-w-md rounded-2xl grid gap-6">
//           {/* Header */}
//           <h2 className="text-2xl font-bold text-gray-900">
//             Change Password
//           </h2>
//           <div className="h-0.5 bg-gray-200 w-full" />

//           {/* Current Password */}
//           <div className="flex flex-col">
//             <label className="text-gray-500 mb-2">Current Password</label>
//             <div className="relative">
//               <input
//                 type={currentVisible ? "text" : "password"}
//                 className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setCurrentVisible(v => !v)}
//                 className="absolute inset-y-0 right-4 flex items-center text-gray-400"
//               >
//                 {currentVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* New Password */}
//           <div className="flex flex-col">
//             <label className="text-gray-500 mb-2">New Password</label>
//             <div className="relative">
//               <input
//                 type={newVisible ? "text" : "password"}
//                 className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setNewVisible(v => !v)}
//                 className="absolute inset-y-0 right-4 flex items-center text-gray-400"
//               >
//                 {newVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm New Password */}
//           <div className="flex flex-col">
//             <label className="text-gray-500 mb-2">Confirm New Password</label>
//             <div className="relative">
//               <input
//                 type={confirmVisible ? "text" : "password"}
//                 className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setConfirmVisible(v => !v)}
//                 className="absolute inset-y-0 right-4 flex items-center text-gray-400"
//               >
//                 {confirmVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="mt-4 w-full bg-red-900 text-white font-semibold py-4 rounded-xl hover:bg-red-800 transition-colors"
//           >
//             Change Password
//           </button>
//         </div>
//       </div>
//     </AdminContainer>
//   );
// };

// export default ChangePass;
