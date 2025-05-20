"use client";

import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { GrLineChart } from "react-icons/gr";
import axiosInstance from "@/lib/axiosInstance";
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
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
// import EmptyStateWithAction from "../EmptyState";
// import Container from "../Container";


const SkeletonLoader = dynamic(
  () => import("@/components/dashboard/loadingStates/SkeletonLoader"),
  {
    ssr: false // Disable server-side rendering
  }
);

// --------------------- INTERFACES ---------------------
interface MonthlySale {
  month: string;
  sales: number;
  netSales?: string;
}

interface DailySale {
  day: string;
  sales: number;
}

interface SalesData {
  month: string; // or "day" if daily
  sales: number;
  netSales?: string;
}

interface CurrencySales {
  totalAmount: number;
  growthRate: number;
  monthlySales: MonthlySale[];
  dailySales: DailySale[];
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    overallSales: {
      naira: CurrencySales;
      dollar: CurrencySales;
    };
    // ... other data (ordersSummary, etc.)
  };
}

// --------------------- CUSTOM TOOLTIP ---------------------
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    const { netSales, sales } = payload[0].payload as SalesData;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">Sales: {sales.toLocaleString()}</p>
        {netSales && (
          <p className="text-xs text-gray-600">Net Sales: {netSales}</p>
        )}
      </div>
    );
  }
  return null;
};

// --------------------- CUSTOM BAR BACKGROUND ---------------------
interface CustomBarProps {
  x: number;
  width: number;
  index: number;
  hoveredIndex: number;
  onBarHover: (index: number) => void;
  onBarLeave: () => void;
  viewBox?: { x: number; y: number; width: number; height: number };
  fillColor: string; // We'll pass the fill color (#751423 or #F7B500) for gradient
}

const CustomBackgroundBar: React.FC<CustomBarProps> = ({
  x,
  width,
  index,
  hoveredIndex,
  onBarHover,
  onBarLeave,
  viewBox,
  fillColor
}) => {
  // Use the chart's viewBox for chart area dimensions.
  const chartY = viewBox?.y ?? 0;
  const chartHeight = viewBox?.height ?? 300;
  // Top padding of 10px.
  const topPadding = 10;
  // When hovered, fill with a gradient; otherwise use a solid gray.
  const fill = hoveredIndex === index ? `url(#gradient-${index})` : "#F9FAFB";
  // Dotted line color: gray by default, white on hover.
  const lineStroke = hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";

  return (
    <g
      onMouseEnter={() => onBarHover(index)}
      onMouseLeave={onBarLeave}
      style={{ cursor: "pointer" }}
    >
      {hoveredIndex === index && (
        <defs>
          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
      )}
      {/* Full-height Bar with top padding and rounded top corners */}
      <rect
        x={x}
        y={chartY + topPadding}
        width={width}
        height={chartHeight - topPadding}
        fill={fill}
        rx={8}
        ry={8}
      />
      {/* Centered Dotted Line adjusted to start at the padded top */}
      <line
        x1={x + width / 2}
        x2={x + width / 2}
        y1={chartY + topPadding}
        y2={chartY + chartHeight}
        stroke={lineStroke}
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    </g>
  );
};

