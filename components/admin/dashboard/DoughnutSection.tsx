import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { PiShoppingCartBold } from "react-icons/pi";

const data = {
  labels: [],
  datasets: [
    {
      data: [65.8, 20.5, 35.9],
      backgroundColor: ["#7E1526", "#FFD529", "#E5E7EB"],
      cutout: "70%"
    }
  ]
};


const DoughnutSection: React.FC = () => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col font-[poppins]">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-[#111827]">Order Stats</h3>
      <select className="text-sm text-gray-500">
      <option>Month</option>
      </select>
    </div>
    <div className="relative h-36 flex items-center justify-center">
      <Doughnut data={data} />
      <div className="p-3 rounded-full bg-[#F0F6FF] absolute">
        <PiShoppingCartBold size={19} className=" text-[#751423]" />
      </div>
    </div>

    <ul className="mt-4 space-y-2">
      <li className="flex items-center justify-between">
        <span className="flex text-[#718096] text-xs font-medium items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-[#7E1526] mr-2"></span>
          Completed
        </span>
        <span className="text-[#111827] font-bold text-xs">65.8%</span>
      </li>
      <li className="flex items-center justify-between">
        <span className="flex items-center text-[#718096] text-xs font-medium">
          <span className="inline-block w-3 h-3 rounded-full bg-[#FFD529] mr-2"></span>
          Shipped
        </span>
        <span className="text-[#111827] font-bold text-xs">20.5%</span>
      </li>
      <li className="flex items-center justify-between">
        <span className="flex items-center text-[#718096] text-xs font-medium">
          <span className="inline-block w-3 h-3 rounded-full bg-[#E5E7EB] mr-2"></span>
          Pending
        </span>
        <span className="text-[#111827] font-bold text-xs">35.9%</span>
      </li>
    </ul>
  </div>
  // </div>
);
export default DoughnutSection;

// import React from 'react'
// import { Doughnut } from 'react-chartjs-2'
// import 'chart.js/auto'
// import { FiShoppingCart } from 'react-icons/fi'

// const data = {
//   labels: [],
//   datasets: [{ data: [65.8, 20.5, 35.9], backgroundColor: ['#7E1526', '#FFD529', '#E5E7EB'], cutout: '70%' }],
// }

// const DoughnutSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow p-6">
//     <div className="flex justify-between items-center">
//       <h3 className="text-lg font-medium text-gray-900">Order Stats</h3>
//       <select className="text-sm text-gray-500"><option>Month</option></select>
//     </div>
//     <div className="relative h-36 flex items-center justify-center">
//       <Doughnut data={data} />
//       <FiShoppingCart size={32} className="absolute text-red-800" />
//     </div>
//   </div>
// )
// export default DoughnutSection
