import { FiPackage, FiSearch } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { GoArrowUp } from "react-icons/go";
import { GuestOrder } from "@/app/(dashboard)/admin/admin-delivery/page";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/mixpanel";


  interface DeliveryProps {
    orders: GuestOrder[];
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

  const DeliveryTable: React.FC<DeliveryProps> = ({orders, currentPage, setOrderStatus, orderStatus, setCurrentPage,searchTerm, totalPages, setLimit, limit, setSearchTerm}) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const orderOptions = ["All Orders", "pending", "shipped", "delivered", "PickedUp"];
    const [selected, setSelected] = useState("All Orders");
    const [currencySortState, setCurrencySortState] = useState<"asc" | "desc">("asc");
    const [ordersData, setOrdersData] = useState<GuestOrder[]>(orders);

     useEffect(() => {
        setOrdersData(orders);
      }, [orders]);  

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "pending":
          return "bg-[#FFF5EB] text-[#F97316]";
        case "delivered":
          return "bg-[#ECFDF5] text-[#10B981]";
        case "shipped":
          return "bg-[#EEF2FF] text-[#6366F1]";
        case "pickedup":
          return "bg-[#FEF9C3] text-[#CA8A04]"; 
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
      
      const exportToCSV = (data: any[], filename = 'delivery.csv') => {
        if (!data || data.length === 0) return;
      
        const headers = [
          'Order ID',
          'Order Date',
          'Delivery Type',
          'Delivery Fee',
          'Delivery Location',
          'Carrier',
          'Status'
        ];
      
        const csvRows = [headers.join(',')];
      
        // const capitalize = (str?: string) =>
        //   str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
      
        for (const row of data) {
          const values = headers.map(header => {
            let value;
      
            switch (header) {
              case 'Order ID':
                value = row.orderId;
                break;
              case 'Order Date':
                value = row.createdAt ? new Date(row.createdAt).toLocaleString() : '';
                break;
              case 'Delivery Type':
                value = row.deliveryType || '';
                break;
              case 'Delivery Fee':
                value = row.homeDeliveryFee != null
                  ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.homeDeliveryFee.toLocaleString()}"`
                  : 'N/A';
                break;
              case 'Delivery Location':
                value = row.shippingAddress || 'N/A';
                break;
              case 'Carrier':
                value = row.deliveryType === "pickUp" ? "PickUp" : 'GIG';
                break;
              case 'Status':
                value = row.orderStatus || '';
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

      const sortOrdersByCurrency = () => {
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
    <div className="flex flex-col md:flex-row items-center gap-4 md:flex-wrap w-full md:w-auto" id="filter-search-container">
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

  <div className="mt-6 bg-white rounded-2xl shadow p-4 overflow-x-auto" id="orders-table-container">
    {/* Table Head */}
        {/* Table Head */}
        <div className="flex py-3 text-[#718096] font-semibold text-sm border-b min-w-[900px]" id="table-header">
          <div className="w-[60px] flex items-center justify-center shrink-0" id="select-all-header">
            <FaRegCircle className="w-5 h-5"/>
          </div>
          <div className="w-[200px] flex items-center gap-1 text-base font-medium text-[#718096]" id="orders-header">
            Orders <PiArrowsDownUpFill   onClick={sortOrdersByCurrency} className="cursor-pointer"/>
          </div>
          <div className="w-[350px] flex items-center gap-1 text-base font-medium text-[#718096]" id="guest-header">
            Guest <PiArrowsDownUpFill   onClick={sortOrdersByCurrency} className="cursor-pointer"/>
          </div>
          <div className="w-[200px] flex items-center gap-1 text-base font-medium text-[#718096]" id="delivery-header">
            Delivery <GoArrowUp className="text-[#0CAF60]" />
          </div>
          <div className="w-[200px] flex items-center gap-1 text-base font-medium text-[#718096]" id="carrier-header">
            Carrier <PiArrowsDownUpFill   onClick={sortOrdersByCurrency} className="cursor-pointer"/>
          </div>
          <div className="w-[160px] flex items-center gap-1 text-base font-medium text-[#718096]" id="status-header">
            Status <PiArrowsDownUpFill   onClick={sortOrdersByCurrency} className="cursor-pointer"/>
          </div>
          <div className="w-[60px] flex items-center justify-center shrink-0" id="actions-header">
            <BsThreeDots className="w-5 h-5 text-[#A0AEC0]"/>
          </div>
        </div>

    {/* Table Body */}
    {orders.length === 0 && (
      <div className="flex flex-col items-center justify-center w-full py-16 text-center bg-white rounded-md border border-dashed border-gray-300" id="empty-state">
        <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Delivery Found</h3>
        <p className="text-sm text-gray-500">
          You don&apos;t have any delivery matching the current filter.
        </p>
      </div>
    )}
    
    {ordersData.map((order, i) => (
          <div
            key={i}
            className="flex items-center py-4 border-b last:border-b-0 text-sm min-w-[900px]"
            id={`order-row-${order.orderId}`}
          >
            <div className="w-[60px] flex justify-center shrink-0" id={`select-${order.orderId}`}>
              <FaRegCircle className="w-5 h-5 text-[#718096]"/>
            </div>
            <div className="w-[200px]" id={`order-info-${order.orderId}`}>
              <div className="font-semibold text-base text-[#111827] truncate">{order.orderId}</div>
              <div className="text-sm font-medium text-[#718096]">{formatDate(order.createdAt)}</div>
            </div>
            <div className="w-[350px]" id={`guest-info-${order.orderId}`}>
              <div className="font-semibold text-base text-[#111827]">
                {`${order?.guestFirstName?.charAt(0)?.toUpperCase()}${order?.guestFirstName?.slice(1)} ${order?.guestLastName?.charAt(0)?.toUpperCase()}${order?.guestLastName?.slice(1)}`}
              </div>
              <div className="text-sm font-medium text-[#718096] truncate">{order?.guestEmail}</div>
            </div>
            <div className="w-[200px] font-semibold text-base text-[#111827]" id={`delivery-info-${order.orderId}`}>
              {order.homeDeliveryFee != null
                ? `${order.totalAmountCurrency === "NGN" ? "₦" : "$"}${order.homeDeliveryFee.toLocaleString()}`
                : "N/A"}
            </div>
            <div className="w-[200px] font-semibold text-base text-[#111827]" id={`carrier-info-${order.orderId}`}>
              {order.deliveryType === "pickUp" 
                ? "PickUp" : order.deliveryType === "homeDelivery" ? "GIG" : ""}
            </div>
            <div className="w-[160px]" id={`status-info-${order.orderId}`}>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-[8px] ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order?.orderStatus?.charAt(0)?.toUpperCase() + order?.orderStatus?.slice(1)}
              </span>
            </div>
            <div className="w-[60px] flex justify-center shrink-0" id={`actions-${order.orderId}`}>
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
  );
}

export default DeliveryTable;