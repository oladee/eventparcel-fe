import React from 'react'

interface Props { active: 'Groups' | 'Orders'; onChange: (tab: 'Groups' | 'Orders') => void }
const Tabs: React.FC<Props> = ({ active, onChange }) => (
  <div className="border-b">
    <nav className="flex space-x-8 px-2">
      {(['Groups','Orders'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`py-3 text-sm font-bold outline-none ${active===tab ? 'text-primary border-b-2 border-primary' : 'text-[#718096]'}`}
        >{tab}</button>
      ))}
    </nav>
  </div>
)

export default Tabs