// --------------------- CHART COMPONENT ---------------------
const Chart: React.FC = () => {
  // State for dashboard data from API
  const [dashboardData, setDashboardData] = useState<
    DashboardResponse["data"] | null
  >(null);
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default currency is 'naira'
  const [currency, setCurrency] = useState<"naira" | "dollar">("naira");
  // Default view is "monthly"; can toggle to "daily"
  const [viewType, setViewType] = useState<"monthly" | "daily">("monthly");

  // Track which bar (index) is currently hovered
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUserId = localStorage.getItem("loggedInUserId");
      console.log("Checking to see if the value for loggedInUserId is available", loggedInUserId);
  
      if (!loggedInUserId) {
        router.refresh();
        console.log("User ID not found in localStorage. Redirecting to login page.");
        return;
      }
  
      try {
        const response = await axiosInstance.get(`/dashboard-data/${loggedInUserId}`);
        if (response.data.success) {
          setDashboardData(response.data.data);
          setError("");
          setLoading(false);
  
          // Clear the interval once the API call is successful
          clearInterval(intervalId);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data");
      }
    };
  
    const intervalId: NodeJS.Timeout = setInterval(fetchData, 1000);
  
    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [router]);
  

  // --------------------- FETCH DATA ---------------------

  // useEffect(() => {
  //   const loggedInUserId = localStorage.getItem("loggedInUserId");

  //   if (!loggedInUserId) {
  //     router.replace("/");
  //     console.log(
  //       "User ID not found in localStorage. Redirecting to login page."
  //     );
  //     return;
  //   }
  //   axiosInstance
  //     .get(`/dashboard-data/${loggedInUserId}`)
  //     .then((response) => {
  //       if (response.data.success) {
  //         setDashboardData(response.data.data);
  //       } else {
  //         setError("Failed to fetch dashboard data");
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setError("An error occurred while fetching data");
  //       setLoading(false);
  //     });
  // }, [router]);

  // --------------------- RENDER STATES ---------------------
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !dashboardData) {
    return (
      <div className="p-4 text-red-600">{error || "No data available"}</div>
    );
  }

  // Extract the relevant data for the selected currency
  const currentSalesData = dashboardData.overallSales[currency];
  // const { totalAmount, growthRate } = currentSalesData;

  // Prepare the chart data based on monthly or daily view
  const chartData: SalesData[] =
    viewType === "monthly"
      ? currentSalesData.monthlySales.map((item) => ({
          month: item.month,
          sales: item.sales
        }))
      : currentSalesData.dailySales.map((item) => ({
          month: item.day, // Reuse the "month" key for labeling
          sales: item.sales
        }));

  // const isEmptyData = chartData.every((item) => item.sales === 0);
  // if (isEmptyData) {
  //   return (
  //     <Container>
  //       <EmptyStateWithAction />
  //     </Container>
  //   );
  // }

  // A small multiplier for the top range in the chart so that bars and line don't touch the top
  const maxSales = Math.max(...chartData.map((item) => item.sales)) * 1.1;

  // --------------------- TOGGLE HANDLERS ---------------------
  const toggleView = () => {
    setViewType((prev) => (prev === "monthly" ? "daily" : "monthly"));
  };

  const toggleCurrency = (selectedCurrency: "naira" | "dollar") => {
    setCurrency(selectedCurrency);
    // Reset the hoveredIndex so the bar highlight doesn't remain if switching quickly
    setHoveredIndex(-1);
  };

  // --------------------- RENDER COLORS ---------------------
  // #751423 for naira, #F7B500 for dollar
  const chartColor = currency === "naira" ? "#751423" : "#F7B500";

  // --------------------- CUSTOM LINE DOT ---------------------
  interface DotProps {
    cx: number;
    cy: number;
    index: number;
  }
  const renderCustomDot = (props: DotProps): React.ReactElement<SVGElement> => {
    const { cx, cy, index } = props;
    // Show a dot only if the bar is hovered
    return (
      <circle
        key={`custom-dot-${index}`}
        cx={cx}
        cy={cy}
        r={index === hoveredIndex ? 6 : 0}
        fill={chartColor}
        stroke={index === hoveredIndex ? "#fff" : "none"}
        strokeWidth={index === hoveredIndex ? 2 : 0}
      />
    ) as React.ReactElement<SVGElement>;
  };

  return (
    <div className="bg-white rounded-[18px] w-full h-full p-4 flex flex-col gap-6 ">
      {/* Top Section */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xs md:text-xl font-medium text-[#718096]">
            Overall Sales
          </h1>

          {/* Currency Switcher Row */}
          <div className="flex items-center gap-4 mt-2">
            {/* Naira */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleCurrency("naira")}
            >
              <p
                className={`text-xl font-semibold ${
                  currency === "naira" ? "text-primary" : "text-[#718096]"
                }`}
              >
                ₦
                {/* {(dashboardData.overallSales.naira.totalAmount / 1e6).toFixed(
                  2
                )} */}
                {dashboardData.overallSales.naira.totalAmount.toLocaleString()}
              </p>
              {currency === "naira" && (
                <span className="hidden md:flex items-center text-[10px] md:text-xs font-medium text-white bg-primary px-2 py-2 rounded-full">
                  <GrLineChart className="mr-1" />
                  {/* {Math.abs(dashboardData.overallSales.naira.growthRate)}% */}
                  {Math.abs(
                    dashboardData.overallSales.naira.growthRate
                  ).toFixed(2)}
                  %
                </span>
              )}
            </div>

            {/* Separator */}
            <div className="h-9 w-[1px] bg-[#CBD5E0]" />

            {/* Dollar */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleCurrency("dollar")}
            >
              <p
                className={`text-xl font-semibold ${
                  currency === "dollar" ? "text-[#F7B500]" : "text-gray-400"
                }`}
              >
                {/* $
                {dashboardData.overallSales.dollar.totalAmount >= 1000
                  ? `${(
                      dashboardData.overallSales.dollar.totalAmount / 1000
                    ).toFixed(2)}k`
                  : dashboardData.overallSales.dollar.totalAmount} */}
                $
                {dashboardData.overallSales.dollar.totalAmount.toLocaleString()}
              </p>
              {currency === "dollar" && (
                <span className="hidden md:flex items-center text-[10px] md:text-xs font-medium text-white bg-[#F7B500] px-2 py-2 rounded-full">
                  <GrLineChart className="mr-1" />
                  {Math.abs(
                    dashboardData.overallSales.dollar.growthRate
                  ).toFixed(2)}
                  %
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Monthly / Daily Toggle */}
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={toggleView}
            className="flex items-center gap-2 border border-[#F1F2F4] rounded-[8px] px-4 py-2 text-[#111827] hover:bg-gray-50 outline-none"
          >
            {viewType === "monthly" ? "Monthly" : "Daily"}
            <FaCalendarAlt />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full relative">
        <ResponsiveContainer width="100%" height={352}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            onMouseLeave={() => setHoveredIndex(-1)}
          >
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, maxSales]}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
              }
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="sales"
              fill="transparent"
              shape={(props: any) => (
                <CustomBackgroundBar
                  {...props}
                  index={props.index}
                  hoveredIndex={hoveredIndex}
                  onBarHover={(i) => setHoveredIndex(i)}
                  onBarLeave={() => setHoveredIndex(-1)}
                  fillColor={chartColor}
                />
              )}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={chartColor}
              strokeWidth={2}
              dot={renderCustomDot}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;



















// "use client";

// import React, { useState, useEffect } from "react";
// import { FaCalendarAlt } from "react-icons/fa";
// import { GrLineChart } from "react-icons/gr";
// import axiosInstance from "@/lib/axiosInstance";
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
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation";
// import EmptyStateWithAction from "../EmptyState";
// import Container from "../Container";

// const SkeletonLoader = dynamic(
//   () => import("@/components/dashboard/loadingStates/SkeletonLoader"),
//   {
//     ssr: false // Disable server-side rendering
//   }
// );

// // --------------------- INTERFACES ---------------------
// interface MonthlySale {
//   month: string;
//   sales: number;
//   netSales?: string;
// }

// interface DailySale {
//   day: string;
//   sales: number;
// }

// interface SalesData {
//   month: string; // or "day" if daily
//   sales: number;
//   netSales?: string;
// }

// interface CurrencySales {
//   totalAmount: number;
//   growthRate: number;
//   monthlySales: MonthlySale[];
//   dailySales: DailySale[];
// }

// interface DashboardResponse {
//   success: boolean;
//   message: string;
//   data: {
//     overallSales: {
//       naira: CurrencySales;
//       dollar: CurrencySales;
//     };
//     // ... other data (ordersSummary, etc.)
//   };
// }

// // --------------------- CUSTOM TOOLTIP ---------------------
// const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
//   active,
//   payload,
//   label
// }) => {
//   if (active && payload && payload.length) {
//     const { netSales, sales } = payload[0].payload as SalesData;
//     return (
//       <div className="bg-white p-2 border rounded shadow">
//         <p className="text-sm font-medium">{label}</p>
//         <p className="text-xs text-gray-500">Sales: {sales.toLocaleString()}</p>
//         {netSales && (
//           <p className="text-xs text-gray-600">Net Sales: {netSales}</p>
//         )}
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
//   fillColor: string; // We'll pass the fill color (#751423 or #F7B500) for gradient
// }

// const CustomBackgroundBar: React.FC<CustomBarProps> = ({
//   x,
//   width,
//   index,
//   hoveredIndex,
//   onBarHover,
//   onBarLeave,
//   viewBox,
//   fillColor
// }) => {
//   // Use the chart's viewBox for chart area dimensions.
//   const chartY = viewBox?.y ?? 0;
//   const chartHeight = viewBox?.height ?? 300;
//   // Top padding of 10px.
//   const topPadding = 10;
//   // When hovered, fill with a gradient; otherwise use a solid gray.
//   const fill = hoveredIndex === index ? `url(#gradient-${index})` : "#F9FAFB";
//   // Dotted line color: gray by default, white on hover.
//   const lineStroke = hoveredIndex === index ? "#FFFFFF" : "#F1F2F4";

//   return (
//     <g
//       onMouseEnter={() => onBarHover(index)}
//       onMouseLeave={onBarLeave}
//       style={{ cursor: "pointer" }}
//     >
//       {hoveredIndex === index && (
//         <defs>
//           <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor={fillColor} />
//             <stop offset="100%" stopColor="#FFFFFF" />
//           </linearGradient>
//         </defs>
//       )}
//       {/* Full-height Bar with top padding and rounded top corners */}
//       <rect
//         x={x}
//         y={chartY + topPadding}
//         width={width}
//         height={chartHeight - topPadding}
//         fill={fill}
//         rx={8}
//         ry={8}
//       />
//       {/* Centered Dotted Line adjusted to start at the padded top */}
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
//   // State for dashboard data from API
//   const [dashboardData, setDashboardData] = useState<
//     DashboardResponse["data"] | null
//   >(null);
//   // Loading and error states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Default currency is 'naira'
//   const [currency, setCurrency] = useState<"naira" | "dollar">("naira");
//   // Default view is "monthly"; can toggle to "daily"
//   const [viewType, setViewType] = useState<"monthly" | "daily">("monthly");

//   // Track which bar (index) is currently hovered
//   const [hoveredIndex, setHoveredIndex] = useState(-1);
//   const router = useRouter();


  

//   // --------------------- FETCH DATA ---------------------

//   useEffect(() => {
//     const loggedInUserId = localStorage.getItem("loggedInUserId");

//     if (!loggedInUserId) {
//       router.replace("/");
//       console.log(
//         "User ID not found in localStorage. Redirecting to login page."
//       );
//       return;
//     }
//     axiosInstance
//       .get(`/dashboard-data/${loggedInUserId}`)
//       .then((response) => {
//         if (response.data.success) {
//           setDashboardData(response.data.data);
//         } else {
//           setError("Failed to fetch dashboard data");
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("An error occurred while fetching data");
//         setLoading(false);
//       });
//   }, [router]);

//   // --------------------- RENDER STATES ---------------------
//   if (loading) {
//     return <SkeletonLoader />;
//   }

//   if (error || !dashboardData) {
//     return (
//       <div className="p-4 text-red-600">{error || "No data available"}</div>
//     );
//   }

//   // Extract the relevant data for the selected currency
//   const currentSalesData = dashboardData.overallSales[currency];
//   // const { totalAmount, growthRate } = currentSalesData;

//   // Prepare the chart data based on monthly or daily view
//   const chartData: SalesData[] =
//     viewType === "monthly"
//       ? currentSalesData.monthlySales.map((item) => ({
//           month: item.month,
//           sales: item.sales
//         }))
//       : currentSalesData.dailySales.map((item) => ({
//           month: item.day, // Reuse the "month" key for labeling
//           sales: item.sales
//         }));

//   const isEmptyData = chartData.every((item) => item.sales === 0);
//   if (isEmptyData) {
//     return (
//       <Container>
//         <EmptyStateWithAction />
//       </Container>
//     );
//   }

//   // A small multiplier for the top range in the chart so that bars and line don't touch the top
//   const maxSales = Math.max(...chartData.map((item) => item.sales)) * 1.1;

//   // --------------------- TOGGLE HANDLERS ---------------------
//   const toggleView = () => {
//     setViewType((prev) => (prev === "monthly" ? "daily" : "monthly"));
//   };

//   const toggleCurrency = (selectedCurrency: "naira" | "dollar") => {
//     setCurrency(selectedCurrency);
//     // Reset the hoveredIndex so the bar highlight doesn't remain if switching quickly
//     setHoveredIndex(-1);
//   };

//   // --------------------- RENDER COLORS ---------------------
//   // #751423 for naira, #F7B500 for dollar
//   const chartColor = currency === "naira" ? "#751423" : "#F7B500";

//   // --------------------- CUSTOM LINE DOT ---------------------
//   interface DotProps {
//     cx: number;
//     cy: number;
//     index: number;
//   }
//   const renderCustomDot = (props: DotProps): React.ReactElement<SVGElement> => {
//     const { cx, cy, index } = props;
//     // Show a dot only if the bar is hovered
//     return (
//       <circle
//         key={`custom-dot-${index}`}
//         cx={cx}
//         cy={cy}
//         r={index === hoveredIndex ? 6 : 0}
//         fill={chartColor}
//         stroke={index === hoveredIndex ? "#fff" : "none"}
//         strokeWidth={index === hoveredIndex ? 2 : 0}
//       />
//     ) as React.ReactElement<SVGElement>;
//   };

//   return (
//     <div className="bg-white rounded-[18px] w-full h-full p-4 flex flex-col gap-6 ">
//       {/* Top Section */}
//       <div className="flex gap-4 items-center justify-between">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-xs md:text-xl font-medium text-[#718096]">
//             Overall Sales
//           </h1>

//           {/* Currency Switcher Row */}
//           <div className="flex items-center gap-4 mt-2">
//             {/* Naira */}
//             <div
//               className="flex items-center gap-2 cursor-pointer"
//               onClick={() => toggleCurrency("naira")}
//             >
//               <p
//                 className={`text-xl font-semibold ${
//                   currency === "naira" ? "text-primary" : "text-[#718096]"
//                 }`}
//               >
//                 ₦
//                 {/* {(dashboardData.overallSales.naira.totalAmount / 1e6).toFixed(
//                   2
//                 )} */}
//                 {dashboardData.overallSales.naira.totalAmount.toLocaleString()}
//               </p>
//               {currency === "naira" && (
//                 <span className="hidden md:flex items-center text-[10px] md:text-xs font-medium text-white bg-primary px-2 py-2 rounded-full">
//                   <GrLineChart className="mr-1" />
//                   {/* {Math.abs(dashboardData.overallSales.naira.growthRate)}% */}
//                   {Math.abs(
//                     dashboardData.overallSales.naira.growthRate
//                   ).toFixed(2)}
//                   %
//                 </span>
//               )}
//             </div>

//             {/* Separator */}
//             <div className="h-9 w-[1px] bg-[#CBD5E0]" />

//             {/* Dollar */}
//             <div
//               className="flex items-center gap-2 cursor-pointer"
//               onClick={() => toggleCurrency("dollar")}
//             >
//               <p
//                 className={`text-xl font-semibold ${
//                   currency === "dollar" ? "text-[#F7B500]" : "text-gray-400"
//                 }`}
//               >
//                 {/* $
//                 {dashboardData.overallSales.dollar.totalAmount >= 1000
//                   ? `${(
//                       dashboardData.overallSales.dollar.totalAmount / 1000
//                     ).toFixed(2)}k`
//                   : dashboardData.overallSales.dollar.totalAmount} */}
//                 $
//                 {dashboardData.overallSales.dollar.totalAmount.toLocaleString()}
//               </p>
//               {currency === "dollar" && (
//                 <span className="hidden md:flex items-center text-[10px] md:text-xs font-medium text-white bg-[#F7B500] px-2 py-2 rounded-full">
//                   <GrLineChart className="mr-1" />
//                   {Math.abs(
//                     dashboardData.overallSales.dollar.growthRate
//                   ).toFixed(2)}
//                   %
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Monthly / Daily Toggle */}
//         <div className="mt-4 sm:mt-0">
//           <button
//             type="button"
//             onClick={toggleView}
//             className="flex items-center gap-2 border border-[#F1F2F4] rounded-[8px] px-4 py-2 text-[#111827] hover:bg-gray-50 outline-none"
//           >
//             {viewType === "monthly" ? "Monthly" : "Daily"}
//             <FaCalendarAlt />
//           </button>
//         </div>
//       </div>

//       {/* Chart Container */}
//       <div className="w-full relative">
//         <ResponsiveContainer width="100%" height={352}>
//           <ComposedChart
//             data={chartData}
//             margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
//             onMouseLeave={() => setHoveredIndex(-1)}
//           >
//             <XAxis dataKey="month" axisLine={false} tickLine={false} />
//             <YAxis
//               domain={[0, maxSales]}
//               tickFormatter={(value) =>
//                 value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
//               }
//               axisLine={false}
//               tickLine={false}
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
//                   fillColor={chartColor}
//                 />
//               )}
//             />
//             <Line
//               type="monotone"
//               dataKey="sales"
//               stroke={chartColor}
//               strokeWidth={2}
//               dot={renderCustomDot}
//               activeDot={{ r: 6 }}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Chart;



