import React from 'react'

interface Props { icon: React.ReactNode; label: string; value: string; delta: string, subtext:string }
const DeliveryStatCard: React.FC<Props> = ({ icon, label, value, delta, subtext }) => (
  
        <div 
          className="w-[163px] lg:w-[300px] xl:w-[347px] h-[121px] lg:h-[165px] bg-[#FFFFFF] shadow-sm p-3 rounded-[12px]"
        >
          <div id={`stat-header`} className='flex items-center gap-2 text-primary'>
              {icon}
            <p id={`stat-title`} className="font-general font-semibold text-xs lg:text-sm text-[#111827]">
              {label}
            </p>
          </div>
          <div id={`stat-divider`} className="border-t border-[#EEEFF2] my-3 mb-1 lg:mb-10"></div>
          <p id={`stat-count`} className="text-2xl font-bold text-[#111827]">{value}</p>
          <div 
            id={`stat-change`}
            className={`text-xs font-general font-normal mt-1`}
            >
            <p className={`mt-auto font-medium text-sm ${delta.startsWith("-") ? "text-red-500" : "text-green-500"}`}>
              {delta} <span className="text-[#718096]">{subtext}</span>
            </p>
        </div>
        </div>
)
export default DeliveryStatCard
