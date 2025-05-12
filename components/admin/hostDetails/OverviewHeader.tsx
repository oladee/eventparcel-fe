"use client";

import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlineInsertChartOutlined } from "react-icons/md";

interface Metric {
  overall: number;
  growthRate: number;
}

interface Props {
  summary: {
    totalOrders: Metric;
    totalDelivered: Metric;
    pendingOrders: Metric;
  };
}


const OverviewHeader: React.FC<Props> = () => {
  // const {
  //   totalOrders: { overall: orders, growthRate: ordersGrowth },
  //   totalDelivered: { overall: delivered, growthRate: deliveredGrowth },
  //   pendingOrders: { overall: pending, growthRate: pendingGrowth },
  // } = summary;

  // const formatChange = (change: number) =>
  //   `${change >= 0 ? "+" : ""}${change}%`;

  return (
    <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
      <h2 className="text-lg font-bold flex items-center space-x-2">
        <MdOutlineInsertChartOutlined size={20} color="#A0AEC0" />
        <span className="text-[#111827]">Overview</span>
      </h2>

      <div className="flex items-center space-x-6">
        {/* Total Orders */}
        

        {/* Last update */}
        <div className="text-[#718096] text-sm flex items-center space-x-2">
          <span>Last update:</span>
          <span className="font-semibold text-black-100">
            {new Date().toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button className="outline-none">
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewHeader;



// "use client";

// import React from "react";
// import { FiRefreshCw } from "react-icons/fi";
// import { MdOutlineInsertChartOutlined } from "react-icons/md";

// interface Metric {
//   overall: number;
//   growthRate: number;
// }

// interface Props {
//   summary: {
//     totalOrders: Metric;
//     totalDelivered: Metric;
//     pendingOrders: Metric;
//   };
// }

// const OverviewHeader: React.FC<Props> = ({ summary }) => {
//   const {
//     totalOrders: { overall: orders, growthRate: ordersGrowth },
//     totalDelivered: { overall: delivered, growthRate: deliveredGrowth },
//     pendingOrders: { overall: pending, growthRate: pendingGrowth },
//   } = summary;

//   const formatChange = (change: number) =>
//     `${change >= 0 ? "+" : ""}${change}%`;

//   return (
//     <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
//       <h2 className="text-lg font-bold flex items-center space-x-2">
//         <MdOutlineInsertChartOutlined size={20} color="#A0AEC0" />
//         <span className="text-[#111827]">Overview</span>
//       </h2>

//       <div className="flex items-center space-x-6">
//         {/* Total Orders */}
//         <div className="text-sm">
//           <span className="text-[#718096]">Total Orders:</span>{" "}
//           <span className="font-semibold">{orders}</span>{" "}
//           <span
//             className={`text-xs ${
//               ordersGrowth >= 0 ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {formatChange(ordersGrowth)}
//           </span>
//         </div>

//         {/* Total Delivered */}
//         <div className="text-sm">
//           <span className="text-[#718096]">Delivered:</span>{" "}
//           <span className="font-semibold">{delivered}</span>{" "}
//           <span
//             className={`text-xs ${
//               deliveredGrowth >= 0 ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {formatChange(deliveredGrowth)}
//           </span>
//         </div>

//         {/* Pending Orders */}
//         <div className="text-sm">
//           <span className="text-[#718096]">Pending:</span>{" "}
//           <span className="font-semibold">{pending}</span>{" "}
//           <span
//             className={`text-xs ${
//               pendingGrowth >= 0 ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {formatChange(pendingGrowth)}
//           </span>
//         </div>

//         {/* Last update */}
//         <div className="text-[#718096] text-sm flex items-center space-x-2">
//           <span>Last update:</span>
//           <span className="font-semibold text-black-100">
//             {new Date().toLocaleDateString("en-GB", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </span>
//           <button className="outline-none">
//             <FiRefreshCw size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OverviewHeader;















// import React from "react";
// import { FiRefreshCw } from "react-icons/fi";
// import { MdOutlineInsertChartOutlined } from "react-icons/md";

// const OverviewHeader: React.FC = () => (
//   <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
//     <h2 className="text-lg font-bold flex items-center space-x-2">
//       <MdOutlineInsertChartOutlined size={20} color="#A0AEC0" />
//       <span className="text-[#111827]">Overview</span>
//     </h2>
//     <div className="text-[#718096] text-sm flex items-center space-x-2">
//       <span>Last update:</span>
//       <span className="font-semibold text-black-100">April 25, 2025</span>
//       <button className="outline-none ">
//         <FiRefreshCw size={14} />
//       </button>
//     </div>
//   </div>
// );
// export default OverviewHeader;
