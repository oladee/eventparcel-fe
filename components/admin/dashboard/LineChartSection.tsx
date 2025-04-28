import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

const data = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
  datasets: [{ label: 'Net Sales', data: [42,45,43,51,47,50,55], borderColor: '#7E1526', tension: 0.4, fill: false }],
}

const LineChartSection: React.FC = () => (
  <div className="bg-white rounded-2xl shadow p-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Overall Sales</h3>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-[#7E1526]">₦131.49M</span>
        <span className="text-lg font-semibold text-gray-500">$1.23k</span>
        <button className="flex items-center border border-gray-200 rounded-md px-3 py-1 text-sm">
          Monthly
          <svg className="ml-1" width="16" height="16" fill="none"><path d="M4 6l4 4 4-4" stroke="#4B5563"/></svg>
        </button>
      </div>
    </div>
    <div className="mt-4 h-64"><Line data={data} /></div>
  </div>
)
export default LineChartSection
