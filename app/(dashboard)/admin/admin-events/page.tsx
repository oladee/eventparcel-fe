import AdminContainer from '@/components/admin/AdminContainer'
import React from 'react'

const page = () => {
  return (
   <AdminContainer>
    <p>This Page Is Coming Soon</p>
   </AdminContainer>
  )
}

export default page

















// import React from 'react'
// import AdminContainer from '@/components/admin/AdminContainer'
// import FiltersBar from '@/components/admin/events/FiltersBar'
// import EventCard from '@/components/admin/events/EventCard'

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