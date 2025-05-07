// components/GroupsTabs.tsx
"use client";
import React from "react";
import GroupCard, { Package } from "./GroupCard";

export interface EventGroup {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupPrivacy: "general" | "private";
  packages: Package[];
}

interface GroupsTabProps {
  groups: EventGroup[];
}

const GroupsTabs: React.FC<GroupsTabProps> = ({ groups }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {groups.map((group, index) => (
        <GroupCard
          key={group._id || `group-${index}`}
          id={group._id}
          type={group.groupPrivacy === "general" ? "General" : "Private"}
          title={group.groupName}
          desc={group.groupDescription}
          packages={group.packages}
        />
      ))}
      {/* {groups.map(group => (
        <GroupCard
          key={group._id}
          id={group._id}
          type={group.groupPrivacy === "general" ? "General" : "Private"}
          title={group.groupName}
          desc={group.groupDescription}
          packages={group.packages}
        />
      ))} */}
    </div>
  );
};

export default GroupsTabs;

// "use client"
// import React from "react"
// import GroupCard from "./GroupCard"

// interface EventGroup {
//   _id: string
//   groupName: string
//   groupDescription: string
//   groupPrivacy: "general" | "private"
//   packages: string[]
// }

// interface GroupsTabProps {
//   groups: EventGroup[]
// }

// const GroupsTabs: React.FC<GroupsTabProps> = ({ groups }) => {
//   console.log(groups)
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//     {groups.map(g => (
//       <GroupCard
//         key={g._id}
//         id={g._id}
//         type={g.groupPrivacy === "general" ? "General" : "Private"}
//         title={g.groupName}
//         desc={g.groupDescription}
//         sales="₦0"     // replace with actual when available
//         sold={0}       // replace with actual when available
//       />
//     ))}
//   </div>
//   )
// }

// export default GroupsTabs

// import React from 'react'
// import GroupCard, { Props } from './GroupCard'

// const groups: Props[] = [ // Add type annotation
//   {
//     id: 1,
//     type: 'General',
//     title: 'General Aso Ebi',
//     desc: 'This is the general aso ebi for everyone who is not a family member',
//     sales: '₦13.49M',
//     sold: 164,
//     inStock: 20
//   },
//   {
//     id: 2,
//     type: 'Private',
//     title: 'Olawale Aso Ebi',
//     desc: 'This is the Olawale aso ebi for everyone who is a family member of Olawale',
//     sales: '₦13.49M',
//     sold: 164
//   },
// ]

// const GroupsTab: React.FC = () => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//     {groups.map(g => <GroupCard key={g.id} {...g} />)}
//   </div>
// )

// export default GroupsTab
