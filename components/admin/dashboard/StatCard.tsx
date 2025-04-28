import React from 'react'
interface Props { icon: React.ReactNode; label: string; value: string; delta: string }
const StatCard: React.FC<Props> = ({ icon, label, value, delta }) => (
  <div className="bg-white rounded-2xl shadow pt-3 pb-4 px-3 flex flex-col ">
    <div className="flex items-center text-primary border-b border-[#EEEFF2] p-2">
      {icon}
      <span className="ml-2 font-semibold text-[#111827]">{label}</span>
    </div>
    <h2 className="mt-4 text-2xl font-bold text-[#111827]">{value}</h2>
    <p className="mt-auto text-green-500 font-medium text-sm">{delta} <span className='text-[#718096]'>from last week</span></p>
  </div>
)
export default StatCard