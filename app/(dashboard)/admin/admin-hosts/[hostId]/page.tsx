// app/(dashboard)/admin/admin-hosts/[hostId]/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminContainer from "@/components/admin/AdminContainer";
import Tabs from "@/components/admin/eventDetails/Tabs";
// import GroupsTabs from "@/components/admin/eventDetails/GroupTabs";
// import OrdersTab from "@/components/admin/eventDetails/OrdersTab";
import OverviewDashboard from "@/components/admin/hostDetails/OverviewDashboard";
import HostSidebarInfo from "@/components/admin/hostDetails/HostSidebarInfo";
import { toast } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import { OverviewData, HostDetails, PickupDetails } from "@/types/host";
import GroupsTabs from "@/components/admin/hostDetails/GroupTabs";
import OrdersTab from "@/components/admin/hostDetails/OrdersTab";
import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";

interface EventGroup {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupPrivacy: "general" | "private";
  packages: [];
}

interface Event {
  _id: string;
  eventName: string;
  eventImgUrl: string;
  eventGroups: EventGroup[];
  salesSummary: {
    currency: string;
    totalSales: number;
    totalPackagesSold: number;
  }[];
  // …you can add others if needed
}

// interface OrderItem {
//   /* … */
// }
interface Order {
  orderId: string;
  createdAt: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  totalAmount: number;
  totalAmountCurrency: string;
  orderStatus: string;
}

interface HostPageData {
  overview: OverviewData;
  hostDetails: HostDetails;
  events: Event[];
  orders: {
    orders: Order[];
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
  pickupDetails: PickupDetails;
}

const HostDetailPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hostId = pathname.split("/").pop();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HostPageData | null>(null);
  const [activeTab, setActiveTab] = useState<"Groups" | "Orders">("Groups");

  // useEffect(() => {
  //   if (!hostId) {
  //     router.replace("/admin/admin-hosts");
  //     return;
  //   }
  //   axiosInstance
  //     .get(`/admin-host/${hostId}`)
  //     .then((res) => {
  //       if (res.data.success) {
  //         setData(res.data.data);
  //         console.log(res.data.message);
  //       } else {
  //         throw new Error(res.data.message);
  //       }
  //     })
  //     .catch((e: any) => {
  //       setError(e.message || "Failed to load host");
  //       toast.error(e.message);
  //     })
  //     .finally(() => setLoading(false));
  // }, [hostId, router]);

  const fetchHostData = React.useCallback(() => {
    if (!hostId) {
      router.replace("/admin/admin-hosts");
      return;
    }
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/admin-host/${hostId}`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          throw new Error(res.data.message);
        }
      })
      .catch((e: any) => {
        setError(e.message || "Failed to load host");
        toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, [hostId, router]);

  React.useEffect(() => {
    fetchHostData();
  }, [fetchHostData]);

  if (loading) {
    return (
      <AdminContainer>
        <div className="p-12 animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 w-1/3 rounded" />
          <div className="h-6 bg-gray-200 w-1/2 rounded" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </AdminContainer>
    );
  }
  if (error || !data) {
    return (
      <AdminContainer>
        <div className="p-6 text-red-600 flex items-center">
          <BiLoaderCircle className="mr-2 animate-spin" size={22} />
          {error || "No data available"}
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left/main */}
        <div className="lg:col-span-2 lg:h-[143vh] no-scrollbar overflow-y-scroll">
          {/* Pass your overview data into the dashboard */}
          <OverviewDashboard
            overview={data.overview}
            onRefresh={fetchHostData}
          />

          <div className="mt-6">
            <Tabs active={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === "Groups" ? (
                // Here "groups" really means "events" for a host
                <GroupsTabs groups={data.events} />
              ) : (
                // flatten the orders list
                <OrdersTab orders={data.orders.orders} />
              )}
            </div>
          </div>
        </div>

        {/* right/sidebar */}
        <HostSidebarInfo host={data.hostDetails} pickup={data.pickupDetails} />
      </div>
    </AdminContainer>
  );
};

export default HostDetailPage;
