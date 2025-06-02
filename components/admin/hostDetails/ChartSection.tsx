"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";

import { SalesOverview } from "@/types/host";

interface Props {
  naira: SalesOverview;
  dollar: SalesOverview;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">
          Sales: {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const ChartSection: React.FC<Props> = ({ naira }) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const data = naira.monthlySales;
  const max = Math.max(...data.map((d) => d.sales)) * 1.1;

  // Set a minimum width per month (e.g., 80px)
  const chartWidth = Math.max(data.length * 80, 600);

  return (
    <div className="rounded-[12px] border border-[#EEEFF2] w-full h-full p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[#111827] text-lg font-bold">Monthly Sales</h1>
        <button
          type="button"
          className="flex items-center gap-2 border border-[#F1F2F4] rounded-[8px] px-4 py-2 text-[#111827] text-xs bg-[#FAFAFA] hover:bg-gray-50 outline-none"
        >
          ₦ / $
          <FiChevronDown className="ml-1 text-gray-500" />
        </button>
      </div>

      <div className="w-full relative overflow-x-auto no-scrollbar" style={{ height: 300 }}>
        <div style={{ width: chartWidth, minWidth: 600, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, max]}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sales"
                fill="transparent"
                shape={
                  ((props: any) => {
                    const { x, y, width, height, index } = props;
                    const fillColor =
                      hoveredIndex === index ? "#751423" : "#F9FAFB";
                    const lineColor =
                      hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";

                    return (
                      <g
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Gradient only when hovered */}
                        {hoveredIndex === index && (
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#751423" />
                              <stop offset="100%" stopColor="#FFFFFF" />
                            </linearGradient>
                          </defs>
                        )}
                        <rect
                          x={x}
                          y={y + 10}
                          width={width}
                          height={height - 10}
                          fill={
                            hoveredIndex === index
                              ? "url(#gradient)"
                              : fillColor
                          }
                          rx={8}
                          ry={8}
                        />
                        <line
                          x1={x + width / 2}
                          x2={x + width / 2}
                          y1={y + 10}
                          y2={y + height}
                          stroke={lineColor}
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />
                      </g>
                    );
                  }) as any
                }
              />
              <Line
                type="linear"
                dataKey="sales"
                stroke="#751423"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

// "use client";

// import React, { useState } from "react";
// import { FiChevronDown } from "react-icons/fi";
// import {
//   ComposedChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   TooltipProps,
// } from "recharts";

// import { SalesOverview } from "@/types/host";

// interface Props {
//   naira: SalesOverview;
//   dollar: SalesOverview;
// }

// const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
//   active,
//   payload,
//   label,
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-2 border rounded">
//         <p className="text-sm font-medium">{label}</p>
//         <p className="text-xs text-gray-500">
//           Sales: {payload[0].value?.toLocaleString()}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const ChartSection: React.FC<Props> = ({ naira }) => {
//   const [hoveredIndex, setHoveredIndex] = useState(-1);
//   const data = naira.monthlySales;
//   const max = Math.max(...data.map((d) => d.sales)) * 1.1;

//   return (
//     <div className="rounded-[12px] border border-[#EEEFF2] w-full h-full p-4 flex flex-col gap-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-[#111827] text-lg font-bold">Monthly Sales</h1>
//         <button
//           type="button"
//           className="flex items-center gap-2 border border-[#F1F2F4] rounded-[8px] px-4 py-2 text-[#111827] text-xs bg-[#FAFAFA] hover:bg-gray-50 outline-none"
//         >
//           ₦ / $
//           <FiChevronDown className="ml-1 text-gray-500" />
//         </button>
//       </div>

//       <div className="w-full relative" style={{ height: 300 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart
//             data={data}
//             margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
//             onMouseLeave={() => setHoveredIndex(-1)}
//           >
//             <XAxis dataKey="month" axisLine={false} tickLine={false} />
//             <YAxis
//               domain={[0, max]}
//               tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar
//               dataKey="sales"
//               fill="transparent"
//               shape={((props: any) => {
//                 const { x, y, width, height, index } = props;
//                 const fillColor = hoveredIndex === index ? "#751423" : "#F9FAFB";
//                 const lineColor = hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";

//                 return (
//                   <g
//                     onMouseEnter={() => setHoveredIndex(index)}
//                     onMouseLeave={() => setHoveredIndex(-1)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {/* Gradient only when hovered */}
//                     {hoveredIndex === index && (
//                       <defs>
//                         <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="0%" stopColor="#751423" />
//                           <stop offset="100%" stopColor="#FFFFFF" />
//                         </linearGradient>
//                       </defs>
//                     )}
//                     <rect
//                       x={x}
//                       y={y + 10}
//                       width={width}
//                       height={height - 10}
//                       fill={hoveredIndex === index ? "url(#gradient)" : fillColor}
//                       rx={8}
//                       ry={8}
//                     />
//                     <line
//                       x1={x + width / 2}
//                       x2={x + width / 2}
//                       y1={y + 10}
//                       y2={y + height}
//                       stroke={lineColor}
//                       strokeWidth={2}
//                       strokeDasharray="4 4"
//                     />
//                   </g>
//                 );
//               }) as any}
//             />
//             <Line
//               type="linear"
//               dataKey="sales"
//               stroke="#751423"
//               strokeWidth={2}
//               dot={false}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default ChartSection;
