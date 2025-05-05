import { FiPackage, FiSearch } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { GoArrowUp } from "react-icons/go";
import { GuestOrder } from "@/app/(dashboard)/admin/admin-delivery/page";

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

  const DeliveryTable: React.FC<DeliveryProps> = ({orders, currentPage, setCurrentPage,searchTerm, totalPages, setLimit, limit, setSearchTerm, setOrderStatus, orderStatus}) => {

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "pending":
            return "bg-[#FFF5EB] text-[#F97316]";
          case "delivered":
            return "bg-[#ECFDF5] text-[#10B981]";
          case "shipped":
            return "bg-[#EEF2FF] text-[#6366F1]";
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
    <div className="w-full gap-4 pt-3 rounded-xl" id="orders-container">
  <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 md:gap-0" id="orders-controls">
    {/* Left: Filter + Search */}
    <div className="flex flex-col md:flex-row items-center gap-4 md:flex-wrap w-full md:w-auto" id="filter-search-container">
      {/* Show Dropdown */}
      <div className="w-full md:w-[189px] h-[56px] flex justify-center items-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium" id="show-dropdown">
        <span>Show:</span>
        <span className="font-bold text-[#111827] text-base">All Orders</span> 
        <MdOutlineKeyboardArrowDown className="w-4 h-4 text-[#111827]"/>
      </div>

      {/* Search Input */}
      <div className="w-full md:w-[339px] h-[56px] flex items-center bg-[#FFFFFF] rounded-[12px] px-3 py-1.5" id="search-container">
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
        className="w-full md:w-[153px] h-[56px] flex items-center justify-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm"
        id="export-button"
      >
        <HiOutlineDocumentDownload size={16} />
        Export 
      </button>
    </div>
  </div>

  <div className="mt-6 bg-white rounded-2xl shadow p-4 overflow-x-auto" id="orders-table-container">
    {/* Table Head */}
    <div className="flex py-3 text-[#718096] font-semibold text-sm border-b min-w-[900px]" id="table-header">
      <div className="w-[60px] flex items-center justify-center shrink-0" id="select-all-header">
        <FaRegCircle className="w-5 h-5"/>
      </div>
      <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]" id="orders-header">
        Orders <PiArrowsDownUpFill />
      </div>
      <div className="flex-1 min-w-[150px] flex items-center gap-1 text-base font-medium text-[#718096]" id="guest-header">
        Guest <PiArrowsDownUpFill />
      </div>
      <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]" id="delivery-header">
        Delivery <GoArrowUp className="text-[#0CAF60]" />
      </div>
      <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]" id="carrier-header">
        Carrier <PiArrowsDownUpFill />
      </div>
      <div className="flex-1 min-w-[100px] flex items-center gap-1 text-base font-medium text-[#718096]" id="status-header">
        Status <PiArrowsDownUpFill />
      </div>
      <div className="w-[60px] flex items-center justify-center shrink-0" id="actions-header">
        <BsThreeDots className="w-5 h-5 text-[#A0AEC0]"/>
      </div>
    </div>

    {/* Table Body */}
    {orders.length === 0 && (
      <div className="flex flex-col items-center justify-center w-full py-16 text-center bg-white rounded-md border border-dashed border-gray-300" id="empty-state">
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
        className="flex items-center py-4 border-b last:border-b-0 text-sm min-w-[900px]"
        id={`order-row-${order.orderId}`}
      >
        <div className="w-[60px] flex justify-center shrink-0" id={`select-${order.orderId}`}>
          <FaRegCircle className="w-5 h-5 text-[#718096]"/>
        </div>
        <div className="flex-1 min-w-[120px]" id={`order-info-${order.orderId}`}>
          <div className="font-semibold text-base text-[#111827]">{order.orderId}</div>
          <div className="text-sm font-medium text-[#718096]">{formatDate(order.createdAt)}</div>
        </div>
        <div className="flex-1 min-w-[150px]" id={`guest-info-${order.orderId}`}>
          <div className="font-semibold text-base text-[#111827]">
            {`${order.guestFirstName.charAt(0).toUpperCase()}${order.guestFirstName.slice(1)} ${order.guestLastName.charAt(0).toUpperCase()}${order.guestLastName.slice(1)}`}
          </div>
          <div className="text-sm font-medium text-[#718096]">{order.guestEmail}</div>
        </div>
        <div className="flex-1 min-w-[120px] font-semibold text-base text-[#111827]" id={`delivery-info-${order.orderId}`}>
          {order.totalAmountCurrency === "NGN" ? "₦" : "$"}{order.totalAmount.toLocaleString()}
        </div>
        <div className="flex-1 min-w-[120px] font-semibold text-base text-[#111827]" id={`carrier-info-${order.orderId}`}>
          GIG(still dummy)
        </div>
        <div className="flex-1 min-w-[100px]" id={`status-info-${order.orderId}`}>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-[8px] ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
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

export default DeliveryTable;