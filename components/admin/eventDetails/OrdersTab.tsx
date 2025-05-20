"use client"
import React, { useState, useMemo } from "react"
import { FiSearch, FiDownload } from "react-icons/fi"
import OrderTable, { Order } from "./OrderTable"
import { saveAs } from 'file-saver'

// Matches the API shape for each order
export interface EventOrder {
  orderId: string
  createdAt: string
  guestFirstName: string
  guestLastName: string
  guestEmail: string
  totalAmount: number
  totalAmountCurrency: string
  orderStatus: "pending" | "shipped" | "delivered"
}

const statusTabs = ["All Orders", "pending", "shipped", "delivered"] as const
type Status = typeof statusTabs[number]

interface OrdersTabProps {
  orders: EventOrder[]
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<Status>("All Orders")
  const [search, setSearch] = useState("")

  // Filter & map into the table’s Order shape
  const tableOrders: Order[] = useMemo(() => {
    return orders
      .filter(order => {
        const matchesStatus =
          activeTab === "All Orders" || order.orderStatus === activeTab
  
        const fullName = `${order.guestFirstName} ${order.guestLastName}`.toLowerCase()
        const matchesSearch =
          !search ||
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          fullName.includes(search.toLowerCase())
  
        return matchesStatus && matchesSearch
      })
      .map(order => ({
        id: order.orderId,
        date: new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        guest: `${order.guestFirstName} ${order.guestLastName}`,
        email: order.guestEmail,
        amount:
          order.totalAmountCurrency === "NGN"
            ? `₦${order.totalAmount.toLocaleString()}`
            : `$${order.totalAmount.toLocaleString()}`,
        status: order.orderStatus,
      }))
  }, [orders, search, activeTab])

  console.log("tableOrders", tableOrders)



  
const handleExport = () => {
  const csvHeaders = ['Order ID', 'Date', 'Guest', 'Email', 'Amount', 'Status']

  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const csvRows = tableOrders.map(order => [
    order.id,
    order.date,
    order.guest,
    order.email,
    escapeCSV(order.amount), // Quote to protect values like ₦4,000 or $2,000
    order.status === 'delivered' ? 'Completed' : capitalize(order.status),
  ])

  const csvContent = [
    csvHeaders,
    ...csvRows
  ]
    .map(row => row.join(','))
    .join('\n')

  // Add BOM to handle special characters like ₦
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'orders.csv')
}

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

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
              {tab === "delivered" ? "Completed" : tab}
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
        <button onClick={handleExport} className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 text-[#718096] text-sm">
          <FiDownload className="mr-2" /> Download
        </button>
      </div>

      {/* Table */}
      <OrderTable orders={tableOrders} />
    </div>
  )
}

export default OrdersTab














// import React, { useState, useMemo } from "react";
// import { FiSearch, FiCalendar, FiDownload } from "react-icons/fi";
// import OrderTable from "./OrderTable";

// const statusTabs = ["All Orders", "Pending", "Shipped", "Completed"] as const;

// interface Order {
//   id: string;
//   date: string;
//   guest: string;
//   email: string;
//   amount: string;
//   status: "Pending" | "Shipped" | "Completed";
// }

// // Dummy orders array
// const allOrders: Order[] = Array.from({ length: 30 }, (_, i) => ({
//   id: `#ID2389${760 + i}`,
//   date: "24 Apr, 2025",
//   guest: [
//     "Chieko Chute",
//     "Annabel Rohan",
//     "Pedro Huard",
//     "Jamel Eusebio",
//     "Augustina Midgett",
//     "Geoffrey Mott"
//   ][i % 6],
//   email: "chieko@mail.com",
//   amount: [
//     "₦1,560,000",
//     "$475.11",
//     "₦1,560,000",
//     "₦21,560,000",
//     "$450.00",
//     "₦1,560,000"
//   ][i % 6],
//   status: ["Pending", "Pending", "Shipped", "Completed", "Pending", "Shipped"][
//     i % 6
//   ] as Order["status"]
// }));

// const OrdersTab: React.FC = () => {
//   const [activeTab, setActiveTab] =
//     useState<(typeof statusTabs)[number]>("All Orders");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(6);

//   const filtered = useMemo(() => {
//     let data = allOrders;
//     if (activeTab !== "All Orders") {
//       data = data.filter((o) => o.status === activeTab);
//     }
//     if (search) {
//       data = data.filter(
//         (o) =>
//           o.id.includes(search) ||
//           o.guest.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     return data;
//   }, [activeTab, search]);

//   const pageCount = Math.ceil(filtered.length / pageSize);
//   const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="space-y-4 bg-white rounded-2xl py-4 overflow-x-auto">
//       {/* Status Tabs */}
//       <div className="border-b">
//         <nav className="flex space-x-8 px-2">
//           {statusTabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => {
//                 setActiveTab(tab);
//                 setPage(1);
//               }}
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
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search by ID, or others..."
//             className="ml-2 w-full bg-transparent border-none focus:ring-0 text-sm text-[#111827] placeholder-[#A0AEC0] outline-none"
//           />
//         </div>
//         <div className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4">
//           <FiCalendar className="text-gray-400 mr-2" />
//           <span className="text-[#718096] text-sm">April 11 - April 24</span>
//         </div>
//         <button className="flex items-center bg-[#FAFAFA] rounded-[12px] px-4 py-4 text-[#718096] text-sm">
//           <FiDownload className="mr-2" /> Download
//         </button>
//       </div>

//       {/* Table */}
//       <OrderTable orders={pageData} />

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-4 px-4">
//         <div className="flex items-center space-x-2">
//           <span className="text-[#718096] font-medium text-sm">Show result:</span>
//           <select
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(Number(e.target.value));
//               setPage(1);
//             }}
//             className="bg-white border rounded-[7px] px-2 py-1 font-bold"
//           >
//             {[6, 10, 20, 50].map((n) => (
//               <option key={n} value={n}>
//                 {n}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="px-2"
//           >
//             ‹
//           </button>
//           {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
//             <button
//               key={p}
//               onClick={() => setPage(p)}
//               className={`px-3 py-1 rounded-[7px] ${
//                 p === page ? "bg-green-100 text-[#0CAF60] font-bold" : "text-gray-500"
//               }`}
//             >
//               {p}
//             </button>
//           ))}
//           <button
//             onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
//             disabled={page === pageCount}
//             className="px-2"
//           >
//             ›
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrdersTab;
