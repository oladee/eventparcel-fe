"use client";

import React from "react";
import OverviewHeader from "./OverviewHeader";
import StatsCardGroup from "./StatsCardGroup";
import ChartSection from "./ChartSection";

import { OverviewData } from "@/types/host"; 

interface Props {
  overview: OverviewData;
}

const OverviewDashboard: React.FC<Props> = ({ overview }) => (
  <div className="space-y-6 bg-white p-4 rounded-2xl">
    <OverviewHeader summary={overview.ordersSummary} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <StatsCardGroup invites={overview.invitesSummary} />
      <div className="lg:col-span-2">
        <ChartSection
          naira={overview.nairaSales}
          dollar={overview.dollarSales}
        />
      </div>
    </div>
  </div>
);

export default OverviewDashboard;














// "use client";
// import React from "react";
// import OverviewHeader from "./OverviewHeader";
// import StatsCardGroup from "./StatsCardGroup";
// import ChartSection from "./ChartSection";


// const OverviewDashboard: React.FC = () => (
//   <div className="space-y-6 bg-white p-4 rounded-2xl">
//       <OverviewHeader />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <StatsCardGroup />
//         <div className="lg:col-span-2">
//           <ChartSection />
//         </div>
//       </div>
//     </div>
// );

// export default OverviewDashboard;
