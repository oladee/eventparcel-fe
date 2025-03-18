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
        <button className="relative outline-none">
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
