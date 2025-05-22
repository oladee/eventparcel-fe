"use client";

import { trackEvent } from "@/lib/mixpanel";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import React from "react";
import { FiLogOut } from "react-icons/fi";

const ToolTipProfile: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  const handleLogout = () => {
    trackEvent("Logout", {
      source: `${pathname} page`,
      timestamp: new Date().toISOString(),
      page_name: `${pathname} page`,
    });

    localStorage.clear(); // Clear localStorage
    router.replace("/adminLogin"); // Navigate to /adminLogin
  };

  const handleChangePassword = () => {
    router.push("/admin/admin-changePassword"); // Navigate to change password page
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

      <div className="border-t border-gray-200 px-4 py-3 rounded-b-xl">
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

export default ToolTipProfile;
















// "use client";

// import React from "react";
// // import { AiOutlineUser } from "react-icons/ai";
// import { FiLogOut } from "react-icons/fi";

// const ToolTipProfile: React.FC = () => (
//   <div
//     className="
//       absolute -right-11 top-full mt-2
//       w-56 bg-white rounded-xl shadow-xl z-50
//     "
//   >
//     {/* <div className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-t-xl">
//       <AiOutlineUser size={20} className="text-gray-700" />
//       <span className="font-semibold text-gray-800">My Account</span>
//     </div> */}

//     <div className="flex flex-col divide-y divide-gray-200">
//       {/* <button className="px-4 py-3 text-left text-gray-700 hover:bg-gray-50">
//         Privacy Policy
//       </button> */}
//       <button className="px-4 py-3 text-left text-gray-700 hover:bg-gray-50">
//         Change Password
//       </button>
//     </div>


//     <div className="border-t border-gray-200 px-4 py-3 rounded-b-xl">
//       <button className="flex items-center space-x-2 text-red-500 hover:bg-red-50 w-full text-left rounded">
//         <FiLogOut size={18} />
//         <span>Log Out</span>
//       </button>
//     </div>
//   </div>
// );

// export default ToolTipProfile;
