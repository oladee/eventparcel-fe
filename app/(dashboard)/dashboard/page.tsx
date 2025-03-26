"use client";

import React from "react";
import Container from "@/components/dashboard/Container";
import { FaArrowUp, FaCalendarAlt } from "react-icons/fa";

const data = [
  { month: "Jan", height: "h-[40px]" },
  { month: "Feb", height: "h-[60px]" },
  { month: "Mar", height: "h-[80px]" },
  {
    month: "Apr",
    height: "h-[160px]", // This is the tallest bar
    netSales: "₦852,657.00"
  },
  { month: "May", height: "h-[70px]" },
  { month: "Jun", height: "h-[60px]" },
  { month: "Jul", height: "h-[50px]" }
];

const Page: React.FC = () => {
  return (
    <Container>
      {/* Wrapper */}
      <div className="w-full h-full p-4 flex flex-col gap-6">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          {/* Left - Overall Sales + Big Number */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800">
                Overall sales
              </h1>
              <span className="flex items-center text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <FaArrowUp className="mr-1" />
                23.5%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">₦131.49M</div>
          </div>

          {/* Right - Monthly Dropdown */}
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Monthly
              <FaCalendarAlt />
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white shadow-sm rounded-lg p-4">
          {/* Y-Axis Labels (optional) */}
          <div className="relative">
            <div className="absolute -left-10 top-0 flex flex-col justify-between h-full text-gray-400 text-sm">
              <span>400k</span>
              <span>300k</span>
              <span>200k</span>
              <span>100k</span>
              <span>0</span>
            </div>
            {/* Chart Grid */}
            <div className="grid grid-cols-7 gap-4 mt-2">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-end"
                >
                  {/* Bar Wrapper */}
                  <div className="relative w-full bg-gray-100 h-[200px] flex items-end justify-center rounded-md overflow-hidden">
                    <div
                      className={`w-2/3 bg-red-500 rounded-t-md hover:bg-red-600 transition-all ${item.height} relative`}
                    >
                      {/* Tooltip for Apr */}
                      {item.netSales && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max bg-white text-gray-700 text-sm p-2 rounded shadow-md">
                          {item.netSales}
                          <span className="block text-xs text-gray-400">
                            Net sales
                          </span>
                          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Month Label */}
                  <span className="mt-2 text-sm text-gray-600">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            {/* Optional - Subtle line chart overlay (static example) */}
            <svg
              viewBox="0 0 700 200"
              preserveAspectRatio="none"
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
              <path
                d="M0,160 C100,150 150,140 200,120 C250,90 300,60 350,40 C400,20 500,80 550,60 C600,40 650,80 700,50"
                stroke="#9F1239" /* Tailwind's red-900 or so */
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;

// "use client";
// import Container from "@/components/dashboard/Container";

// const Page = () => {

//   return (
//     <Container>
//       <div className="w-full h-full flex items-center justify-center">
//         Dashboard is coming soon
//       </div>
//     </Container>
//   );
// };

// export default Page;
