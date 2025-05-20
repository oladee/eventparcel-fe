"use client"
import React, { useState, useMemo } from "react"
import { FiSearch, FiDownload } from "react-icons/fi"
import OrderTable, { Order } from "./OrderTable"

// now accepts any string status
export interface EventOrder {
  orderId: string
  createdAt: string
  guestFirstName: string
  guestLastName: string
  guestEmail: string
  totalAmount: number
  totalAmountCurrency: string
  orderStatus: string
}

const statusTabs = ["All Orders", "pending", "shipped", "delivered"] as const
type Status = typeof statusTabs[number]

interface OrdersTabProps {
  orders: EventOrder[]
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<Status>("All Orders")
  const [search, setSearch] = useState("")

  const tableOrders: Order[] = useMemo(() => {
    return orders
      .filter(o => {
        // if a specific status is selected, only show matching
        if (activeTab !== "All Orders" && o.orderStatus.toLowerCase() !== activeTab)
          return false

        if (search) {
          const name = `${o.guestFirstName} ${o.guestLastName}`.toLowerCase()
          if (
            !o.orderId.includes(search) &&
            !name.includes(search.toLowerCase())
          ) {
            return false
          }
        }

        return true
      })
      .map(o => ({
        id: o.orderId,
        date: new Date(o.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        guest: `${o.guestFirstName} ${o.guestLastName}`,
        email: o.guestEmail,
        amount:
          o.totalAmountCurrency === "NGN"
            ? `₦${o.totalAmount.toLocaleString()}`
            : `$${o.totalAmount.toLocaleString()}`,
        status: o.orderStatus,
      }))
  }, [activeTab, search, orders])

  return (
    <div className="space-y-4 bg-white rounded-2xl py-4 overflow-x-auto">
      {/* Status Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 px-2">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-base font-bold ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-[#718096]"
              }`}
            >
              {tab === "All Orders" ? tab : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 px-4">
        <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 w-full max-w-[275px]">
          <FiSearch className="text-[#111827]" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or guest..."
            className="ml-2 w-full bg-transparent border-none focus:ring-0 text-sm placeholder-[#A0AEC0] outline-none"
          />
        </div>
        {/* <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4">
          <FiCalendar className="text-gray-400 mr-2" />
          <span className="text-[#718096] text-sm">All dates</span>
        </div> */}
        <button className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 text-[#718096] text-sm">
          <FiDownload className="mr-2" /> Download
        </button>
      </div>

      {/* Table */}
      <OrderTable orders={tableOrders} />
    </div>
  )
}

export default OrdersTab
















// // components/admin/eventDetails/OrdersTab.tsx
// "use client";
// import React, { useState, useMemo } from "react";
// import { FiSearch, FiCalendar, FiDownload } from "react-icons/fi";
// import OrderTable, { Order as TableOrder } from "./OrderTable";

// // Matches the API shape for each order
// export interface EventOrder {
//   orderId: string;
//   createdAt: string;
//   guestFirstName: string;
//   guestLastName: string;
//   guestEmail: string;
//   totalAmount: number;
//   totalAmountCurrency: string;
//   orderStatus: string;  // no longer a strict union
// }

// const statusTabs = ["All Orders", "Pending", "Shipped", "Completed"] as const;
// type Status = typeof statusTabs[number];

// interface OrdersTabProps {
//   orders: EventOrder[];
// }

// const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
//   const [activeTab, setActiveTab] = useState<Status>("All Orders");
//   const [search, setSearch] = useState("");

//   const tableOrders: TableOrder[] = useMemo(() => {
//     return orders
//       .filter((o) => {
//         if (activeTab !== "All Orders" && !o.orderStatus.toLowerCase().includes(activeTab.toLowerCase())) {
//           return false;
//         }
//         if (
//           search &&
//           !(
//             o.orderId.includes(search) ||
//             `${o.guestFirstName} ${o.guestLastName}`.toLowerCase().includes(search.toLowerCase())
//           )
//         ) {
//           return false;
//         }
//         return true;
//       })
//       .map((o) => ({
//         id: o.orderId,
//         date: new Date(o.createdAt).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//         guest: `${o.guestFirstName} ${o.guestLastName}`,
//         email: o.guestEmail,
//         amount:
//           o.totalAmountCurrency === "NGN"
//             ? `₦${o.totalAmount.toLocaleString()}`
//             : `$${o.totalAmount.toLocaleString()}`,
//         status: o.orderStatus,
//       }));
//   }, [orders, activeTab, search]);

//   return (
//     <div className="space-y-4 bg-white rounded-2xl py-4 overflow-x-auto">
//       {/* Status Tabs */}
//       <div className="border-b">
//         <nav className="flex space-x-8 px-2">
//           {statusTabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-3 text-base font-bold ${
//                 activeTab === tab
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-[#718096]"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 px-4">
//         <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 w-full max-w-[275px]">
//           <FiSearch className="text-[#111827]" size={18} />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by ID or guest..."
//             className="ml-2 w-full bg-transparent border-none focus:ring-0 text-sm placeholder-[#A0AEC0] outline-none"
//           />
//         </div>
//         <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4">
//           <FiCalendar className="text-gray-400 mr-2" />
//           <span className="text-[#718096] text-sm">All dates</span>
//         </div>
//         <button className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 text-[#718096] text-sm">
//           <FiDownload className="mr-2" /> Download
//         </button>
//       </div>

//       {/* Table */}
//       <OrderTable orders={tableOrders} />
//     </div>
//   );
// };

// export default OrdersTab;


























// "use client"
// import React, { useState, useMemo } from "react"
// import { FiSearch, FiCalendar, FiDownload } from "react-icons/fi"
// import OrderTable, { Order } from "./OrderTable"

// // Matches the API shape for each order
// export interface EventOrder {
//   orderId: string
//   createdAt: string
//   guestFirstName: string
//   guestLastName: string
//   guestEmail: string
//   totalAmount: number
//   totalAmountCurrency: string
//   orderStatus: "Pending" | "Shipped" | "Completed"
// }

// const statusTabs = ["All Orders", "Pending", "Shipped", "Completed"] as const
// type Status = typeof statusTabs[number]

// interface OrdersTabProps {
//   orders: EventOrder[]
// }

// const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
//   const [activeTab, setActiveTab] = useState<Status>("All Orders")
//   const [search, setSearch] = useState("")

//   // Filter & map into the table’s Order shape
//   const tableOrders: Order[] = useMemo(
//     () =>
//       orders
//         .filter(o => {
//           if (activeTab !== "All Orders" && o.orderStatus !== activeTab) return false
//           if (
//             search &&
//             !(
//               o.orderId.includes(search) ||
//               `${o.guestFirstName} ${o.guestLastName}`
//                 .toLowerCase()
//                 .includes(search.toLowerCase())
//             )
//           ) {
//             return false
//           }
//           return true
//         })
//         .map(o => ({
//           id: o.orderId,
//           date: new Date(o.createdAt).toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           }),
//           guest: `${o.guestFirstName} ${o.guestLastName}`,
//           email: o.guestEmail,
//           amount:
//             o.totalAmountCurrency === "NGN"
//               ? `₦${o.totalAmount.toLocaleString()}`
//               : `$${o.totalAmount.toLocaleString()}`,
//           status: o.orderStatus,
//         })),
//     [activeTab, search, orders]
//   )

//   return (
//     <div className="space-y-4 bg-white rounded-2xl py-4 overflow-x-auto">
//       {/* Status Tabs */}
//       <div className="border-b">
//         <nav className="flex space-x-8 px-2">
//           {statusTabs.map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-3 text-base font-bold ${
//                 activeTab === tab
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-[#718096]"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 px-4">
//         <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 w-full max-w-[275px]">
//           <FiSearch className="text-[#111827]" size={18} />
//           <input
//             type="text"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search by ID or guest..."
//             className="ml-2 w-full bg-transparent border-none focus:ring-0 text-sm placeholder-[#A0AEC0] outline-none"
//           />
//         </div>
//         <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4">
//           <FiCalendar className="text-gray-400 mr-2" />
//           <span className="text-[#718096] text-sm">All dates</span>
//         </div>
//         <button className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 text-[#718096] text-sm">
//           <FiDownload className="mr-2" /> Download
//         </button>
//       </div>

//       {/* Table */}
//       <OrderTable orders={tableOrders} />
//     </div>
//   )
// }

// export default OrdersTab

