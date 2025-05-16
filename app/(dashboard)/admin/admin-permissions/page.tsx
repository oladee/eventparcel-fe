import AdminContainer from "@/components/admin/AdminContainer";
import React from "react";

const page = () => {
  return (
    <AdminContainer>
      <div className="w-full h-full flex justify-center items-center">
        This page is coming soon
      </div>
    </AdminContainer>
  );
};

export default page;






// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { BsThreeDots } from "react-icons/bs";
// import { FiSearch } from "react-icons/fi";
// import { PiArrowsDownUpFill } from "react-icons/pi";

// type StatusTab = "All Users" | "Active" | "Disabled";

// const initialRoles = ["Super Admin", "Admin"];
// const tableHeaders = ["Users", "Transactions", "Logistics", "Events", "Admin"];
// // const statuses = ["Active", "Disabled"];
// const statusTabs: StatusTab[] = ["All Users", "Active", "Disabled"];

// export default function PermissionsTable() {
//   const [roles, setRoles] = useState(initialRoles);
//   const [checkedState, setCheckedState] = useState(() => {
//     return [
//       // Super Admin: all true
//       Array(tableHeaders.length).fill(true),
//       // Admin: all true except the last column ("Admin")
//       tableHeaders.map((_, index) => index === tableHeaders.length - 1 ? false : true),
//     ];
//   });
  
//   const [statusState, setStatusState] = useState(
//     Array(initialRoles.length).fill("Active")
//   );
  
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newChecked, setNewChecked] = useState(Array(tableHeaders.length).fill(false));

//   const toggleCheckbox = (row: number, col: number) => {
//     const newCheckedState = [...checkedState];
//     newCheckedState[row][col] = !newCheckedState[row][col];
  
//     // Update checkedState first
//     setCheckedState(newCheckedState);
  
//     // Check if any in row is true
//     const isAnyChecked = newCheckedState[row].some(Boolean);
//     const newStatusState = [...statusState];
//     newStatusState[row] = isAnyChecked ? "Active" : "Disabled";
//     setStatusState(newStatusState);
//   };
  

//   const toggleNewCheckbox = (index: number) => {
//     const newState = [...newChecked];
//     newState[index] = !newState[index];
//     setNewChecked(newState);
//   };

//   const handleCreateRole = () => {
//     setShowNewRow(true);
//   };

//   const handleSaveRole = () => {
//     setRoles((prev) => [...prev, "Role name"]);
//     setCheckedState((prev) => [...prev, newChecked]);
//     setNewChecked(Array(tableHeaders.length).fill(false));
//     setShowNewRow(false);
//   };

//   return (
//     <>
//       {/* Header */}
//       <div className="flex flex-row justify-between mt-12">
//         <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full max-w-2xl">
//           <div className="flex items-center bg-white rounded-[12px] px-4 py-2">
//             <span className="text-[#A0AEC0]">Show:</span>
//             <select disabled className="ml-2 text-black font-bold border-none focus:ring-0 outline-none">
//               {statusTabs.map((tab) => (
//                 <option key={tab} value={tab}>
//                   {tab}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex-1 flex items-center bg-white rounded-[12px] px-4 py-2">
//             <FiSearch className="text-[#000]" />
//             <input
//               type="text"
//               placeholder="Search by name, email, or others..."
//               className="ml-2 w-full border-none focus:ring-0 outline-none"
//             />
//           </div>
//         </div>
//         <button
//           disabled //disabled will be removed later when other admin roles has been added
//           onClick={handleCreateRole}
//           className="w-[153px] h-[40px] border border-[#751423] bg-[#FFFFFF] text-[#751423] rounded-[12px] font-medium text-base"
//         >
//           Create Role
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto mt-4 bg-[#FFFFFF] rounded-[12px]">
//         <table className="min-w-full rounded-md">
//           <thead>
//             <tr>
//               <th className="text-left p-3 border-b flex items-center gap-1 text-[#718096] font-medium text-base">
//                 Role <PiArrowsDownUpFill className="text-gray-500 text-sm" />
//               </th>
//               {tableHeaders.map((theader, index) => (
//                 <th key={index} className="text-center p-3 border-b whitespace-nowrap">
//                   <div className="flex items-center text-[#718096] justify-center font-medium text-medium gap-1">
//                     {theader}
//                     <PiArrowsDownUpFill className="text-[#718096] text-sm" />
//                   </div>
//                 </th>
//               ))}
//               <th className="text-center p-3 border-b whitespace-nowrap">
//                 <div className="flex items-center justify-center gap-1 font-medium text-base text-[#718096]">
//                   Status
//                   <PiArrowsDownUpFill className="text-[#718096] text-sm" />
//                 </div>
//               </th>
//               <th className="text-center p-3 border-b whitespace-nowrap">
//                 <div className="flex items-center justify-center gap-1">
//                   <BsThreeDots className="w-5 h-5 text-[#A0AEC0]" />
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.map((role, rowIndex) => (
//               <tr key={rowIndex} className="border-t">
//                 <td className="p-3 font-semibold text-base text-[#111827]">{role}</td>
//                 {tableHeaders.map((_, colIndex) => (
//                   <td key={colIndex} className="text-center p-3">
//                     <button onClick={() => toggleCheckbox(rowIndex, colIndex)}>
//                       <Image
//                         src={
//                           checkedState[rowIndex][colIndex]
//                             ? "/images/check.png"
//                             : "/images/unchecked.png"
//                         }
//                         alt="checkbox"
//                         width={15}
//                         height={15}
//                       />
//                     </button>
//                   </td>
//                 ))}
//                 <td className="text-center p-3">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                       statusState[rowIndex] === "Active"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {statusState[rowIndex]}
//                   </span>
//                 </td>
//                 <td className="text-center p-3 flex justify-center px-5">
//                   <BsThreeDots className="w-5 h-5 text-[#A0AEC0]" />
//                 </td>
//               </tr>
//             ))}

//             {/* New Row */}
//             {showNewRow && (
//                 <tr className="border-t bg-[#FFFFFF]">
//                     <td className="p-2">
//                     <input 
//                         type="text" 
//                         placeholder="Role name" 
//                         className="p-3 font-semibold text-base w-[156px] h-[35px] rounded-[8px] px-2 bg-[#FAFAFA]" 
//                     />
//                 </td>
//                 {newChecked.map((checked, index) => (
//                 <td key={index} className="text-center p-3">
//                     <button onClick={() => toggleNewCheckbox(index)}>
//                     <Image
//                         src={checked ? "/images/check.png" : "/images/unchecked.png"}
//                         alt="checkbox"
//                         width={15}
//                         height={15}
//                     />
//                     </button>
//                 </td>
//                 ))}
            
//                 {/* Combined cell for Save button */}
//                 <td className="text-center p-3 pl-10" colSpan={2}>
//                 <button
//                     onClick={handleSaveRole}
//                     className="w-full px-4 py-2 bg-[#751423] text-white rounded-[8px] text-sm"
//                 >
//                     Save
//                 </button>
//                 </td>
//             </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }
