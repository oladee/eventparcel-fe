// ===== FiltersBar.tsx =====
"use client"
import React from "react"
import {FiSearch } from "react-icons/fi"
// import { VscSettings } from "react-icons/vsc"

interface Props {
  searchTerm: string
  onSearchChange: (term: string) => void
}

const FiltersBar: React.FC<Props> = ({ searchTerm, onSearchChange }) => (
  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full max-w-2xl ">
      <div className="flex items-center bg-white rounded-[12px] px-4 py-2">
        <span className="text-[#A0AEC0]">Show:</span>
        {/* <select className="ml-2 text-black font-bold border-none focus:ring-0 outline-none appearance-none">
          <option>All Events</option>
        </select> */}
        <p className="ml-2 text-black font-bold">All Events</p>
      </div>

      <div className="flex-1 flex items-center bg-white rounded-[12px] px-4 py-2">
        <FiSearch className="text-[#000]" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by event name or location..."
          className="ml-2 w-full border-none focus:ring-0 outline-none"
        />
      </div>

      {/* <button className="flex items-center bg-white rounded-[12px] px-4 py-2 text-[#718096]">
        <VscSettings className="mr-2 text-[#A0AEC0]" size={20} />
        Filters
      </button> */}
    </div>

    {/* <button className="flex items-center bg-white rounded-[12px]  px-4 py-2 text-[#718096] outline-none">
      <FiDownload className="mr-2 text-[#A0AEC0]" />
      Export
      <FiChevronDown className="ml-1 text-[#718096]" />
    </button> */}
  </div>
)

export default FiltersBar












// import React from "react";
// import { FiChevronDown, FiSearch, FiDownload } from "react-icons/fi";
// import { VscSettings } from "react-icons/vsc";

// const FiltersBar: React.FC = () => (
//   <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
//     <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full max-w-2xl ">
//       <div className="flex items-center bg-white rounded-[12px] px-4 py-2">
//         <span className="text-[#A0AEC0]">Show:</span>
//         <select className="ml-2 text-black font-bold border-none focus:ring-0 outline-none">
//           <option>All Events</option>
//         </select>
//         {/* <FiChevronDown className="ml-1 text-gray-500" /> */}
//       </div>

//       <div className="flex-1 flex items-center bg-white rounded-[12px] px-4 py-2">
//         <FiSearch className="text-[#000]" />
//         <input
//           type="text"
//           placeholder="Search by name, email, or others..."
//           className="ml-2 w-full border-none focus:ring-0 outline-none"
//         />
//       </div>

//       <button className="flex items-center bg-white rounded-[12px] px-4 py-2 text-[#718096]">
//         <VscSettings className="mr-2 text-[#A0AEC0]" size={20} />
//         Filters
//       </button>
//     </div>

//     <button className="flex items-center bg-white rounded-[12px]  px-4 py-2 text-[#718096] outline-none">
//       <FiDownload className="mr-2 text-[#A0AEC0]" />
//       Export
//       <FiChevronDown className="ml-1 text-[#718096]" />
//     </button>
//   </div>
// );

// export default FiltersBar;
