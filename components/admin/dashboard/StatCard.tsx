import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  subtext?: string;
}
const StatCard: React.FC<Props> = ({ icon, label, value, delta, subtext }) => (
  <div className="bg-white rounded-2xl pt-3 pb-4 px-3 flex flex-col justify-between ">
    <div className="flex items-center text-primary border-b border-[#EEEFF2] p-2">
      {icon}
      <span className="ml-2 font-semibold text-[#111827]">{label}</span>
    </div>
    <div className="mb-3">
      <h2 className="mt-4 text-2xl font-bold text-[#111827]">{value}</h2>
      <p className="mt-auto text-green-500 font-medium text-sm">
        {delta} <span className="text-[#718096]">{subtext} from last week</span>
      </p>
    </div>
  </div>
);
export default StatCard;
