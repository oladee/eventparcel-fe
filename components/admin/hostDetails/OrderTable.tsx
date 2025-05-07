import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

export interface Order {
  id: string;
  date: string;
  guest: string;
  email: string;
  amount: string;
  status: string;
}

const OrderTable: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <table className="min-w-full bg-white overflow-hidden">
    <thead className="border-t">
      <tr>
        <th className="p-4">
          <input type="checkbox" />
        </th>
        <th className="p-4 text-left text-xs font-medium text-gray-500 capitalize">
          <div className="flex items-center gap-2">
            Order <GrTransaction className="rotate-90" />
          </div>
        </th>
        <th className="p-4 text-left text-xs font-medium text-gray-500 capitalize">
          <div className="flex items-center gap-2">
            Guest <GrTransaction className="rotate-90" />
          </div>
        </th>
        <th className="p-4 text-left text-xs font-medium text-gray-500 capitalize">
          <div className="flex items-center gap-2">
            Amount <GrTransaction className="rotate-90" />
          </div>
        </th>
        <th className="p-4 text-left text-xs font-medium text-gray-500 capitalize">
          <div className="flex items-center gap-2">
            Status <GrTransaction className="rotate-90" />
          </div>
        </th>
        <th className="p-4"><FiMoreHorizontal className="text-gray-400" /></th>
      </tr>
    </thead>
    <tbody>
      {orders.map((o) => (
        <tr key={o.id} className="border-t">
          <td className="p-4">
            <input type="checkbox" />
          </td>
          <td className="p-4">
            <p className="font-semibold">{o.id}</p>
            <p className="text-gray-400 text-xs">{o.date}</p>
          </td>
          <td className="p-4">
            <p className="font-semibold">{o.guest}</p>
            <p className="text-gray-400 text-xs">{o.email}</p>
          </td>
          <td className="p-4 font-semibold">{o.amount}</td>
          <td className="p-4">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                o.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : o.status === "Shipped"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {o.status}
            </span>
          </td>
          <td className="p-4 text-right">
            <FiMoreHorizontal className="text-gray-400" />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderTable;

// import React from 'react'
// import { FiMoreHorizontal } from 'react-icons/fi'

// const orders = [
//   { id:'#ID238976', date:'24 Apr, 2025', guest:'Chieko Chute', email:'chieko@mail.com', amount:'₦1,560,000', status:'Pending' },
//   // add more orders here
// ]

// const OrderTable: React.FC = () => (
//   <table className="min-w-full bg-white rounded-2xl  overflow-hidden">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="p-4"><input type="checkbox" /></th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//         <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//         <th className="p-4"></th>
//       </tr>
//     </thead>
//     <tbody>
//       {orders.map(o => (
//         <tr key={o.id} className="border-t">
//           <td className="p-4"><input type="checkbox" /></td>
//           <td className="p-4">
//             <p className="font-semibold">{o.id}</p>
//             <p className="text-gray-400 text-xs">{o.date}</p>
//           </td>
//           <td className="p-4">
//             <p className="font-semibold">{o.guest}</p>
//             <p className="text-gray-400 text-xs">{o.email}</p>
//           </td>
//           <td className="p-4 font-semibold">{o.amount}</td>
//           <td className="p-4">
//             <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">{o.status}</span>
//           </td>
//           <td className="p-4 text-right">
//             <FiMoreHorizontal className="text-gray-400" />
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// )

// export default OrderTable
