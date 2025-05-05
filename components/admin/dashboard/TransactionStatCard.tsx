import React from "react";
import { PiPackageBold } from "react-icons/pi";
import BoxTime from "../../../assets/orderIcons/box-time.png"; 
import Finance from "../../../assets/orderIcons/finance.png"; 
import Image from "next/image";
import TransactionsStatCard from "./TransactionsStatCard";
import { SalesSummary } from "@/app/(dashboard)/admin/admin-transactions/page";

interface OrdersStatCardGroupProps {
  orderSummary?: SalesSummary;
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(2)}K`;
  return `₦${value.toFixed(2)}`;
};

const formatDollarCurrency = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const OrdersStatCardGroup: React.FC<OrdersStatCardGroupProps> = ({ orderSummary }) => {
  const stats = [
    {
      icon: (
        <Image
          src={Finance.src}
          alt="Overall Sales"
          className="w-5 h-5 object-contain"
          width={20}
          height={20}
        />
      ),
      label: "Overall Sales",
      naira: formatCurrency(orderSummary?.NGN?.overallSales || 0),
      dollar: formatDollarCurrency(orderSummary?.USD?.overallSales || 0),
      subtext: "in Dollars",
    },
    {
      icon: (
        <Image
          src={BoxTime.src}
          alt="Net Payout"
          className="w-5 h-5 object-contain"
          width={20}
          height={20}
        />
      ),
      label: "Net Payout",
      naira: formatCurrency(orderSummary?.NGN?.netSales || 0),
      dollar: formatDollarCurrency(orderSummary?.USD?.netSales || 0),
      subtext: "in Dollars",
    },
    {
      icon: <PiPackageBold size={20} />,
      label: "Delivery Fee",
      naira: formatCurrency(orderSummary?.NGN?.deliveryFee || 0),
      dollar: formatDollarCurrency(orderSummary?.USD?.deliveryFee || 0),
      subtext: "in Dollars",
    },
    {
      icon: <PiPackageBold size={20} />,
      label: "Service Fee",
      naira: formatCurrency(orderSummary?.NGN?.serviceFee || 0),
      dollar: formatDollarCurrency(orderSummary?.USD?.serviceFee || 0),
      subtext: "in Dollars",
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:justify-between items-center gap-4">
      {stats.map((s, i) => (
        <TransactionsStatCard
          key={i}
          icon={s.icon}
          label={s.label}
          naira={s.naira}
          dollar={s.dollar}
          subtext={s.subtext}
        />
      ))}
    </div>
  );
};

export default OrdersStatCardGroup;
