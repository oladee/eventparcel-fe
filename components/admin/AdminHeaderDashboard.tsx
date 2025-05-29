"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { usePathname } from "next/navigation";
import ToolTipProfile from "@/components/admin/ToolTipProfile";

interface HeaderProps {
  toggleSidebar: () => void;
}

const AdminHeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
    imageUrl: ""
  });
  const userRef = useRef(user);
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pageTitles: { [key: string]: string } = {
    "/admin": "Dashboard",
    "/admin/admin-hosts": "Hosts",
    "/admin/admin-events": "Events",
    "/admin/admin-orders": "Orders",
    "/admin/admin-delivery": "Delivery",
    "/admin/admin-transactions": "Transactions",
    "/admin/admin-integrations": "Integration",
    "/admin/admin-feeSettings": "Fee Setting",
    "/admin/admin-users": "Admin Users",
    "/admin/admin-permissions": "Admin Permissions",
    "/admin/admin-settings": "Settings"
  };
  const getCurrentPageTitle = () => {
    if (pathname?.startsWith("/admin/admin-hosts/")) {
      return "Hosts";
    }
    return pageTitles[pathname] || "Dashboard";
  };

  const loadUserData = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const { data: payload } = JSON.parse(loggedInUser) as {
        data: {
          firstName?: string;
          lastName?: string;
          role?: string;
          imageUrl?: string | null;
        };
      };
      const newUser = {
        firstName: payload?.firstName || "",
        lastName: payload?.lastName || "",
        role: payload?.role || "",
        imageUrl: payload?.imageUrl || ""
      };
      setUser(newUser);
      userRef.current = newUser;
    }
  };

  useEffect(() => {
    loadUserData();
    const interval = setInterval(() => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const parsed = JSON.parse(loggedInUser).data;
        if (
          parsed.firstName !== userRef.current.firstName ||
          parsed.lastName !== userRef.current.lastName ||
          parsed.role !== userRef.current.role ||
          parsed.imageUrl !== userRef.current.imageUrl
        ) {
          loadUserData();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 500); // 1 second delay
  };

  const renderAvatar = () => {
    if (user.imageUrl) {
      return (
        <Image
          src={user.imageUrl}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
          width={40}
          height={40}
          priority
        />
      );
    }
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
    console.log("initials", initials);
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
        {initials}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:pl-64 z-10 flex items-center justify-between bg-white h-16 px-4">
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center space-x-4">
        <button className="md:hidden" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">{getCurrentPageTitle()}</h1>
        </div>
      </div>

      {/* Right: Avatar + Tooltip */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderAvatar()}
            {showTooltip && <ToolTipProfile />}
          </div>

          {/* Name + Role */}
          <div className="leading-tight hidden md:block">
            <div className="font-semibold truncate max-w-[13ch]">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeaderDashboard;

// // components/admin/AdminHeaderDashboard.tsx
// "use client";

// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import { FiMenu } from "react-icons/fi";
// import { usePathname } from "next/navigation";
// import ToolTipProfile from "@/components/admin/ToolTipProfile";

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const AdminHeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//     imageUrl: ""
//   });
//   const userRef = useRef(user);
//   const pathname = usePathname();
//   const [isAvatarHovered, setIsAvatarHovered] = useState(false);

//   const pageTitles: { [key: string]: string } = {
//     "/admin": "Dashboard",
//     "/admin/admin-hosts": "Hosts",
//     "/admin/admin-events": "Events",
//     "/admin/admin-orders": "Orders",
//     "/admin/admin-delivery": "Delivery",
//     "/admin/admin-transactions": "Transactions",
//     "/admin/admin-integrations": "Integration",
//     "/admin/admin-feeSettings": "Fee Setting",
//     "/admin/adminUsers": "Admin Users",
//     "/admin/admin-settings": "Settings"
//   };
//   const getCurrentPageTitle = () => {
//     if (pathname?.startsWith("/admin/admin-hosts/")) {
//       return "Hosts";
//     }
//     return pageTitles[pathname] || "Dashboard";
//   };

//   const loadUserData = () => {
//     const loggedInUser = localStorage.getItem("loggedInUser");
//     if (loggedInUser) {
//       const parsed = JSON.parse(loggedInUser);
//       const newUser = {
//         firstName: parsed.firstName || "",
//         lastName: parsed.lastName || "",
//         role: parsed.role || "",
//         imageUrl: parsed.imageUrl || ""
//       };
//       setUser(newUser);
//       userRef.current = newUser;
//     }
//   };

//   useEffect(() => {
//     loadUserData();
//     const interval = setInterval(() => {
//       const loggedInUser = localStorage.getItem("loggedInUser");
//       if (loggedInUser) {
//         const parsed = JSON.parse(loggedInUser);
//         if (
//           parsed.firstName !== userRef.current.firstName ||
//           parsed.lastName !== userRef.current.lastName ||
//           parsed.role !== userRef.current.role ||
//           parsed.imageUrl !== userRef.current.imageUrl
//         ) {
//           loadUserData();
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const renderAvatar = () => {
//     if (user.imageUrl) {
//       return (
//         <Image
//           src={user.imageUrl}
//           alt="User"
//           className="w-10 h-10 rounded-full object-cover"
//           width={40}
//           height={40}
//           priority
//         />
//       );
//     }
//     const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
//     return (
//       <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
//         {initials}
//       </div>
//     );
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 md:pl-64 z-10 flex items-center justify-between bg-white h-16 px-4">
//       {/* Left: Hamburger + Page Title */}
//       <div className="flex items-center space-x-4">
//         <button className="md:hidden" onClick={toggleSidebar}>
//           <FiMenu size={24} />
//         </button>
//         <div className="hidden md:block">
//           <h1 className="text-xl font-bold">{getCurrentPageTitle()}</h1>
//         </div>
//       </div>

//       {/* Right: Avatar + Tooltip */}
//       <div className="flex items-center space-x-4">
//         <div className="flex items-center space-x-2">
//           {/* Avatar wrapper */}
//           <div
//             className="relative"
//             onMouseEnter={() => setIsAvatarHovered(true)}
//             onMouseLeave={() => setIsAvatarHovered(false)}
//           >
//             {renderAvatar()}

//             {isAvatarHovered && <ToolTipProfile />}
//           </div>

//           {/* Name+role */}
//           <div className="leading-tight hidden md:block">
//             <div className="font-semibold truncate max-w-[13ch]">
//               {user.firstName} {user.lastName}
//             </div>
//             <div className="text-xs text-gray-500 capitalize">{user.role}</div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeaderDashboard;

// "use client";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import { FiMenu } from "react-icons/fi";
// // import { HiOutlineEnvelope } from "react-icons/hi2";
// import { usePathname } from "next/navigation";
// import ToolTipProfile from "./ToolTipProfile";

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const AdminHeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//     imageUrl: ""
//   });

//   // Use a ref to store the current user state
//   const userRef = useRef(user);

//   // Get the current pathname
//   // This will be used to determine the current page title
//   const pathname = usePathname();

//   const pageTitles: { [key: string]: string } = {
//     "/admin": "Dashboard",
//     "/admin/admin-hosts": "Hosts",
//     "/admin/admin-events": "Events",
//     "/admin/admin-orders": "Orders",
//     "/admin/admin-delivery": "Delivery",
//     "/admin/admin-transactions": "Transactions",
//     "/admin/admin-integrations": "Integration",
//     "/admin/admin-feeSettings": "Fee Setting",
//     "/admin/adminUsers": "Admin Users",
//     "/admin/admin-settings": "Settings"
//   };

//   // Handle dynamic routes like /admin/admin-hosts/:id
//   const getCurrentPageTitle = () => {
//     if (pathname?.startsWith("/admin/admin-hosts/")) {
//       return "Hosts";
//     }
//     return pageTitles[pathname] || "Dashboard";
//   };

//   const loadUserData = () => {
//     const loggedInUser = localStorage.getItem("loggedInUser");
//     if (loggedInUser) {
//       const parsedUser = JSON.parse(loggedInUser);
//       setUser({
//         firstName: parsedUser.firstName || "",
//         lastName: parsedUser.lastName || "",
//         role: parsedUser.role || "",
//         imageUrl: parsedUser.imageUrl || "" // Leave empty if no imageUrl
//       });
//       userRef.current = {
//         firstName: parsedUser.firstName || "",
//         lastName: parsedUser.lastName || "",
//         role: parsedUser.role || "",
//         imageUrl: parsedUser.imageUrl || ""
//       };
//     }
//   };

//   useEffect(() => {
//     // Load user data on component mount
//     loadUserData();

//     // Poll localStorage for changes in the same tab
//     const interval = setInterval(() => {
//       const loggedInUser = localStorage.getItem("loggedInUser");
//       if (loggedInUser) {
//         const parsedUser = JSON.parse(loggedInUser);
//         if (
//           parsedUser.firstName !== userRef.current.firstName ||
//           parsedUser.lastName !== userRef.current.lastName ||
//           parsedUser.role !== userRef.current.role ||
//           parsedUser.imageUrl !== userRef.current.imageUrl
//         ) {
//           setUser({
//             firstName: parsedUser.firstName || "",
//             lastName: parsedUser.lastName || "",
//             role: parsedUser.role || "",
//             imageUrl: parsedUser.imageUrl || ""
//           });
//           userRef.current = {
//             firstName: parsedUser.firstName || "",
//             lastName: parsedUser.lastName || "",
//             role: parsedUser.role || "",
//             imageUrl: parsedUser.imageUrl || ""
//           };
//         }
//       }
//     }, 1000); // Check every second

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, []); // Empty dependency array to avoid infinite loop

//   const renderAvatar = () => {
//     if (user.imageUrl) {
//       return (
//         <Image
//           src={user.imageUrl}
//           alt="User"
//           className="w-10 h-10 rounded-full object-cover"
//           width={40}
//           height={40}
//           priority
//         />
//       );
//     }

//     // Fallback: Display initials
//     const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
//       0
//     )}`.toUpperCase();
//     return (
//       <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
//         {initials}
//       </div>
//     );
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 md:pl-64 z-10 flex items-center justify-between bg-white h-16 px-4">
//       {/* Left side: Hamburger + Greeting */}
//       <div className="flex items-center space-x-4">
//         {/* Hamburger (mobile only) */}
//         <button className="md:hidden" onClick={toggleSidebar}>
//           <FiMenu size={24} />
//         </button>
//         <div className="hidden md:block">
//           {/* Current page */}
//           <h1 className="text-xl font-bold">{getCurrentPageTitle()}</h1>
//         </div>
//       </div>

//       {/* Right side: Search, Create Event, Notification, User Avatar */}
//       <div className="relative flex items-center space-x-4">
//         {/* User Avatar + Name/Role */}
//         <div className="flex items-center space-x-2">
//           {renderAvatar()}
//           <div className="leading-tight hidden md:block">
//             <div className="font-semibold truncate max-w-[13ch]">
//               {user.firstName} {user.lastName}
//             </div>
//             <div className="text-xs text-gray-500 capitalize">{user.role}</div>
//           </div>
//           <ToolTipProfile />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeaderDashboard;

// "use client";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import { FiMenu } from "react-icons/fi";
// // import { HiOutlineEnvelope } from "react-icons/hi2";
// import { usePathname } from "next/navigation";

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const AdminHeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//     imageUrl: ""
//   });

//   // Use a ref to store the current user state
//   const userRef = useRef(user);

//   // Get the current pathname
//   // This will be used to determine the current page title
//   const pathname = usePathname();

//   const pageTitles: { [key: string]: string } = {
//     "/admin": "Dashboard",
//     "/admin/admin-hosts": "Hosts",
//     "/admin/admin-events": "Events",
//     "/admin/admin-orders": "Orders",
//     "/admin/admin-delivery": "Delivery",
//     "/admin/admin-transactions": "Transactions",
//     "/admin/admin-integrations": "Integration",
//     "/admin/admin-feeSettings": "Fee Setting",
//     "/admin/adminUsers": "Admin Users",
//     "/admin/admin-settings": "Settings"
//   };

//   // Handle dynamic routes like /admin/admin-hosts/:id
//   const getCurrentPageTitle = () => {
//     if (pathname?.startsWith("/admin/admin-hosts/")) {
//       return "Hosts";
//     }
//     return pageTitles[pathname] || "Dashboard";
//   };

//   const loadUserData = () => {
//     const loggedInUser = localStorage.getItem("loggedInUser");
//     if (loggedInUser) {
//       const parsedUser = JSON.parse(loggedInUser);
//       setUser({
//         firstName: parsedUser.firstName || "",
//         lastName: parsedUser.lastName || "",
//         role: parsedUser.role || "",
//         imageUrl: parsedUser.imageUrl || "" // Leave empty if no imageUrl
//       });
//       userRef.current = {
//         firstName: parsedUser.firstName || "",
//         lastName: parsedUser.lastName || "",
//         role: parsedUser.role || "",
//         imageUrl: parsedUser.imageUrl || ""
//       };
//     }
//   };

//   useEffect(() => {
//     // Load user data on component mount
//     loadUserData();

//     // Poll localStorage for changes in the same tab
//     const interval = setInterval(() => {
//       const loggedInUser = localStorage.getItem("loggedInUser");
//       if (loggedInUser) {
//         const parsedUser = JSON.parse(loggedInUser);
//         if (
//           parsedUser.firstName !== userRef.current.firstName ||
//           parsedUser.lastName !== userRef.current.lastName ||
//           parsedUser.role !== userRef.current.role ||
//           parsedUser.imageUrl !== userRef.current.imageUrl
//         ) {
//           setUser({
//             firstName: parsedUser.firstName || "",
//             lastName: parsedUser.lastName || "",
//             role: parsedUser.role || "",
//             imageUrl: parsedUser.imageUrl || ""
//           });
//           userRef.current = {
//             firstName: parsedUser.firstName || "",
//             lastName: parsedUser.lastName || "",
//             role: parsedUser.role || "",
//             imageUrl: parsedUser.imageUrl || ""
//           };
//         }
//       }
//     }, 1000); // Check every second

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, []); // Empty dependency array to avoid infinite loop

//   const renderAvatar = () => {
//     if (user.imageUrl) {
//       return (
//         <Image
//           src={user.imageUrl}
//           alt="User"
//           className="w-10 h-10 rounded-full object-cover"
//           width={40}
//           height={40}
//           priority
//         />
//       );
//     }

//     // Fallback: Display initials
//     const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
//       0
//     )}`.toUpperCase();
//     return (
//       <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
//         {initials}
//       </div>
//     );
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 md:pl-64 z-10 flex items-center justify-between bg-white h-16 px-4">
//       {/* Left side: Hamburger + Greeting */}
//       <div className="flex items-center space-x-4">
//         {/* Hamburger (mobile only) */}
//         <button className="md:hidden" onClick={toggleSidebar}>
//           <FiMenu size={24} />
//         </button>
//         <div className="hidden md:block">
//           {/* Current page */}
//           {/* <h1 className="text-xl font-bold">Dashboard</h1> */}
//           <h1 className="text-xl font-bold">{getCurrentPageTitle()}</h1>
//         </div>
//       </div>

//       {/* Right side: Search, Create Event, Notification, User Avatar */}
//       <div className="flex items-center space-x-4">
//         {/* Search Bar */}
//         {/* <div className="hidden md:flex items-center bg-gray-100 rounded px-2 py-1">
//           <FiSearch className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="bg-transparent focus:outline-none ml-2 text-sm"
//           />
//         </div> */}

//         {/* Messages */}
//         {/* <button className="relative outline-none">
//           <HiOutlineEnvelope size={20} />
//           <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
//         </button> */}

//         {/* Notification */}
//         {/* <button className="relative outline-none">
//           <FiBell size={20} />
//           <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
//         </button> */}

//         {/* Separator */}
//         {/* <div className="h-[30px] bg-[#EEEFF2] w-px"></div> */}

//         {/* User Avatar + Name/Role */}
//         <div className="flex items-center space-x-2">
//           {renderAvatar()}
//           <div className="leading-tight hidden md:block">
//             <div className="font-semibold truncate max-w-[13ch]">
//               {user.firstName} {user.lastName}
//             </div>
//             <div className="text-xs text-gray-500 capitalize">{user.role}</div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeaderDashboard;
