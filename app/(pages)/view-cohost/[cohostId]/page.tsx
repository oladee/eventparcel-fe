"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { BiLoaderCircle } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import CohostActionsModal from "@/components/dashboard/cohost/CohostActionsModal";
import { useRouter as Route } from "next-nprogress-bar";
import HeaderLayout from "@/components/layout/HeaderLayout";



interface ActivityUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface EventData {
  _id: string;
  eventName: string;
  eventDescription: string;
  date: string;
  time: string;
  eventLocation: string;
}

interface GroupData {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupCurrency: string;
  groupPrivacy: string;
  isDisabled: boolean;
  contacts: any[];
  isDraft: boolean;
  link: string;
}

interface ActivityLogEntry {
  _id: string;
  timestamp: string;
  user: ActivityUser;
  event: EventData;
  group?: GroupData;
  action: string;
  actionType: "Event" | "Group";
  entity: string;
  entityType: string;
  meta: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Palette for random action color (red, green, yellow, etc.)
const actionColors = ["#C22B2F", "#F7B500", "#0CAF60"];

export default function Page() {
  const router = useRouter();
  const route = Route();

  // // Convert possible string | string[] to string:
  // const rawCohostId = params?.cohostId;
  // const cohostId = Array.isArray(rawCohostId) ? rawCohostId[0] : rawCohostId || "";
  const params = useParams();
  const searchParams = useSearchParams();

  const rawCohostId = params?.cohostId;
  const cohostId = Array.isArray(rawCohostId)
    ? rawCohostId[0]
    : rawCohostId || "";

  // Get eventId from query string
  const eventId = searchParams.get("eventId");

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // We'll store user info from logs to display in the header
  const [coHostUser, setCoHostUser] = useState<ActivityUser | null>(null);

  // Control the "More" button modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!cohostId) {
      router.replace("/login");
      return;
    }

