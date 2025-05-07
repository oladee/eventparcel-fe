"use client"
import React from "react"
import GroupCard, { Package } from "./GroupCard"

export interface HostEvent {
  _id: string
  eventName: string
  // we only care about the packages inside each eventGroups
  eventGroups: {
    _id: string
    packages: Package[]
  }[]
}

interface GroupsTabsProps {
  groups: HostEvent[]
}

const GroupTabs: React.FC<GroupsTabsProps> = ({ groups }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {groups.map(evt =>
      // flatten each event's groups into cards
      evt.eventGroups.map(grp => (
        <GroupCard
          key={grp._id}
          id={grp._id}
          title={evt.eventName}
          packages={grp.packages}
        />
      ))
    )}
  </div>
)

export default GroupTabs
















// // components/admin/hostDetails/GroupTabs.tsx
// "use client";

// import React from "react";
// import GroupCard from "./GroupCard";
// // import GroupCard, { Package } from "../eventDetails/GroupCard";

// // ——— put this at the top of the file ———
// interface HostEvent {
//   _id: string;
//   eventName: string;
//   eventGroups: {
//     _id: string;
//     packages: Package[];
//   }[];
//   salesSummary: {
//     currency: string;
//     totalSales: number;
//     totalPackagesSold: number;
//   }[];
// }

// interface GroupsTabsProps {
//   groups: HostEvent[];    // use it here
// }

// const GroupsTabs: React.FC<GroupsTabsProps> = ({ groups }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//       {groups.map((evt) => {
//         const pkgs = evt.eventGroups[0]?.packages || [];
//         const ngn = evt.salesSummary.find((s) => s.currency === "NGN");
//         const totalSales = ngn?.totalSales ?? 0;
//         const totalSold = ngn?.totalPackagesSold ?? 0;

//         return (
//           <GroupCard
//             key={evt._id}
//             id={evt._id}
//             type="General"
//             title={evt.eventName}
//             desc={`${totalSold} packages sold`}
//             sales={`₦${totalSales.toLocaleString()}`}
//             sold={totalSold}
//             inStock={undefined}
//             packages={pkgs}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default GroupsTabs;














// // components/admin/eventDetails/GroupsTabs.tsx
// "use client";
// import React from "react";
// import GroupCard, { Package } from "./GroupCard";

// export interface Event {
//   _id: string;
//   eventName: string;
//   eventImgUrl: string;
//   // only need salesSummary for cards
//   salesSummary: {
//     currency: string;
//     totalSales: number;
//     totalPackagesSold: number;
//   }[];
//   // you can add other fields if needed
// }

// interface GroupsTabsProps {
//   events: Event[];
// }

// const GroupsTabs: React.FC<GroupsTabsProps> = ({ events }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//       {events.map((evt) => {
//         // find NGN or fallback
//         const ngn = evt.salesSummary.find((s) => s.currency === "NGN") ?? evt.salesSummary[0];
//         return (
//           <GroupCard
//             key={evt._id}
//             id={evt._id}
//             type="General" /* or derive from evt if you have a privacy field */
//             title={evt.eventName}
//             desc={`Sold ${ngn.totalPackagesSold} packages`}
//             sales={`₦${ngn.totalSales.toLocaleString()}`}
//             sold={ngn.totalPackagesSold}
//             inStock={0} /* or derive if you have a quantity field */
//             packages={[]} /* if your GroupCard now expects packages: replace with evt.packages if present */
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default GroupsTabs;











// // components/GroupsTabs.tsx
// "use client";
// import React from "react";
// import GroupCard, { Package } from "./GroupCard";
// // import GroupCard, { Package } from "./GroupCard";

// export interface EventGroup {
//   _id: string;
//   groupName: string;
//   groupDescription: string;
//   groupPrivacy: "general" | "private";
//   packages: Package[];
// }

// interface GroupsTabProps {
//   groups: EventGroup[];
// }

// const GroupsTabs: React.FC<GroupsTabProps> = ({ groups }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//       {groups.map((group, index) => (
//         <GroupCard
//           key={group._id || `group-${index}`}
//           id={group._id}
//           type={group.groupPrivacy === "general" ? "General" : "Private"}
//           title={group.groupName}
//           desc={group.groupDescription}
//           packages={group.packages}
//         />
//       ))}
//     </div>
//   );
// };

// export default GroupsTabs;