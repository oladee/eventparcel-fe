"use client";

import React from "react";
import {  usePathname, useRouter } from "next/navigation"; // Import useRouter for navigation
import { FiLogOut } from "react-icons/fi";
import { trackEvent } from "@/lib/mixpanel";

const ToolTipProfileHost: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  const handleLogout = () => {
    trackEvent("Logout", {
      source: `${pathname} page`,
      timestamp: new Date().toISOString(),
      page_name: `${pathname} page`,
    });
    localStorage.clear(); // Clear localStorage
    router.replace("/"); // Navigate to /login
  };

  const handleChangePassword = () => {
    router.push("/dashboard/changePassword"); // Navigate to change password page
  };

  return (
    <div
      className="
        absolute -right-11 top-full mt-2
        w-56 bg-white rounded-xl shadow-xl z-50
      "
    >
      <div className="flex flex-col divide-y divide-gray-200">
        <button
          onClick={handleChangePassword} // Attach the change password handler
          className="px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
        >
          Change Password
        </button>
      </div>

      <div className="border-gray-200 px-4 py-3 rounded-b-xl">
        <button
          onClick={handleLogout} // Attach the logout handler
          className="flex items-center space-x-2 text-red-500 hover:bg-red-50 w-full text-left rounded"
        >
          <FiLogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ToolTipProfileHost;
