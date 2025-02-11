"use client"

import { Logo } from "./icons/Icons";
import { FaBars } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const pathname = usePathname();
  const isTransparentBg = pathname === '/' || pathname === '/signup';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header className={`w-full py-4 px-12 fixed right-0 top-0 z-10 ${isTransparentBg ? 'bg-transparent' : 'bg-white shadow-md'} ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-2 items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Logo width={40} height={40} />
          <span className="text-xl font-bold text-black-100">Event Parcel</span>
        </div>

        {/* Navigation Links (hidden on small screens) */}
        <nav className={`hidden md:flex justify-end space-x-8 font-medium ${isTransparentBg ? 'lg:text-white' : 'text-black-100'} ${isScrolled ? "!text-black-100" : "bg-transparent"}`}>
          <a href="#" className="hover:text-gray-900 transition">Products</a>
          <a href="#" className="hover:text-gray-900 transition">Features</a>
          <a href="#" className="hover:text-gray-900 transition">Pricing</a>
          <a href="#" className="hover:text-gray-900 transition">FAQ</a>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="flex justify-end md:hidden">
          <button className="text-black-100">
            <FaBars size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
