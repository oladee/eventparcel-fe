import React from "react";
import { GrLocation } from "react-icons/gr";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { PiPhoneBold } from "react-icons/pi";

const HostSidebarInfo: React.FC = () => (
  <div className="space-y-6">
    {/* host details */}
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <h4 className="text-xl font-bold text-[#111827] ">Host Details</h4>
        {/* <FiMoreHorizontal className="text-[#A0AEC0]" size={20} /> */}
      </div>
      {/* host info */}
      <div className="mt-2 pt-3 flex items-center">
        {/* avatar */}
        <div className="w-12 h-12 rounded-full bg-[#8C62FF] flex items-center justify-center font-semibold text-white text-sm">
          DB
        </div>
        {/* name and email */}
        <div className="ml-3">
          <p className="font-semibold text-black-100">Darcel Ballentine</p>
          <p className="text-[#718096] text-sm">Lagos, NG</p>
        </div>
      </div>
      {/* contact info */}
      <div className="border-t border-[#EEEFF2] mt-2 pt-3 space-y-4">
        <p className="font-bold text-black-100">Contact Information</p>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <HiOutlineEnvelope className="text-[#A0AEC0]" size={24} />{" "}
          darcelballentine@mail.com
        </div>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <PiPhoneBold className="text-[#A0AEC0]" size={24} />
          (671) 555-0110
        </div>
      </div>
    </div>

    {/* Pickup details */}
    <div className="bg-white rounded-2xl p-6">
      <h4 className="text-lg font-bold text-black-100">Pickup Details</h4>
      <div className="mt-2 border-t border-[#EEEFF2] pt-3">
        <p className="font-semibold">Darcel Ballentine</p>
        <p className="text-[#718096] text-sm">Lagos, NG</p>
      </div>
      <div className="mt-2 border-t border-[#EEEFF2] pt-3 space-y-4">
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <HiOutlineEnvelope className="text-[#A0AEC0]" size={24} />{" "}
          darcelballentine@mail.com
        </div>
        <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
          <PiPhoneBold className="text-[#A0AEC0]" size={24} />
          (671) 555-0110
        </div>
      </div>
      <div className="flex items-start gap-3 mt-2 text-[#A0AEC0] font-medium border-t border-[#EEEFF2] pt-3">
        <GrLocation size={24} />
        <p className="text-sm text-[#718096]">
          2715 Ash Dr. San Jose, South Dakota 83475
        </p>
      </div>
    </div>
  </div>
);

export default HostSidebarInfo;
