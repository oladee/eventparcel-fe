"use client";

import RightBar from "@/components/Rightbar";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";

import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
const router = useRouter()
const handleAddNew =()=>{
    router.push("/create-cohost")
}
  return (
    <>
      {/* <ToastContainer /> */}
      <section className="bg-[#F9FAFB] !overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
          <div className="mb-4 md:mb-12 text-center p-3 sm:p-0 space-y-3">
            <h1
              id="payment_deliveryHeader"
              className="text-2xl sm:text-3xl font-bold text-[#111827]"
            >
              Add a Co-host
            </h1>
            <p id="payment_deliveryDesc" className="gap-3">
              <span className="mr-2">
                Enter the name and email address of your co-host
              </span>
              <span
                onClick={() => setIsRightBarOpen(true)}
                className="px-2 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
              >
                !
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 bg-white rounded-[12px] p-4">
              {/* Avatar */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C4C4C466] text-gray-800 font-bold text-base">
                JP
              </div>
              {/* Name & Email */}
              <div>
                <h2 className="text-sm font-semibold text-[#101828]">
                  James Paul-smith
                </h2>
                <p className="text-sm text-[#667085]">jamesolawale@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white rounded-[12px] p-4">
              {/* Avatar */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C4C4C466] text-gray-800 font-bold text-base">
                JP
              </div>
              {/* Name & Email */}
              <div>
                <h2 className="text-sm font-semibold text-[#101828]">
                  James Paul-smith
                </h2>
                <p className="text-sm text-[#667085]">jamesolawale@gmail.com</p>
              </div>
            </div>
          </div>

          <div
          onClick={handleAddNew}
           className="border-2 mt-6 border-dashed border-gray-300 rounded-[20px] flex flex-col items-center justify-center py-6  cursor-pointer hover:bg-gray-50 ">
            <Image src="/images/plus.png" alt="plus" width={32} height={32} />
            <span className="text-primary text-sm md:text-base">Add New</span>
          </div>
        </div>

        <div className="bg-[#FFFF] py-4 flex justify-center absolute z-10 right-0 bottom-0 w-full">
          <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full">
            <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
              Save for later
            </button>
            <button
              type="submit"
              disabled={true}
              className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                true ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {false ? (
                <BiLoaderCircle className="animate-spin mr-2" size={22} />
              ) : (
                "Continue"
              )}
            </button>
          </div>

          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
      </section>
    </>
  );
};

export default Page;







// import React from "react";
// import { FaPlus } from "react-icons/fa";

// const page = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       {/* Container */}
//       <div
//         className="
//         grid
//         grid-cols-1
//         md:grid-cols-2
//         gap-6
//         w-full
//         max-w-2xl
//         bg-white
//         p-6
//         rounded-md
//         shadow-sm
//       "
//       >
//         {/* Left Section: User Info */}
//         <div className="flex items-center space-x-4">
//           {/* Avatar */}
//           <div
//             className="
//             flex
//             items-center
//             justify-center
//             w-14
//             h-14
//             rounded-full
//             bg-gray-200
//             text-gray-800
//             font-bold
//             text-lg
//           "
//           >
//             JP
//           </div>
//           {/* Name & Email */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">
//               James Paul-smith
//             </h2>
//             <p className="text-sm text-gray-500">jamesolawale@gmail.com</p>
//           </div>
//         </div>

//         {/* Right Section: Add New */}
//         <div
//           className="
//           border-2
//           border-dashed
//           border-gray-300
//           rounded-md
//           flex
//           flex-col
//           items-center
//           justify-center
//           py-6
//           cursor-pointer
//           hover:bg-gray-50
//         "
//         >
//           <FaPlus className="text-gray-500 mb-2" size={20} />
//           <span className="text-gray-600">Add New</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;
