"use client"
import React, { useEffect, useState, useMemo } from 'react'
import AdminContainer from '@/components/admin/AdminContainer'
import FiltersBar from '@/components/admin/events/FiltersBar'
import EventCard from '@/components/admin/events/EventCard'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BiLoaderCircle } from 'react-icons/bi'
import { FiSearch } from 'react-icons/fi'
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'

interface SalesSummary { currency: string; totalSales: number; totalPackagesSold: number }
interface EventItem {
  _id: number
  eventName: string
  eventImgUrl: string
  date: string
  time: string
  eventLocation: string
  salesSummary: SalesSummary[]
}
interface CardProps {
  id: number
  image: string
  title: string
  dateLabel: string
  location: string
  sales: string
  packagesSold: number
}

const GridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
    ))}
  </div>
)

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CardProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    axiosInstance.get('/admin-events')
      .then(res => {
        if (res.data.success) {
          const mapped = (res.data.data as EventItem[]).map(evt => {
            const naira = evt.salesSummary.find(s => s.currency === 'NGN')
            const usd = evt.salesSummary.find(s => s.currency === 'USD')
            const salesStr = [
              naira ? `₦${naira.totalSales.toLocaleString()}` : null,
              usd && usd.totalPackagesSold > 0 ? `$${usd.totalSales.toLocaleString()}` : null
            ].filter((s): s is string => Boolean(s)).join(' - ')
            const totalPackages = (naira?.totalPackagesSold ?? 0) + (usd?.totalPackagesSold ?? 0)
            return {
              id: evt._id,
              image: evt.eventImgUrl || '/images/placeholder_eventCover2.jpg',
              title: evt.eventName,
              dateLabel: `${new Date(evt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} AT ${evt.time}`,
              location: evt.eventLocation,
              sales: salesStr || '₦0',
              packagesSold: totalPackages
            }
          })
          setEvents(mapped)
          console.log(res.data.message)
        } else {
          throw new Error(res.data.message)
        }
      })
      .catch(err => {
        const msg = err.message || 'Network error'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredEvents = useMemo(
    () => events.filter(e =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [events, searchTerm]
  )

  if (!loading && error) {
    return (
      <AdminContainer>
        <div className="p-6 text-red-600 flex items-center">
          <BiLoaderCircle className="mr-2 animate-spin" size={22} />{error}
        </div>
      </AdminContainer>
    )
  }

  return (
    <AdminContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-6 p-6">
        <FiltersBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {loading ? (
          <GridSkeleton />
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(e => (
              <EventCard
                key={e.id}
                id={e.id}
                image={e.image}
                title={e.title}
                date={e.dateLabel}
                location={e.location}
                sales={e.sales}
                packagesSold={e.packagesSold}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <FiSearch className="text-gray-500" size={30} />
            <p className="text-xl font-semibold text-gray-700">
              No events found for “{searchTerm}”
            </p>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </AdminContainer>
  )
}

export default EventsPage





















// // ===== EventsPage.tsx =====
// "use client"
// import React, { useEffect, useState } from 'react'
// import AdminContainer from '@/components/admin/AdminContainer'
// import FiltersBar from '@/components/admin/events/FiltersBar'
// import EventCard from '@/components/admin/events/EventCard'
// import axiosInstance from '@/lib/axiosInstance'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { BiLoaderCircle } from 'react-icons/bi'

// // API Response Types
// interface SalesSummary { currency: string; totalSales: number; totalPackagesSold: number }
// interface EventItem {
//   _id: string
//   eventName: string
//   eventImgUrl: string
//   date: string
//   time: string
//   eventLocation: string
//   salesSummary: SalesSummary[]
// }

// // Props passed to EventCard
// interface CardProps {
//   id: string
//   image: string
//   title: string
//   dateLabel: string
//   location: string
//   sales: string
//   packagesSold: number
// }

// // Simple skeleton loader for grid
// const GridSkeleton: React.FC = () => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
//     ))}
//   </div>
// )

// const EventsPage: React.FC = () => {
//   const [events, setEvents] = useState<CardProps[]>([])
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     setLoading(true)
//     axiosInstance.get('/admin-events')
//       .then(res => {
//         if (res.data.success) {
//           const mapped = (res.data.data as EventItem[]).map(evt => {
//             // format sales: NGN + USD
//             const naira = evt.salesSummary.find(s => s.currency === 'NGN')
//             const usd = evt.salesSummary.find(s => s.currency === 'USD')
//             const salesStr = [
//               naira && `₦${naira.totalSales.toLocaleString()}`,
//               usd && usd.totalPackagesSold > 0 ? `$${usd.totalSales.toLocaleString()}` : null
//             ].filter(Boolean).join(' - ')
//             const totalPackages = naira?.totalPackagesSold ?? 0 + usd?.totalPackagesSold ?? 0
//             return {
//               id: evt._id,
//               image: evt.eventImgUrl || '/images/placeholder_eventCover2.jpg',
//               title: evt.eventName,
//               dateLabel: `${new Date(evt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} AT ${evt.time}`,
//               location: evt.eventLocation,
//               sales: salesStr || '₦0',
//               packagesSold: totalPackages
//             }
//           })
//           setEvents(mapped)
//           console.log(res.data.message)
//         } else {
//           throw new Error(res.data.message)
//         }
//       })
//       .catch(err => {
//         const msg = err.message || 'Network error'
//         setError(msg)
//         toast.error(msg)
//       })
//       .finally(() => setLoading(false))
//   }, [])

//   // Basic validation: if no events
//   if (!loading && error) {
//     return (
//       <AdminContainer>
//         <div className="p-6 text-red-600 flex items-center">
//           <BiLoaderCircle className="mr-2 animate-spin" size={22} />{error}
//         </div>
//       </AdminContainer>
//     )
//   }

//   return (
//     <AdminContainer>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="space-y-6 p-6">
//         <FiltersBar />
//         {loading ? (
//           <GridSkeleton />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {events.map(e => (
//               <EventCard
//                 key={e.id}
//                 id={e.id}
//                 image={e.image}
//                 title={e.title}
//                 date={e.dateLabel}
//                 location={e.location}
//                 sales={e.sales}
//                 packagesSold={e.packagesSold}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </AdminContainer>
//   )
// }

// export default EventsPage



































// import React from 'react'
// import AdminContainer from '@/components/admin/AdminContainer'
// import FiltersBar from '@/components/admin/events/FiltersBar'
// import EventCard from '@/components/admin/events/EventCard'
// import axiosInstance from '@/lib/axiosInstance'

// // Sample event data
// type Event = {
//   id: number
//   image: string
//   title: string
//   date: string
//   location: string
//   sales: string
//   packagesSold: number
// }

// const events: Event[] = [
//   {
//     id: 1,
//     image: '/images/placeholder_eventCover2.jpg',
//     title: 'James & Jane Wedding Anniversary 2025',
//     date: '12 MAR, 2025 AT 10:30AM WAT',
//     location: 'Jaja Hall, 18 Olumo Street, Onike, Yaba, Lagos.',
//     sales: '₦13.49M',
//     packagesSold: 164,
//   },
//   {
//     id: 2,
//     image: '/images/placeholder_eventCover2.jpg',
//     title: 'Lorem & Ipsum Wedding Ceremony',
//     date: '17 JUL, 2021 AT 02:00PM WAT',
//     location: 'Riverside Venue, Banana Island, Lagos.',
//     sales: '₦61.49M - $964',
//     packagesSold: 36,
//   },
//   {
//     id: 3,
//     image: '/images/placeholder_eventCover2.jpg',
//     title: 'James & Jane Wedding Anniversary 2025',
//     date: '12 MAR, 2025 AT 10:30AM WAT',
//     location: 'Jaja Hall, 18 Olumo Street, Onike, Yaba, Lagos.',
//     sales: '₦13.49M',
//     packagesSold: 164,
//   },
//   {
//     id: 4,
//     image: '/images/placeholder_eventCover2.jpg',
//     title: 'James & Jane Wedding Anniversary 2025',
//     date: '12 MAR, 2025 AT 10:30AM WAT',
//     location: 'Jaja Hall, 18 Olumo Street, Onike, Yaba, Lagos.',
//     sales: '₦13.49M',
//     packagesSold: 164,
//   },
// ]

// const EventsPage: React.FC = () => (
//   <AdminContainer>
//     <div className="space-y-6">
//       <FiltersBar />
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map(event => (
//           <EventCard key={event.id} {...event} />
//         ))}
//       </div>
//     </div>
//   </AdminContainer>
// )

// export default EventsPage