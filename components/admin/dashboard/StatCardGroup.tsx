import React from "react";
import StatCard from "./StatCard";
import { FiUser } from "react-icons/fi";
import { PiPackageBold, PiShoppingCartBold } from "react-icons/pi";

const stats = [
  {
    icon: <PiShoppingCartBold size={20} />,
    label: "Total Order",
    value: "1,256",
    delta: "+ 1.0%"
  },
  {
    icon: <PiPackageBold size={20} />,
    label: "Service Fee",
    value: "₦14.23M",
    delta: "+ 5.4%"
  },
  {
    icon: <FiUser size={20} />,
    label: "Total Events",
    value: "1,786",
    delta: "+ 3.9%"
  },
  {
    icon: <FiUser size={20} />,
    label: "Total Host",
    value: "786",
    delta: "+ 3.9%"
  }
];
const StatCardGroup: React.FC = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
      {stats.map((s, i) => (
        <StatCard
          key={i}
          icon={s.icon}
          label={s.label}
          value={s.value}
          delta={s.delta}
        />
      ))}
    </div>
  </>
);

export default StatCardGroup;









// import React from 'react'
// import StatCard from './StatCard'
// import { FiShoppingCart, FiUser } from 'react-icons/fi'
// import { HiOutlineCube } from 'react-icons/hi'

// const stats = [
//   { icon: <FiShoppingCart size={20} />, label: 'Total Order', value: '1,256', delta: '+ 1.0%' },
//   { icon: <HiOutlineCube size={20} />, label: 'Service Fee', value: '₦14.23M', delta: '+ 5.4%' },
//   { icon: <FiUser size={20} />, label: 'Total Events', value: '1,786', delta: '+ 3.9%' },
//   { icon: <FiUser size={20} />, label: 'Total Host', value: '786', delta: '+ 3.9%' },
// ]

// const StatCardGroup: React.FC = () => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// {stats.map((s, i) => (
//   <StatCard key={i} icon={s.icon} label={s.label} value={s.value} delta={s.delta} />
// ))}
//   </div>
// )

// export default StatCardGroup
