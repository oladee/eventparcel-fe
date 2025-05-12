import React from "react";
import StatCard from "./OrderStatCard";
import { FiEye } from "react-icons/fi";
import { PiPackageBold, PiShoppingCartBold } from "react-icons/pi";
import BoxTime from "../../../assets/orderIcons/box-time.png";
import Image from "next/image";

interface WeekData {
  week: string;
  pending?: number;
  delivered?: number;
  orders?: number;
}

interface SummaryWithWeeks {
  byWeek: WeekData[];
  growthRate: number;
  overall: number;
}

interface OrdersSummary {
  pendingOrders: SummaryWithWeeks & {
    byWeek: Array<WeekData & { pending: number }>;
  };
  totalDelivered: SummaryWithWeeks & {
    byWeek: Array<WeekData & { delivered: number }>;
  };
  totalOrders: SummaryWithWeeks & {
    byWeek: Array<WeekData & { orders: number }>;
  };
}

interface InvitesSummary {
  totalInvites: number;
  totalViewed: number;
  viewedRate: number;
}

interface OrderSummary {
  invitesSummary: InvitesSummary;
  ordersSummary: OrdersSummary;
}

interface OrderStatProps {
  orderSummary: OrderSummary;
}

const OrdersStatCardGroup: React.FC<OrderStatProps> = ({ orderSummary }) => {
  // Extract values from orderSummary
  const {
    invitesSummary: { totalInvites, viewedRate },
    // invitesSummary: { totalInvites, totalViewed, viewedRate },
    ordersSummary: { totalOrders, totalDelivered, pendingOrders }
  } = orderSummary;

  const stats = [
    {
      icon: <PiShoppingCartBold size={20} />,
      label: "Total Orders",
      value: totalOrders.overall.toString(),
      delta: `${totalOrders.growthRate}%`,
      subtext: "from last week"
    },
    {
      icon: <FiEye size={20} />,
      label: "Total Invites",
      value: totalInvites.toString(),
      delta: `${viewedRate}%`,
      subtext: "viewed invites"
    },
    {
      icon: <PiPackageBold size={20} />,
      label: "Total Delivered",
      value: totalDelivered.overall.toString(),
      delta: `${totalDelivered.growthRate}%`,
      subtext: "from last week"
    },
    {
      icon: (
        <Image
          src={BoxTime.src}
          alt="Box Time"
          className="w-5 h-5 object-contain"
          width={20}
          height={20}
        />
      ),
      label: "Pending Orders",
      value: pendingOrders.overall.toString(),
      delta: pendingOrders.byWeek[3].pending.toString(), // Week 4 pending count
      subtext: "from this week"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:justify-between items-center gap-4">
      {stats.map((s, i) => (
        <StatCard
          key={i}
          icon={s.icon}
          label={s.label}
          value={s.value}
          delta={s.delta}
          subtext={s.subtext}
        />
      ))}
    </div>
  );
};

export default OrdersStatCardGroup;
