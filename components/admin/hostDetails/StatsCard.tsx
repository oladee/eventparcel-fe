"use client";

import React from "react";
import { FiInfo } from "react-icons/fi";

interface Props {
  title: string;
  value: string;
  delta: string;
  highlight?: boolean;
}

const StatsCard: React.FC<Props> = ({ title, value, delta, highlight }) => (
  <div
    className={`${
      highlight ? "bg-[#7E1526] text-white" : "bg-white border border-[#EEEFF2]"
    } rounded-[12px] p-4 flex flex-col space-y-2`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-xs ${highlight ? "text-white" : "text-[#718096]"}`}>
        {title}
      </span>
      <FiInfo className={highlight ? "text-gray-200" : "text-gray-400"} />
    </div>
    <h3 className={`${highlight ? "text-lg font-bold" : "text-2xl font-semibold"}`}>
      {value}
    </h3>
    <p className={`text-xs ${highlight ? "text-gray-300" : "text-green-500 font-medium"}`}>
      {delta}
    </p>
  </div>
);

export default StatsCard;


















// import React from 'react'
// import { FiInfo } from 'react-icons/fi'

// interface Props {
//   title: string
//   value: string
//   delta: string
//   highlight?: boolean
// }
// const StatsCard: React.FC<Props> = ({ title, value, delta, highlight }) => (
//   <div className={`${highlight ? 'bg-[#7E1526] text-white' : 'bg-white border border-[#EEEFF2]'} rounded-[12px] p-4 flex flex-col space-y-2`}>
//     <div className="flex items-center justify-between">
//       <span className={`text-xs ${highlight ? 'text-white' : 'text-[#718096]'}`}>{title}</span>
//       <FiInfo className={`${highlight ? 'text-gray-200' : 'text-gray-400'}`} />
//     </div>
//     <h3 className={`${highlight ? 'text-lg font-bold' : 'text-2xl font-semibold'} text-current`}>{value}</h3>
//     <p className={`text-xs ${highlight ? 'text-gray-300' : 'text-green-500 font-medium'}`}>{delta}</p>
//   </div>
// )
// export default StatsCard