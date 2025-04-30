import React from 'react'
import GroupCard, { Props } from './GroupCard' 

const groups: Props[] = [ // Add type annotation
  { 
    id: 1, 
    type: 'General', 
    title: 'General Aso Ebi', 
    desc: 'This is the general aso ebi for everyone who is not a family member', 
    sales: '₦13.49M', 
    sold: 164, 
    inStock: 20 
  },
  { 
    id: 2, 
    type: 'Private', 
    title: 'Olawale Aso Ebi', 
    desc: 'This is the Olawale aso ebi for everyone who is a family member of Olawale', 
    sales: '₦13.49M', 
    sold: 164 
  },
]
// const groups = [
//   { id:1, type:'General', title:'General Aso Ebi', desc:'This is the general aso ebi for everyone who is not a family member', sales:'₦13.49M', sold:164, inStock:20 },
//   { id:2, type:'Private', title:'Olawale Aso Ebi', desc:'This is the Olawale aso ebi for everyone who is a family member of Olawale', sales:'₦13.49M', sold:164 },
// ]

const GroupsTab: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {groups.map(g => <GroupCard key={g.id} {...g} />)}
  </div>
)

export default GroupsTab