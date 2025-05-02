import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlineInsertChartOutlined } from "react-icons/md";

const OverviewHeader: React.FC = () => (
  <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
    <h2 className="text-lg font-bold flex items-center space-x-2">
      <MdOutlineInsertChartOutlined size={20} color="#A0AEC0" />
      <span className="text-[#111827]">Overview</span>
    </h2>
    <div className="text-[#718096] text-sm flex items-center space-x-2">
      <span>Last update:</span>
      <span className="font-semibold text-black-100">April 25, 2025</span>
      <button className="outline-none ">
        <FiRefreshCw size={14} />
      </button>
    </div>
  </div>
);
export default OverviewHeader;
