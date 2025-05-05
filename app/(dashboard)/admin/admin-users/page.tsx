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
// import React, { useState, useMemo } from "react";
// import AdminContainer from "@/components/admin/AdminContainer";
// import { FiSearch } from "react-icons/fi";
// // import { VscSettings } from "react-icons/vsc";
// import AdminUsersTable, { AdminInterface } from "@/components/admin/adminUsers/AdminUsersTable";
// import AddNewUser from "@/components/admin/AddNewUser";

// const adminsData: AdminInterface[] = Array.from({ length: 30 }, (_, i) => ({
//   id: i + 1,
//   name: [
//     "Chieko Chute",
//     "Annabel Rohan",
//     "Pedro Huard",
//     "Jamel Eusebio",
//     "Augustina Midgett",
//     "Geoffrey Mott"
//   ][i % 6],
//   dateAdded: "12 Mar, 2025",
//   email: [
//     "chieko@mail.com",
//     "rohan_anna@mail.com",
//     "pedrohuar@mail.com",
//     "eusebio234@mail.com",
//     "midgett245@mail.com",
//     "bettina@mail.com"
//   ][i % 6],
//   role: [
//     "Super Admin",
//     "Admin",
//     "Admin",
//     "Logistics",
//     "Audit",
//     "Audit"
//   ][i % 6] as "Super Admin" | "Admin" | "Audit" | "Logistics",
//   lastLogin: "12 Mar, 2025",
//   status: [
//     "Active",
//     "Active",
//     "Suspended",
//     "Active",
//     "Disabled",
//     "Disabled"
//   ][i % 6] as "Active" | "Suspended" | "Disabled"
// }));

// type StatusTab = "All Users" | "Active" | "Suspended" | "Disabled";
// const statusTabs: StatusTab[] = [
//   "All Users",
//   "Active",
//   "Suspended",
//   "Disabled"
// ];

// const AdminPage: React.FC = () => {
//   const [newUser, setNewUser] = useState(false);
//   const [activeTab, setActiveTab] = useState<StatusTab>("All Users");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(6);
// console.log(setActiveTab)
//   const filtered = useMemo(() => {
//     let data = adminsData;
//     if (activeTab !== "All Users")
//       data = data.filter((h) => h.status === activeTab);
//     if (search)
//       data = data.filter(
//         (h) =>
//           h.name.toLowerCase().includes(search.toLowerCase()) ||
//           h.email.toLowerCase().includes(search.toLowerCase())
//       );
//     return data;
//   }, [activeTab, search]);

//   const pageCount = Math.ceil(filtered.length / pageSize);
//   const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <AdminContainer>
//       <div className="space-y-6">
//         {/* Controls */}
//         <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
//           <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full max-w-2xl ">
//             <div className="flex items-center bg-white rounded-[12px] px-4 py-2">
//               <span className="text-[#A0AEC0]">Show:</span>
//               <select className="ml-2 text-black font-bold border-none focus:ring-0 outline-none">
//                 {/* <option>All Events</option> */}
//                 {statusTabs.map((tab) => (
//                   <option key={tab} value={tab}>
//                     {tab}
//                   </option>
//                 ))}
//               </select>
//               {/* <FiChevronDown className="ml-1 text-gray-500" /> */}
//             </div>

//             <div className="flex-1 flex items-center bg-white rounded-[12px] px-4 py-2">
//               <FiSearch className="text-[#000]" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or others..."
//                 className="ml-2 w-full border-none focus:ring-0 outline-none"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//             </div>
//           </div>

//           <div className="flex flex-row justify-between">
//             <button className="w-[153px] h-[40px] border border-[#751423] bg-[#FFFFFF] text-[#751423] rounded-[12px] font-medium text-base">Permissions</button>
//             <button className="w-[171px] h-[40px] ml-3 bg-[#751423] text-[#FFFFFF] rounded-[12px] font-bold text-base" onClick={() => setNewUser(true)}>Add New User</button>
//           </div>
//         </div>
//       <div>
//         {/* Table */}
//         <AdminUsersTable admins={pageData} />

//         {/* Pagination */}
//         <div className="flex items-center justify-between rounded-b-2xl p-4 bg-white">
//           <div className="flex items-center space-x-2">
//             <span className="text-gray-500">Show result:</span>
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="bg-white border rounded-md px-2 py-1"
//             >
//               {[6, 10, 20, 50].map((n) => (
//                 <option key={n} value={n}>
//                   {n}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               className="px-2"
//             >
//               ‹
//             </button>
//             {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 className={`px-3 py-1 rounded-md ${
//                   p === page ? "bg-green-100 text-green-600" : "text-gray-500"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//             <button
//               disabled={page === pageCount}
//               onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
//               className="px-2"
//             >
//               ›
//             </button>
//           </div>
//         </div>
//         </div>
//             {newUser && (
//               <AddNewUser 
//                 isOpen={newUser}
//                 onClose={() => setNewUser(false)}
//                 onSubmit={() => {
//                   setNewUser(false);
//                 }}
//               />
//             )}
//       </div>
//     </AdminContainer>
//   );
// };

// export default AdminPage;
