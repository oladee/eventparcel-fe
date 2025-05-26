"use client";
// app/(dashboard)/admin/admin-events/[eventId]/page.tsx

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminContainer from "@/components/admin/AdminContainer";
import OverviewHeader from "@/components/admin/eventDetails/OverviewHeader";
import SidebarInfo from "@/components/admin/eventDetails/SidebarInfo";
import Tabs from "@/components/admin/eventDetails/Tabs";
import GroupsTabs from "@/components/admin/eventDetails/GroupTabs";
import OrdersTab, {
  EventOrder
} from "@/components/admin/eventDetails/OrdersTab";
import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";

// ——— API response interfaces ———
interface EventGroup {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupPrivacy: "general" | "private";
  packages: [];
}
interface PayoutDetails {
  nairaAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  dollarAccount?: {
    usBankName: string;
    usAccountNumber: string;
    usAccountName: string;
    routingNumber: string;
  };
  pickupLocation: string;
  contactPhoneNumber: string;
}

interface HostDetails {
  hostFirstName: string;
  hostLastName: string;
  hostEmail: string;
}
interface DeliveryStat {
  homeDelivery: number;
  pickUp: number;
}
// Use the same EventOrder type as OrdersTab expects
type APIOrder = EventOrder & {
  /* plus any extra API props, but these are the minimum */
};

