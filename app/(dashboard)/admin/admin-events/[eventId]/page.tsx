"use client";

import React from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import { useState } from "react";
import SidebarInfo from "@/components/admin/eventDetails/SidebarInfo";
import Tabs from "@/components/admin/eventDetails/Tabs";
import GroupsTab from "@/components/admin/eventDetails/GroupTabs";
import OrdersTab from "@/components/admin/eventDetails/OrdersTab";
import OverviewHeader from "@/components/admin/eventDetails/OverviewHeader";

const EventDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Groups" | "Orders">("Groups");

  return (
    <AdminContainer>
      {/* Top: Overview Header & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* <div className="h-screen overflow-y-scroll grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
        <div className="lg:col-span-2 lg:h-[143vh] no-scrollbar overflow-y-scroll">
          <OverviewHeader />
          {/* Tabs & Content */}
          <div className="mt-6">
            <Tabs active={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === "Groups" ? <GroupsTab /> : <OrdersTab />}
            </div>
          </div>
        </div>
        <SidebarInfo />
      </div>
    </AdminContainer>
  );
};

export default EventDetailPage;
