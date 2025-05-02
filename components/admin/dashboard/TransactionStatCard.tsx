import React from "react";
// import { FiEye } from "react-icons/fi";
import { PiPackageBold } from "react-icons/pi";
import BoxTime from "../../../assets/orderIcons/box-time.png"; 
import Finance from "../../../assets/orderIcons/finance.png"; 
import Image from "next/image";
import TransactionsStatCard from "./TransactionsStatCard";

const stats = [
  {
    icon: (
        <Image
          src={Finance.src}
          alt="Box Time"
          className="w-5 h-5 object-contain"
          width={20}
          height={20}
        />
      ),
    label: "Overall Sales",
    naira: "₦531.49M",
    dollar: "+374.58K",
    subtext: "in Dollars"
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
    label: "Net Payout",
    naira: "₦531.49M",
    dollar: "+374.58K",
    subtext: "in Dollars"
  },
  {
    icon: <PiPackageBold size={20} />,
    label: "Delivery Fee",
    naira: "₦531.49M",
    dollar: "+374.58K",
    subtext: "in Dollars"
  },
  {
    icon: <PiPackageBold size={20} />,
    label: "Service Fee",
    naira: "₦531.49M",
    dollar: "+374.58K",
    subtext: "in Dollars"
  }
];

const OrdersStatCardGroup: React.FC = () => (
  <>
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
  </>
);

export default OrdersStatCardGroup;
