import { FiPackage, FiSearch } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { Order } from "@/app/interface/Order";
import { trackEvent } from "@/lib/mixpanel";
import { usePathname } from "next/navigation";

interface OrderSummaryItem {
  amountReceived: number;
  amountReceivedCurrency: string;
  guestPayment: number;
  guestPaymentCurrency: string;
  homeDeliveryFee: number;
  items: number;
  orderNumber: string;
  tax: number;
  totalAmount: number;
  totalAmountCurrency: string;
  orderId: Order;
}


interface TransactionProps {
  orders: OrderSummaryItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (search: string) => void;
  searchTerm: string;
  totalPages?: number;
  setLimit?: React.Dispatch<React.SetStateAction<number>>; 
  limit: number;
}


const TransactionTable: React.FC<TransactionProps> = ({orders, currentPage, setCurrentPage,searchTerm, totalPages, setLimit, limit, setSearchTerm}) => {
  console.log(orders)
  const pathname = usePathname();
  const [openBreakdownOrderId, setOpenBreakdownOrderId] = useState<string | null>(null);
  const [currencySortState, setCurrencySortState] = useState<"asc" | "desc">("asc");
  const [ordersData, setOrdersData] = useState<OrderSummaryItem[]>(orders);
  
  useEffect(() => {
    setOrdersData(orders);
  }, [orders]);  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const day = date.toLocaleString("en-GB", { day: "2-digit" });
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
  
    return `${day} ${month}, ${year}`;
  };


  const capitalize = (str?: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    //EXPORT CSV FILE
    const exportToCSV = (data: any[], filename = 'transactions.csv') => {
      if (!data || data.length === 0) return;
    
      const headers = [
        'Order ID',
        'Payment Date',
        'Guest Name',
        'Total Amount',
        'Net Payout',
        'Tax',
        'Delivery Fee',
        'Transaction fee',
        'Service fee'
      ];
    
      const csvRows = [headers.join(',')];
    
      for (const row of data) {
        const values = headers.map(header => {
          let value;
    
          switch (header) {
            case 'Order ID':
              value = row.orderNumber;
              break;
            case 'Payment Date':
              value = row.orderId.createdAt ? new Date(row.orderId.createdAt).toLocaleString() : '';
              break;
            case 'Guest Name':
              value = `${capitalize(row.orderId.guestFirstName)} ${capitalize(row.orderId.guestLastName)}`.trim();
              break;
            case 'Total Amount':
              value = row.totalAmount != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.totalAmount.toLocaleString()}"`
                : '';
              break;
            case 'Net Payout':
              value = row.amountReceived != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.amountReceived.toLocaleString()}"`
                : '';
              break;
            case 'Tax':
              value = row.tax != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.tax.toLocaleString()}"`
                : '';
              break;
            case 'Delivery Fee':
              value = row.homeDeliveryFee != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.homeDeliveryFee.toLocaleString()}"`
                : 'N/A';
              break;
            case 'Transaction fee':
              value = row.transactionFee != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.transactionFee.toLocaleString()}"`
                : 'to be fixed';
              break;
            case 'Service fee':
              value = row.serviceFee != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.serviceFee.toLocaleString()}"`
                : 'to be fixed';
              break;
            default:
              value = '';
          }
    
          const escaped = String(value ?? '').replace(/"/g, '""');
          return `"${escaped}"`;
        });
    
        csvRows.push(values.join(','));
      }

      try {
            // Prepend BOM to ensure UTF-8 encoding is preserved
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        trackEvent("Export Data", {
          source: `${pathname} page`,
          timestamp: new Date().toISOString(),
          page_name: `${pathname} Page`,
          route: pathname,
          status: "Successful"
        });
      }catch(error) {
        console.error(error);
        trackEvent("Export Data", {
          source: `${pathname} page`,
          timestamp: new Date().toISOString(),
          page_name: `${pathname} Page`,
          route: pathname,
          status: "Failed"
        });
      }
    };

    
  const getPageNumbers = (currentPage: any, totalPages: any) => {
    const pageNumbers = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 4) {
        pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
  
    return pageNumbers;
  };

  //sort total amount
  const sortTotalAmount = () => {
    const newSortState = currencySortState === "asc" ? "desc" : "asc";
  
    const sorted = [...ordersData].sort((a, b) => {
      const isNGNa = a.totalAmountCurrency === "NGN";
      const isNGNb = b.totalAmountCurrency === "NGN";
  
      // NGN always above Dollar
      if (isNGNa && !isNGNb) return -1;
      if (!isNGNa && isNGNb) return 1;
  
      // Both NGN or both Dollar — sort by amount
      const amountA = a.totalAmount || 0;
      const amountB = b.totalAmount || 0;
  
      return newSortState === "asc" ? amountA - amountB : amountB - amountA;
    });
  
    setOrdersData(sorted);
    setCurrencySortState(newSortState);
  };
  
  
  //sort payout amount
  const sortPayoutAmount = () => {
    const newSortState = currencySortState === "asc" ? "desc" : "asc";
  
    const sorted = [...ordersData].sort((a, b) => {
      const isNGNa = a.totalAmountCurrency === "NGN";
      const isNGNb = b.totalAmountCurrency === "NGN";
  
      // NGN always above Dollar
      if (isNGNa && !isNGNb) return -1;
      if (!isNGNa && isNGNb) return 1;
  
      // Both NGN or both Dollar — sort by amount
      const amountA = a.amountReceived || 0;
      const amountB = b.amountReceived || 0;
  
      return newSortState === "asc" ? amountA - amountB : amountB - amountA;
    });
  
    setOrdersData(sorted);
    setCurrencySortState(newSortState);
  };

  //sort by delivery
  const sortDeliveryFee = () => {
    const newSortState = currencySortState === "asc" ? "desc" : "asc";
  
    const sorted = [...ordersData].sort((a, b) => {
      const isNGNa = a.totalAmountCurrency === "NGN" && a.homeDeliveryFee;
      const isNGNb = b.totalAmountCurrency === "NGN" && b.homeDeliveryFee;
  
      const hasDeliveryA = typeof a.homeDeliveryFee === "number" && a.homeDeliveryFee > 0;
      const hasDeliveryB = typeof b.homeDeliveryFee === "number" && b.homeDeliveryFee > 0;
  
      // 1. NGN with valid homeDeliveryFee goes above all
      if (isNGNa && !isNGNb) return -1;
      if (!isNGNa && isNGNb) return 1;
  
      // 2. If one has delivery fee and one doesn’t, prioritize the one that has
      if (hasDeliveryA && !hasDeliveryB) return -1;
      if (!hasDeliveryA && hasDeliveryB) return 1;
  
      // 3. Sort by delivery fee (only among items that both have or both don’t)
      const amountA = a.homeDeliveryFee || 0;
      const amountB = b.homeDeliveryFee || 0;
  
      return newSortState === "asc" ? amountA - amountB : amountB - amountA;
    });
  
    setOrdersData(sorted);
    setCurrencySortState(newSortState);
  };
  
    
  return (
    <div className="w-full gap-4 pt-3 rounded-xl" id="orders-container">
  <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 md:gap-0" id="orders-controls">
    {/* Left: Filter + Search */}
    <div className="flex flex-col md:flex-row items-center gap-4 md:flex-wrap w-full md:w-auto" id="search-controls">
      {/* Search Input */}
      <div className="w-full md:w-[339px] h-[40px] flex items-center bg-[#FFFFFF] rounded-[12px] px-3 py-1.5" id="search-container">
        <FiSearch className="text-[#111827] mr-2 w-6 h-6" />
        <input
          type="text"
          placeholder="Search by name, email, or others..."
          className="outline-none text-sm text-[#718096] bg-transparent placeholder-[#A0AEC0] w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search-input"
        />
      </div>
    </div>

    {/* Right: Export */}
    <div className="w-full md:w-auto" id="export-container">
      <button 
        onClick={() => exportToCSV(orders)} 
        className="w-full md:w-[153px] h-[40px] flex items-center justify-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm"
        id="export-button"
      >
        <HiOutlineDocumentDownload size={16} />
        Export 
      </button>
    </div>
  </div>

  <div id="main-table" className="w-full gap-4 pt-3 rounded-xl">
    {/* Table */}
    <div className="mt-2 bg-white rounded-2xl shadow p-4 overflow-x-auto" id="orders-table">
      <table className="w-full" id="orders-table-content">
        <colgroup>
          <col className="w-[60px]" id="select-col"/>
          <col className="min-w-[120px]" id="order-col"/>
          <col className="min-w-[120px]" id="guest-col"/>
          <col className="min-w-[120px]" id="total-col"/>
          <col className="min-w-[120px]" id="payout-col"/>
          <col className="min-w-[120px]" id="delivery-col"/>
          <col className="min-w-[120px]" id="status-col"/>
          <col className="w-[60px]" id="actions-col"/>
        </colgroup>
        
        {/* Table Head */}
        <thead id="table-header">
          <tr className="border-b" id="header-row">
            <th className="p-3 text-center" id="select-header">
              <FaRegCircle className="w-5 h-5 mx-auto text-[#718096]"/>
            </th>
            <th className="p-3 text-left" id="order-header">
              <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                Orders
              </div>
            </th>
            <th className="p-3 text-left" id="guest-header">
              <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                Guest 
              </div>
            </th>
            <th className="p-3 text-left" id="total-header">
              <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                Total <PiArrowsDownUpFill onClick={sortTotalAmount} className="cursor-pointer"/>
              </div>
            </th>
            <th className="p-3 text-left" id="payout-header">
              <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                Payout <PiArrowsDownUpFill onClick={sortPayoutAmount} className="cursor-pointer"/>
              </div>
            </th>
            <th className="p-3 text-left" id="delivery-header">
              <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                Delivery <PiArrowsDownUpFill onClick={sortDeliveryFee} className="cursor-pointer"/>
              </div>
            </th>
            <th className="p-3 text-left" id="status-header">
              <div className="flex items-center gap-1 text-base font-medium text-[#718096]">
                Status 
              </div>
            </th>
            <th className="p-3 text-center" id="actions-header">
              <BsThreeDots className="w-5 h-5 text-[#A0AEC0] mx-auto"/>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody id="table-body">
            {ordersData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <div className="flex flex-col items-center justify-center w-full py-16 text-center bg-white rounded-md border border-dashed border-gray-300">
                    <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions Found</h3>
                    <p className="text-sm text-gray-500">
                      You don&apos;t have any transactions matching the current filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              ordersData.map((order, i) => (
            <React.Fragment key={i}>
              <tr className="border-b last:border-b-0 hover:bg-gray-50" id={`order-row-${order.orderNumber}`}>
                <td className="p-3 text-center" id={`select-${order.orderNumber}`}>
                  <FaRegCircle className="w-5 h-5 text-[#718096] mx-auto"/>
                </td>
                <td className="p-3" id={`order-info-${order.orderNumber}`}>
                  <div className="font-semibold text-base text-[#111827]">{order.orderNumber}</div>
                  <div className="text-sm font-medium text-[#718096]">{formatDate(order.orderId.createdAt)}</div>
                </td>
                <td className="p-3" id={`guest-info-${order.orderNumber}`}>
                  <div className="font-semibold text-base text-[#111827]">
                  {`${order.orderId.guestFirstName.charAt(0).toUpperCase()}${order?.orderId.guestFirstName.slice(1)} ${order?.orderId.guestLastName.charAt(0).toUpperCase()}${order.orderId.guestLastName.slice(1)}`}
                  </div>
                  <div className="text-sm font-medium text-[#718096]">{order.orderId.guestEmail}</div>
                </td>
                <td className="p-3" id={`total-info-${order.orderNumber}`}>
                  <div className="text-base font-medium text-[#718096]">{order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.orderId.totalAmount.toLocaleString()}</div>
                </td>
                <td className="p-3 font-semibold text-base text-[#111827]" id={`payout-info-${order.orderNumber}`}>
                  {order?.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.amountReceived.toLocaleString()}
                </td>
                {order.orderId.deliveryType === "homeDelivery" ? (
                  <td className="p-3 font-semibold text-base text-[#111827]" id={`delivery-fee-${order.orderNumber}`}>
                    {order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.homeDeliveryFee}
                  </td>
                ) : (
                  <td className="p-3 font-semibold text-base text-[#111827]" id={`delivery-fee-${order.orderNumber}`}>
                    N/A
                  </td>
                )}
                <td className="p-3" id={`status-action-${order.orderNumber}`}>
                  <button
                  onClick={() => 
                    setOpenBreakdownOrderId((prev) => 
                      prev === order.orderNumber ? null : order.orderNumber
                    )
                  }
                    className="w-full max-w-[156px] h-[35px] flex items-center justify-center text-xs text-[#751423] border border-[#751423] py-2 rounded-[8px] font-extrabold mx-auto"
                    id={`breakdown-button-${order.orderNumber}`}
                  >
                    {openBreakdownOrderId === order.orderNumber ? "See Less" : "See Breakdown"}
                    {openBreakdownOrderId === order.orderNumber ? (
                        <BiChevronUp size={16} className="ml-1 text-[#A0AEC0]" />
                      ) : (
                        <BiChevronDown size={16} className="ml-1 text-[#A0AEC0]" />
                      )}          
                  </button>
                </td>
                <td className="p-3 text-center" id={`actions-${order.orderNumber}`}>
                  <BsThreeDots className="w-5 h-5 text-[#A0AEC0] mx-auto"/>
                </td>
              </tr>

              {/* Expanded Details Row */}
              {openBreakdownOrderId === order.orderNumber && (
                <tr className="border-b border-gray-200" id={`breakdown-details-${order.orderNumber}`}>
                <td colSpan={8} className="pl-14 max-sm:pl-4">
                  <div className="w-full h-[110.8px] lg:h-[76.8px] flex flex-col sm:flex-row px-4 py-2 max-sm:px-2" id={`breakdown-content-${order.orderNumber}`}>
                    <div className="flex-1 flex flex-col justify-between border-r border-gray-300 max-sm:border-r-0 max-sm:pb-2" id={`breakdown-left-${order.orderNumber}`}>
                      <div className="flex justify-between max-sm:gap-2">
                        <span className="text-gray-500 text-sm">{order.items} item(s)</span>
                        <span className="text-gray-500 text-sm text-left xl:pr-16 2xl:pr-28 max-sm:pr-2">{order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between max-sm:gap-2">
                        {order.orderId.deliveryType === "homeDelivery" && (
                          <>
                            <span className="text-gray-500 text-sm">Home Delivery</span>
                            <span className="text-gray-500 text-sm text-left xl:pr-16 2xl:pr-28 max-sm:pr-2">{order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order?.homeDeliveryFee.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between max-sm:pt-2" id={`breakdown-right-${order.orderNumber}`}>
                      <div className="flex justify-between max-sm:gap-2">
                        <span className="text-gray-500 text-sm sm:pl-24">Tax</span>
                        <span className="text-gray-500 text-sm">{order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between max-sm:gap-2">
                        <span className="text-gray-500 text-sm sm:pl-24">Total</span>
                        <span className="text-gray-500 text-sm">{order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              )}
            </React.Fragment>
          )))}
        </tbody>
      </table>
  
          {/* Pagination */}
          <div id="pagination" className="flex flex-col sm:flex-row justify-between sm:mr-4 items-center mt-6 gap-2 sm:gap-0">
            <div className="text-sm text-[#718096] whitespace-nowrap">
              <div className="flex items-center">
                <span className="text-gray-600 text-sm mr-2 whitespace-nowrap">
                  Show result:
                </span>
                <select
                    id="table-limit"
                    value={limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      localStorage.setItem("orders_limit", newLimit.toString()); // persist it
                      setLimit && setLimit(newLimit); // update local state
                    }}
                    className="border rounded-[2px] px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >

                  {[6, 10, 20, 30, 40, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm overflow-x-auto py-2 sm:py-0 w-full justify-center sm:w-auto">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className="text-[#A0AEC0] whitespace-nowrap"
              >
                &lt;
              </button>

              {getPageNumbers(currentPage, totalPages).map((pageNum, index) =>
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-[#A0AEC0]">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-[12px] p-[8px] whitespace-nowrap ${
                      pageNum === currentPage
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : "text-[#A0AEC0] hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                onClick={() => currentPage < (totalPages || 1) && setCurrentPage(currentPage + 1)}
                className="text-[#A0AEC0] whitespace-nowrap">&gt;</button>
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
