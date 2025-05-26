"use client"
import React from "react"
import { FiMoreHorizontal } from "react-icons/fi"
import { BsBoxSeam } from "react-icons/bs"
import { HiOutlineEnvelope } from "react-icons/hi2"
import { PiPhoneBold } from "react-icons/pi"
import { GrLocation } from "react-icons/gr"

interface SidebarInfoProps {
  host: { hostFirstName: string; hostLastName: string; hostEmail: string }
  payout?: {
    nairaAccount?: {
      accountNumber: string
      bankName: string
      accountName: string
    },
    dollarAccount?: {
      usBankName: string
      usAccountNumber: string
      usAccountName: string
      routingNumber: string
    },
    pickupLocation: string,
    contactPhoneNumber: string
  }
  deliveryStat: { homeDelivery: number; pickUp: number }
}

const AccountSection: React.FC<{
  type: 'Naira' | 'Dollar'
  account?: {
    accountName: string
    accountNumber: string
    bankName?: string
    usBankName?: string
    routingNumber?: string
  }
}> = ({ type, account }) => {
  if (!account) return null

  return (
    <>
      <div className="mt-2 border-t border-[#EEEFF2] pt-3">
        <p className="font-semibold text-black-100">{account.accountName}</p>
        <p className="text-[#718096] text-sm font-medium">{type}</p>
      </div>
      <div className="mt-4 border-t pt-3 text-sm">
        <p>
          <span className="text-[#718096]">Account:</span>{' '}
          <span className="font-semibold text-[#718096]">{account.accountNumber}</span>
        </p>
        {account.bankName && (
          <p className="mt-2">
            <span className="text-[#718096]">Bank:</span>{' '}
            <span className="font-semibold text-[#718096]">{account.bankName}</span>
          </p>
        )}
        {account.usBankName && (
          <p className="mt-2">
            <span className="text-[#718096]">US Bank:</span>{' '}
            <span className="font-semibold text-[#718096]">{account.usBankName}</span>
          </p>
        )}
        {account.routingNumber && (
          <p className="mt-2">
            <span className="text-[#718096]">Routing Number:</span>{' '}
            <span className="font-semibold text-[#718096]">{account.routingNumber}</span>
          </p>
        )}
      </div>
    </>
  )
}

