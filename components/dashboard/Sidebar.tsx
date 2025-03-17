import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  FiX,
  FiHome,
  FiCalendar,
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiCreditCard,
  FiHelpCircle,
  FiSettings
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "!text-primary py-2 px-2 rounded-[7px] !font-bold"
      : "text-[#718096] hover:text-black";

  return (
    <aside
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
      `}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold mb-6">Event Parcel</h1>

        {/* MENU Section */}
        <div className="mb-4">
          <p className="px-2 text-sm font-medium text-gray-500 uppercase mb-2">
            Menu
          </p>
          <nav className="space-y-2">
            <a
            onClick={() => handleNavigation("/dashboard")}
            className={`slide_nav  ${linkClass("/dashboard")}`}
            //  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
             >
              <FiHome className="w-5 h-5" />
              <span>Dashboard</span>
            </a>

            <a 
             onClick={() => handleNavigation("/dashboard/events")}
             className={`slide_nav  ${linkClass("/dashboard/events")}`}
            // className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
            >
              <FiCalendar className="w-5 h-5" />
              <span>Events</span>
            </a>

            {/* Orders with a badge */}
            <a className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
              <div className="flex items-center space-x-3">
                <FiShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </div>
              <span className="bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                8
              </span>
            </a>
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <FiUsers className="w-5 h-5" />
              <span>Contacts</span>
            </a>
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <FiTruck className="w-5 h-5" />
              <span>Delivery</span>
            </a>
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <FiCreditCard className="w-5 h-5" />
              <span>Transactions</span>
            </a>
          </nav>
        </div>

        {/* ADMIN Section */}
        <div className="pt-4 border-t mb-4">
          <p className="px-2 text-sm font-medium text-gray-500 uppercase mb-2">
            Admin
          </p>
          <nav className="space-y-2">
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <span>Co-Host</span>
            </a>
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <span>Discounts</span>
            </a>
          </nav>
        </div>

        {/* SETTINGS & HELP Section */}
        <div className="mt-auto pt-4 border-t">
          <nav className="space-y-2">
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <FiSettings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
              <FiHelpCircle className="w-5 h-5" />
              <span>Get Help</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Close button for mobile */}
      <button
        className="md:hidden absolute top-4 right-4 p-2"
        onClick={() => setIsOpen(false)}
      >
        <FiX className="w-6 h-6" />
      </button>
    </aside>
  );
};

// import { FiX, FiHome, FiCalendar, FiShoppingBag, FiUsers, FiTruck, FiCreditCard, FiHelpCircle } from "react-icons/fi";

// interface SidebarProps {
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// }

// export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
//   return (
//     <aside className={`${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 bg-white shadow-lg md:shadow-none z-40 transition-transform duration-200 ease-in-out`}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-8">Event Parcel</h1>

//         <nav className="space-y-4">
//           <div className="space-y-2">
//             {[
//               { icon: FiHome, text: "Dashboard" },
//               { icon: FiCalendar, text: "Events" },
//               { icon: FiShoppingBag, text: "Orders" },
//               { icon: FiUsers, text: "Contacts" },
//               { icon: FiTruck, text: "Delivery" },
//               { icon: FiCreditCard, text: "Transactions" },
//             ].map((item) => (
//               <a key={item.text} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
//                 <item.icon className="w-5 h-5" />
//                 <span>{item.text}</span>
//               </a>
//             ))}
//           </div>

//           <div className="pt-4 border-t space-y-2">
//             <p className="px-2 text-sm font-medium text-gray-500">ADMIN</p>
//             {["Co-Host", "Discounts"].map((text) => (
//               <a key={text} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
//                 <span>{text}</span>
//               </a>
//             ))}
//           </div>

//           <div className="pt-4 border-t">
//             <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
//               <FiHelpCircle className="w-5 h-5" />
//               <span>Get Help</span>
//             </a>
//           </div>
//         </nav>
//       </div>

//       {/* Close button for mobile */}
//       <button className="md:hidden absolute top-4 right-4 p-2" onClick={() => setIsOpen(false)}>
//         <FiX className="w-6 h-6" />
//       </button>
//     </aside>
//   );
// };
