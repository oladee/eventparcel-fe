import React from 'react'
import StatCard from './StatCard'
import { PiPackageBold, PiShoppingCartBold } from 'react-icons/pi'
import { FiUser } from 'react-icons/fi'

interface Stat {
  label: string; value: string; delta: string
}
interface Props { stats: Stat[] }

const StatCardGroup: React.FC<Props> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> */}
    {stats.map((s,i) => (
      <StatCard key={i} icon={
        {
          'Total Order': <PiShoppingCartBold size={20} />, 
          'Service Fee': <PiPackageBold size={20} />, 
          'Total Events': <FiUser size={20} />, 
          'Total Host': <FiUser size={20} />
        }[s.label]
      } label={s.label} value={s.value} delta={s.delta} />
    ))}
  </div>
)
export default StatCardGroup























// import React from "react";
// import StatCard from "./StatCard";
// import { FiUser } from "react-icons/fi";
// import { PiPackageBold, PiShoppingCartBold } from "react-icons/pi";

// const stats = [
//   {
//     icon: <PiShoppingCartBold size={20} />,
//     label: "Total Order",
//     value: "1,256",
//     delta: "+ 1.0%"
//   },
//   {
//     icon: <PiPackageBold size={20} />,
//     label: "Service Fee",
//     value: "₦14.23M",
//     delta: "+ 5.4%"
//   },
//   {
//     icon: <FiUser size={20} />,
//     label: "Total Events",
//     value: "1,786",
//     delta: "+ 3.9%"
//   },
//   {
//     icon: <FiUser size={20} />,
//     label: "Total Host",
//     value: "786",
//     delta: "+ 3.9%"
//   }
// ];
// const StatCardGroup: React.FC = () => (
//   <>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
//       {stats.map((s, i) => (
//         <StatCard
//           key={i}
//           icon={s.icon}
//           label={s.label}
//           value={s.value}
//           delta={s.delta}
//         />
//       ))}
//     </div>
//   </>
// );

// export default StatCardGroup;