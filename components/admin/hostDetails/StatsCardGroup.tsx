"use client";

import React from "react";
import StatsCard from "./StatsCard";

import { InvitesSummary } from "@/types/host";

interface Props {
  invites: InvitesSummary;
}

const StatsCardGroup: React.FC<Props> = ({ invites }) => {
  const data = [
    {
      title: "Total Invites",
      value: invites.totalInvites.toString(),
      delta: `${invites.viewedRate}% viewed`,
      highlight: false,
    },
    {
      title: "Viewed",
      value: invites.totalViewed.toString(),
      delta: `${invites.viewedRate}%`,
      highlight: false,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-6">
      {data.map((d, i) => (
        <StatsCard key={i} {...d} />
      ))}
    </div>
  );
};

export default StatsCardGroup;


















// import React from 'react'
// // import { FiInfo } from 'react-icons/fi'
// import StatsCard from './StatsCard'

// const data = [
//   { title: 'Overall sales', value: '₦131.49M', delta: '+12.0% from last month', highlight: true },
//   { title: 'Total Order', value: '245', delta: '+1.5% from last month' },
//   { title: 'Total Invites', value: '650', delta: '65% view rate' },
// ]

// const StatsCardGroup: React.FC = () => (
//   <div className="grid grid-cols-1 gap-6">
//     {data.map((d, i) => (
//       <StatsCard key={i} {...d} />
//     ))}
//   </div>
// )
// export default StatsCardGroup