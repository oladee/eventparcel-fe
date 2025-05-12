import React from "react";
import { PiPackageBold, PiShoppingCartBold } from "react-icons/pi";
import BoxTime from "../../../assets/orderIcons/box-time.png"; 
import Image from "next/image";
import DeliveryStatCard from "./DeliveryStatCard";

export interface OrderSummary {
  deliveredThisWeek: number;
  shippedThisWeek: number;
  pendingThisWeek: number;
  totalDelivered: number;
  totalShipped: number;
  totalPending: number;
  totalOrders: number;
  pctDeliveredVsLastWeek: number;
  pctPendingVsLastWeek: number;
  pctTotalOrdersVsLastWeek: number;
}

interface DeliveryStatProps {
  orderSummary?: OrderSummary;
}

const OrdersStatCardGroup: React.FC<DeliveryStatProps> = ({ orderSummary }) => {
  const stats = [
    {
      icon: <PiShoppingCartBold size={20} />,
      label: "Total Orders",
      value: orderSummary?.totalOrders.toLocaleString() || "0",
      delta: `${orderSummary?.pctTotalOrdersVsLastWeek ?? 0}%`,
      subtext: "from last week"
    },
    {
      icon: (
        <Image
          src={BoxTime}
          alt="Box Time"
          className="w-5 h-5 object-contain"
          width={20}
          height={20}
        />
      ),
      label: "Shipped Orders",
      value: orderSummary?.totalShipped.toString() || "0",
      delta: `${orderSummary?.shippedThisWeek ?? 0}`,
      subtext: "from this week"
    },
    {
      icon: <PiPackageBold size={20} />,
      label: "Total Completed",
      value: orderSummary?.totalDelivered.toString() || "0",
      delta: `${orderSummary?.pctDeliveredVsLastWeek ?? 0}%`,
      subtext: "from last week"
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:justify-between items-center gap-4">
      {stats.map((s, i) => (
        <DeliveryStatCard
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
