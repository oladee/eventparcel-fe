import React from "react";
import { PiPackageBold, PiShoppingCartBold } from "react-icons/pi";
import BoxTime from "../../../assets/orderIcons/box-time.png"; 
import Image from "next/image";
import DeliveryStatCard from "./DeliveryStatCard";

const stats = [
  {
    icon: <PiShoppingCartBold size={20} />,
    label: "Total Order",
    value: "1,256",
    delta: "+ 1.0%",
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
    label: "Shipped Orders",
    value: "76",
    delta: "16",
    subtext: "from this week"
},
{
  icon: <PiPackageBold size={20} />,
  label: "Total Completed",
  value: "186",
  delta: "+ 3.9%",
  subtext: "from last week"
},
];

const OrdersStatCardGroup: React.FC = () => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-[338px] xl:gap-[438px]">
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
  </>
);

export default OrdersStatCardGroup;