const SidebarInfo: React.FC<SidebarInfoProps> = ({ host, payout, deliveryStat }) => {
  return (
    <div className="space-y-6">
      {/* host details */}
      <div className="bg-white rounded-2xl p-4">
        <div className="flex items-start justify-between">
          <h4 className="text-xl font-bold text-[#111827]">Host</h4>
          <FiMoreHorizontal className="text-[#A0AEC0]" size={20} />
        </div>
        <div className="mt-2 pt-3 flex items-center border-t border-[#EEEFF2]">
          <div className="w-8 h-8 rounded-full bg-[#DEA087] flex items-center justify-center text-xs font-semibold text-white">
            {host.hostFirstName[0]}{host.hostLastName[0]}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-black-100 text-sm">{host.hostFirstName} {host.hostLastName}</p>
            <p className="text-[#718096] text-xs">{host.hostEmail}</p>
          </div>
        </div>
      </div>

      {/* payout details */}
      <div className="bg-white rounded-2xl p-4">
        <h4 className="text-lg font-bold text-black-100">Payout Details</h4>
        
        {payout?.nairaAccount && (
          <AccountSection 
            type="Naira" 
            account={{
              accountName: payout.nairaAccount.accountName,
              accountNumber: payout.nairaAccount.accountNumber,
              bankName: payout.nairaAccount.bankName
            }} 
          />
        )}
        
        {payout?.dollarAccount && (
          <AccountSection 
            type="Dollar" 
            account={{
              accountName: payout.dollarAccount.usAccountName.charAt(0).toUpperCase() + payout.dollarAccount.usAccountName.slice(1),
              accountNumber: payout.dollarAccount.usAccountNumber,
              usBankName: payout.dollarAccount.usBankName,
              routingNumber: payout.dollarAccount.routingNumber
            }} 
          />
        )}

        {!payout?.nairaAccount && !payout?.dollarAccount && (
          <div className="mt-2 border-t border-[#EEEFF2] pt-3 text-[#718096] text-sm">
            No payout details available
          </div>
        )}
      </div>

      {/* delivery stats */}
      <div className="bg-white rounded-2xl p-4">
        <h4 className="text-lg font-bold text-black-100">Delivery Stats</h4>
        <div className="mt-2 grid grid-cols-2 border-t border-[#EEEFF2] pt-3">
          <div>
            <p className="font-bold text-lg">{deliveryStat.homeDelivery}</p>
            <p className="text-[#718096] font-medium text-xs">Home Delivery</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]"></div>
            <p className="font-bold text-xl">{deliveryStat.pickUp}</p>
            <p className="text-[#718096] font-medium text-xs">Pickup</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-[#718096] font-medium">
          <BsBoxSeam className="mr-3" /> Platform Delivery
        </div>
      </div>

      {/* pickup details placeholder */}
      <div className="bg-white rounded-2xl p-6">
        <h4 className="text-lg font-bold text-black-100">Pickup Details</h4>
        <div className="mt-2 border-t border-[#EEEFF2] pt-3 space-y-4 text-[#718096] text-sm font-medium">
          <div className="flex items-center gap-3">
            <HiOutlineEnvelope className="text-[#A0AEC0]" size={24} />{' '}
            {host.hostEmail}
          </div>
          <div className="flex items-center gap-3">
            <PiPhoneBold className="text-[#A0AEC0]" size={24} />{' '}
            {payout?.contactPhoneNumber || "N/A"}
          </div>
        </div>
        <div className="flex items-start gap-3 mt-2 text-[#A0AEC0] font-medium border-t border-[#EEEFF2] pt-3">
          <GrLocation size={34} /> <p className="text-sm text-[#718096]">
          {payout?.pickupLocation
              ? payout.pickupLocation
                  .split(" ")
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(" ")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SidebarInfo






















// import React from "react";
// import { BsBoxSeam } from "react-icons/bs";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { GrLocation } from "react-icons/gr";
// import { HiOutlineEnvelope } from "react-icons/hi2";
// import { PiPhoneBold } from "react-icons/pi";

// const SidebarInfo: React.FC = () => (
//   <div className="space-y-6">
//     {/* host details */}
//     <div className="bg-white rounded-2xl p-4">
//       <div className="flex items-start justify-between">
//         <h4 className="text-xl font-bold text-[#111827] ">Host</h4>
//         <FiMoreHorizontal className="text-[#A0AEC0]" size={20} />
//       </div>
//       {/* host info */}
//       <div className="mt-2 pt-3 flex items-center border-t border-[#EEEFF2]">
//         {/* avatar */}
//         <div className="w-8 h-8 rounded-full bg-[#DEA087] flex items-center justify-center font-semibold text-white text-xs">
//           CC
//         </div>
//         {/* name and email */}
//         <div className="ml-3">
//           <p className="font-semibold text-black-100">Chieko Chute</p>
//           <p className="text-[#718096]">chieko@mail.com</p>
//         </div>
//       </div>
//     </div>

//     {/* payout details */}
//     <div className="bg-white rounded-2xl p-4">
//       {/* title */}
//       <h4 className="text-lg font-bold text-black-100">Payout Details</h4>
//       <div className="border-t border-[#EEEFF2] mt-2 pt-3">
//         <p className="font-semibold text-black-100">Darcel Ballentine</p>
//         <p className="text-[#718096] text-sm font-medium">Naira</p>
//       </div>
//       <div className="mt-4 border-t pt-3 text-sm">
//         <p>
//           <span className="text-[#718096]">Account:</span>{" "}
//           <span className="font-semibold text-[#718096]">4506850485</span>
//         </p>
//         <p className="mt-2">
//           <span className="text-[#718096]">Bank:</span>{" "}
//           <span className="font-semibold text-[#718096]">Access Bank</span>
//         </p>
//       </div>
//     </div>

//     {/* Delivery Info */}
//     <div className="bg-white rounded-2xl p-4">
//       <h4 className="text-lg font-bold text-black-100">Delivery Stats</h4>
//       <div className="mt-2 grid grid-cols-2 border-t border-[#EEEFF2] pt-3">
//         <div>
//           <p className="font-bold text-lg">37</p>
//           <p className="text-[#718096] font-medium text-xs">Home Delivery</p>
//         </div>
//         <div className="relative pl-4">
//           {/* short left borderline */}
//           <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]"></div>
//           <p className="font-bold text-xl">14</p>
//           <p className="text-[#718096] font-medium text-xs">Pickup</p>
//         </div>
//       </div>
//       <div className="mt-4 flex items-center text-[#718096] font-medium">
//         <BsBoxSeam className="mr-3" /> Platform Delivery
//       </div>
//     </div>

//     <div className="bg-white rounded-2xl p-6">
//       <h4 className="text-lg font-bold text-black-100">Pickup Details</h4>
//       <div className="mt-2 border-t border-[#EEEFF2] pt-3">
//         <p className="font-semibold">Darcel Ballentine</p>
//         <p className="text-[#718096] text-sm">Lagos, NG</p>
//       </div>
//       <div className="mt-2 border-t border-[#EEEFF2] pt-3 space-y-4">
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <HiOutlineEnvelope className="text-[#A0AEC0]" size={24} />{" "}
//           darcelballentine@mail.com
//         </div>
//         <div className="flex items-center gap-3 text-[#718096] text-sm font-medium">
//           <PiPhoneBold className="text-[#A0AEC0]" size={24} />
//           (671) 555-0110
//         </div>
//       </div>
//       <div className="flex items-start gap-3 mt-2 text-[#A0AEC0] font-medium border-t border-[#EEEFF2] pt-3">
//         <GrLocation size={24} />
//         <p className="text-sm text-[#718096]">
//           2715 Ash Dr. San Jose, South Dakota 83475
//         </p>
//       </div>
//     </div>
//   </div>
// );

// export default SidebarInfo;
