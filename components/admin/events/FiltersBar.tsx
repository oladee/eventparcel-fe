import React from 'react'
import { FiChevronDown, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'

const FiltersBar: React.FC = () => (
  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
    <div className="flex items-center bg-white rounded-2xl shadow px-4 py-2">
      <span className="text-gray-500">Show:</span>
      <select className="ml-2 text-black font-medium border-none focus:ring-0">
        <option>All Events</option>
      </select>
      <FiChevronDown className="ml-1 text-gray-500" />
    </div>

    <div className="flex-1 flex items-center bg-white rounded-2xl shadow px-4 py-2">
      <FiSearch className="text-gray-400" />
      <input
        type="text"
        placeholder="Search by name, email, or others..."
        className="ml-2 w-full border-none focus:ring-0"
      />
    </div>

    <button className="flex items-center bg-white rounded-2xl shadow px-4 py-2 text-gray-700">
      <FiFilter className="mr-2" />
      Filters
    </button>

    <button className="flex items-center bg-white rounded-2xl shadow px-4 py-2 text-gray-700">
      <FiDownload className="mr-2" />
      Export
      <FiChevronDown className="ml-1" />
    </button>
  </div>
)

export default FiltersBar