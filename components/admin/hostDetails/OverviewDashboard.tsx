"use client";
import React from "react";
import OverviewHeader from "./OverviewHeader";
import StatsCardGroup from "./StatsCardGroup";
import ChartSection from "./ChartSection";


const OverviewDashboard: React.FC = () => (
  <div className="space-y-6 bg-white p-4 rounded-2xl">
      <OverviewHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatsCardGroup />
        <div className="lg:col-span-2">
          <ChartSection />
        </div>
      </div>
    </div>
);

export default OverviewDashboard;
