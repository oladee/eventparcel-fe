"use client"

import React, { useEffect, useState } from "react"
import AdminContainer from "@/components/admin/AdminContainer"
import { FiSearch, FiDownload, FiPackage } from "react-icons/fi"
import HostsTable, { Host } from "@/components/admin/hosts/HostsTable"
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { BiLoaderCircle } from "react-icons/bi"
import { saveAs } from 'file-saver'
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/mixpanel"

const HostsSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden">
    <table className="w-full table-auto animate-pulse">
      <thead className="bg-gray-50">
        <tr>
          {['','Host Name','Location','Overall Sales','Last Login','Status',''].map((_, i) => (
            <th key={i} className="p-4 h-6 bg-gray-200" />
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, row) => (
          <tr key={row} className="border-t">
            {[...Array(7)].map((_, cell) => (
              <td key={cell} className="p-4 h-8 bg-gray-200" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const statusTabs = [
  { label: 'All Hosts',   value: ''         },
  { label: 'Active',      value: 'active'   },
  { label: 'Inactive',    value: 'inactive' },
  { label: 'Suspended',   value: 'suspended'},
  { label: 'Disabled',    value: 'disabled' },
  { label: 'Unverified',  value: 'unverified'},
]

const HostsPage: React.FC = () => {
  const [hosts, setHosts]             = useState<Host[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [search, setSearch]           = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage]               = useState(1)
  const [limit, setLimit]             = useState(10)
  const [totalHosts, setTotalHosts]   = useState(0)
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true)

    // Build query params
    const params: Record<string, any> = { page, limit }
    if (search) params.search = search

    if (statusFilter) {
      // <-- CAPITALIZE HERE
      params.status = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
    }

    axiosInstance.get('/admin-hosts', { params })
      .then(res => {
        if (!res.data.success) throw new Error(res.data.message)

        const mapped: Host[] = res.data.data.hosts.map((h: any) => ({
          id:        h._id,
          name:      h.hostName,
          email:     h.email,
          location:  h.location || '-',
          sales:     `₦${h.overallSales.NGN.toLocaleString()}${h.overallSales.USD ? ` | $${h.overallSales.USD.toLocaleString()}` : ''}`,
          lastLogin: h.lastLogin ? new Date(h.lastLogin).toLocaleDateString('en-GB') : '-',
          status:    (h.status.charAt(0).toUpperCase() + h.status.slice(1)) as Host['status'],
        }))

        setHosts(mapped)
        setTotalHosts(res.data.data.totalHosts ?? 0)
        setError(null)
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Network error'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [page, limit, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(totalHosts / limit))

  const handleExport = () => {
    try {
      const csv = [
        ['Name', 'Email', 'Sales', 'Last Login', 'Status'],
        ...hosts.map(h => [h.name, h.email, h.sales, h.lastLogin, h.status])
      ]
        .map(r => r.join(','))
        .join('\n');
  
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'hosts.csv');

      trackEvent("Export Data", {
      source: `${pathname} page`,
      timestamp: new Date().toISOString(),
      page_name: `${pathname} Page`,
      route: pathname,
      status: "Successful"
    });
    } catch (error) {
      console.error(error);
      trackEvent("Export Data", {
        source: `${pathname} page`,
        timestamp: new Date().toISOString(),
        page_name: `${pathname} Page`,
        route: pathname,
        status: "Failed"
      });
    }
  };
  

  const handleStatusUpdate = (id: string, newStatus: string) => {
    const cap = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
    setHosts(prev =>
      prev.map(h => (h.id === id ? { ...h, status: cap as Host['status'] } : h))
    )
  }

  return (
    <AdminContainer>
      <ToastContainer position="top-right" autoClose={3000}/>
      <div className="space-y-6">

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-white rounded-[12px] px-4 py-2 space-x-2">
            <span className="text-[#A0AEC0]">Show:</span>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              className="text-black font-bold border-none focus:ring-0 outline-none"
            >
              {statusTabs.map(tab => (
                <option key={tab.value} value={tab.value}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex items-center bg-white rounded-[12px] px-4 py-2">
            <FiSearch className="text-[#000]" />
            <input
              type="text"
              placeholder="Search by name, email, or others..."
              className="ml-2 w-full border-none focus:ring-0 outline-none"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>

          <button
            className="flex items-center bg-white rounded-[12px] px-4 py-2 text-[#718096]"
            onClick={handleExport}
          >
            <FiDownload className="mr-2 text-[#A0AEC0]" />Export
          </button>
        </div>

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="flex items-center justify-center p-6"><HostsSkeleton/></div>
        ) : error ? (
          <div className="p-6 text-red-600 flex items-center">
            <BiLoaderCircle className="mr-2 animate-spin" size={22}/>
            {error}
          </div>
        ) : hosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <FiPackage className="w-12 h-12 text-gray-400 mb-4"/>
            <p className="text-xl font-semibold text-gray-700">
              No hosts found for “{statusFilter || search}”
            </p>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <HostsTable
              hosts={hosts}
              onStatusUpdate={handleStatusUpdate}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between rounded-b-2xl p-4 bg-white">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Show result:</span>
                <select
                  value={limit}
                  onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
                  className="bg-white border rounded-md px-2 py-1 outline-none"
                >
                  {[6,10,20,50].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                {[...Array(pageCount)].map((_, i) => (
                  <button
                    key={i+1}
                    onClick={()=>setPage(i+1)}
                    className={`px-3 py-1 rounded-md ${page===i+1 ? 'bg-green-100 text-green-600' : 'text-gray-500'}`}
                  >
                    {i+1}
                  </button>
                ))}
                <button disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminContainer>
  )
}

export default HostsPage
























// "use client"

// import React, { useEffect, useState, useMemo } from "react"
// import AdminContainer from "@/components/admin/AdminContainer"
// import { FiSearch, FiDownload, FiPackage } from "react-icons/fi"
// import HostsTable, { Host } from "@/components/admin/hosts/HostsTable"
// import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
// import { ToastContainer, toast } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css'
// import { BiLoaderCircle } from "react-icons/bi"
// import { saveAs } from 'file-saver'

// const HostsSkeleton: React.FC = () => (
//   <div className="bg-white rounded-2xl overflow-hidden">
//     <table className="w-full table-auto animate-pulse">
//       <thead className="bg-gray-50">
//         <tr>
//           {['','Host Name','Location','Overall Sales','Last Login','Status',''].map((_, i) => (
//             <th key={i} className="p-4 h-6 bg-gray-200"></th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {[...Array(5)].map((_, row) => (
//           <tr key={row} className="border-t">
//             {[...Array(7)].map((_, cell) => (
//               <td key={cell} className="p-4 h-8 bg-gray-200"></td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )

// const statusTabs = [
//   { label: 'All Hosts',   value: ''         },
//   { label: 'Active',      value: 'active'   },
//   { label: 'Inactive',    value: 'inactive' },
//   { label: 'Suspended',   value: 'suspended'},
//   { label: 'Disabled',    value: 'disabled' },
//   { label: 'Unverified',  value: 'unverified'},
// ]

// const HostsPage: React.FC = () => {
//   const [hosts, setHosts]               = useState<Host[]>([])
//   const [loading, setLoading]           = useState(false)
//   const [error, setError]               = useState<string | null>(null)
//   const [search, setSearch]             = useState("")
//   const [statusFilter, setStatusFilter] = useState("")
//   const [page, setPage]                 = useState(1)
//   const [limit, setLimit]               = useState(10)

//   // Fetch hosts on mount & when page, limit or search change
//   useEffect(() => {
//     setLoading(true)
//     axiosInstance.get('/admin-hosts', { params: { page, limit, search } })
//       .then(res => {
//         if (!res.data.success) throw new Error(res.data.message)
//         const mapped: Host[] = res.data.data.hosts.map((h: any) => ({
//           id:        h._id,
//           name:      h.hostName,
//           email:     h.email,
//           location:  h.location || '-',
//           sales:     `₦${h.overallSales.NGN.toLocaleString()}${h.overallSales.USD ? ` | $${h.overallSales.USD.toLocaleString()}` : ''}`,
//           lastLogin: h.lastLogin ? new Date(h.lastLogin).toLocaleDateString('en-GB') : '-',
//           status:    (h.status.charAt(0).toUpperCase() + h.status.slice(1)) as Host['status'],
//         }))
//         setHosts(mapped)
//         setError(null)
//       })
//       .catch(err => {
//         const msg = err.response?.data?.message || err.message || 'Network error'
//         setError(msg)
//         toast.error(msg)
//       })
//       .finally(() => setLoading(false))
//   }, [page, limit, search])

//   // Case‑insensitive status filter
//   const filtered = useMemo(() => {
//     return hosts.filter(h => {
//       if (!statusFilter) return true
//       return h.status.toLowerCase() === statusFilter.toLowerCase()
//     })
//   }, [hosts, statusFilter])

//   // Pagination
//   const pageCount = Math.max(1, Math.ceil(filtered.length / limit))
//   const pageData  = filtered.slice((page - 1) * limit, page * limit)

//   // Export CSV
//   const handleExport = () => {
//     const csv = [
//       ['Name','Email','Sales','Last Login','Status'],
//       ...filtered.map(h => [h.name, h.email, h.sales, h.lastLogin, h.status])
//     ].map(r => r.join(',')).join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     saveAs(blob, 'hosts.csv')
//   }

//   // Remove host from view if its status no longer matches the current filter
//   const handleStatusUpdate = (id: string, newStatus: string) => {
//     const cap = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
//     setHosts(prev =>
//       prev
//         .map(h => h.id === id ? { ...h, status: cap as Host['status'] } : h)
//         .filter(h => !statusFilter || h.status.toLowerCase() === statusFilter.toLowerCase())
//     )
//   }

//   return (
//     <AdminContainer>
//       <ToastContainer position="top-right" autoClose={3000}/>
//       <div className="space-y-6">

//         {/* Controls */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex items-center bg-white rounded-[12px] px-4 py-2 space-x-2">
//             <span className="text-[#A0AEC0]">Show:</span>
//             <select
//               value={statusFilter}
//               onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
//               className="text-black font-bold border-none focus:ring-0 outline-none"
//             >
//               {statusTabs.map(tab => (
//                 <option key={tab.value} value={tab.value}>
//                   {tab.label}
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
//               value={search}
//               onChange={e => { setSearch(e.target.value); setPage(1) }}
//             />
//           </div>

//           <button
//             className="flex items-center bg-white rounded-[12px] px-4 py-2 text-[#718096]"
//             onClick={handleExport}
//           >
//             <FiDownload className="mr-2 text-[#A0AEC0]"/>Export
//           </button>
//         </div>

//         {/* Table / Loading / Empty */}
//         {loading ? (
//           <div className="flex items-center justify-center p-6"><HostsSkeleton/></div>
//         ) : error ? (
//           <div className="p-6 text-red-600 flex items-center">
//             <BiLoaderCircle className="mr-2 animate-spin" size={22}/>
//             {error}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <FiPackage className="w-12 h-12 text-gray-400 mb-4"/>
//             <p className="text-xl font-semibold text-gray-700">
//               No hosts found for “{statusFilter || search}”
//             </p>
//             <p className="mt-2 text-gray-500">Try adjusting your search or filter.</p>
//           </div>
//         ) : (
//           <>
//             <HostsTable
//               hosts={pageData}
//               onStatusUpdate={handleStatusUpdate}
//             />

//             {/* Pagination */}
//             <div className="flex items-center justify-between rounded-b-2xl p-4 bg-white">
//               <div className="flex items-center space-x-2">
//                 <span className="text-gray-500">Show result:</span>
//                 <select
//                   value={limit}
//                   onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
//                   className="bg-white border rounded-md px-2 py-1"
//                 >
//                   {[6,10,20,50].map(n => (
//                     <option key={n} value={n}>{n}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
//                 {[...Array(pageCount)].map((_, i) => (
//                   <button
//                     key={i+1}
//                     onClick={()=>setPage(i+1)}
//                     className={`px-3 py-1 rounded-md ${page===i+1 ? 'bg-green-100 text-green-600' : 'text-gray-500'}`}
//                   >
//                     {i+1}
//                   </button>
//                 ))}
//                 <button disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>›</button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </AdminContainer>
//   )
// }

// export default HostsPage



























// // ===== HostsPage.tsx =====
// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import AdminContainer from "@/components/admin/AdminContainer";
// import { FiSearch, FiDownload, FiPackage } from "react-icons/fi";
// import HostsTable, { Host } from "@/components/admin/hosts/HostsTable";
// import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import { saveAs } from "file-saver";
// // import Image from "next/image"

// const HostsSkeleton: React.FC = () => (
//   <div className="bg-white rounded-2xl overflow-hidden">
//     <table className="w-full table-auto animate-pulse">
//       <thead className="bg-gray-50">
//         <tr>
//           {[
//             "",
//             "Host Name",
//             "Location",
//             "Overall Sales",
//             "Last Login",
//             "Status",
//             ""
//           ].map((_, i) => (
//             <th key={i} className="p-4 h-6 bg-gray-200"></th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {[...Array(5)].map((_, row) => (
//           <tr key={row} className="border-t">
//             {[...Array(7)].map((_, cell) => (
//               <td key={cell} className="p-4 h-8 bg-gray-200"></td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const statusTabs = [
//   { label: "All Host", value: "" },
//   { label: "Active", value: "active" },
//   { label: "Inactive", value: "inactive" },
//   { label: "Suspended", value: "suspended" },
//   { label: "Disabled", value: "disabled" },
//   { label: "Unverified", value: "unverified" }
// ];

// const HostsPage: React.FC = () => {
//   const [hosts, setHosts] = useState<Host[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   useEffect(() => {
//     setLoading(true);
//     axiosInstance
//       .get("/admin-hosts", { params: { page, limit, search } })
//       .then((res) => {
//         if (res.data.success) {
//           const data = res.data.data.hosts;
//           const mapped = data.map((h: any) => ({
//             id: h._id,
//             name: h.hostName,
//             email: h.email,
//             location: h.location || "-",
//             sales: `₦${h.overallSales.NGN.toLocaleString()}${
//               h.overallSales.USD
//                 ? ` | $${h.overallSales.USD.toLocaleString()}`
//                 : ""
//             }`,
//             lastLogin: h.lastLogin
//               ? new Date(h.lastLogin).toLocaleDateString("en-GB")
//               : "-",
//             status: (h.status.charAt(0).toUpperCase() +
//               h.status.slice(1)) as Host["status"]
//           }));
//           setHosts(mapped);
//           setError(null);
//           console.log(res.data.message);
//         } else {
//           throw new Error(res.data.message);
//         }
//       })
//       .catch((err) => {
//         const msg =
//           err.response?.data?.message || err.message || "Network error";
//         setError(msg);
//         toast.error(msg);
//       })
//       .finally(() => setLoading(false));
//   }, [page, limit, search]);

//   // Client-side filter by status
//   // const filtered = useMemo(() => {
//   //   return hosts.filter((h) =>
//   //     statusFilter ? h.status === statusFilter : true
//   //   );
//   // }, [hosts, statusFilter]);

//   const filtered = useMemo(() =>
//   hosts.filter(h =>
//     statusFilter
//       ? h.status.toLowerCase() === statusFilter
//       : true
//   ),
//   [hosts, statusFilter]
// )

//   // Pagination over filtered
//   const pageCount = Math.max(1, Math.ceil(filtered.length / limit));
//   const pageData = filtered.slice((page - 1) * limit, page * limit);

//   const handleExport = () => {
//     const csv = [
//       ["Name", "Email", "Sales", "Last Login", "Status"],
//       ...filtered.map((h) => [h.name, h.email, h.sales, h.lastLogin, h.status])
//     ]
//       .map((r) => r.join(","))
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "hosts.csv");
//   };

//   return (
//     <AdminContainer>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="space-y-6">
//         {/* Controls */}
//         <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
//           <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full max-w-2xl ">
//             <div className="flex items-center bg-white rounded-[12px] px-4 py-2">
//               <span className="text-[#A0AEC0]">Show:</span>
//               {/* <select
//                 value={statusFilter}
//                 onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
//                 className="ml-2 text-black font-bold border-none focus:ring-0 outline-none"
//               >
//                 {statusTabs.map(tab => (
//                   <option key={tab.value} value={tab.value}>{tab.label}</option>
//                 ))}
//               </select> */}
//               {/* HostsPage.tsx */}
//               <select
//                 value={statusFilter}
//                 onChange={(e) => {
//                   setStatusFilter(e.target.value);
//                   setPage(1);
//                 }}
//                 className="ml-2 text-black font-bold border-none focus:ring-0 outline-none"
//               >
//                 {statusTabs.map((tab) => {
//                   // capitalize the tab.value
//                   const capitalized = tab.value
//                     ? tab.value.charAt(0).toUpperCase() + tab.value.slice(1)
//                     : "";
//                   return (
//                     <option key={tab.value} value={capitalized}>
//                       {tab.label}
//                     </option>
//                   );
//                 })}
//               </select>
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
//           <button
//             className="flex items-center bg-white rounded-[12px] px-4 py-2 text-[#718096]"
//             onClick={handleExport}
//           >
//             <FiDownload className="mr-2 text-[#A0AEC0]" />
//             Export
//           </button>
//         </div>
//         {/* Table & Loading/Error/No Data */}
//         {loading ? (
//           <div className="flex items-center justify-center p-6">
//             <HostsSkeleton />
//           </div>
//         ) : error ? (
//           <div className="p-6 text-red-600 flex items-center">
//             <BiLoaderCircle className="mr-2 animate-spin" size={22} />
//             {error}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
//             <p className="text-xl font-semibold text-gray-700">
//               No hosts found for “{search || statusFilter}”
//             </p>
//             <p className="mt-2 text-gray-500">
//               Try adjusting your search or filter criteria.
//             </p>
//           </div>
//         ) : (
//           <>
//             <HostsTable hosts={pageData} />
//             {/* Pagination */}
//             <div className="flex items-center justify-between rounded-b-2xl p-4 bg-white">
//               <div className="flex items-center space-x-2">
//                 <span className="text-gray-500">Show result:</span>
//                 <select
//                   value={limit}
//                   onChange={(e) => {
//                     setLimit(Number(e.target.value));
//                     setPage(1);
//                   }}
//                   className="bg-white border rounded-md px-2 py-1"
//                 >
//                   {[6, 10, 20, 50].map((n) => (
//                     <option key={n} value={n}>
//                       {n}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   disabled={page === 1}
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   className="px-2"
//                 >
//                   ‹
//                 </button>
//                 {[...Array(pageCount)].map((_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setPage(i + 1)}
//                     className={`px-3 py-1 rounded-md ${
//                       page === i + 1
//                         ? "bg-green-100 text-green-600"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   disabled={page === pageCount}
//                   onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
//                   className="px-2"
//                 >
//                   ›
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </AdminContainer>
//   );
// };

// export default HostsPage;
