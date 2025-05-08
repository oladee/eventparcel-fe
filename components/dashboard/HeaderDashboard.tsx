import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import ToolTipProfileHost from "./ToolTipProfileHost";

interface HeaderProps {
  toggleSidebar: () => void;
}

const HeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
    imageUrl: ""
  });

  

  // Use a ref to store the current user state
  const userRef = useRef(user);
  const [showTooltip, setShowTooltip] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadUserData = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        role: parsedUser.role || "",
        imageUrl: parsedUser.imageUrl || "" // Leave empty if no imageUrl
      });
      userRef.current = {
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        role: parsedUser.role || "",
        imageUrl: parsedUser.imageUrl || ""
      };
    }
  };

  useEffect(() => {
    // Load user data on component mount
    loadUserData();

    // Poll localStorage for changes in the same tab
    const interval = setInterval(() => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const parsedUser = JSON.parse(loggedInUser);
        if (
          parsedUser.firstName !== userRef.current.firstName ||
          parsedUser.lastName !== userRef.current.lastName ||
          parsedUser.role !== userRef.current.role ||
          parsedUser.imageUrl !== userRef.current.imageUrl
        ) {
          setUser({
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
            role: parsedUser.role || "",
            imageUrl: parsedUser.imageUrl || ""
          });
          userRef.current = {
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
            role: parsedUser.role || "",
            imageUrl: parsedUser.imageUrl || ""
          };
        }
      }
    }, 1000); // Check every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to avoid infinite loop


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

    // Fallback: Display initials
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
        {initials}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:pl-64 z-10 flex items-center justify-between bg-white h-16 px-4">
      {/* Left side: Hamburger + Greeting */}
      <div className="flex items-center space-x-4">
        {/* Hamburger (mobile only) */}
        <button className="md:hidden" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">Hi, {user.firstName}!</h1>
          <p className="text-sm text-gray-500">
            Let&apos;s check your store today
          </p>
        </div>
      </div>

      {/* Right side: Search, Create Event, Notification, User Avatar */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        {/* <div className="hidden md:flex items-center bg-gray-100 rounded px-2 py-1">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none ml-2 text-sm"
          />
        </div> */}

        {/* Notification */}
        <button className="relative outline-none">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Separator */}
        <div className="h-[30px] bg-[#EEEFF2] w-px"></div>

        {/* User Avatar + Name/Role */}
        <div className="flex items-center space-x-2">
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderAvatar()}
            {showTooltip && <ToolTipProfileHost />}
          </div>
          {/* {renderAvatar()} */}
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

export default HeaderDashboard;

















// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const HeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     role: "",
//     imageUrl: ""
//   });

//   useEffect(() => {
//     // Retrieve the loggedInUser data from localStorage
//     const loggedInUser = localStorage.getItem("loggedInUser");
//     console.log("checking if a user is logged in")
//     if (loggedInUser) {
//       console.log("A User is logged in")
//       const parsedUser = JSON.parse(loggedInUser);
//       setUser({
//         firstName: parsedUser.firstName || "",
//         lastName: parsedUser.lastName || "",
//         role: parsedUser.role || "",
//         imageUrl: parsedUser.imageUrl || "" // Leave empty if no imageUrl
//       });
//     }
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
//           <h1 className="text-xl font-bold">Hi, {user.firstName}!</h1>
//           <p className="text-sm text-gray-500">
//             Let&apos;s check your store today
//           </p>
//         </div>
//       </div>

//       {/* Right side: Search, Create Event, Notification, User Avatar */}
//       <div className="flex items-center space-x-4">
//         {/* Search Bar */}
//         <div className="hidden md:flex items-center bg-gray-100 rounded px-2 py-1">
//           <FiSearch className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="bg-transparent focus:outline-none ml-2 text-sm"
//           />
//         </div>

//         {/* Notification */}
//         <button className="relative outline-none">
//           <FiBell size={20} />
//           <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         {/* Separator */}
//         <div className="h-[30px] bg-[#EEEFF2] w-px"></div>

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

// export default HeaderDashboard;