    const fetchActivityLogs = async () => {
      try {
        // const response = await axiosInstance.get(`/get-activity-logs/${cohostId}`);
        const response = await axiosInstance.get(
          `/get-activity-logs/${cohostId}?eventId=${eventId}`
        );

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
        toast.error(error?.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [cohostId, router, eventId]);

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
      logs: grouped[dateKey]
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
      <section className="bg-[#F9FAFB] min-h-screen md:px-8 py-20 lg:py-24 px-3 sm:px-4 mx-auto  h-screen overflow-y-auto no-scrollbar">
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
        <h2 className="text-xl font-semibold text-[#111827] mb-4">
          Activity Log
        </h2>

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
                      .sort(
                        (a, b) =>
                          dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix()
                      )
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
                                {/* <button
                                  onClick={() =>
                                    alert(
                                      `Viewing ${getViewButtonText(
                                        log.entityType
                                      )} for “${log.entity}”.`
                                    )
                                  }
                                  className="text-xs font-medium bg-[#7514231F] text-[#751423] border border-[#979797] rounded-full px-4 py-1 hover:bg-gray-100"
                                >
                                  {getViewButtonText(log.entityType)}
                                </button> */}
                                <button
                                  onClick={() => {
                                    if (log.actionType === "Event") {
                                      route.push(
                                        `/dashboard/events/${log.event._id}`
                                      );
                                    } else if (log.actionType === "Group") {
                                      const groupId =
                                        log.meta?.eventGroupID ||
                                        log.group?._id;
                                      if (groupId) {
                                        route.push(
                                          `/dashboard/groups/${groupId}`
                                        );
                                      } else {
                                        toast.error("Group ID not found.");
                                      }
                                    } else {
                                      toast.error("Unknown action type.");
                                    }
                                  }}
                                  className="text-xs font-medium bg-[#7514231F] text-[#751423] border border-[#979797] rounded-full px-4 py-1 hover:bg-gray-100"
                                >
                                  {log.actionType === "Event"
                                    ? "View Event"
                                    : "View Group"}
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
          onRemove={() => setIsModalOpen(false)}
          cohost={{
            _id: cohostId,
            eventId: "placeholderEventId",
            status: true
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
// import "dayjs/locale/en";
// import { BiLoaderCircle } from "react-icons/bi";
// import { toast, ToastContainer } from "react-toastify";
// import HeaderLayout from "@/components/layout/HeaderLayout";
// import CohostActionsModal from "@/components/modals/CohostActionsModal";

// // Define interfaces for user & log entry
// interface ActivityUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
// }

// interface ActivityLogEntry {
//   timestamp: string;
//   user: ActivityUser;
//   event: string;
//   action: string;
//   entity: string;
//   entityType: string;
//   meta: Record<string, any>;
// }

// // Palette for random action color (red, green, yellow, etc.)
// const actionColors = ["#C22B2F", "#F7B500", "#0CAF60"];

// export default function Page() {
//   const params = useParams();
//   const router = useRouter();
  
//   // Convert possible string | string[] to string:
//   const rawCohostId = params?.cohostId;
//   const cohostId = Array.isArray(rawCohostId) ? rawCohostId[0] : rawCohostId || "";

//   const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   // We'll store user info from logs to display in the header
//   const [coHostUser, setCoHostUser] = useState<ActivityUser | null>(null);

//   // Control the "More" button modal
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (!cohostId) {
//       router.replace("/login");
//       return;
//     }

//     const fetchActivityLogs = async () => {
//       try {
//         const response = await axiosInstance.get(`/get-activity-logs/${cohostId}`);
//         if (response.data.success) {
//           const logs: ActivityLogEntry[] = response.data.data;
//           setActivityLogs(logs);

//           // If you want to show user info from the co-host in the header
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

//   // Group logs by date (YYYY-MM-DD)
//   const groupLogsByDate = (logs: ActivityLogEntry[]) => {
//     const grouped: Record<string, ActivityLogEntry[]> = {};
//     logs.forEach((log) => {
//       const dateKey = dayjs(log.timestamp).format("YYYY-MM-DD");
//       if (!grouped[dateKey]) {
//         grouped[dateKey] = [];
//       }
//       grouped[dateKey].push(log);
//     });

//     // Sort dates descending
//     const sortedDates = Object.keys(grouped).sort(
//       (a, b) => dayjs(b).unix() - dayjs(a).unix()
//     );

//     return sortedDates.map((dateKey) => ({
//       date: dateKey,
//       logs: grouped[dateKey],
//     }));
//   };

//   // Format the date heading e.g. "Wednesday 8 May"
//   const formatDisplayDate = (dateStr: string) => {
//     return dayjs(dateStr).format("dddd D MMMM");
//   };

//   // Format time e.g. "11:04"
//   const formatTime = (timestamp: string) => {
//     return dayjs(timestamp).format("HH:mm");
//   };

//   // Button text for different entity types
//   const getViewButtonText = (entityType: string) => {
//     if (!entityType) return "View";
//     const lower = entityType.toLowerCase();
//     if (lower.includes("event")) return "View Event";
//     if (lower.includes("group")) return "View Group";
//     return "View Group";
//   };

//   // Prepare grouped logs
//   const groupedLogs = groupLogsByDate(activityLogs);

//   // Prepare co-host info (header)
//   const coHostName = coHostUser
//     ? `${coHostUser.firstName} ${coHostUser.lastName}`
//     : "Co-host Name";
//   const coHostEmail = coHostUser?.email || "cohost@example.com";
//   const initials = coHostUser
//     ? `${coHostUser.firstName[0]}${coHostUser.lastName[0]}`.toUpperCase()
//     : "CH";

//   return (
//     <HeaderLayout>
//       <section className="bg-[#F9FAFB] min-h-screen md:px-8 py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
//         {/* Header: Avatar, name, email, More button */}
//         <div className="bg-white rounded-xl p-4 flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700">
//               {initials}
//             </div>
//             <div>
//               <h1 className="text-md font-bold text-[#101828] capitalize">
//                 {coHostName}
//               </h1>
//               <p className="text-sm text-[#667085]">{coHostEmail}</p>
//             </div>
//           </div>
//           {/* "More" button -> opens cohost actions modal */}
//           <div
//             className="text-gray-500 font-bold text-xl cursor-pointer"
//             onClick={() => setIsModalOpen(true)}
//           >
//             ...
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-xl font-semibold text-[#111827] mb-4">Activity Log</h2>

//         {loading ? (
//           <div className="flex justify-center items-center mt-10">
//             <BiLoaderCircle className="animate-spin text-gray-400" size={36} />
//           </div>
//         ) : activityLogs.length === 0 ? (
//           <div className="text-center text-gray-500 mt-10">
//             No activity logs found.
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {groupedLogs.map((group) => {
//               const dateLabel = formatDisplayDate(group.date);
//               return (
//                 <div key={group.date}>
//                   <h3 className="text-sm font-bold text-gray-600 mb-4">
//                     {dateLabel}
//                   </h3>

//                   {/* For each activity on this date */}
//                   <div className="space-y-3">
//                     {group.logs
//                       .sort((a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix())
//                       .map((log, idx) => {
//                         // Pick a color for the action text and pin
//                         const color = actionColors[idx % actionColors.length];

//                         return (
//                           <div key={idx} className="relative flex ">
//                             {/* Time stamp */}
//                             <div className="w-14 text-right text-sm text-gray-400 pr-2">
//                               {formatTime(log.timestamp)}
//                             </div>
                           


//                             {/* Activity Details and View Button */}
//                             <div className="relative flex-1 ml-4 flex flex-wrap items-center justify-between p-4 bg-white rounded-xl">
//                                 {/* Circlar pin on the left */}
//                             <div className="flex-shrink-0 w-6 flex flex-col items-center h-full border-l-2 border-[#989DB2] pl-4 absolute -left-3">
//                               <div
//                                 className="w-2 h-2 rounded-full mt-1 absolute -left-[5px] -top-2"
//                                 style={{ backgroundColor: color }}
//                               />
//                             </div>
//                               <div className="">
//                                 <div
//                                   className="text-sm font-semibold mb-1 capitalize"
//                                   style={{ color }}
//                                 >
//                                   {log.action}
//                                 </div>
//                                 <div className="text-base max-w-sm font-semibold text-[#101828] mb-1">
//                                   {log.entity}
//                                 </div>
//                                 {log.entityType && (
//                                   <div className="text-sm text-[#667085]">
//                                     {log.entityType}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="mt-2 md:mt-0">
//                                 <button
//                                   onClick={() =>
//                                     alert(
//                                       `Viewing ${getViewButtonText(log.entityType)} for “${log.entity}”.`
//                                     )
//                                   }
//                                   className="text-xs font-medium bg-[#7514231F] text-[#751423] border border-[#979797] rounded-full px-4 py-1 hover:bg-gray-100"
//                                 >
//                                   {getViewButtonText(log.entityType)}
//                                 </button>
//                               </div>
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
//       <ToastContainer />

//       {/* Cohost Actions Modal */}
//       {isModalOpen && (
//         <CohostActionsModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           cohost={{
//             _id: cohostId,
//             eventId: "placeholderEventId",
//             status: true,
//           }}
//         />
//       )}
//     </HeaderLayout>
//   );
// }






