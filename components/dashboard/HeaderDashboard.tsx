import Image from "next/image";
import React from "react";
import { FiMenu, FiBell, FiSearch, FiPlus } from "react-icons/fi";

// interface HeaderProps {
//   toggleSidebar: () => void
// }

const HeaderDashboard: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-white h-16 px-4 shadow">
      {/* Left side: Hamburger + Greeting */}
      <div className="flex items-center space-x-4">
        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden !invisible"
          // onClick={toggleSidebar}
        >
          <FiMenu size={24} />
        </button>
        <div>
          <h1 className="text-lg font-semibold">Hi, Tynisha Obey</h1>
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

        {/* Create Event (plus icon) */}
        <button className="hidden md:flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500">
          <FiPlus />
          <span>Create Event</span>
        </button>

        {/* Notification */}
        <button className="relative">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <Image
          src="https://via.placeholder.com/32"
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
          width={8}
          height={8}
        />
      </div>
    </header>
  );
};

export default HeaderDashboard;
