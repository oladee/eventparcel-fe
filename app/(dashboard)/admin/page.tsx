"use client"
import React, { useEffect, useState } from 'react'
import AdminContainer from '@/components/admin/AdminContainer'
import StatCardGroup from '@/components/admin/dashboard/StatCardGroup'
import DoughnutSection from '@/components/admin/dashboard/DoughnutSection'
import LineChartSection from '@/components/admin/dashboard/LineChartSection'
import RecentEventsSection from '@/components/admin/dashboard/RecentEventsSection'
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BiLoaderCircle } from 'react-icons/bi'

// Local skeleton for page-level loading
const PageSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-52 bg-gray-200 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-gray-200 rounded-[18px]" />
      <div className="h-80 bg-gray-200 rounded-2xl" />
    </div>
  </div>
)

// ---------------- TYPE DEFINITIONS ----------------
interface CurrencySales {
  totalAmount: number
  growthRate: number
  // growthRateDaily: number
  monthlySales: { month: string; sales: number }[]
  dailySales: { day: string; sales: number }[]
}

interface EventItem {
  _id: string
  eventName: string
  eventImgUrl: string
  date: string
  time: string
  eventLocation: string
}

interface DashboardData {
  totalOrder: { value: number; growth: number }
  totalEvents: { value: number; growth: number }
  totalHosts: { value: number; growth: number }
  totalServiceFees: { value: number; growth: number }
  orderStats: { completed: number; shipped: number; pending: number }
  overallSales: { naira: CurrencySales; dollar: CurrencySales }
  recentEvents: EventItem[]
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get('/admin-dashboard')
      .then(res => {
        if (res.data.success) {
          setData(res.data.data)
          console.log(res.data.message)
        } else {
          const msg = res.data.message || 'Failed to load dashboard'
          setError(msg)
          toast.error(msg)
        }
      })
      .catch(err => {
        const msg = err.response?.data?.message || 'Network error'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Show page skeleton while loading
  if (loading) return <PageSkeleton />

  // Show spinner with text if API error
  if (error && !data) return (
    <div className="flex items-center justify-center h-full p-4 text-red-600">
      <BiLoaderCircle className="mr-2 animate-spin" size={22} />
      {error}
    </div>
  )

  if (!data) return <div className="p-4 text-gray-600">No data available</div>

    function formatCurrencyShort(amount?: number): string {
    if (typeof amount !== 'number') return '0';
  
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (amount >= 1_000) {
      return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return amount.toString();
  }

  return (
    <AdminContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-6 p-6">
        {/* Top panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
            <StatCardGroup stats={[
              { label: 'Total Order', value: data.totalOrder.value.toLocaleString(), delta: `${data.totalOrder.growth}%` },
              { label: 'Service Fee', value: `₦${formatCurrencyShort(data.totalServiceFees.value)}`, delta: `${data.totalServiceFees.growth}%` },
              { label: 'Total Events', value: data.totalEvents.value.toLocaleString(), delta: `${data.totalEvents.growth}%` },
              { label: 'Total Host', value: data.totalHosts.value.toLocaleString(), delta: `${data.totalHosts.growth}%` }
            ]} />
          </div>
          <DoughnutSection orderStats={data.orderStats} />
        </div>

        {/* Bottom charts & events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LineChartSection />
          </div>
          <RecentEventsSection events={data.recentEvents} />
        </div>
      </div>  
    </AdminContainer>
  )
}

export default DashboardPage




















// "use client"
// import React, { useEffect, useState } from 'react'
// import AdminContainer from '@/components/admin/AdminContainer'
// import StatCardGroup from '@/components/admin/dashboard/StatCardGroup'
// import DoughnutSection from '@/components/admin/dashboard/DoughnutSection'
// import LineChartSection from '@/components/admin/dashboard/LineChartSection'
// import RecentEventsSection from '@/components/admin/dashboard/RecentEventsSection'
// import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { BiLoaderCircle } from 'react-icons/bi'

// // Local skeleton for page-level loading
// const PageSkeleton: React.FC = () => (
//   <div className="p-6 space-y-6 animate-pulse">
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
//         ))}
//       </div>
//       <div className="h-52 bg-gray-200 rounded-2xl" />
//     </div>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2 h-80 bg-gray-200 rounded-[18px]" />
//       <div className="h-80 bg-gray-200 rounded-2xl" />
//     </div>
//   </div>
// )

// // ---------------- TYPE DEFINITIONS ----------------
// interface CurrencySales {
//   totalAmount: number
//   growthRate: number
//   // growthRateDaily: number
//   monthlySales: { month: string; sales: number }[]
//   dailySales: { day: string; sales: number }[]
// }

// interface EventItem {
//   _id: string
//   eventName: string
//   eventImgUrl: string
//   date: string
//   time: string
//   eventLocation: string
// }

// interface DashboardData {
//   totalOrder: { value: number; growth: number }
//   totalEvents: { value: number; growth: number }
//   totalHosts: { value: number; growth: number }
//   totalServiceFees: { value: number; growth: number }
//   orderStats: { completed: number; shipped: number; pending: number }
//   overallSales: { naira: CurrencySales; dollar: CurrencySales }
//   recentEvents: EventItem[]
// }

// const DashboardPage: React.FC = () => {
//   const [data, setData] = useState<DashboardData | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     setLoading(true)
//     axiosInstance
//       .get('/admin-dashboard')
//       .then(res => {
//         if (res.data.success) {
//           setData(res.data.data)
//           console.log(res.data.message)
//         } else {
//           const msg = res.data.message || 'Failed to load dashboard'
//           setError(msg)
//           toast.error(msg)
//         }
//       })
//       .catch(err => {
//         const msg = err.response?.data?.message || 'Network error'
//         setError(msg)
//         toast.error(msg)
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }, [])

//   // Show page skeleton while loading
//   if (loading) return <PageSkeleton />

//   // Show spinner with text if API error
//   if (error && !data) return (
//     <div className="flex items-center justify-center h-full p-4 text-red-600">
//       <BiLoaderCircle className="mr-2 animate-spin" size={22} />
//       {error}
//     </div>
//   )

//   if (!data) return <div className="p-4 text-gray-600">No data available</div>

//     function formatCurrencyShort(amount?: number): string {
//     if (typeof amount !== 'number') return '0';
  
//     if (amount >= 1_000_000) {
//       return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
//     }
//     if (amount >= 1_000) {
//       return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
//     }
//     return amount.toString();
//   }

//   return (
//     <AdminContainer>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="space-y-6 p-6">
//         {/* Top panels */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
//             <StatCardGroup stats={[
//               { label: 'Total Order', value: data.totalOrder.value.toLocaleString(), delta: `${data.totalOrder.growth}%` },
//               { label: 'Service Fee', value: `₦${data.totalServiceFees.value.toLocaleString()}`, delta: `${data.totalServiceFees.growth}%` },
//               { label: 'Total Events', value: data.totalEvents.value.toLocaleString(), delta: `${data.totalEvents.growth}%` },
//               { label: 'Total Host', value: data.totalHosts.value.toLocaleString(), delta: `${data.totalHosts.growth}%` }
//             ]} />
//           </div>
//           <DoughnutSection orderStats={data.orderStats} />
//         </div>

//         {/* Bottom charts & events */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <LineChartSection />
//           </div>
//           <RecentEventsSection events={data.recentEvents} />
//         </div>
//       </div>  
//     </AdminContainer>
//   )
// }

// export default DashboardPage