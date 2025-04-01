"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/dashboard/Container";
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
  TooltipProps,
} from "recharts";

// Define interfaces for the expected data shapes
interface MonthlySale {
  month: string;
  sales: number;
  netSales?: string;
}

interface DailySale {
  day: string;
  sales: number;
}

interface OverallSales {
  totalAmount: number;
  growthRate: number;
  monthlySales: MonthlySale[];
  dailySales: DailySale[];
}

interface DashboardData {
  overallSales: OverallSales;
  // Other parts of the dashboard can be defined here as needed
}

interface SalesData {
  month: string;
  sales: number;
  netSales?: string;
}

// interface CustomTooltipProps extends TooltipProps<number, string> {}

// const CustomTooltip: React.FC<CustomTooltipProps> = ({
//   active,
//   payload,
//   label,
// }) => {
//   if (active && payload && payload.length) {
//     const { netSales, sales } = payload[0].payload as SalesData;
//     return (
//       <div className="bg-white p-2 border rounded shadow">
//         <p className="text-sm font-medium">{label}</p>
//         <p className="text-xs text-gray-500">
//           Sales: ₦{sales.toLocaleString()}
//         </p>
//         {netSales && (
//           <p className="text-xs text-gray-600">Net Sales: {netSales}</p>
//         )}
//       </div>
//     );
//   }
//   return null;
// };


const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const { netSales, sales } = payload[0].payload as SalesData;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">
          Sales: ₦{sales.toLocaleString()}
        </p>
        {netSales && (
          <p className="text-xs text-gray-600">Net Sales: {netSales}</p>
        )}
      </div>
    );
  }
  return null;
};

// Custom background bar shape props
interface CustomBarProps {
  x: number;
  width: number;
  index: number;
  hoveredIndex: number;
  onBarHover: (index: number) => void;
  onBarLeave: () => void;
  viewBox?: { x: number; y: number; width: number; height: number };
}

const CustomBackgroundBar: React.FC<CustomBarProps> = ({
  x,
  width,
  index,
  hoveredIndex,
  onBarHover,
  onBarLeave,
  viewBox,
}) => {
  // Use the chart's viewBox for chart area dimensions.
  const chartY = viewBox?.y ?? 0;
  const chartHeight = viewBox?.height ?? 300;
  // Top padding of 10px.
  const topPadding = 10;
  // When hovered, fill with a gradient; otherwise use a solid gray.
  const fill =
    hoveredIndex === index ? `url(#gradient-${index})` : "#F9FAFB";
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
            <stop offset="0%" stopColor="#751423" />
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

// Define type for the custom dot props for the Line component
interface DotProps {
  cx: number;
  cy: number;
  index: number;
}

const Page: React.FC = () => {
  // State for dashboard data from API
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  // Loading and error states (optional)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default view is "monthly"; can toggle to "daily"
  const [viewType, setViewType] = useState("monthly");
  // Track which bar (index) is currently hovered
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    axiosInstance
      .get("/dashboard")
      .then((response) => {
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred while fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="p-4">Loading...</div>
      </Container>
    );
  }

  if (error || !dashboardData) {
    return (
      <Container>
        <div className="p-4 text-red-600">{error || "No data available"}</div>
      </Container>
    );
  }

  const { overallSales } = dashboardData;

  const chartData: SalesData[] =
    viewType === "monthly"
      ? overallSales.monthlySales
      : overallSales.dailySales.map((item) => ({
          month: item.day,
          sales: item.sales,
        }));

  const maxSales = Math.max(...chartData.map((item) => item.sales)) * 1.1;

  const toggleView = () => {
    setViewType((prev) => (prev === "monthly" ? "daily" : "monthly"));
  };

  // Custom dot for the line chart: always return a <circle> element with a unique key.
  const renderCustomDot = (props: DotProps): React.ReactElement<SVGElement> => {
    const { cx, cy, index } = props;
    return (
      <circle
        key={`custom-dot-${index}`}
        cx={cx}
        cy={cy}
        r={index === hoveredIndex ? 6 : 0}
        fill="#9F1239"
        stroke={index === hoveredIndex ? "#fff" : "none"}
        strokeWidth={index === hoveredIndex ? 2 : 0}
      />
    ) as React.ReactElement<SVGElement>;
  };

  return (
    <Container>
      <div className="bg-white rounded-[18px] w-full h-full p-4 flex flex-col gap-6">
        {/* Top Section */}
        <div className="flex items-start sm:items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-xs md:text-xl font-medium text-[#718096]">
              Overall Sales
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-2xl md:text-3xl font-bold text-[#111827]">
                ₦{(overallSales.totalAmount / 1e6).toFixed(2)}M
              </p>
              <span className="flex items-center text-[10px] md:text-xs font-medium text-white bg-primary px-2 py-2 rounded-full">
                <GrLineChart className="mr-1" />
                {Math.abs(overallSales.growthRate)}%
              </span>
            </div>
          </div>
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
                  />
                )}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#9F1239"
                strokeWidth={2}
                dot={renderCustomDot}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Container>
  );
};

export default Page;
