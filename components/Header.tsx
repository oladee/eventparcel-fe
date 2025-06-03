"use client";

import { Logo } from "./icons/Icons";

const Header: React.FC = () => {
  const handleLogoClick = () => {
    window.location.href = "https://www.eventparcel.com";
  };

  return (
    <header
      role="navigation"
      className="w-full py-4 px-6 md:px-8 lg:px-12 fixed right-0 top-0 z-20 bg-white shadow-md"
    >
      <div className="container mx-auto flex items-center">
        {/* Logo Section */}
        <div
          className="flex items-center space-x-2 w-max cursor-pointer"
          onClick={handleLogoClick}
        >
          <Logo width={100} height={150} aria-label="Event Parcel Logo" />
        </div>
      </div>
    </header>
  );
};

export default Header;
































// "use client";

// import { Logo } from "./icons/Icons";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// const Header: React.FC = () => {
//   const pathname = usePathname();
//   const isTransparentBg = pathname === "/" || pathname === "/signup";
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 30);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen((prev) => !prev);
//   };

//   return (
//     <header
//       role="navigation"
//       className={`w-full py-4 px-6 md:px-8 lg:px-12 fixed right-0 top-0 z-20 
//       ${isTransparentBg ? "bg-transparent" : "bg-white shadow-md"} 
//       ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}
//     >
//       <div className="container mx-auto grid grid-cols-2 md:grid-cols-2 items-center">
//         {/* Logo Section */}
//         <div className="flex items-center space-x-2 w-max">
//           <Logo width={100} height={150} aria-label="Event Parcel Logo" />
//         </div>

//         {/* Navigation Links (hidden on small screens) */}
//         <nav
//           role="navigation"
//           aria-label="Main Navigation"
//           className={`hidden md:flex justify-end space-x-8 font-medium 
//           ${isTransparentBg ? "lg:text-white" : "text-black-100"} 
//           ${isScrolled ? "!text-black-100" : "bg-transparent"}`}
//         >
//          <a href="#" className="hover:text-[#3a8dff] transition">
//             Products
//           </a>
//           <a href="#" className="hover:text-[#3a8dff] transition">
//             Features
//           </a>
//           <a href="#" className="hover:text-[#3a8dff] transition">
//             Pricing
//           </a>
//           <a href="#" className="hover:text-[#3a8dff] transition">
//             FAQ
//           </a>
//         </nav>

//         {/* Mobile Menu Button */}
//         <div className="flex justify-end md:hidden">
//           <button
//             aria-label="Toggle Mobile Menu"
//             aria-expanded={isMobileMenuOpen}
//             aria-controls="mobile-menu"
//             className="text-black-100"
//             onClick={toggleMobileMenu}
//           >
//             {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div
//           id="mobile-menu"
//           role="menu"
//           className="md:hidden bg-white shadow-md absolute top-15 right-0 w-full z-10"
//         >
//           <nav role="navigation" aria-label="Mobile Navigation" className="flex flex-col items-center space-y-4 py-4">
//             <a href="#" className="hover:text-[#3a8dff] transition">
//               Products
//             </a>
//             <a href="#" className="hover:text-[#3a8dff] transition">
//               Features
//             </a>
//             <a href="#" className="hover:text-[#3a8dff] transition">
//               Pricing
//             </a>
//             <a href="#" className="hover:text-[#3a8dff] transition">
//               FAQ
//             </a>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


