"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/dashboard/Container";
import PackagesSection from "@/components/dashboard/eventComponents/PackagesSection";
import EventDetailsSection from "@/components/dashboard/eventComponents/EventDetailsSection";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { motion } from "framer-motion";

const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEventId = localStorage.getItem("eventId");
      if (!storedEventId) {
        router.replace("/event-creation");
        return;
      }

      const fetchEventData = async () => {
        try {
          const response = await axiosInstance.get(
            `/view-event/${storedEventId}`
          );
          if (response.data.success) {
            setEventData(response.data.data);
          } else {
            setError("Failed to fetch event data.");
          }
        } catch (error: any) {
          console.error("Error fetching event:", error);
          setError(error.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();
    }
  }, [router]);

  const handleAddGroupClick = () => {
    router.push("/new-group");
  };

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center min-h-screen">
          {/* Animated Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-[#751423] border-gray-300 rounded-full"
          ></motion.div>

          {/* Skeleton Effect for Loading Content */}
          <div className="mt-6 w-[80%] max-w-md bg-white p-4 shadow-lg rounded-xl">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <Container>
      <EventDetailsSection eventData={eventData} />
      {eventData?.eventGroups?.length > 0 ? (
        <PackagesSection eventData={eventData} />
      ) : (
        <div className="flex justify-center">
          <div
            className="flex w-full max-w-2xl h-[100px] mt-5 rounded-2xl flex-col border-[2px] border-dashed justify-center items-center ml-[5px] bg-[#FFFFFF66] cursor-pointer"
            onClick={handleAddGroupClick}
          >
            <Image src="/images/plus.png" alt="plus" width={32} height={32} />
            <span className="font-general font-semibold text-sm text-[#751423]">
              Add Groups
            </span>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Page;

// "use client";

// import React, { useEffect, useState } from "react";
// import Container from "@/components/dashboard/Container";
// import PackagesSection from "@/components/dashboard/eventComponents/PackagesSection";
// import EventDetailsSection from "@/components/dashboard/eventComponents/EventDetailsSection";
// import axiosInstance from "@/lib/axiosInstance";
// import { useRouter } from "next-nprogress-bar";
// import Image from "next/image";

// const Page: React.FC = () => {
//   const [eventData, setEventData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedEventId = localStorage.getItem("eventId");
//       if (!storedEventId) {
//         router.replace("/event-creation");
//         return;
//       }

//       // Fetch event data using the stored event ID
//       const fetchEventData = async () => {
//         try {
//           const response = await axiosInstance.get(
//             `/view-event/${storedEventId}`
//           );
//           if (response.data.success) {
//             setEventData(response.data.data);
//           } else {
//             setError("Failed to fetch event data.");
//           }
//         } catch (error: any) {
//           console.error("Error fetching event:", error);
//           setError(error.response?.data?.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchEventData();
//     }
//   }, [router]);

//   const handleAddGroupClick = () => {
//     router.push("/new-group");
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <Container>
//       {/* Pass the eventData to both child components */}
//       <EventDetailsSection eventData={eventData} />
//       {/* <PackagesSection eventData={eventData} /> */}
//       {eventData?.eventGroups?.length > 0 ? (
//         <PackagesSection eventData={eventData} />
//       ) : (
//         // <button
//         //   onClick={() => router.push("/add-group")}
//         //   className="bg-blue-500 text-white px-4 py-2 rounded"
//         // >
//         //   Add a group
//         // </button>
//         <div className="flex justify-center">
//           <div
//             className="flex w-full max-w-2xl h-[100px] mt-5 rounded-2xl flex-col border-[2px] border-dashed justify-center items-center ml-[5px] bg-[#FFFFFF66] cursor-pointer"
//             onClick={handleAddGroupClick}
//           >
//             <Image src="/images/plus.png" alt="plus" width={32} height={32} />
//             <span className="font-general font-semibold text-sm text-[#751423]">
//               Add Groups
//             </span>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default Page;
