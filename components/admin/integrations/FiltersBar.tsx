import React from "react";
import { FiChevronDown } from "react-icons/fi";

export type ShowTab = "All" | "Connected" | "NotConnected";
export type WorkWithTab = "All" | "Shipping" | "Marketing" | "Analytics";

interface Props {
  show: ShowTab;
  onShowChange: (val: ShowTab) => void;
  workWith: WorkWithTab;
  onWorkWithChange: (val: WorkWithTab) => void;
}
const FiltersBar: React.FC<Props> = ({
  show,
  onShowChange,
  workWith,
  onWorkWithChange
}) => (
  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
    <div className="flex items-center bg-white rounded-xl px-4 py-2 relative">
      <select
        value={show}
        onChange={(e) => onShowChange(e.target.value as ShowTab)}
        className="appearance-none bg-transparent pr-6 focus:ring-0 text-gray-700 font-medium border-none outline-none"
      >
        <option value="All">All Integrations</option>
        <option value="Connected">Connected</option>
        <option value="NotConnected">Not Connected</option>
      </select>
      <div className="absolute right-4">
      <FiChevronDown className="ml-2 text-gray-500" />
      </div>
    </div>
    <div className="flex items-center bg-white rounded-xl px-4 py-2 relative">
      <select
        value={workWith}
        onChange={(e) => onWorkWithChange(e.target.value as WorkWithTab)}
        className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium appearance-none pr-6 outline-none"
      >
        <option value="All">Work with</option>
        <option value="Shipping">Shipping</option>
        <option value="Marketing">Marketing</option>
        <option value="Analytics">Analytics</option>
      </select>
      <div className="absolute right-4">
      <FiChevronDown className="ml-2 text-gray-500" />
      </div>
    </div>
  </div>
);
export default FiltersBar;



// import React from 'react'
// import { FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi'

// interface Props {
//   show: string
//   onShowChange: (val:string)=>void
//   workWith: string
//   onWorkWithChange: (val:string)=>void
// }
// const FiltersBar: React.FC<Props> = ({ show, onShowChange, workWith, onWorkWithChange }) => (
//   <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
//     <div className="flex items-center bg-white rounded-2xl shadow px-4 py-2">
//       <select
//         value={show}
//         onChange={e=>onShowChange(e.target.value)}
//         className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
//       >
//         <option value="All">All Integrations</option>
//         <option value="Connected">Connected</option>
//         <option value="NotConnected">Not Connected</option>
//       </select>
//       <FiChevronDown className="ml-2 text-gray-500" />
//     </div>
//     <div className="flex items-center bg-white rounded-2xl shadow px-4 py-2">
//       <select
//         value={workWith}
//         onChange={e=>onWorkWithChange(e.target.value)}
//         className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
//       >
//         <option value="All">Work with</option>
//         <option value="Shipping">Shipping</option>
//         <option value="Marketing">Marketing</option>
//         <option value="Analytics">Analytics</option>
//       </select>
//       <FiChevronDown className="ml-2 text-gray-500" />
//     </div>
//   </div>
// )
// export default FiltersBar
