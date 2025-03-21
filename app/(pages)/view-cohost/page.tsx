"use client";

import RightBar from "@/components/Rightbar";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";

import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderLayout from "@/components/layout/HeaderLayout";

const Page = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [coHosts, setCoHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/add-cohost");
  };

  const handleContinue = () => {
    router.push("/new-group");
  };

  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEventId = localStorage.getItem("eventId");
      // const storedEventId = "67d4b39a98acd292aa0daa32";
      if (!storedEventId) {
        router.replace("/event-creation");
        return;
      }
      
    const fetchCoHosts = async () => {
      try {
        const response = await axiosInstance.get(`/view-cohosts/${storedEventId}`);
        if (response.data.success) {
          setCoHosts(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error: any) {
        console.log(error);
        toast.error("Failed to fetch co-hosts.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoHosts();
  }
  }, []);

  return (
    <HeaderLayout>
      <ToastContainer />
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

          {loading ? (
            <div className="flex justify-center items-center">
              <BiLoaderCircle className="animate-spin" size={32} />
            </div>
          ) : coHosts.length === 0 ? (
            <div className="text-center text-gray-500">
              No co-hosts found. Please add a co-host.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {coHosts.map((coHost: any) => (
                <div
                  key={coHost._id}
                  className="flex items-center space-x-4 bg-white rounded-[12px] p-4"
                >
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C4C4C466] text-gray-800 font-bold text-base">
                    {coHost.firstName[0]}
                    {coHost.lastName[0]}
                  </div>
                  {/* Name & Email */}
                  <div>
                    <h2 className="text-sm font-semibold text-[#101828]">
                      {coHost.firstName} {coHost.lastName}
                    </h2>
                    <p className="text-sm text-[#667085]">{coHost.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={handleAddNew}
            className="border-2 mt-6 border-dashed border-gray-300 rounded-[20px] flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50"
          >
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
              onClick={handleContinue}
              disabled={false}
              className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                false ? "opacity-50 cursor-not-allowed" : ""
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
    </HeaderLayout>
  );
};

export default Page;

























// "use client";

// import RightBar from "@/components/Rightbar";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import { BiLoaderCircle } from "react-icons/bi";

// import "react-datepicker/dist/react-datepicker.css";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const Page = () => {
//   const [isRightBarOpen, setIsRightBarOpen] = useState(false);
//   const [coHosts, setCoHosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const handleAddNew = () => {
//     router.push("/create-cohost");
//   };

//   const handleContinue = () => {
//     router.push("/payment-delivery");
//   };

//   useEffect(() => {
//     const fetchCoHosts = async () => {
//       try {
//         const response = await axiosInstance.get("/view-cohosts");
//         if (response.data.success) {
//           setCoHosts(response.data.data);
//         } else {
//           toast.error(response.data.message);
//         }
//       } catch (error:any) {
//         console.log(error);
//         toast.error("Failed to fetch co-hosts.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoHosts();
//   }, []);

//   return (
//     <>
//       <ToastContainer />
//       <section className="bg-[#F9FAFB] !overflow-hidden relative">
//         <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
//           <div className="mb-4 md:mb-12 text-center p-3 sm:p-0 space-y-3">
//             <h1
//               id="payment_deliveryHeader"
//               className="text-2xl sm:text-3xl font-bold text-[#111827]"
//             >
//               Add a Co-host
//             </h1>
//             <p id="payment_deliveryDesc" className="gap-3">
//               <span className="mr-2">
//                 Enter the name and email address of your co-host
//               </span>
//               <span
//                 onClick={() => setIsRightBarOpen(true)}
//                 className="px-2 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
//               >
//                 !
//               </span>
//             </p>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center">
//               <BiLoaderCircle className="animate-spin" size={32} />
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-6">
//               {coHosts.map((coHost: any) => (
//                 <div
//                   key={coHost._id}
//                   className="flex items-center space-x-4 bg-white rounded-[12px] p-4"
//                 >
//                   {/* Avatar */}
//                   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C4C4C466] text-gray-800 font-bold text-base">
//                     {coHost.firstName[0]}
//                     {coHost.lastName[0]}
//                   </div>
//                   {/* Name & Email */}
//                   <div>
//                     <h2 className="text-sm font-semibold text-[#101828]">
//                       {coHost.firstName} {coHost.lastName}
//                     </h2>
//                     <p className="text-sm text-[#667085]">{coHost.email}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div
//             onClick={handleAddNew}
//             className="border-2 mt-6 border-dashed border-gray-300 rounded-[20px] flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50"
//           >
//             <Image src="/images/plus.png" alt="plus" width={32} height={32} />
//             <span className="text-primary text-sm md:text-base">Add New</span>
//           </div>
//         </div>

//         <div className="bg-[#FFFF] py-4 flex justify-center absolute z-10 right-0 bottom-0 w-full">
//           <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full">
//             <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//               Save for later
//             </button>
//             <button
//               type="submit"
//               onClick={handleContinue}
//               disabled={false}
//               className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//                 false ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {false ? (
//                 <BiLoaderCircle className="animate-spin mr-2" size={22} />
//               ) : (
//                 "Continue"
//               )}
//             </button>
//           </div>

//           <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
//         </div>
//       </section>
//     </>
//   );
// };

// export default Page;
