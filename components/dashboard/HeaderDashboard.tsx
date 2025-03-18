import Image from "next/image";
import React from "react";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

interface HeaderProps {
  toggleSidebar: () => void;
}

const HeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 md:pl-64 z-10 flex items-center justify-between bg-white h-16 px-4 ">
      {/* Left side: Hamburger + Greeting */}
      <div className="flex items-center space-x-4">
        {/* Hamburger (mobile only) */}
        <button className="md:hidden" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">Hi, Tynisha!</h1>
          <p className="text-sm text-gray-500">
            Let&apos;s check your store today
          </p>
        </div>
      </div>

      {/* Right side: Search, Create Event, Notification, User Avatar */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded px-2 py-1">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none ml-2 text-sm"
          />
        </div>

        {/* Notification */}
        <button className="relative">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* seperator */}
        <div className="h-[30px] bg-[#EEEFF2] w-px"></div>

        {/* User Avatar + Name/Host */}
        <div className="flex items-center space-x-2">
          {/* Replace with the actual avatar you want */}
          <Image
            src="https://placehold.co/600x400/png"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
            width={10}
            height={10}
          />
          <div className="leading-tight hidden md:block">
            <div className="font-semibold">Tynisha Obey</div>
            <div className="text-xs text-gray-500">Host</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;













// import React from "react";
// import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const HeaderDashboard: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   return (
//     <header className="bg-white shadow px-4 py-2">
//       {/*
//         Use a grid for medium/desktop:
//         1) Greeting (left)
//         2) Search (center)
//         3) Notification/User (right)
//       */}
//       <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 h-16">
//         {/* Left: Hamburger (mobile only) + Greeting */}
//         <div className="flex items-center space-x-4">
//           <button className="md:hidden" onClick={toggleSidebar}>
//             <FiMenu size={24} />
//           </button>
//           <div className="hidden md:block">
//             <h1 className="text-xl font-bold">Hi, Tynisha!</h1>
//             <p className="text-sm text-gray-500">Let&apos;s check your store today</p>
//           </div>
//         </div>

//         {/* Center: Search Bar (hidden on small screens, displayed on md+) */}
//         <div className="hidden md:flex justify-center">
//           <div className="relative w-full max-w-md">
//             <FiSearch className="absolute top-3 left-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none text-sm"
//             />
//           </div>
//         </div>

//         {/* Right: Notification + User Info */}
//         <div className="flex justify-end items-center space-x-6">
//           {/* Notification Bell with Red Dot */}
//           <div className="relative">
//             <FiBell size={24} />
//             {/* The screenshot shows a red indicator; here we add a '4' for clarity */}
//             <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//               4
//             </span>
//           </div>

//           {/* User Avatar + Name/Host */}
//           <div className="flex items-center space-x-2">
//             {/* Replace with the actual avatar you want */}
//             <img
//               src="https://placehold.co/600x400/png"
//               alt="User"
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <div className="leading-tight hidden md:block">
//               <div className="font-semibold">Tynisha Obey</div>
//               <div className="text-xs text-gray-500">Host</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderDashboard;
