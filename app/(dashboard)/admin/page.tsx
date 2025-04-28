"use client"
import React from 'react'
import AdminContainer from '@/components/admin/AdminContainer'
import StatCardGroup from '@/components/admin/dashboard/StatCardGroup'
import DoughnutSection from '@/components/admin/dashboard/DoughnutSection'
import LineChartSection from '@/components/admin/dashboard/LineChartSection'
import RecentEventsSection from '@/components/admin/dashboard/RecentEventsSection'

const DashboardPage: React.FC = () => (
  <AdminContainer>
    <div className="space-y-6">
      {/* Top section: stat cards & donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
          <StatCardGroup />
        </div>
        <DoughnutSection />
      </div>

      {/* Bottom section: line chart & recent events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChartSection />
        </div>
        <RecentEventsSection />
      </div>
    </div>
  </AdminContainer>
)

export default DashboardPage






// "use client"
// import React from 'react'
// import AdminContainer from '@/components/admin/AdminContainer'
// import StatCardGroup from '@/components/admin/dashboard/StatCardGroup'
// import DoughnutSection from '@/components/admin/dashboard/DoughnutSection'
// import LineChartSection from '@/components/admin/dashboard/LineChartSection'
// import RecentEventsSection from '@/components/admin/dashboard/RecentEventsSection'

// const DashboardPage: React.FC = () => (
//   <AdminContainer>
//     <div className="space-y-6">
//       <StatCardGroup />
//       <DoughnutSection />
//       <LineChartSection />
//       <RecentEventsSection />
//     </div>
//   </AdminContainer>
// )

// export default DashboardPage
































// "use client"

// import React from 'react'
// import AdminContainer from '@/components/admin/AdminContainer'
// import { FiShoppingCart, FiUser } from 'react-icons/fi'
// import { HiOutlineCube } from 'react-icons/hi'
// import { Doughnut, Line } from 'react-chartjs-2'
// import 'chart.js/auto'

// // Dummy data for charts
// const doughnutData = {
//   labels: ['Completed', 'Shipped', 'Pending'],
//   datasets: [
//     {
//       data: [65.8, 20.5, 35.9],
//       backgroundColor: ['#7E1526', '#FFD529', '#E5E7EB'],
//       hoverOffset: 4,
//       cutout: '70%',
//     },
//   ],
// }

// const lineData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//   datasets: [
//     {
//       label: 'Net Sales',
//       data: [42, 45, 43, 51, 47, 50, 55],
//       borderColor: '#7E1526',
//       tension: 0.4,
//       fill: false,
//     },
//   ],
// }

// // Recent events data
// const recentEvents = [
//   {
//     id: 1,
//     title: 'James & Jane Wedding Anniversary 2025',
//     date: '12 MAR, 2025 AT 10:30AM WAT',
//     image: '/images/event1.png',
//   },
//   {
//     id: 2,
//     title: 'James & Jane Wedding Anniversary 2025',
//     date: '12 MAR, 2025 AT 10:30AM WAT',
//     image: '/images/event1.png',
//   },
// ]

// const Dashboard: React.FC = () => {
//   return (
//     <AdminContainer>
//       <div className="space-y-6">
//         {/* Top section: small cards and donut */}
        // <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        //   {/* Small cards group */}
        //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
        //     {/* Total Order */}
        //     <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        //       <div className="flex items-center text-gray-700">
        //         <FiShoppingCart size={20} />
        //         <span className="ml-2 font-medium">Total Order</span>
        //       </div>
        //       <h2 className="mt-4 text-3xl font-bold text-gray-900">1,256</h2>
        //       <p className="mt-auto text-green-500 font-medium">+ 1.0% from last week</p>
        //     </div>
        //     {/* Service Fee */}
        //     <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        //       <div className="flex items-center text-gray-700">
        //         <HiOutlineCube size={20} />
        //         <span className="ml-2 font-medium">Service Fee</span>
        //       </div>
        //       <h2 className="mt-4 text-3xl font-bold text-gray-900">₦14.23M</h2>
        //       <p className="mt-auto text-green-500 font-medium">+ 5.4% from last week</p>
        //     </div>
        //     {/* Total Events */}
        //     <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        //       <div className="flex items-center text-gray-700">
        //         <FiUser size={20} />
        //         <span className="ml-2 font-medium">Total Events</span>
        //       </div>
        //       <h2 className="mt-4 text-3xl font-bold text-gray-900">1,786</h2>
        //       <p className="mt-auto text-green-500 font-medium">+ 3.9% from last week</p>
        //     </div>
        //     {/* Total Host */}
        //     <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        //       <div className="flex items-center text-gray-700">
        //         <FiUser size={20} />
        //         <span className="ml-2 font-medium">Total Host</span>
        //       </div>
        //       <h2 className="mt-4 text-3xl font-bold text-gray-900">786</h2>
        //       <p className="mt-auto text-green-500 font-medium">+ 3.9% from last week</p>
        //     </div>
        //   </div>

//           {/* Donut chart */}
//           <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium text-gray-900">Order Stats</h3>
//               <select className="text-sm text-gray-500">
//                 <option>Month</option>
//               </select>
//             </div>
//             <div className="flex-1 flex items-center justify-center py-4">
//               <Doughnut data={doughnutData} />
//             </div>
//             <ul className="mt-4 space-y-2">
//               <li className="flex items-center justify-between">
//                 <span className="flex items-center">
//                   <span className="inline-block w-3 h-3 rounded-full bg-[#7E1526] mr-2"></span>
//                   Completed
//                 </span>
//                 <span className="text-gray-900">65.8%</span>
//               </li>
//               <li className="flex items-center justify-between">
//                 <span className="flex items-center">
//                   <span className="inline-block w-3 h-3 rounded-full bg-[#FFD529] mr-2"></span>
//                   Shipped
//                 </span>
//                 <span className="text-gray-900">20.5%</span>
//               </li>
//               <li className="flex items-center justify-between">
//                 <span className="flex items-center">
//                   <span className="inline-block w-3 h-3 rounded-full bg-[#E5E7EB] mr-2"></span>
//                   Pending
//                 </span>
//                 <span className="text-gray-500">35.9%</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom section: line chart and recent events */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Line chart */}
//           <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium text-gray-900">Overall sales</h3>
//               <div className="flex items-center space-x-2">
//                 <span className="text-2xl font-bold text-[#7E1526]">₦131.49M</span>
//                 <span className="text-lg font-semibold text-gray-500">$1.23k</span>
//                 <button className="flex items-center border border-gray-200 rounded-md px-3 py-1 text-sm">
//                   Monthly
//                   <svg className="ml-1" width="16" height="16" fill="none"><path d="M4 6l4 4 4-4" stroke="#4B5563"/></svg>
//                 </button>
//               </div>
//             </div>
//             <div className="mt-4">
//               <Line data={lineData} />
//             </div>
//           </div>

//           {/* Recent events */}
//           <div className="bg-white rounded-2xl shadow p-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
//               <a href="#" className="text-red-600 text-sm font-medium">See All</a>
//             </div>
//             <div className="mt-4 space-y-4">
//               {recentEvents.map(event => (
//                 <div key={event.id} className="flex items-center space-x-4">
//                   <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-900">{event.title}</h4>
//                     <p className="text-gray-500 text-sm flex items-center">
//                       <svg className="inline-block mr-1" width="16" height="16"><path d="M8 2v12M2 8h12" stroke="#9CA3AF"/></svg>
//                       {event.date}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </AdminContainer>
//   )
// }

// export default Dashboard
