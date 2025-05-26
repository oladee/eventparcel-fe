"use client";
import React from "react";
import Image from "next/image";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdOutlineCalendarToday } from "react-icons/md";

interface OverviewHeaderProps {
  imageUrl: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  overallSales?: string; // formatted with currency symbol
  overallSalesDollar?: string;
  packagesSold: number;
  netPayout?: string;
  netPayoutDollar?: string;
}

const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  imageUrl,
  name,
  description,
  date,
  time,
  location,
  overallSales,
  overallSalesDollar,
  netPayout,
  netPayoutDollar,
  packagesSold
}) => {
  const hasBothSales = overallSales && overallSalesDollar;
  const hasOnlyNaira = overallSales && !overallSalesDollar;
  const hasOnlyDollar = !overallSales && overallSalesDollar;
  const hasBothPayouts = netPayout && netPayoutDollar;
  const hasOnlyNaira1 = netPayout && !netPayoutDollar;
  const hasOnlyDollar1 = !netPayout && netPayoutDollar;

  return (
    <div className="bg-white p-4 rounded-2xl mb-4">
      <div className="relative w-full rounded-xl overflow-hidden">
        <Image
          src={imageUrl || "/images/placeholder_eventCover2.jpg"}
          alt={name}
          className="w-full h-48 object-cover rounded-xl"
          width={600}
          height={400}
          quality={100}
          priority
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md">
          <FiMoreHorizontal size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold text-gray-900 capitalize">{name}</h2>
        <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
          {description}
        </p>

        <div className="mt-4 border-t pt-3 text-gray-700">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MdOutlineCalendarToday size={18} />
            <span>
              {new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}{" "}
              AT {time}
            </span>
          </div>
          <p className="text-sm mt-1 text-gray-500">{location}</p>
        </div>

        <div className="grid grid-cols-3 mt-4 border-t pt-3 text-gray-700">
          <div>
            {hasBothSales && (
              <>
                <div className="flex flex-col">
                  <p className="text-xl text-[#751423] font-semibold">
                    {overallSales}
                  </p>
                  <p className="text-xl text-[#751423] font-semibold pr-2">
                    {overallSalesDollar}
                  </p>
                </div>
                <p className="text-xs text-[#718096] font-medium">
                  Overall sales
                </p>
              </>
            )}
            {hasOnlyNaira && (
              <>
                <p className="text-xl text-[#751423] font-semibold">
                  {overallSales}
                </p>
                <p className="text-xs text-[#718096] font-medium">
                  Overall sales (NGN)
                </p>
              </>
            )}
            {hasOnlyDollar && (
              <>
                <p className="text-xl text-[#751423] font-semibold">
                  {overallSalesDollar}
                </p>
                <p className="text-xs text-[#718096] font-medium">
                  Overall sales (USD)
                </p>
              </>
            )}
          </div>

          <div className="relative pl-4">
            <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
            {hasBothPayouts && (
              <div className="flex flex-col">
                <p className="text-xl text-[#751423] font-semibold">
                  {netPayout}
                </p>
                <p className="text-xl text-[#0CAF60] font-semibold pr-2">
                  {netPayoutDollar}
                </p>
              </div>
            )}
            {hasOnlyNaira1 && (
              <p className="text-xl text-[#751423] font-semibold">
                {netPayout}
              </p>
            )}
            {hasOnlyDollar1 && (
              <p className="text-xl text-[#0CAF60] font-semibold">
                {netPayoutDollar}
              </p>
            )}
            {!netPayout && !netPayoutDollar && (
              <p className="text-xl text-gray-500 font-semibold">-</p>
            )}
            <p className="text-xs text-[#718096] font-medium">Net payout</p>
          </div>

          {/* <div className="relative pl-4">
            <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
            <p className="text-xl font-semibold text-[#0CAF60]">{netPayout}</p>
            <p className="text-xs text-[#718096] font-medium">Net payout</p>
          </div> */}
          <div className="relative pl-4">
            <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
            <p className="text-xl text-[#111827] font-semibold">
              {packagesSold}
            </p>
            <p className="text-xs text-[#718096] font-medium">Package Sold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewHeader;

// "use client"
// import React from "react"
// import Image from "next/image"
// import { FiMoreHorizontal } from "react-icons/fi"
// import { MdOutlineCalendarToday } from "react-icons/md"

// interface OverviewHeaderProps {
//   imageUrl: string
//   name: string
//   description: string
//   date: string
//   time: string
//   location: string
//   overallSales?: string     // formatted with currency symbol
//   overallSalesDollar?: string
//   netPayout: string        // account number string
//   packagesSold: number
// }

// const OverviewHeader: React.FC<OverviewHeaderProps> = ({
//   imageUrl,
//   name,
//   description,
//   date,
//   time,
//   location,
//   overallSales,
//   overallSalesDollar,
//   netPayout,
//   packagesSold
// }) => (
//   <div className="bg-white p-4 rounded-2xl mb-4">
//     <div className="relative w-full rounded-xl overflow-hidden">
//       <Image
//         src={imageUrl || "/images/placeholder_eventCover2.jpg"}
//         alt={name}
//         className="w-full h-48 object-cover rounded-xl"
//         width={600}
//         height={400}
//         quality={100}
//         priority
//       />
//       <button className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md">
//         <FiMoreHorizontal size={20} className="text-gray-600" />
//       </button>
//     </div>

//     <div className="mt-4">
//       <h2 className="text-xl font-bold text-gray-900 capitalize">{name}</h2>
//       <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
//         {description}
//       </p>

//       <div className="mt-4 border-t pt-3 text-gray-700">
//         <div className="flex items-center gap-2 text-sm font-semibold">
//           <MdOutlineCalendarToday size={18} />
//           <span>
//             {new Date(date).toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric"
//             })} AT {time}
//           </span>
//         </div>
//         <p className="text-sm mt-1 text-gray-500">{location}</p>
//       </div>

//       <div className="grid grid-cols-3 mt-4 border-t pt-3 text-gray-700">
//         <div>
//           <div className="flex items-center justify-between">
//             <p className="text-xl text-[#751423] font-semibold">
//               {overallSales}
//             </p>
//             <p className="text-xl text-[#751423] font-semibold pr-5">
//               {overallSalesDollar}
//             </p>
//           </div>
//           <p className="text-xs text-[#718096] font-medium">Overall sales</p>
//         </div>
//         <div className="relative pl-4">
//           <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
//           <p className="text-xl font-semibold text-[#0CAF60]">{netPayout}</p>
//           <p className="text-xs text-[#718096] font-medium">Net payout</p>
//         </div>
//         <div className="relative pl-4">
//           <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]" />
//           <p className="text-xl text-[#111827] font-semibold">{packagesSold}</p>
//           <p className="text-xs text-[#718096] font-medium">Package Sold</p>
//         </div>
//       </div>
//     </div>
//   </div>
// )

// export default OverviewHeader

// import Image from "next/image";
// import React from "react";
// import { FiMoreHorizontal } from "react-icons/fi";
// import { MdOutlineCalendarToday } from "react-icons/md";

// const OverviewHeader = () => (
//   <div className="bg-white p-4 rounded-2xl mb-4">
//     {/* Image Section */}
//     <div className="relative w-full rounded-xl overflow-hidden">
//       <Image
//         src={"/images/placeholder_eventCover2.jpg"}
//         alt={"Event Cover"}
//         className="w-full h-48 object-cover rounded-xl"
//         width={600}
//         height={400}
//         quality={100}
//         priority
//       />
//       {/* More Options Button */}
//       <button
//         //   onClick={toggleModal}
//         className="absolute top-3 right-3 bg-white p-2 rounded-[8px] shadow-md"
//       >
//         <FiMoreHorizontal size={20} className="text-gray-600" />
//       </button>
//     </div>

//     {/* Details Section */}
//     <div className="mt-4">
//       <h2 className="text-xl font-bold text-gray-900 capitalize">
//         James & Jane Wedding Anniversary 2025
//       </h2>
//       <p className="text-gray-600 text-sm mt-1 w-full max-w-3xl truncate-text">
//         JKT48 will soon be celebrating its 11th anniversary through the JKT48
//         11th Anniversary: Flying High.{" "}
//         <span className="text-[#751423] text-sm font-medium">READ MORE</span>
//       </p>

//       {/* Event Info */}
//       <div className="mt-4 border-t pt-3 text-gray-700">
//         <div className="flex items-center gap-2 text-sm font-semibold">
//           <MdOutlineCalendarToday size={18} />
//           <span>12 MAR, 2025 AT 10:30AM WAT</span>
//         </div>
//         <p className="text-sm mt-1 text-gray-500">
//           Jaja Hall, 18 Olumo Street, Onike, Yaba, Lagos
//         </p>
//       </div>

//       {/* Sales Info */}
//       <div className="grid grid-cols-3 mt-4 border-t pt-3 text-gray-700">
//         <div className="">
//           <p className="text-xl text-[#751423] font-semibold">₦13.49M</p>
//           <p className="text-xs text-[#718096] font-medium">Overall sales</p>
//         </div>
//         <div className="relative pl-4">
//           {/* short left borderline */}
//           <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]"></div>
//           <p className="text-xl font-semibold text-[#0CAF60]">₦13.09M</p>
//           <p className="text-xs text-[#718096] font-medium">Net payout</p>
//         </div>
//         <div className="relative pl-4">
//           {/* short left borderline */}
//           <div className="absolute left-0 top-2 h-8 w-[1px] bg-[#CBD5E0]"></div>
//           <p className="text-xl text-[#111827] font-semibold">164</p>
//           <p className="text-xs text-[#718096] font-medium">Package Sold</p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default OverviewHeader;
