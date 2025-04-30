"use client"
import { useRouter } from 'next-nprogress-bar'
import React, { useState, useRef, useEffect } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'

export type Host = {
  id: number
  name: string
  email: string
  location: string
  sales: string
  lastLogin: string
  status: 'Active' | 'Inactive' | 'Unverified'
}

const statusClasses: Record<Host['status'], string> = {
  Active: 'bg-teal-100 text-teal-700',
  Inactive: 'bg-orange-100 text-orange-700',
  Unverified: 'bg-red-100 text-red-700',
}

const HostsTable: React.FC<{ hosts: Host[] }> = ({ hosts }) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleMenu = (id: number) => {
    setMenuOpenId(prev => (prev === id ? null : id))
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <table className="min-w-full bg-white rounded-2xl shadow overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4"><input type="checkbox" /></th>
          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Host Name</th>
          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Overall Sales</th>
          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
          <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="p-4"></th>
        </tr>
      </thead>
      <tbody>
        {hosts.map(h => (
          <tr key={h.id} className="border-t relative">
            <td className="p-4"><input type="checkbox" /></td>
            <td className="p-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-white">
                {h.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{h.name}</p>
                <p className="text-gray-400 text-xs">{h.email}</p>
              </div>
            </td>
            <td className="p-4 font-medium text-gray-900">{h.location}</td>
            <td className="p-4 font-semibold text-gray-900">{h.sales}</td>
            <td className="p-4 text-gray-500 text-sm">{h.lastLogin}</td>
            <td className="p-4">
              <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[h.status]}`}>{h.status}</span>
            </td>
            <td className="p-4 text-right relative">
              <button onClick={() => toggleMenu(h.id)}>
                <FiMoreHorizontal className="text-gray-400" />
              </button>
              {menuOpenId === h.id && (
                <div ref={menuRef} className="absolute right-4 top-10 bg-white shadow-lg rounded-lg w-40 z-10">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => router.push(`/admin/admin-host/${h.id}`)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View Host
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Suspend Host
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Disable Host
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default HostsTable














// import React, { useState } from 'react'
// import { FiMoreHorizontal } from 'react-icons/fi'

// export type Host = {
//   id: number
//   name: string
//   email: string
//   location: string
//   sales: string
//   lastLogin: string
//   status: 'Active' | 'Inactive' | 'Unverified'
// }

// const statusClasses: Record<Host['status'], string> = {
//   Active: 'bg-teal-100 text-teal-700',
//   Inactive: 'bg-orange-100 text-orange-700',
//   Unverified: 'bg-red-100 text-red-700',
// }

// const HostsTable: React.FC<{ hosts: Host[] }> = ({ hosts }) => {
//   const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

//   const toggleMenu = (id: number) => {
//     setMenuOpenId(prev => (prev === id ? null : id))
//   }

//   return (
//     <table className="min-w-full bg-white rounded-2xl shadow overflow-hidden">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="p-4"><input type="checkbox" /></th>
//           <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Host Name</th>
//           <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
//           <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Overall Sales</th>
//           <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
//           <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//           <th className="p-4"></th>
//         </tr>
//       </thead>
//       <tbody>
//         {hosts.map(h => (
//           <tr key={h.id} className="border-t relative">
//             <td className="p-4"><input type="checkbox" /></td>
//             <td className="p-4 flex items-center space-x-3">
//               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-white">
//                 {h.name.split(' ').map(n => n[0]).join('')}
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-900">{h.name}</p>
//                 <p className="text-gray-400 text-xs">{h.email}</p>
//               </div>
//             </td>
//             <td className="p-4 font-medium text-gray-900">{h.location}</td>
//             <td className="p-4 font-semibold text-gray-900">{h.sales}</td>
//             <td className="p-4 text-gray-500 text-sm">{h.lastLogin}</td>
//             <td className="p-4">
//               <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[h.status]}`}>{h.status}</span>
//             </td>
//             <td className="p-4 text-right relative">
//               <button onClick={() => toggleMenu(h.id)}>
//                 <FiMoreHorizontal className="text-gray-400" />
//               </button>
//               {menuOpenId === h.id && (
//                 <div className="absolute right-4 top-10 bg-white shadow-lg rounded-lg w-40 z-10">
//                   <ul className="py-1">
//                     <li>
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         View Host
//                       </button>
//                     </li>
//                     <li>
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Suspend Host
//                       </button>
//                     </li>
//                     <li>
//                       <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                         Disable Host
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }

// export default HostsTable












// import React from 'react'
// import { FiMoreHorizontal } from 'react-icons/fi'

// export type Host = {
//   id: number
//   name: string
//   email: string
//   location: string
//   sales: string
//   lastLogin: string
//   status: 'Active' | 'Inactive' | 'Unverified'
// }

// const statusClasses: Record<Host['status'], string> = {
//   Active: 'bg-teal-100 text-teal-700',
//   Inactive: 'bg-orange-100 text-orange-700',
//   Unverified: 'bg-red-100 text-red-700',
// }

// const HostsTable: React.FC<{ hosts: Host[] }> = ({ hosts }) => (
//   <table className="min-w-full bg-white rounded-2xl shadow overflow-hidden">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="p-4"><input type="checkbox" /></th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Host Name</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Overall Sales</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//         <th className="p-4"></th>
//       </tr>
//     </thead>
//     <tbody>
//       {hosts.map(h => (
//         <tr key={h.id} className="border-t">
//           <td className="p-4"><input type="checkbox" /></td>
//           <td className="p-4 flex items-center space-x-3">
//             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-white">{h.name.split(' ').map(n=>n[0]).join('')}</div>
//             <div>
//               <p className="font-semibold text-gray-900">{h.name}</p>
//               <p className="text-gray-400 text-xs">{h.email}</p>
//             </div>
//           </td>
//           <td className="p-4 font-medium text-gray-900">{h.location}</td>
//           <td className="p-4 font-semibold text-gray-900">{h.sales}</td>
//           <td className="p-4 text-gray-500 text-sm">{h.lastLogin}</td>
//           <td className="p-4">
//             <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[h.status]}`}>{h.status}</span>
//           </td>
//           <td className="p-4 text-right">
//             <FiMoreHorizontal className="text-gray-400" />
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// )

// export default HostsTable