// // components/order/OrderManagement.tsx
// "use client";

// import { cn } from '@/utils/cn';
// import { Search, Settings2 } from "lucide-react";
// import Image from 'next/image';
// import React, { useState } from 'react';
// import OrderPagination from './OrderPagination';
// import { Order } from '@/app/interface/Order';

// interface OrderManagementProps {
//   orders: Order[];
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   tabs: string[];
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   page: number;
//   setPage: (page: number) => void;
//   limit: number;
//   setLimit: (limit: number) => void;
//   totalPages: number;
//   handleOrderClick: (order: Order) => void;
//   handleStatusChange: (status: string) => void;
//   selectedOrder: Order | null;
//   setSelectedOrder: (order: Order | null) => void;
//   statusModal: boolean;
//   setIsStatusModal: (open: boolean) => void;
//   modalRef: React.RefObject<HTMLDivElement>;
// }

// const OrderManagement: React.FC<OrderManagementProps> = ({
//   orders,
//   activeTab,
//   setActiveTab,
//   tabs,
//   searchQuery,
//   setSearchQuery,
//   page,
//   setPage,
//   limit,
//   setLimit,
//   totalPages,
//   handleOrderClick,
//   handleStatusChange,
//   selectedOrder,
//   setSelectedOrder,
//   statusModal,
//   setIsStatusModal,
//   modalRef
// }) => {
//   return (
//     <>
//       {/* Tabs */}
//       <div id="orders-content-container" className='bg-[#FFFFFF] p-5 mt-6 rounded-[12px]'>
//         <div id="orders-tabs" className="flex items-center border-b space-x-6 mt-6 mb-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               className={cn(
//                 "font-general text-sm pb-2 transition-all",
//                 activeTab === tab
//                   ? "text-primary font-bold border-b-2 border-primary"
//                   : "text-[#718096] font-normal hover:text-primary/80"
//               )}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Search and Filter */}
//         <div id="search-filter-container" className="flex items-center gap-3 rounded-md mt-3">
//           <div id="search-container" className="flex items-center bg-[#FAFAFA] px-4 py-2 rounded-[12px] w-[80%] h-[56px]">
//             <Search className="h-6 w-6 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="ml-3 w-full h-full outline-none text-base bg-[#FAFAFA] placeholder:text-gray-400"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <div className='bg-[#FAFAFA] h-14 w-14 flex justify-center items-center'>
//             <button className="p-2 rounded-[12x]">
//               <Settings2 className='text-[#A0AEC0]' />
//             </button>
//           </div>
//         </div>

//         {/* Order List */}
//         <div id="orders-list" className="mt-6 space-y-4">
//           {orders?.length 
//             ? (
//               orders?.map((order) => (
//                 <React.Fragment key={order._id}>
//                   <div className="border-t border-[#EEEFF2] my-3"></div>
//                   <div
//                     onClick={() => handleOrderClick(order)}
//                     className="rounded-lg font-general cursor-pointer"
//                   >
//                     <div className="flex justify-between text-[#718096] font-medium text-sm mb-2 py-4">
//                       <p>
//                         {new Date(order?.createdAt).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "2-digit",
//                           year: "numeric",
//                         })}
//                       </p>

//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedOrder(order);
//                           setIsStatusModal(true);
//                         }}
//                         className={
//                           order.orderStatus === "pending"
//                             ? "bg-[#FFF0E6] text-[#FE964A] px-2 py-1 text-xs rounded flex items-center"
//                             : order.orderStatus === "delivered"
//                             ? "bg-[#ecfdeb] text-[#33ca5e] px-2 py-1 text-xs rounded flex items-center"
//                             : "bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded flex items-center"
//                         }
//                       >
//                         {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)} ▼
//                       </div>
//                     </div>

//                     {order.items.map((item) => (
//                       <div
//                         key={item._id}
//                         className="flex items-center gap-3 mb-2 h-[91px] bg-[#FAFAFA] rounded-[12px] space-x-4 px-2 py-2"
//                       >
//                         <Image
//                           src={item.packageId?.packageImgUrls?.[0] || "/fallback-image.png"}
//                           alt={item.packageId?.packageTitle || "Order Image"}
//                           width={42}
//                           height={42}
//                           className="rounded-md h-[42px] w-[42px] object-contain"
//                         />

//                         <div className="flex-1">
//                           <p className="font-semibold text-sm text-[#111827]">
//                             {item.packageId?.packageTitle || "No Title"}
//                           </p>
//                           <p className="text-[#718096] font-normal text-sm">
//                             {item.packageId?.packagePriceCurrency === "NGN" ? "₦" : "$"}
//                             {item.packageId?.packagePrice?.toLocaleString() || "N/A"}
//                           </p>
//                         </div>

//                         <div className="flex items-center text-[#718096] text-xs">
//                           <span>Qty: {item.quantity}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="bg-white rounded-lg p-4 w-full max-w-md">
//                     <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
//                       <p className="font-medium">Order Number</p>
//                       <p className="font-bold text-gray-900 truncate">{order?.orderId}</p>

//                       <p className="font-medium">Guest</p>
//                       <p className="font-bold text-gray-900">
//                         {order?.guestName || "Guest Name"}
//                       </p>

//                       <p className="font-medium">Delivery</p>
//                       <p className="font-bold text-gray-900">
//                         {order?.items[0]?.deliveryMethod || "N/A"}
//                       </p>

//                       <p className="font-medium">Total Price</p>
//                       <p className="font-bold text-gray-900">
//                         {order?.items[0]?.packageId?.packagePriceCurrency === "NGN" ? "₦" : "$"}
//                         {order.totalAmount?.toLocaleString() || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </React.Fragment>
//               ))
//             ) : (
//               <p>No orders available</p>
//             )}
//         </div>
//       </div>

//       {/* Status Modal */}
//       {statusModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div
//             ref={modalRef}
//             className="bg-white p-4 rounded-[15px] shadow-md w-64"
//           >
//             <ul className="mt-1 space-y-2">
//               {["pending", "shipped", "delivered"].map((status) => (
//                 <li
//                   key={status}
//                   onClick={() => handleStatusChange(status)}
//                   className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-medium text-xl text-gray-700"
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       <div id="orders-pagination">
//         <OrderPagination 
//           totalPages={totalPages} 
//           currentPage={page} 
//           setCurrentPage={setPage} 
//           setLimit={setLimit}
//         />
//       </div>
//     </>
//   );
// };

// export default OrderManagement;