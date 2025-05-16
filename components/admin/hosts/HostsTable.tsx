"use client";

import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next-nprogress-bar";
import { FiMoreHorizontal } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";
import { toast } from "react-toastify";

export type Host = {
  id: string;
  name: string;
  email: string;
  location: string;
  sales: string;
  lastLogin: string;
  status: "Active" | "Inactive" | "Unverified" | "Suspended" | "Disabled";
};

const statusClasses: Record<Host["status"], string> = {
  Active:     "bg-[#2B9EA01F] text-[#2B9EA0] border border-[#2B9EA0]",
  Inactive:   "bg-[#FE964A1F] text-[#FE964A]  border border-[#FE964A]",
  Unverified: "bg-[#DE42221F] text-[#DE4222] border border-[#DE4222]",
  Disabled:   "bg-[#FE964A1F] text-[#FE4222] border border-[#DE4222]",
  Suspended:  "bg-[#DE42221F] text-[#FE964A]  border border-[#FE964A]",
};

interface Props {
  hosts: Host[];
  onStatusUpdate: (id: string, newStatus: string) => void;
}

const HostsTable: React.FC<Props> = ({ hosts, onStatusUpdate }) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [loadingButton, setLoadingButton] = useState<{ id: string; action: Host["status"] } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router  = useRouter();

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (id: string) => {
    setMenuOpenId(prev => (prev === id ? null : id));
  };

  const getRandomColorClass = () => {
    const colors = ["bg-red-500","bg-yellow-500","bg-green-500","bg-blue-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // call API → bubble up to parent
  const handleUpdate = async (id: string, newStatus: Host["status"]) => {
    setLoadingButton({ id, action: newStatus });
    try {
      const { data } = await axiosInstance.put("/update-host-status", {
        userId: id,
        status: newStatus.toLowerCase(),
      });
      toast.success("Host status updated successfully!");
      onStatusUpdate(id, data.data.status);
      setMenuOpenId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoadingButton(null);
    }
  };

  return (
    <div className="bg-white min-w-full overflow-x-auto no-scrollbar">
      <table className="w-full table-auto bg-white rounded-t-2xl overflow-visible">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4"><input type="checkbox"/></th>
            {["Host Name","Location","Overall Sales","Last Login","Status"].map(col => (
              <th key={col} className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
                <div className="flex items-center gap-2">
                  {col} <GrTransaction className="rotate-90"/>
                </div>
              </th>
            ))}
            <th className="p-4 text-right text-gray-400">…</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map(h => (
            <tr key={h.id} className="border-t relative">
              <td className="p-4"><input type="checkbox"/></td>
              <td className="p-4 flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${getRandomColorClass()}`}>
                  {h.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-black-100 text-sm">{h.name}</p>
                  <p className="text-gray-400 text-xs">{h.email}</p>
                </div>
              </td>
              <td className="p-4 font-semibold text-black-100 text-sm">{h.location}</td>
              <td className="p-4 font-semibold text-black-100 text-sm">{h.sales}</td>
              <td className="p-4 text-[#718096] text-sm">{h.lastLogin}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[h.status]}`}>
                  {h.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button onClick={() => toggleMenu(h.id)}>
                  <FiMoreHorizontal className="text-gray-400"/>
                </button>
                {menuOpenId === h.id && (
                  <div ref={menuRef} className="absolute right-4 top-10 bg-white shadow-lg rounded-lg w-40 z-10">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => router.push(`/admin/admin-hosts/${h.id}`)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Host
                        </button>
                      </li>
                      {h.status === "Active" && (
                        <>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Suspended")}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Suspended"
                                ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"/>
                                : "Suspend Host"}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Disabled")}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Disabled"
                                ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"/>
                                : "Disable Host"}
                            </button>
                          </li>
                        </>
                      )}
                            {h.status === "Suspended" && (
                        <>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Active")}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Active"
                                ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                : "Activate Host"}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Disabled")}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Disabled"
                                ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                : "Disable Host"}
                            </button>
                          </li>
                        </>
                      )}
                      {h.status === "Inactive" && (
                        <>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Active")}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Active"
                                ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                : "Activate Host"}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Suspended")}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Suspended"
                                ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                : "Suspend Host"}
                            </button>
                          </li>
                        </>
                      )}
                      {h.status === "Disabled" && (
                        <>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Active")}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Active"
                                ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                : "Activate Host"}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleUpdate(h.id, "Suspended")}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              {loadingButton?.id === h.id && loadingButton?.action === "Suspended"
                                ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                : "Suspend Host"}
                            </button>
                          </li>
                        </>
                      )}

                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HostsTable


















// "use client";
// import axiosInstance from "@/lib/axiosInstance";
// import { useRouter } from "next-nprogress-bar";
// import React, { useState, useRef, useEffect } from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { GrTransaction } from "react-icons/gr";
// import { toast } from "react-toastify";

// export type Host = {
//   id: number;
//   name: string;
//   email: string;
//   location: string;
//   sales: string;
//   lastLogin: string;
//   status: "Active" | "Inactive" | "Unverified" | "Suspended" | "Disabled";
// };

// const statusClasses: Record<Host["status"], string> = {
//   Active: "bg-[#2B9EA01F] text-[#2B9EA0] border border-[#2B9EA0]",
//   Inactive: "bg-[#FE964A1F] text-[#FE964A] border border-[#FE964A]",
//   Unverified: "bg-[#DE42221F] text-[#DE4222] border border-[#DE4222]",
//   Disabled: "bg-[#FE964A1F] text-[#DE4222] border border-[#DE4222]",
//   Suspended: "bg-[#DE42221F] text-[#FE964A] border border-[#FE964A]",
// };

// const HostsTable: React.FC<{ hosts: Host[] }> = ({ hosts }) => {
//   const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
//   const [hostList, setHostList] = useState<Host[]>(hosts);
//     const [loadingButton, setLoadingButton] = useState<{ id: number; action: Host["status"] } | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   console.log(hosts);
  

//   const toggleMenu = (id: number) => {
//     setMenuOpenId((prev) => (prev === id ? null : id));
//   };

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpenId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getRandomColorClass = () => {
//     const colors = [
//       "bg-red-500",
//       "bg-yellow-500",
//       "bg-green-500",
//       "bg-blue-500"
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const updateHostStatus = async (id: number, status: Host["status"]) => {
//     try {
//       const response = await axiosInstance.put("/update-host-status", {
//         userId: id.toString(),
//         status
//       });
//       const updated = response.data.data;

//       toast.success("Host status updated successfully!");
//       // setHostList(prev =>
//       //   prev.map(h => (h.id === id ? { ...h, status: updated.status.toCapitalize() } : h))
//       // );
//       setHostList((prev) =>
//         prev.map((h) =>
//           h.id === id
//             ? { ...h, status: updated.status.charAt(0).toUpperCase() + updated.status.slice(1) }
//             : h
//         )
//       );
//       setMenuOpenId(null);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Something went wrong.");
//     }
//   };

//   const handleUpdateStatus = async (id: number, newStatus:any) => {
//     setLoadingButton({ id, action: newStatus });
//     try {
//       await updateHostStatus(id, newStatus);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingButton(null);
//     }
//   };


//   return (
//     <div className="bg-white min-w-full overflow-x-scroll no-scrollbar">
//       <table className="w-full table-auto bg-white rounded-t-2xl overflow-visible">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="p-4 text-left">
//               <input type="checkbox" />
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Host Name <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Location <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Overall Sales <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Last Login <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
//               <div className="flex items-center gap-2">
//                 Status <GrTransaction className="rotate-90" />
//               </div>
//             </th>
//             <th className="p-4 text-right text-gray-400">
//              ...
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {hostList.map((h) => (
//             <tr key={h.id} className="border-t relative">
//               <td className="p-4">
//                 <input type="checkbox" />
//               </td>
//               <td className="p-4 flex items-center space-x-3">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${getRandomColorClass()}`}
//                 >
//                   {h.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-black-100 text-sm">
//                     {h.name}
//                   </p>
//                   <p className="text-gray-400 text-xs">{h.email}</p>
//                 </div>
//               </td>
//               <td className="p-4 font-semibold text-black-100 text-sm">
//                 {h.location}
//               </td>
//               <td className="p-4 font-semibold text-black-100 text-sm">
//                 {h.sales}
//               </td>
//               <td className="p-4 text-[#718096] text-sm">{h.lastLogin}</td>
//               <td className="p-4">
//                 <span
//                   className={`px-2 py-1 text-xs rounded-full ${
//                     statusClasses[h.status]
//                   }`}
//                 >
//                   {h.status}
//                 </span>
//               </td>
//               <td className="p-4 text-right relative">
//                 <button onClick={() => toggleMenu(h.id)}>
//                   <FiMoreHorizontal className="text-gray-400" />
//                 </button>
//                 {menuOpenId === h.id && (
//                   <div
//                     ref={menuRef}
//                     className="absolute right-4 top-10 bg-white shadow-lg rounded-lg w-40 z-10"
//                   >
//                     <ul className="py-1">
//                       <li>
//                         <button
//                           onClick={() =>
//                             router.push(`/admin/admin-hosts/${h.id}`)
//                           }
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           View Host
//                         </button>
//                       </li>
//                       {/* <li>
//                         <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                           Suspend Host
//                         </button>
//                       </li>
//                       <li>
//                         <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                           Disable Host
//                         </button>
//                       </li> */}
//                       {h.status === "Active" && (
//                         <>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "suspended")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Suspended"
//                                 ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Suspend Host"}
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "disabled")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Disabled"
//                                 ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Disable Host"}
//                             </button>
//                           </li>
//                         </>
//                       )}
//                       {h.status === "Suspended" && (
//                         <>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "active")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Active"
//                                 ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Activate Host"}
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "disabled")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Disabled"
//                                 ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Disable Host"}
//                             </button>
//                           </li>
//                         </>
//                       )}
//                       {h.status === "Inactive" && (
//                         <>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "active")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Active"
//                                 ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Activate Host"}
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "Suspended")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Suspended"
//                                 ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Suspend Host"}
//                             </button>
//                           </li>
//                         </>
//                       )}
//                       {h.status === "Disabled" && (
//                         <>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "active")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Active"
//                                 ? <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Activate Host"}
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               onClick={() => handleUpdateStatus(h.id, "suspended")}
//                               className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                             >
//                               {loadingButton?.id === h.id && loadingButton?.action === "Suspended"
//                                 ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                                 : "Suspend Host"}
//                             </button>
//                           </li>
//                         </>
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HostsTable;