interface OrdersData {
  orders: APIOrder[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

interface SalesSummary {
  NGN?: {
    netPayout: number;
    // other fields if needed
  };
  USD?: {
    netPayout: number;
    // other fields if needed
  };
}

interface EventData {
  _id: string;
  eventName: string;
  eventImgUrl: string;
  eventDescription: string;
  date: string;
  time: string;
  eventLocation: string;
  eventGroups: EventGroup[];
  payoutDetails?: PayoutDetails;
  hostDetails: HostDetails;
  deliveryStat: DeliveryStat;
  orders: OrdersData;
  salesSummary?: SalesSummary;
}

const EventDetailPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"Groups" | "Orders">("Groups");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EventData | null>(null);

  const id = pathname.split("/").pop();
  useEffect(() => {
    if (!id) {
      router.replace("/dashboard/events");
      return;
    }
    axiosInstance
      .get(`/admin-event/${id}`, { params: { search: "" } })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
          console.log(res.data.message);
        } else {
          throw new Error(res.data.message);
        }
      })
      .catch((e: any) => {
        setError(e.message || "Failed to fetch event");
        toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

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

  // // calculate overall Naira sales
  // const totalNaira = data.orders.orders
  //   .filter(o => o.totalAmountCurrency === "NGN")
  //   .reduce((sum, o) => sum + o.totalAmount, 0)
  // const totalDollar = data.orders.orders
  // .filter(o => o.totalAmountCurrency === "USD")
  // .reduce((sum, o) => sum + o.totalAmount, 0)

  // const formattedOverall = `₦${totalNaira.toLocaleString()}`
  // const formattedOverallDollar = `$${totalDollar.toLocaleString()}`

  // // safe payout
  // const acctNum = data.payoutDetails?.nairaAccount?.accountNumber ?? "-"

  // console.log(data)

  const formatNetPayout = () => {
    if (!data?.salesSummary)
      return { netPayout: undefined, netPayoutDollar: undefined };

    const nairaPayout = data.salesSummary.NGN?.netPayout
      ? `₦${data.salesSummary.NGN.netPayout.toLocaleString()}`
      : undefined;
    const dollarPayout = data.salesSummary.USD?.netPayout
      ? `$${data.salesSummary.USD.netPayout.toLocaleString()}`
      : undefined;

    return {
      netPayout: nairaPayout,
      netPayoutDollar: dollarPayout
    };
  };

  const payoutValues = formatNetPayout();

  // Calculate sales based on currency
  const calculateSales = () => {
    const nairaSales = data.orders.orders
      .filter((o) => o.totalAmountCurrency === "NGN")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const dollarSales = data.orders.orders
      .filter((o) => o.totalAmountCurrency === "USD")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      naira: `₦${nairaSales.toLocaleString()}`,
      dollar: `$${dollarSales.toLocaleString()}`
    };
  };

  const sales = data ? calculateSales() : { naira: "", dollar: "" };

  // Determine which sales to pass based on account types
  const getSalesProps = () => {
    const hasNairaAccount = !!data?.payoutDetails?.nairaAccount;
    const hasDollarAccount = !!data?.payoutDetails?.dollarAccount;

    if (hasNairaAccount && hasDollarAccount) {
      return {
        overallSales: sales.naira,
        overallSalesDollar: sales.dollar
      };
    } else if (hasNairaAccount) {
      return { overallSales: sales.naira };
    } else if (hasDollarAccount) {
      return { overallSalesDollar: sales.dollar };
    }
    return {}; // No accounts, pass neither
  };

  const salesProps = getSalesProps();

  // safe payout
  // const acctNum = data?.payoutDetails?.nairaAccount?.accountNumber ?? "-"
  // const acctNum = "dummy";

  return (
    <AdminContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 lg:h-[143vh] no-scrollbar overflow-y-scroll">
          <OverviewHeader
            imageUrl={data.eventImgUrl}
            name={data.eventName}
            description={data.eventDescription}
            date={data.date}
            time={data.time}
            location={data.eventLocation}
            // overallSales={formattedOverall}
            // overallSalesDollar={formattedOverallDollar}
            {...salesProps} // Spread the conditional sales props
            // netPayout={acctNum}
            netPayout={payoutValues.netPayout}
            netPayoutDollar={payoutValues.netPayoutDollar}
            packagesSold={data.orders.orders.length}
          />
          <div className="mt-6">
            <Tabs active={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === "Groups" ? (
                <GroupsTabs groups={data.eventGroups} />
              ) : (
                // Pass the raw array into OrdersTab.orders
                <OrdersTab orders={data.orders.orders} />
              )}
            </div>
          </div>
        </div>
        <SidebarInfo
          host={data.hostDetails}
          payout={data.payoutDetails}
          deliveryStat={data.deliveryStat}
        />
      </div>
    </AdminContainer>
  );
};

export default EventDetailPage;

// "use client";

// import React, { useEffect } from "react";
// import AdminContainer from "@/components/admin/AdminContainer";
// import { useState } from "react";
// import SidebarInfo from "@/components/admin/eventDetails/SidebarInfo";
// import Tabs from "@/components/admin/eventDetails/Tabs";
// import GroupsTab from "@/components/admin/eventDetails/GroupTabs";
// import OrdersTab from "@/components/admin/eventDetails/OrdersTab";
// import OverviewHeader from "@/components/admin/eventDetails/OverviewHeader";
// import { useRouter } from "next/navigation";
// import axiosInstance from "@/lib/axiosInstance";

// const EventDetailPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"Groups" | "Orders">("Groups");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();

//     useEffect(() => {
//       const id = window.location.pathname.split("/").pop(); // Extract eventId from the URL
//       if (!id) {
//         router.replace("/dashboard/events");
//         return;
//       }
//       const fetchEventData = async () => {
//         try {
//           const response = await axiosInstance.get(`/admin-event/680c5942e767022cd7647925?`);
//           // const response = await axiosInstance.get(`/view-event/${id}`);
//           if (response.data.success) {
//             console.log(response.data.data);
//             localStorage.setItem("eventData", JSON.stringify(response.data.data));
//           } else {
//             setError("Failed to fetch event data.");
//           }
//         } catch (error: any) {
//           console.error("Error fetching event:", error);
//           setError(error.response?.data?.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchEventData();
//     }, [router]);

//   return (
//     <AdminContainer>
//       {/* Top: Overview Header & Sidebar */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* <div className="h-screen overflow-y-scroll grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
//         <div className="lg:col-span-2 lg:h-[143vh] no-scrollbar overflow-y-scroll">
//           <OverviewHeader />
//           {/* Tabs & Content */}
//           <div className="mt-6">
//             <Tabs active={activeTab} onChange={setActiveTab} />
//             <div className="mt-4">
//               {activeTab === "Groups" ? <GroupsTab /> : <OrdersTab />}
//             </div>
//           </div>
//         </div>
//         <SidebarInfo />
//       </div>
//     </AdminContainer>
//   );
// };

// export default EventDetailPage;
