import React from "react";
import StatCard from "./OrderStatCard";
import { FiEye } from "react-icons/fi";
import { PiPackageBold, PiShoppingCartBold } from "react-icons/pi";
import BoxTime from "../../../assets/orderIcons/box-time.png"; 
import Image from "next/image";

const stats = [
  {
    icon: <PiShoppingCartBold size={20} />,
    label: "Total Order",
    value: "1,256",
    delta: "+ 1.0%",
    subtext: "from last week"
  },
  {
    icon: <FiEye size={20} />,
    label: "Total Invites",
    value: "324",
    delta: "65%",
    subtext: "viewed invites"
  },
  {
    icon: <PiPackageBold size={20} />,
    label: "Total Delivered",
    value: "1,786",
    delta: "+ 3.9%",
    subtext: "from last week"
  },
  {
    icon: (
        <Image
          src={BoxTime.src}
          alt="Box Time"
          className="w-5 h-5 object-contain"
        />
      ),
    label: "Pending Orders",
    value: "786",
    delta: "16",
    subtext: "from this week"
  }
];

const OrdersStatCardGroup: React.FC = () => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-16">
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
  </>
);

export default OrdersStatCardGroup;
