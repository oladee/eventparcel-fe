import React from 'react'
// import { FiInfo } from 'react-icons/fi'
import StatsCard from './StatsCard'

const data = [
  { title: 'Overall sales', value: '₦131.49M', delta: '+12.0% from last month', highlight: true },
  { title: 'Total Order', value: '245', delta: '+1.5% from last month' },
  { title: 'Total Invites', value: '650', delta: '65% view rate' },
]

const StatsCardGroup: React.FC = () => (
  <div className="grid grid-cols-1 gap-6">
    {data.map((d, i) => (
      <StatsCard key={i} {...d} />
    ))}
  </div>
)
export default StatsCardGroup