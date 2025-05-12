// app/(dashboard)/admin/admin-hosts/[hostId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'


// interface WeeklySummary {
//   week: string;
//   [k: string]: number;
// }
// interface SummarySection<T> {
//   overall: number;
//   byWeek: WeeklySummary[];
//   growthRate: number;
// }
// interface InvitesSummary {
//   totalInvites: number;
//   totalViewed: number;
//   viewedRate: number;
// }
// interface SalesSeries {
//   month: string;
//   sales: number;
// }
// interface SalesOverview {
//   totalAmount: number;
//   growthRate: number;
//   monthlySales: SalesSeries[];
//   dailySales: { day: string; sales: number }[];
// }


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

  useEffect(() => {
    if (!hostId) {
      router.replace("/admin/admin-hosts");
      return;
    }
    axiosInstance
      .get(`/admin-host/${hostId}`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
          console.log(res.data.message);
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
          <OverviewDashboard overview={data.overview} />

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











// "use client";

// import React, { useEffect } from "react";
// import AdminContainer from "@/components/admin/AdminContainer";
// import { useState } from "react";
// import Tabs from "@/components/admin/eventDetails/Tabs";
// import GroupsTabs from "@/components/admin/eventDetails/GroupTabs";
// import OrdersTab from "@/components/admin/eventDetails/OrdersTab";
// import OverviewDashboard from "@/components/admin/hostDetails/OverviewDashboard";
// import HostSidebarInfo from "@/components/admin/hostDetails/HostSidebarInfo";
// import { toast } from "react-toastify";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";
// import { usePathname, useRouter } from "next/navigation";

// const Page: React.FC = () => {
//   // const [activeTab, setActiveTab] = useState<"Groups" | "Orders">("Groups");
//    const router = useRouter()
//     const pathname = usePathname()
//     const [activeTab, setActiveTab] = useState<"Groups" | "Orders">("Groups")
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)
//     const [data, setData] = useState<EventData | null>(null)

//     const id = pathname.split("/").pop()
//     useEffect(() => {
//       if (!id) {
//         router.replace("/admin/admin-hosts")
//         return
//       }
//       axiosInstance
//         .get(`/admin-host/${id}`, { params: { search: "" } })
//         .then(res => {
//           if (res.data.success) {
//             setData(res.data.data)
//             toast.success(res.data.message)
//           } else {
//             throw new Error(res.data.message)
//           }
//         })
//         .catch((e: any) => {
//           setError(e.message || "Failed to fetch event")
//           toast.error(e.message)
//         })
//         .finally(() => setLoading(false))
//     }, [id, router])

//     if (loading) {
//       return (
//         <AdminContainer>
//           <div className="p-12 animate-pulse space-y-6">
//             <div className="h-64 bg-gray-200 rounded-xl" />
//             <div className="h-6 bg-gray-200 w-1/3 rounded" />
//             <div className="h-6 bg-gray-200 w-1/2 rounded" />
//             <div className="h-96 bg-gray-200 rounded-xl" />
//           </div>
//         </AdminContainer>
//       )
//     }
//     if (error || !data) {
//       return (
//         <AdminContainer>
//           <div className="p-6 text-red-600 flex items-center">
//             <BiLoaderCircle className="mr-2 animate-spin" size={22} />
//             {error || "No data available"}
//           </div>
//         </AdminContainer>
//       )
//     }

//   return (
//     <AdminContainer>
//       {/* Top: Overview Header & Sidebar */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* <div className="h-screen overflow-y-scroll grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
//         <div className="lg:col-span-2 lg:h-[143vh] no-scrollbar overflow-y-scroll">
//           <OverviewDashboard />
//           {/* Tabs & Content */}
//           <div className="mt-6">
//             <Tabs active={activeTab} onChange={setActiveTab} />
//             <div className="mt-4">
//               {activeTab === "Groups" ? <GroupsTabs /> : <OrdersTab />}
//             </div>
//           </div>
//         </div>
//         <HostSidebarInfo />
//       </div>
//     </AdminContainer>
//   );
// };

// export default Page;
