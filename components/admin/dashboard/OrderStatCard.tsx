import React from 'react'

interface Props { icon: React.ReactNode; label: string; value: string; delta: string, subtext:string }
const StatCard: React.FC<Props> = ({ icon, label, value, delta, subtext }) => (
  

   <div id="stats-grid" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="w-[163px] lg:w-[253px] h-[121px] lg:h-[165px] bg-[#FFFFFF] shadow-sm p-3 rounded-[12px]"
        >
          <div id={`stat-header`} className='flex items-center gap-2 text-primary'>
              {icon}
            <p id={`stat-title`} className="font-general font-semibold text-xs lg:text-sm text-[#111827]">
              {label}
            </p>
          </div>
          <div id={`stat-divider`} className="border-t border-[#EEEFF2] my-3 mb-1 lg:mb-10"></div>
          <p id={`stat-count`} className="text-2xl font-bold text-[#111827]">{value}</p>
          <p 
            id={`stat-change`}
            className={`text-xs font-general font-normal mt-1`}
            >
         <p className="mt-auto text-green-500 font-medium text-sm">{delta} <span className='text-[#718096]'>{subtext}</span></p>  </p>
        </div>
    </div>
)
export default StatCard



// <div className="bg-white rounded-2xl pt-3 pb-4 px-3 flex flex-col justify-between w-[253px] h-[165px] ">
//   <div className="flex items-center text-primary border-b border-[#EEEFF2] p-2">
//     {icon}
//     <span className="ml-2 font-semibold text-[#111827]">{label}</span>
//   </div>
//   <div className='mb-3'>
//     <h2 className="mt-4 text-2xl font-bold text-[#111827]">{value}</h2>
//     <p className="mt-auto text-green-500 font-medium text-sm">{delta} <span className='text-[#718096]'>{subtext}</span></p>
//   </div>
// </div>