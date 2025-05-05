import { FiPackage, FiSearch } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { GoArrowUp } from "react-icons/go";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

  interface EventGroup {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupCurrency: string;
    groupPrivacy: string;
  }

  interface Event {
    _id: string;
    eventName: string;
    eventImgUrl: string;
    eventImgPublicId: string;
    eventDescription: string;
  }

  interface OrderItem {
    [key: string]: any;
  }

  interface Order {
    city: string;
    createdAt: string;
    deliveryType: string; 
    dispatchType: string;
    eventGroupId: EventGroup;
    eventId: Event;
    guestEmail: string;
    guestFirstName: string;
    guestLastName: string;
    guestPhoneNumber: string;
    homeDeliveryFee: number;
    hostId: string;
    items: OrderItem[];
    orderId: string;
    orderStatus: string; 
    paymentStatus: string; 
    shippingAddress: string;
    state: string;
    tax: number;
    totalAmount: number;
    totalAmountCurrency: string;
    updatedAt: string;
    __v: number;
    _id: string;
  }

  interface OrdersProps {
    orders: Order[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    setSearchTerm: (search: string) => void;
    setOrderStatus:(status: string) => void;
    searchTerm: string;
    orderStatus: string;
    totalPages?: number;
    setLimit?: React.Dispatch<React.SetStateAction<number>>; 
    limit: number;
  }

const OrdersHeader: React.FC<OrdersProps> = ({orders, currentPage, setCurrentPage,searchTerm, totalPages, setLimit, limit, setSearchTerm, setOrderStatus, orderStatus}) => {
    const Router = useRouter();
    const [selected, setSelected] = useState("All Orders");
    const [isOpen, setIsOpen] = useState(false);

    console.log("o", orderStatus)

    const orderOptions = ["All Orders", "pending", "shipped", "delivered"];
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "pending":
            return "bg-[#FFF0E6] text-[#FE964A]";
          case "delivered":
            return "bg-[#E7F7EF] text-[#0CAF60]";
          case "shipped":
            return "bg-[#F4F0FF] text-[#8C62FF]";
          default:
            return "bg-gray-200 text-gray-600";
        }
      };
    
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        const day = date.toLocaleString("en-GB", { day: "2-digit" });
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear();
      
        return `${day} ${month}, ${year}`;
      };
      
      const handleSelectedOrder = (order: any) => {
        localStorage.setItem("selectedOrder", JSON.stringify(order));
        Router.push("/admin/admin-orderDetails");
      };

      
  //EXPORT CSV FILE
  const exportToCSV = (data: any[], filename = 'orders.csv') => {
    if (!data || data.length === 0) return;
  
    const csvRows = [];
  
    // 1. Headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
  
    // 2. Rows
    for (const row of data) {
      const values = headers.map(header => {
        let value = row[header];
  
        // Format dates
        if (['createdAt', 'acceptedAt', 'updatedAt'].includes(header)) {
          value = new Date(value).toLocaleString();
        }
  
        // Serialize nested objects (e.g., eventId, eventGroupId)
        if (typeof value === 'object' && value !== null) {
          try {
            // Customize this to extract relevant fields if needed
            value = JSON.stringify(value);
          } catch (err) {
            value = '[Invalid Object]';
          }
        }
  
        const escaped = ('' + value).replace(/"/g, '""'); // Escape quotes
        return `"${escaped}"`;
      });
  
      csvRows.push(values.join(','));
    }
  
    // 3. Trigger download
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
    
  return (
    <div id="order-table" className="w-full gap-4 pt-3 rounded-xl">
      <div id="table-top" className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 md:gap-0">
      {/* Left: Filter + Search */}
      <div id="table-filter&search" className="flex flex-col md:flex-row items-center gap-4 md:flex-wrap w-full md:w-auto">
        {/* Show Dropdown */}
        <div className="relative w-full md:w-[189px]">
        {/* Trigger Button */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-[169px] h-[40px] flex justify-between items-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium cursor-pointer"
        >
          <span className="whitespace-nowrap">Show:</span>
          <span className="font-bold text-[#111827] text-base flex-1 text-right">
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1) || "All Orders"}
          </span>
          <MdOutlineKeyboardArrowDown className="w-4 h-4 text-[#111827]" />
        </div>
        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-xl overflow-hidden text-sm text-[#111827]"
            >
              {orderOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                    setOrderStatus(option);
                    // Optionally trigger filtering logic here
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selected === option ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

        {/* Search Input */}
        <div id="table-searchField" className="w-full md:w-[339px] h-[40px] flex items-center bg-[#FFFFFF] rounded-[12px] px-3 py-1.5">
          <FiSearch className="text-[#111827] mr-2 w-6 h-6" />
          <input
            type="text"
            placeholder="Search by name, email, or others..."
            className="outline-none text-sm text-[#718096] bg-transparent placeholder-[#A0AEC0] w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Button */}
        {/* <button id="table-filterField" className="w-full md:w-[112px] h-[40px] flex justify-center items-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium">
          <SlidersHorizontal size={16} />
          Filters
        </button> */}
      </div>

      {/* Right: Export */}
      <div id="table-export" className="w-full md:w-auto">
        <button
        onClick={() => exportToCSV(orders)}
        className="w-full md:w-[153px] h-[40px] flex items-center justify-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm">
          <HiOutlineDocumentDownload size={16} />
          Export 
          {/* <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#718096]"/> */}
        </button>
      </div>
    </div>

    <div id="main-table" className="mt-6 w-full bg-white rounded-2xl shadow p-4 overflow-x-auto">
  {/* Table Head */}
  <div id="table-head" className="flex py-3 text-[#718096] font-semibold text-sm border-b w-full">
    <div className="w-[40px] flex items-center justify-center shrink-0"> {/* Reduced from 60px */}
      <FaRegCircle className="w-5 h-5"/>
    </div>
    <div className="flex-1 min-w-[100px] flex items-center gap-1 text-base font-medium text-[#718096]"> {/* Reduced from 120px */}
      Orders <PiArrowsDownUpFill />
    </div>
    <div className="flex-1 min-w-[250px] flex items-center gap-1 text-base font-medium text-[#718096]"> {/* Increased from 220px */}
      Guest <PiArrowsDownUpFill />
    </div>
    <div className="flex-1 min-w-[220px] flex items-center gap-1 text-base font-medium text-[#718096]"> {/* Increased from 200px */}
      Event <PiArrowsDownUpFill />
    </div>  
    <div className="flex-1 min-w-[80px] flex items-center gap-1 text-base font-medium text-[#718096]"> {/* Reduced from 90px */}
      Price <PiArrowsDownUpFill />
    </div>
    <div className="flex-1 min-w-[80px] flex items-center gap-1 text-base font-medium text-[#718096]"> {/* Reduced from 90px */}
      Delivery <GoArrowUp className="text-[#0CAF60]" />
    </div>
    <div className="flex-1 min-w-[80px] flex items-center gap-1 text-base font-medium text-[#718096]"> {/* Reduced from 90px */}
      Status <PiArrowsDownUpFill />
    </div>
    <div className="w-[40px] flex items-center justify-center shrink-0"> {/* Reduced from 60px */}
      <BsThreeDots className="w-5 h-5 text-[#A0AEC0]"/>
    </div>
  </div>

  {/* Table Body */}
  {orders.length === 0 && (
    <div className="flex flex-col items-center justify-center w-full py-16 text-center bg-white rounded-md border border-dashed border-gray-300">
      <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
      <p className="text-sm text-gray-500">
        You don't have any orders matching the current filter.
      </p>
    </div>
  )}
  
  {orders.map((order, i) => (
    <div
      key={i}
      className="flex items-center border-b last:border-b-0 text-sm min-w-[900px] cursor-pointer"
      onClick={() => handleSelectedOrder(order)}
      id="table-body"
    >
      <div className="w-[40px] flex justify-center shrink-0"> {/* Reduced from 60px */}
        <FaRegCircle className="w-5 h-5 text-[#718096]"/>
      </div>
      <div className="flex-1 min-w-[100px] py-3 h-20 flex flex-col justify-center"> {/* Reduced from 120px */}
             <div className="font-semibold text-base text-[#111827]">{order.orderId}</div>
            <div className="text-sm font-medium text-[#718096]">{formatDate(order.createdAt)}</div>
      </div>
      <div className="flex-1 min-w-[250px] py-3 h-20 flex flex-col justify-center overflow-hidden"> {/* Increased from 220px */}
        <div className="font-semibold text-base text-[#111827] break-words">
          {`${order.guestFirstName} ${order.guestLastName}`}
        </div>
        <div className="text-sm font-medium text-[#718096] break-words">
          {order.guestEmail}
        </div>
      </div>
      <div className="flex-1 min-w-[220px] py-3 h-20 flex flex-col justify-center"> {/* Increased from 200px */}
        <div className="text-base font-medium text-[#718096] break-words">
          {order.eventId.eventName
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")} 
        </div>
      </div>
      <div className="flex-1 min-w-[80px] font-semibold text-base text-[#111827] py-3 h-20 flex items-center"> {/* Reduced from 95px */}
        {order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order.totalAmount.toLocaleString()}
      </div>
      <div className="flex-1 min-w-[80px] font-semibold text-base text-[#111827] py-3 h-20 flex items-center"> {/* Reduced from 95px */}
        {order.deliveryType === "homeDelivery" ? "Delivery" : "Pickup"}
      </div>
      <div className="flex-1 min-w-[80px] py-3 h-20 flex items-center"> {/* Reduced from 95px */}
        <span
          className={`w-[85px] px-3 py-1 text-xs font-semibold rounded-[8px] ${getStatusColor(
              order.orderStatus
          )}`}
        >
          {order.orderStatus.charAt(0).toUpperCase()}{order.orderStatus.slice(1)}
        </span>
      </div>
      <div className="w-[40px] flex justify-center shrink-0"> {/* Reduced from 60px */}
        <BsThreeDots className="w-5 h-5 text-[#A0AEC0]"/>
      </div>
    </div>
  ))}

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
          className="text-[#A0AEC0] whitespace-nowrap">&lt;</button>
          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pageNum) => (
            <button
              id="tableNum"
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
          ))}
          <button
            onClick={() => currentPage < (totalPages || 1) && setCurrentPage(currentPage + 1)}
            className="text-[#A0AEC0] whitespace-nowrap">&gt;</button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default OrdersHeader;