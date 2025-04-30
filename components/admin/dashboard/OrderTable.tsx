import { FiSearch } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { GoArrowUp } from "react-icons/go";



const orders = [
    {
      id: "#ID238976",
      date: "24 Apr, 2025",
      guest: "Chieko Chute",
      email: "chieko@mail.com",
      event: "James & Jane Wedding Anniversary 2025",
      price: "₦1,560,000",
      delivery: "Pickup",
      status: "Pending"
    },
    {
      id: "#ID238975",
      date: "24 Apr, 2025",
      guest: "Annabel Rohan",
      email: "chieko@mail.com",
      event: "James & Jane Wedding Anniversary 2025",
      price: "$475.11",
      delivery: "Delivery",
      status: "Pending"
    },
    {
      id: "#ID238976",
      date: "24 Apr, 2025",
      guest: "Pedro Huard",
      email: "chieko@mail.com",
      event: "James & Jane Wedding Anniversary 2025",
      price: "₦1,560,000",
      delivery: "Delivery",
      status: "Delivery"
    },
    {
      id: "#ID238975",
      date: "24 Apr, 2025",
      guest: "Jamel Eusebio",
      email: "chieko@mail.com",
      event: "James & Jane Wedding Anniversary 2025",
      price: "₦1,560,000",
      delivery: "Pickup",
      status: "Delivery"
    },
    {
      id: "#ID238975",
      date: "24 Apr, 2025",
      guest: "Geoffroy Mott",
      email: "chieko@mail.com",
      event: "James & Jane Wedding Anniversary 2025",
      price: "$450.00",
      delivery: "Delivery",
      status: "Shipped"
    }
  ];

const OrdersHeader = () => {

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
      <div className="flex flex-wrap justify-between items-center">
      {/* Left: Filter + Search */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Show Dropdown */}
        <div className="w-[189px] h-[56px] flex justify-center items-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium ">
          <span>Show:</span>
          <span className="font-bold text-[#111827] text-base">All Orders</span> 
          <MdOutlineKeyboardArrowDown className="w-4 h-4 text-[#111827]"/>

        </div>

        {/* Search Input */}
        <div className="w-[339px] h-[56px] flex items-center bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 ">
          <FiSearch className="text-[#111827] mr-2 w-6 h-6" />
          <input
            type="text"
            placeholder="Search by name, email, or others..."
            className="outline-none text-sm text-[#718096] bg-transparent placeholder-[#A0AEC0] w-full"
            />
        </div>

        {/* Filters Button */}
        <button className="w-[112px] h-[56px] flex justify-center items-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium ">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div>
      {/* Right: Export */}
        <button className="w-[153px] h-[56px] flex items-center justify-center gap-2 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm">
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
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Guest <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Event <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Price <PiArrowsDownUpFill />
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
        Delivery <GoArrowUp className="text-[#0CAF60]" />
        </div>
        <div className="flex-1 min-w-[120px] flex items-center gap-1 text-base font-medium text-[#718096]">
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
            <div className="text-base font-medium text-[#718096]">{order.event}</div>
        </div>
        <div className="flex-1 min-w-[120px] font-semibold text-base text-[#111827]">{order.price}</div>
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
    <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-[#718096]">
        Show result: <span className="font-semibold">6</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
        <button className="text-[#A0AEC0]">&lt;</button>
        {[1, 2, 3, 4, "...", 20].map((n, idx) => (
            <button
            key={idx}
            className={`w-8 h-8 rounded-md ${
                n === 2 ? "bg-[#DCFCE7] text-[#16A34A]" : "text-[#A0AEC0] hover:bg-gray-100"
            }`}
            >
            {n}
            </button>
        ))}
        </div>
    </div>
    </div>
    </div>
  );
}

export default OrdersHeader;