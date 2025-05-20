"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { BiLoaderCircle } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import HeaderLayout from "@/components/layout/HeaderLayout";
import CohostActionsModal from "@/components/modals/CohostActionsModal";

// Define interfaces for user & log entry
interface ActivityUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ActivityLogEntry {
  timestamp: string;
  user: ActivityUser;
  event: string;
  action: string;
  entity: string;
  entityType: string;
  meta: Record<string, any>;
}

// Palette for random action color (red, green, yellow, etc.)
const actionColors = ["#C22B2F", "#F7B500", "#0CAF60"];

export default function Page() {
  const params = useParams();
  const router = useRouter();
  
  // Convert possible string | string[] to string:
  const rawCohostId = params?.cohostId;
  const cohostId = Array.isArray(rawCohostId) ? rawCohostId[0] : rawCohostId || "";

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // We'll store user info from logs to display in the header
  const [coHostUser, setCoHostUser] = useState<ActivityUser | null>(null);

  // Control the "More" button modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!cohostId) {
      router.replace("/");
      return;
    }

    const fetchActivityLogs = async () => {
      try {
        const response = await axiosInstance.get(`/get-activity-logs/${cohostId}`);
        if (response.data.success) {
          const logs: ActivityLogEntry[] = response.data.data;
          setActivityLogs(logs);

          // If you want to show user info from the co-host in the header
          if (logs.length > 0) {
            setCoHostUser(logs[0].user);
          }
        } else {
          toast.error(response.data.message || "Failed to fetch logs.");
        }
      } catch (error: any) {
        console.error("Error fetching logs:", error);
        toast.error("An error occurred while fetching activity logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [cohostId, router]);

  // Group logs by date (YYYY-MM-DD)
  const groupLogsByDate = (logs: ActivityLogEntry[]) => {
    const grouped: Record<string, ActivityLogEntry[]> = {};
    logs.forEach((log) => {
      const dateKey = dayjs(log.timestamp).format("YYYY-MM-DD");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(log);
    });

    // Sort dates descending
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => dayjs(b).unix() - dayjs(a).unix()
    );

    return sortedDates.map((dateKey) => ({
      date: dateKey,
      logs: grouped[dateKey],
    }));
  };

  // Format the date heading e.g. "Wednesday 8 May"
  const formatDisplayDate = (dateStr: string) => {
    return dayjs(dateStr).format("dddd D MMMM");
  };

  // Format time e.g. "11:04"
  const formatTime = (timestamp: string) => {
    return dayjs(timestamp).format("HH:mm");
  };

  // Button text for different entity types
  const getViewButtonText = (entityType: string) => {
    if (!entityType) return "View";
    const lower = entityType.toLowerCase();
    if (lower.includes("event")) return "View Event";
    if (lower.includes("group")) return "View Group";
    return "View Group";
  };

  // Prepare grouped logs
  const groupedLogs = groupLogsByDate(activityLogs);

  // Prepare co-host info (header)
  const coHostName = coHostUser
    ? `${coHostUser.firstName} ${coHostUser.lastName}`
    : "Co-host Name";
  const coHostEmail = coHostUser?.email || "cohost@example.com";
  const initials = coHostUser
    ? `${coHostUser.firstName[0]}${coHostUser.lastName[0]}`.toUpperCase()
    : "CH";

  return (
    <HeaderLayout>
      <section className="bg-[#F9FAFB] min-h-screen md:px-8 py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
        {/* Header: Avatar, name, email, More button */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700">
              {initials}
            </div>
            <div>
              <h1 className="text-md font-bold text-[#101828] capitalize">
                {coHostName}
              </h1>
              <p className="text-sm text-[#667085]">{coHostEmail}</p>
            </div>
          </div>
          {/* "More" button -> opens cohost actions modal */}
          <div
            className="text-gray-500 font-bold text-xl cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            ...
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#111827] mb-4">Activity Log</h2>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <BiLoaderCircle className="animate-spin text-gray-400" size={36} />
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No activity logs found.
          </div>
        ) : (
          <div className="space-y-8">
            {groupedLogs.map((group) => {
              const dateLabel = formatDisplayDate(group.date);
              return (
                <div key={group.date}>
                  <h3 className="text-sm font-bold text-gray-600 mb-4">
                    {dateLabel}
                  </h3>

                  {/* For each activity on this date */}
                  <div className="space-y-3">
                    {group.logs
                      .sort((a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix())
                      .map((log, idx) => {
                        // Pick a color for the action text and pin
                        const color = actionColors[idx % actionColors.length];

                        return (
                          <div key={idx} className="relative flex ">
                            {/* Time stamp */}
                            <div className="w-14 text-right text-sm text-gray-400 pr-2">
                              {formatTime(log.timestamp)}
                            </div>
                           


                            {/* Activity Details and View Button */}
                            <div className="relative flex-1 ml-4 flex flex-wrap items-center justify-between p-4 bg-white rounded-xl">
                                {/* Circlar pin on the left */}
                            <div className="flex-shrink-0 w-6 flex flex-col items-center h-full border-l-2 border-[#989DB2] pl-4 absolute -left-3">
                              <div
                                className="w-2 h-2 rounded-full mt-1 absolute -left-[5px] -top-2"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                              <div className="">
                                <div
                                  className="text-sm font-semibold mb-1 capitalize"
                                  style={{ color }}
                                >
                                  {log.action}
                                </div>
                                <div className="text-base max-w-sm font-semibold text-[#101828] mb-1">
                                  {log.entity}
                                </div>
                                {log.entityType && (
                                  <div className="text-sm text-[#667085]">
                                    {log.entityType}
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 md:mt-0">
                                <button
                                  onClick={() =>
                                    alert(
                                      `Viewing ${getViewButtonText(log.entityType)} for “${log.entity}”.`
                                    )
                                  }
                                  className="text-xs font-medium bg-[#7514231F] text-[#751423] border border-[#979797] rounded-full px-4 py-1 hover:bg-gray-100"
                                >
                                  {getViewButtonText(log.entityType)}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <ToastContainer />

      {/* Cohost Actions Modal */}
      {isModalOpen && (
        <CohostActionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cohost={{
            _id: cohostId,
            eventId: "placeholderEventId",
            status: true,
          }}
        />
      )}
    </HeaderLayout>
  );
}










// "use client";
// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axiosInstance from "@/lib/axiosInstance";
// import dayjs from "dayjs";
// import "dayjs/locale/en"; // or your preferred locale
// import { BiLoaderCircle } from "react-icons/bi";
// import { toast, ToastContainer } from "react-toastify";
// import HeaderLayout from "@/components/layout/HeaderLayout"; // Update if you have a different layout

// // Define the interface for user
// interface ActivityUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
// }

// // Define the interface for a single log entry
// interface ActivityLogEntry {
//   timestamp: string;
//   user: ActivityUser;
//   event: string;
//   action: string;
//   entity: string;
//   entityType: string;
//   meta: Record<string, any>;
// }

// // For random action color assignment
// const actionColors = ["#F04438", "#42BA96", "#FFC107"]; // Red, Green, Yellow

// export default function Page() {
//   const params = useParams();
//   const router = useRouter();
//   const cohostId = params?.cohostId || "";

//   const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
//   const [loading, setLoading] = useState(true);

//   // We'll store user info (from the logs) here, in case we want to display
//   // the co-host's name & email at the top. We'll assume all logs come from the same user
//   // or use the first log's user as the "co-host" user.
//   const [coHostUser, setCoHostUser] = useState<ActivityUser | null>(null);

//   useEffect(() => {
//     if (!cohostId) {
//       router.replace("/");
//       return;
//     }

//     const fetchActivityLogs = async () => {
//       try {
//         // e.g. GET /get-activity-logs/67dc75f5e6d185c0143ec15e
//         const response = await axiosInstance.get(`/get-activity-logs-dummy/${cohostId}`);
//         if (response.data.success) {
//           const logs: ActivityLogEntry[] = response.data.data;
//           setActivityLogs(logs);

//           // If needed, we can pull the user info from the first log (assuming same user)
//           if (logs.length > 0) {
//             setCoHostUser(logs[0].user);
//           }
//         } else {
//           toast.error(response.data.message || "Failed to fetch logs.");
//         }
//       } catch (error: any) {
//         console.error("Error fetching logs:", error);
//         toast.error("An error occurred while fetching activity logs.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivityLogs();
//   }, [cohostId, router]);

//   // Group logs by date so we can display them under headings (e.g., "Wednesday 8 May")
//   const groupLogsByDate = (logs: ActivityLogEntry[]) => {
//     const grouped: Record<string, ActivityLogEntry[]> = {};
//     logs.forEach((log) => {
//       const dateKey = dayjs(log.timestamp).format("YYYY-MM-DD");
//       if (!grouped[dateKey]) {
//         grouped[dateKey] = [];
//       }
//       grouped[dateKey].push(log);
//     });

//     // Sort the date keys descending or ascending as you prefer
//     const sortedDates = Object.keys(grouped).sort((a, b) =>
//       // For descending order by date:
//       dayjs(b).unix() - dayjs(a).unix()
//     );

//     // Return an array of { date, logs[] }
//     return sortedDates.map((dateKey) => ({
//       date: dateKey,
//       logs: grouped[dateKey],
//     }));
//   };

//   // Format date heading, e.g. "Wednesday 8 May"
//   const formatDisplayDate = (dateStr: string) => {
//     return dayjs(dateStr).format("dddd D MMMM");
//   };

//   // Format time, e.g. "11:04"
//   const formatTime = (timestamp: string) => {
//     return dayjs(timestamp).format("HH:mm");
//   };

//   // If you want to map entityType => "View Event" / "View Group" button text
//   const getViewButtonText = (entityType: string) => {
//     if (!entityType) return "View";
//     const lower = entityType.toLowerCase();
//     if (lower.includes("event")) return "View Event";
//     if (lower.includes("group")) return "View Group";
//     return "View";
//   };

//   const groupedLogs = groupLogsByDate(activityLogs);

//   // If we have user info, let's create an avatar
//   const coHostName = coHostUser
//     ? `${coHostUser.firstName} ${coHostUser.lastName}`
//     : "Co-host Name";
//   const coHostEmail = coHostUser?.email || "cohost@example.com";
//   // Avatar initials
//   const initials = coHostUser
//     ? `${coHostUser.firstName[0]}${coHostUser.lastName[0]}`.toUpperCase()
//     : "CH";

//   return (
//     <HeaderLayout>
//       <ToastContainer />
//       {/* Container */}
//       <section className="bg-[#F9FAFB] min-h-screen py-4 px-4 md:px-8 mt-72">
//         {/* Top Section with Avatar, Name, Email, More button */}
//         <div className="bg-white rounded-xl p-4 flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-4">
//             {/* Avatar */}
//             <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700">
//               {initials}
//             </div>
//             {/* User info */}
//             <div>
//               <h1 className="text-md font-bold text-[#101828] capitalize">{coHostName}</h1>
//               <p className="text-sm text-[#667085]">{coHostEmail}</p>
//             </div>
//           </div>
//           {/* More button */}
//           <div className="text-gray-500 font-bold text-xl cursor-pointer">...</div>
//         </div>

//         <h2 className="text-xl font-semibold text-[#101828] mb-4">Activity Log</h2>

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center items-center mt-10">
//             <BiLoaderCircle className="animate-spin text-gray-400" size={36} />
//           </div>
//         ) : activityLogs.length === 0 ? (
//           // No logs
//           <div className="text-center text-gray-500 mt-10">
//             No activity logs found.
//           </div>
//         ) : (
//           // Render grouped logs
//           <div className="space-y-8">
//             {groupedLogs.map((group) => {
//               // e.g. group.date = "2025-05-08"
//               const dateLabel = formatDisplayDate(group.date);

//               return (
//                 <div key={group.date}>
//                   <h3 className="text-sm font-bold text-gray-600 mb-4">
//                     {dateLabel}
//                   </h3>
//                   {/* Each day's logs */}
//                   <div className="relative ml-4 border-l-2 border-gray-200 space-y-6 pl-4">
//                     {group.logs
//                       .sort(
//                         (a, b) =>
//                           dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix()
//                       )
//                       .map((log, idx) => {
//                         // Random color for the action text & pin
//                         const color = actionColors[idx % actionColors.length];

//                         return (
//                           <div
//                             key={idx}
//                             className="relative flex items-start md:items-center"
//                           >
//                             {/* Pin circle */}
//                             <div
//                               className="absolute -left-[22px] top-0 w-3 h-3 rounded-full"
//                               style={{
//                                 backgroundColor: color,
//                               }}
//                             />
//                             {/* Time */}
//                             <div className="mr-4 text-sm text-gray-400 min-w-[40px]">
//                               {formatTime(log.timestamp)}
//                             </div>
//                             {/* Action & Entity Info */}
//                             <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center">
//                               <div className="space-y-1">
//                                 <div className="flex items-center flex-wrap text-sm">
//                                   {/* Action */}
//                                   <span
//                                     className="font-semibold mr-2 capitalize"
//                                     style={{ color }}
//                                   >
//                                     {log.action}
//                                   </span>
//                                   {/* Entity */}
//                                   <span className="font-semibold text-[#101828]">
//                                     {log.entity}
//                                   </span>
//                                 </div>
//                                 {/* EntityType in smaller gray text */}
//                                 {log.entityType && (
//                                   <div className="text-xs text-[#667085]">
//                                     {log.entityType}
//                                   </div>
//                                 )}
//                               </div>
//                               {/* "View" Button (e.g. "View Group") */}
//                               <button
//                                 onClick={() =>
//                                   alert(
//                                     `Viewing ${log.entityType} details for “${log.entity}”.`
//                                   )
//                                 }
//                                 className="mt-2 md:mt-0 ml-0 md:ml-4 text-sm font-semibold text-[#344054] border border-[#D0D5DD] rounded-full px-4 py-1 hover:bg-gray-100"
//                               >
//                                 {getViewButtonText(log.entityType)}
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </section>
//     </HeaderLayout>
//   );
// }
