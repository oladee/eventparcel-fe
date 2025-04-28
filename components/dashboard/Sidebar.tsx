"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import { useMyContext } from "@/context";

// Lazy-load icons
const FiX = dynamic(() => import("react-icons/fi").then((mod) => mod.FiX), {
  ssr: false
});
const FiHelpCircle = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiHelpCircle),
  { ssr: false }
);
const FiSettings = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiSettings),
  { ssr: false }
);
const FiCreditCard = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiCreditCard),
  { ssr: false }
);
const RiHome5Line = dynamic(
  () => import("react-icons/ri").then((mod) => mod.RiHome5Line),
  { ssr: false }
);
const BsFillCalendarEventFill = dynamic(
  () => import("react-icons/bs").then((mod) => mod.BsFillCalendarEventFill),
  { ssr: false }
);
const PiShoppingCartLight = dynamic(
  () => import("react-icons/pi").then((mod) => mod.PiShoppingCartLight),
  { ssr: false }
);
// const FaRegUser = dynamic(
//   () => import("react-icons/fa").then((mod) => mod.FaRegUser),
//   { ssr: false }
// );
const BsBoxSeam = dynamic(
  () => import("react-icons/bs").then((mod) => mod.BsBoxSeam),
  { ssr: false }
);
const RiExchange2Line = dynamic(
  () => import("react-icons/ri").then((mod) => mod.RiExchange2Line),
  { ssr: false }
);

// Static import for Logo
import { Logo2 } from "../icons/Icons";
import Image from "next/image";

interface MenuItemProps {
  label: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = React.memo(
  ({ label, path, icon: Icon, badge, exact, onClick }) => {
    const pathname = usePathname();
    const isActive = path
      ? exact
        ? pathname === path
        : pathname.startsWith(path)
      : false;
    const activeClasses = isActive
      ? "text-primary py-2 px-2 rounded-[7px] font-bold"
      : "text-[#718096] hover:text-black";

    const handleClick = () => {
      if (onClick) onClick();
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded ${activeClasses}`}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  }
);
MenuItem.displayName = "MenuItem";

export const Sidebar: React.FC = () => {
  const { isOpen, setIsOpen } = useMyContext();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    console.log(authToken);
    
    if (!authToken) {
      // router.push("/");
      console.log("This is from the container", "No auth token found.");
      
    }
  }, [router]);

  // For swipe gesture detection on mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

  // Handle navigation with error handling
  const handleNavigation = async (path: string) => {
    try {
      await router.push(path);
      // Close sidebar after navigation on mobile devices
      setIsOpen(false);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // When sidebar opens, move focus to it
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  // Touch event handlers for swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchCurrentX !== null) {
      const diff = touchStartX - touchCurrentX;
      if (diff > 50) {
        // Swipe left detected – close sidebar
        setIsOpen(false);
      }
    }
    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  // Menu configurations
  const mainMenu = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: RiHome5Line,
        exact: true
      },
      {
        label: "Events",
        path: "/dashboard/events",
        icon: BsFillCalendarEventFill,
        exact: true
      },
      {
        label: "Orders",
        path: "/dashboard/orders",
        icon: PiShoppingCartLight,
        badge: "8",
        exact: true
      },
      // {
      //   label: "Contacts",
      //   path: "/dashboard/contacts",
      //   icon: FaRegUser,
      //   exact: true
      // },
      {
        label: "Delivery",
        path: "/dashboard/delivery",
        icon: BsBoxSeam,
        exact: true
      },
      {
        label: "Transactions",
        path: "/dashboard/transactions",
        icon: RiExchange2Line,
        exact: true
      }
    ],
    []
  );

  const adminMenu = useMemo(
    () => [
      {
        label: "Co-Host",
        path: "/dashboard/co-host",
        // Using FiHelpCircle as a placeholder icon
        icon: FiHelpCircle,
        exact: true
      },
      {
        label: "Discounts",
        path: "/dashboard/discounts",
        // Using FiCreditCard as a placeholder icon
        icon: FiCreditCard,
        exact: true
      }
    ],
    []
  );

  const settingsMenu = useMemo(
    () => [
      {
        label: "Settings",
        path: "/dashboard/settings",
        icon: FiSettings,
        exact: true
      },
      {
        label: "Get Help",
        path: "/dashboard/help",
        icon: FiHelpCircle,
        exact: true
      }
    ],
    []
  );

  return (
    <>
      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <aside
          ref={sidebarRef}
          tabIndex={-1}
          role="navigation"
          aria-label="Main Navigation"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`overflow-y-auto h-screen no-scrollbar
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            fixed
            md:relative
            inset-y-0
            left-0
            w-64
            bg-white
            shadow-lg
            md:shadow-none
            z-40
            transition-transform
            duration-200
            ease-in-out
            focus:outline-none
          `}
        >
          <div className="p-6 h-max flex flex-col">
            {/* Logo / Title */}
            <div className="hidden md:flex items-center space-x-3 mb-6">
              <Logo2 width={40} height={40} />
              <h1 className="text-base md:text-2xl font-bold">
                Event <br className="md:hidden" /> Parcel
              </h1>
            </div>
            <div className="flex items-center space-x-3 mb-6 md:hidden">
              <Image
                src="/images/logo4.png"
                alt="logo"
                width={100}
                height={100}
                style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
              />
            </div>

            {/* MENU Section */}
            <div className="mb-4">
              <p className="px-2 text-sm font-medium text-gray-500 uppercase mb-2">
                Menu
              </p>
              <nav className="space-y-2">
                {mainMenu.map((item, index) => (
                  <MenuItem
                    key={index}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    onClick={() => handleNavigation(item.path!)}
                    path={item.path}
                    exact={item.exact}
                  />
                ))}
              </nav>
            </div>

            {/* ADMIN Section */}
            <div className="pt-4 border-t mb-4">
              <p className="px-2 text-sm font-medium text-gray-500 uppercase mb-2">
                Admin
              </p>
              <nav className="space-y-2">
                {adminMenu.map((item, index) => (
                  <MenuItem
                    key={index}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => handleNavigation(item.path!)}
                    path={item.path}
                    exact={item.exact}
                  />
                ))}
              </nav>
            </div>

            {/* SETTINGS & HELP Section */}
            <div className="mt-auto pt-4 border-t">
              <nav className="space-y-2">
                {settingsMenu.map((item, index) => (
                  <MenuItem
                    key={index}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => handleNavigation(item.path!)}
                    path={item.path}
                    exact={item.exact}
                  />
                ))}
              </nav>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            className="md:hidden absolute top-4 right-4 p-2 focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
          >
            <FiX className="w-6 h-6" />
          </button>
        </aside>
      </Suspense>
    </>
  );
};
