import { FiSearch } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { BiChevronUp } from "react-icons/bi";
import React from "react";

const orders = [
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  },
  {
    id: "#ID238976",
    date: "24 Apr, 2025",
    guest: "Pedro Huard",
    email: "chieko@mail.com",
    total: "₦1,560,000",
    payout: "₦1,560,000",
    delivery: "₦16,560",
    status: "Delivery",
    item: "1",
    homeDelivery: "₦3000",
    tax: "₦700",
    totalPaid: "₦16,560"
  }
];


const TransactionTable: React.FC = () => {

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "pending":
            return "bg-[#FFF5EB] text-[#F97316]";
          case "delivery":
            return "bg-[#ECFDF5] text-[#10B981]";
          case "shipped":
            return "bg-[#EEF2FF] text-[#6366F1]";
          default:
            return "bg-gray-200 text-gray-600";
        }
      };
      
  return (
    <div className="w-full gap-4 pt-3 rounded-xl">
      <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 md:gap-0">
      {/* Left: Filter + Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:flex-wrap w-full md:w-auto">
        {/* Show Dropdown */}
        <div className="w-full md:w-[189px] h-[40px] flex justify-center items-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium">
          <span>Show:</span>
          <span className="font-bold text-[#111827] text-base">All Orders</span> 
          <MdOutlineKeyboardArrowDown className="w-4 h-4 text-[#111827]"/>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-[339px] h-[40px] flex items-center bg-[#FFFFFF] rounded-[12px] px-3 py-1.5">
          <FiSearch className="text-[#111827] mr-2 w-6 h-6" />
          <input
            type="text"
            placeholder="Search by name, email, or others..."
            className="outline-none text-sm text-[#718096] bg-transparent placeholder-[#A0AEC0] w-full"
          />
        </div>

        {/* Filters Button */}
        <button className="w-full md:w-[112px] h-[40px] flex justify-center items-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Right: Export */}
      <div className="w-full md:w-auto">
        <button className="w-full md:w-[153px] h-[40px] flex items-center justify-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm">
          <HiOutlineDocumentDownload size={16} />
          Export 
          <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#718096]"/>
        </button>
      </div>
    </div>

    <div id="main-table" className="w-full gap-4 pt-3 rounded-xl">
        {/* Table */}
        <div className="mt-2 bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <table className="w-full">
          <colgroup><col className="w-[60px]" /><col className="min-w-[120px]" /><col className="min-w-[120px]" /><col className="min-w-[120px]" /><col className="min-w-[120px]" /><col className="min-w-[120px]" /><col className="min-w-[120px]" /><col className="w-[60px]" /></colgroup>
            
            {/* Table Head */}
            <thead>
              <tr className="border-b">
                <th className="p-3 text-center">
                  <FaRegCircle className="w-5 h-5 mx-auto text-[#718096]"/>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                    Orders <PiArrowsDownUpFill />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                    Guest <PiArrowsDownUpFill />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                    Total <PiArrowsDownUpFill />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                    Payout <PiArrowsDownUpFill />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                    Delivery <PiArrowsDownUpFill />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                    Status <PiArrowsDownUpFill />
                  </div>
                </th>
                <th className="p-3 text-center">
                  <BsThreeDots className="w-5 h-5 text-[#A0AEC0] mx-auto"/>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {orders.map((order, i) => (
                <React.Fragment key={i}>
                  <tr className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-3 text-center">
                      <FaRegCircle className="w-5 h-5 text-[#718096] mx-auto"/>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-base text-[#111827]">{order.id}</div>
                      <div className="text-sm font-medium text-[#718096]">{order.date}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-base text-[#111827]">{order.guest}</div>
                      <div className="text-sm font-medium text-[#718096]">{order.email}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-base font-medium text-[#718096]">{order.total}</div>
                    </td>
                    <td className="p-3 font-semibold text-base text-[#111827]">
                      {order.payout}
                    </td>
                    <td className="p-3 font-semibold text-base text-[#111827]">
                      {order.delivery}
                    </td>
                    <td className="p-3">
                      <button
                        className="w-full max-w-[156px] h-[35px] flex items-center justify-center text-xs text-[#751423] border border-[#751423] py-2 rounded-[8px] font-extrabold mx-auto"
                      >
                        See Breakdown <BiChevronUp size={16} className="ml-1 text-[#A0AEC0]" />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <BsThreeDots className="w-5 h-5 text-[#A0AEC0] mx-auto"/>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  <tr className="border-b border-gray-200">
                    <td colSpan={8} className="pl-14 max-sm:pl-4">
                      <div className="w-full h-[110.8px] lg:h-[76.8px] flex flex-col sm:flex-row px-4 py-2 max-sm:px-2">
                        <div className="flex-1 flex flex-col justify-between border-r border-gray-300 max-sm:border-r-0 max-sm:pb-2">
                          <div className="flex justify-between max-sm:gap-2">
                            <span className="text-gray-500 text-sm">1 item</span>
                            <span className="text-gray-500 text-sm text-left xl:pr-16 2xl:pr-28 max-sm:pr-2">N560,000</span>
                          </div>
                          <div className="flex justify-between max-sm:gap-2">
                            <span className="text-gray-500 text-sm">Home Delivery</span>
                            <span className="text-gray-500 text-sm text-left xl:pr-16 2xl:pr-28 max-sm:pr-2">N3,000</span>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between max-sm:pt-2">
                          <div className="flex justify-between max-sm:gap-2">
                            <span className="text-gray-500 text-sm sm:pl-24">Tax</span>
                            <span className="text-gray-500 text-sm">N7000</span>
                          </div>
                          <div className="flex justify-between max-sm:gap-2">
                            <span className="text-gray-500 text-sm sm:pl-24">Total</span>
                            <span className="text-gray-500 text-sm">N563,000</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between sm:mr-4 items-center mt-6 gap-2 sm:gap-0">
            <div className="text-sm text-[#718096] whitespace-nowrap">
              Show result: <span className="font-semibold">6</span>
            </div>
            <div className="flex items-center gap-1 text-sm overflow-x-auto py-2 sm:py-0 w-full justify-center sm:w-auto">
              <button className="text-[#A0AEC0] whitespace-nowrap">&lt;</button>
              {[1, 2, 3, 4, "...", 20].map((n, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded-[12px] p-[8px] whitespace-nowrap ${
                    n === 2 ? "bg-[#DCFCE7] text-[#16A34A]" : "text-[#A0AEC0] hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button className="text-[#A0AEC0] whitespace-nowrap">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
















// "use client";
// import { useRouter } from "next-nprogress-bar";
// import React, { useState, useRef, useEffect } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { GrTransaction } from "react-icons/gr";

// export type Host = {
//   id: number;
//   name: string;
//   email: string;
//   location: string;
//   sales: string;
//   lastLogin: string;
//   status: "Active" | "Inactive" | "Unverified";
// };

// const statusClasses: Record<Host["status"], string> = {
//   Active: "bg-[#2B9EA01F] text-[#2B9EA0] border border-[#2B9EA0]",
//   Inactive: "bg-[#FE964A1F] text-[#FE964A] border border-[#FE964A]",
//   Unverified: "bg-[#DE42221F] text-[#DE4222] border border-[#DE4222]"
// };

// const HostsTable: React.FC<{ hosts: Host[] }> = ({ hosts }) => {
//   const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   const toggleMenu = (id: number) => {
//     setMenuOpenId((prev) => (prev === id ? null : id));
//   };

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpenId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getRandomColorClass = () => {
//     const colors = [
//       "bg-red-500",
//       "bg-yellow-500",
//       "bg-green-500",
//       "bg-blue-500"
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   return (
//     <div className="bg-white min-w-full overflow-x-scroll no-scrollbar">
//       <table className="w-full table-auto bg-white rounded-t-2xl overflow-hidden">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="p-4">
//               <input type="checkbox" />
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Host Name <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Location <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Overall Sales <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Last Login <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Status <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4">
//               <FiMoreHorizontal className="text-gray-400" />
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {hosts.map((h) => (
//             <tr key={h.id} className="border-t relative">
//               <td className="p-4">
//                 <input type="checkbox" />
//               </td>
//               <td className="p-4 flex items-center space-x-3">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${getRandomColorClass()}`}
//                 >
//                   {h.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-black-100 text-sm">
//                     {h.name}
//                   </p>
//                   <p className="text-gray-400 text-xs">{h.email}</p>
//                 </div>
//               </td>
//               <td className="p-4 font-semibold text-black-100 text-sm">
//                 {h.location}
//               </td>
//               <td className="p-4 font-semibold text-black-100 text-sm">
//                 {h.sales}
//               </td>
//               <td className="p-4 text-[#718096] text-sm">{h.lastLogin}</td>
//               <td className="p-4">
//                 <span
//                   className={`px-2 py-1 text-xs rounded-full ${
//                     statusClasses[h.status]
//                   }`}
//                 >
//                   {h.status}
//                 </span>
//               </td>
//               <td className="p-4 text-right relative">
//                 <button onClick={() => toggleMenu(h.id)}>
//                   <FiMoreHorizontal className="text-gray-400" />
//                 </button>
//                 {menuOpenId === h.id && (
//                   <div
//                     ref={menuRef}
//                     className="absolute right-4 top-10 bg-white shadow-lg rounded-lg w-40 z-10"
//                   >
//                     <ul className="py-1">
//                       <li>
//                         <button
//                           onClick={() =>
//                             router.push(`/admin/admin-hosts/${h.id}`)
//                           }
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           View Host
//                         </button>
//                       </li>
//                       <li>
//                         <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                           Suspend Host
//                         </button>
//                       </li>
//                       <li>
//                         <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                           Disable Host
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HostsTable;
