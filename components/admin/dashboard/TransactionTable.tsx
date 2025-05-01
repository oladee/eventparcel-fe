import { FiSearch } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";

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
        <div className="w-full md:w-[189px] h-[56px] flex justify-center items-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium">
          <span>Show:</span>
          <span className="font-bold text-[#111827] text-base">All Orders</span> 
          <MdOutlineKeyboardArrowDown className="w-4 h-4 text-[#111827]"/>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-[339px] h-[56px] flex items-center bg-[#FFFFFF] rounded-[12px] px-3 py-1.5">
          <FiSearch className="text-[#111827] mr-2 w-6 h-6" />
          <input
            type="text"
            placeholder="Search by name, email, or others..."
            className="outline-none text-sm text-[#718096] bg-transparent placeholder-[#A0AEC0] w-full"
          />
        </div>

        {/* Filters Button */}
        <button className="w-full md:w-[112px] h-[56px] flex justify-center items-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Right: Export */}
      <div className="w-full md:w-auto">
        <button className="w-full md:w-[153px] h-[56px] flex items-center justify-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm">
          <HiOutlineDocumentDownload size={16} />
          Export 
          <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#718096]"/>
        </button>
      </div>
    </div>

    <div className="mt-6 bg-white rounded-2xl shadow p-4 overflow-x-auto">
    {/* Table Head */}
    <div className="flex py-3 text-[#718096] font-semibold text-sm border-b min-w-[900px]">
        <div className="w-[60px] flex items-center justify-center shrink-0">
            <FaRegCircle className="w-5 h-5"/>
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Orders <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[150px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Guest <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Total <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Payout <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Delivery <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[100px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Status <PiArrowsDownUpFill />
        </div>
        <div className="w-[60px] flex items-center justify-center shrink-0">
            <BsThreeDots className="w-5 h-5 text-[#A0AEC0]"/>
        </div>
    </div>

    {/* Table Body */}
    {orders.map((order, i) => (
        <div
        key={i}
        className="flex items-center py-4 border-b last:border-b-0 text-sm min-w-[900px]"
        >
        <div className="w-[60px] flex justify-center shrink-0">
            <FaRegCircle className="w-5 h-5 text-[#718096]"/>
        </div>
        <div className="flex-1 min-w-[120px]">
            <div className="font-semibold text-base text-[#111827]">{order.id}</div>
            <div className="text-sm font-medium text-[#718096]">{order.date}</div>
        </div>
        <div className="flex-1 min-w-[150px]">
            <div className="font-semibold text-base text-[#111827]">{order.guest}</div>
            <div className="text-sm font-medium text-[#718096]">{order.email}</div>
        </div>
        <div className="flex-1 min-w-[200px]">
            <div className="text-base font-medium text-[#718096]">{order.total}</div>
        </div>
        <div className="flex-1 min-w-[120px] font-semibold text-base text-[#111827]">{order.payout}</div>
        <div className="flex-1 min-w-[120px] font-semibold text-base text-[#111827]">{order.delivery}</div>
        <div className="flex-1 min-w-[100px]">
            <span
            className={`px-3 py-1 text-xs font-semibold rounded-[8px] ${getStatusColor(
                order.status
            )}`}
            >
            {order.status}
            </span>
        </div>
        <div className="w-[60px] flex justify-center shrink-0">
            <BsThreeDots className="w-5 h-5 text-[#A0AEC0]"/>
        </div>
        </div>
    ))}

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
  );
}

export default TransactionTable;