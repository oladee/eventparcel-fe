import React from 'react'
import { FiMoreVertical, FiCalendar } from 'react-icons/fi'

interface Props {
  id: number
  image: string
  title: string
  date: string
  location: string
  sales: string
  packagesSold: number
}

const EventCard: React.FC<Props> = ({ image, title, date, location, sales, packagesSold }) => (
  <div className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
    <div className="relative">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <button className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow">
        <FiMoreVertical />
      </button>
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h3>
      <p className="mt-2 text-gray-500 text-sm flex items-center">
        <FiCalendar className="mr-2" />
        {date}
      </p>
      <p className="text-gray-400 text-sm mt-1">{location}</p>
      <div className="mt-4 border-t pt-4 flex items-center justify-between">
        <div>
          <span className="text-red-700 font-bold text-lg">{sales}</span>
          <p className="text-gray-500 text-xs">Overall sales</p>
        </div>
        <div className="border-l pl-4">
          <span className="text-gray-900 font-bold text-lg">{packagesSold}</span>
          <p className="text-gray-500 text-xs">Package Sold</p>
        </div>
      </div>
    </div>
  </div>
)

export default EventCard