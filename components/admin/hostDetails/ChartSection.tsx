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
  TooltipProps,
} from "recharts";

import { SalesOverview } from "@/types/host";

interface Props {
  naira: SalesOverview;
  dollar: SalesOverview;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
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

      <div className="w-full relative" style={{ height: 300 }}>
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
              shape={((props: any) => {
                const { x, y, width, height, index } = props;
                const fillColor = hoveredIndex === index ? "#751423" : "#F9FAFB";
                const lineColor = hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";

                return (
                  <g
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Gradient only when hovered */}
                    {hoveredIndex === index && (
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
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
                      fill={hoveredIndex === index ? "url(#gradient)" : fillColor}
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
              }) as any}
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

// const ChartSection: React.FC<Props> = ({ naira, dollar }) => {
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
//               shape={(props: any) => {
//                 const { x, width, index, viewBox } = props;
//                 const fillColor = hoveredIndex === index ? "#751423" : "#F9FAFB";
//                 const lineColor = hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";
//                 return (
//                   <g
//                     onMouseEnter={() => setHoveredIndex(index)}
//                     onMouseLeave={() => setHoveredIndex(-1)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <rect
//                       x={x}
//                       y={viewBox.y + 10}
//                       width={width}
//                       height={viewBox.height - 10}
//                       fill={fillColor}
//                       rx={8}
//                       ry={8}
//                     />
//                     <line
//                       x1={x + width / 2}
//                       x2={x + width / 2}
//                       y1={viewBox.y + 10}
//                       y2={viewBox.y + viewBox.height}
//                       stroke={lineColor}
//                       strokeWidth={2}
//                       strokeDasharray="4 4"
//                     />
//                   </g>
//                 );
//               }}
//             />
//             <Line type="linear" dataKey="sales" stroke="#751423" strokeWidth={2} dot={false} />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default ChartSection;


























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
//   TooltipProps
// } from "recharts";

// // --------------------- DUMMY DATA ---------------------
// const dummyData = [
//   { month: "Nov", sales: 32000 },
//   { month: "Dec", sales: 45000 },
//   { month: "Jan", sales: 28000 },
//   { month: "Feb", sales: 38000 },
//   { month: "Mar", sales: 41000 },
//   { month: "Apr", sales: 35000 }
// ];

// // --------------------- CUSTOM TOOLTIP ---------------------
// const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
//   active,
//   payload,
//   label
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

// // --------------------- CUSTOM BAR BACKGROUND ---------------------
// interface CustomBarProps {
//   x: number;
//   width: number;
//   index: number;
//   hoveredIndex: number;
//   onBarHover: (index: number) => void;
//   onBarLeave: () => void;
//   viewBox?: { x: number; y: number; width: number; height: number };
// }

// const CustomBackgroundBar: React.FC<CustomBarProps> = ({
//   x,
//   width,
//   index,
//   hoveredIndex,
//   onBarHover,
//   onBarLeave,
//   viewBox
// }) => {
//   const chartY = viewBox?.y ?? 0;
//   const chartHeight = viewBox?.height ?? 270;
//   const topPadding = 10;
//   const fill = hoveredIndex === index ? `url(#gradient)` : "#F9FAFB";
//   const lineStroke = hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";

//   return (
//     <g
//       onMouseEnter={() => onBarHover(index)}
//       onMouseLeave={onBarLeave}
//       style={{ cursor: "pointer" }}
//     >
//       {hoveredIndex === index && (
//         <defs>
//           <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#751423" />
//             <stop offset="100%" stopColor="#FFFFFF" />
//           </linearGradient>
//         </defs>
//       )}
//       <rect
//         x={x}
//         y={chartY + topPadding}
//         width={width}
//         height={chartHeight - topPadding}
//         fill={fill}
//         rx={8}
//         ry={8}
//       />
//       <line
//         x1={x + width / 2}
//         x2={x + width / 2}
//         y1={chartY + topPadding}
//         y2={chartY + chartHeight}
//         stroke={lineStroke}
//         strokeWidth={2}
//         strokeDasharray="4 4"
//       />
//     </g>
//   );
// };

// // --------------------- CHART COMPONENT ---------------------
// const Chart: React.FC = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(-1);
//   const maxSales = 50000; // 50k max value

//   return (
//     <div className="rounded-[12px] border border-[#EEEFF2] w-full h-full p-4 flex flex-col gap-6">
//       {/* <div className="bg-white rounded-[18px] w-full h-full p-4 flex flex-col gap-6 bg-yellow-600"> */}
//       {/* Top Section */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-[#111827] text-lg font-bold">Statistics</h1>
//         <button
//           type="button"
//           className="flex items-center gap-2 border border-[#F1F2F4] rounded-[8px] px-4 py-2 text-[#111827] text-xs bg-[#FAFAFA#718096] hover:bg-gray-50 outline-none"
//         >
//           All time
//           <FiChevronDown className="ml-1 text-gray-500" />
//         </button>
//       </div>

//       {/* Chart Container */}
//       <div className="w-full relative">
//         <ResponsiveContainer width="100%" height={322}>
//           {/* <ResponsiveContainer width="100%" height={352}> */}
//           <ComposedChart
//             data={dummyData}
//             margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
//             onMouseLeave={() => setHoveredIndex(-1)}
//           >
//             <XAxis
//               dataKey="month"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#718096" }}
//             />
//             <YAxis
//               domain={[0, maxSales]}
//               tickFormatter={(value) => `${value / 1000}k`}
//               axisLine={false}
//               tickLine={false}
//               ticks={[10000, 20000, 30000, 40000, 50000]}
//               tick={{ fill: "#718096" }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar
//               dataKey="sales"
//               fill="transparent"
//               shape={(props: any) => (
//                 <CustomBackgroundBar
//                   {...props}
//                   index={props.index}
//                   hoveredIndex={hoveredIndex}
//                   onBarHover={(i) => setHoveredIndex(i)}
//                   onBarLeave={() => setHoveredIndex(-1)}
//                 />
//               )}
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

// export default Chart;


































// "use client";

// import React from "react";
// import {
//   ComposedChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
// } from "recharts";

// const dummyData = [
//   { month: "Nov", sales: 32000 },
//   { month: "Dec", sales: 45000 },
//   { month: "Jan", sales: 28000 },
//   { month: "Feb", sales: 38000 },
//   { month: "Mar", sales: 41000 },
//   { month: "Apr", sales: 35000 },
// ];

// const CustomBackgroundBar = (props: any) => {
//   const { x, y, width, height } = props;
//   return (
//     <g>
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         fill="#F9FAFB"
//         rx={8}
//         ry={8}
//       />
//       <line
//         x1={x + width / 2}
//         x2={x + width / 2}
//         y1={y}
//         y2={y + height}
//         stroke="#F1F2F4"
//         strokeWidth={2}
//         strokeDasharray="4 4"
//       />
//     </g>
//   );
// };

// const Chart = () => {
//   return (
//     <div className="bg-white rounded-[18px] w-full h-full p-4 flex flex-col gap-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-[#111827] text-lg font-bold">Statistics</h1>
//         <select className="border border-[#F1F2F4] rounded-md px-3 py-1 text-sm">
//           <option>All time</option>
//         </select>
//       </div>

//       {/* Total Sales */}
//       <div className="ml-4">
//         <p className="text-2xl font-bold text-[#111827]">N11.49M</p>
//         <p className="text-[#718096] text-sm">Total sales</p>
//       </div>

//       {/* Chart Container */}
//       <div className="w-full relative">
//         <ResponsiveContainer width="100%" height={300}>
//           <ComposedChart
//             data={dummyData}
//             margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//           >
//             <XAxis
//               dataKey="month"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#718096" }}
//               interval={0}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#718096" }}
//               ticks={[10000, 20000, 30000, 40000, 50000]}
//               tickFormatter={(value) => `${value / 1000}k`}
//             />
//             <Bar
//               dataKey="sales"
//               fill="transparent"
//               barSize={40}
//               shape={<CustomBackgroundBar />}
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

// export default Chart;
