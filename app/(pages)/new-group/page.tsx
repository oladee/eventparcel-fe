"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RightBar from "@/components/Rightbar";
import CreateGroupCaller from "@/components/AddNew";
import GeneralModal from "@/components/generalModal";
import FormButtons from "@/components/aboutEvent/FormButtons";
import { Group } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import dynamic from "next/dynamic";
// import router from "next/router";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useRouter } from "next/navigation";

const AddGroup = dynamic(() => import("@/components/AddGroupCaller"), {
  ssr: false
});

const NewGroup: React.FC = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [, setIsAddGroupOpen] = useState(false);
  const [isAddSingleGroupOpen, setIsAddSingleGroupOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(loading, error);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEventId = localStorage.getItem("eventId");

      if (!storedEventId) {
        router.replace("/event-creation");
        return;
      }

      const fetchGroups = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/view-groups/${storedEventId}`
          );
          setGroups(response.data.data);
        } catch (err) {
          console.error("Error fetching groups:", err);
          setError("Failed to fetch groups");
        } finally {
          setLoading(false);
        }
      };

      fetchGroups();
    }
  }, [router]);

  const isFormValid =
    groups.length > 0 && groups.some((group) => group.packages.length > 0);

  const handleAddGroupClick = () => {
    setIsAddGroupOpen(true);
  };

  if (loading) {
    return (
      <p className="text-xl font-semibold h-screen text-center">
        Loading groups...
      </p>
    );
  }

  return (
    <HeaderLayout>
      <section className="w-auto border border-gray-300 bg-[#EEEFF2] mt-14 h-full">
        <div className="py-6 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 lg:mb-12 text-start pl-8 lg:text-center">
            <h3
              id="header"
              className="text-2xl sm:text-3xl font-bold text-gray-900"
            >
              Event Groups & Packages
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600">
              <span id="desc">
                Create groups and packages for different types of guests
              </span>
              <Image
                onClick={() => setIsRightBarOpen(true)}
                src="/images/information.png"
                width={20}
                height={20}
                alt="information"
                className="cursor-pointer"
                id="infoButton"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-xl font-semibold h-screen text-center">
              Loading groups...
            </p>
          ) : groups.length === 0 ? (
            <div
              onClick={handleAddGroupClick}
              className="w-full flex justify-center xl:justify-start xl:pl-[380px]"
            >
              <AddGroup mode="noGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
            </div>
          ) : groups.length === 1 ? (
            <div className="flex flex-col md:flex-row gap-7 justify-center px-8">
              {groups.map((group) => (
                <GeneralModal key={group._id} group={group} />
              ))}

              {isAddSingleGroupOpen && (
                <AddGroup
                  setIsAddGroupOpen={setIsAddGroupOpen}
                  mode="noGroup"
                />
              )}
              {/* Clicking this will open AddGroup */}
              <div
                className=""
                onClick={() => setIsAddSingleGroupOpen(!isAddSingleGroupOpen)}
              >
                <CreateGroupCaller />
              </div>
            </div>
          ) : (
            // Render content for when there are multiple groups
            <div className="flex flex-col sm:flex-row lg:justify-center">
              <div className=" flex flex-wrap w-full max-w-3xl space-x-2 space-y-4 pl-6 md:pl-2 xl:pl-24 -mr-6">
                {groups.map((group) => (
                  <GeneralModal key={group._id} group={group} />
                ))}

                {isAddSingleGroupOpen && (
                  <AddGroup
                    setIsAddGroupOpen={setIsAddGroupOpen}
                    mode="noGroup"
                  />
                )}
              </div>

              <div className="px-8 md:px-0 py-4">
                {/* Clicking this will open AddGroup */}
                <div
                  className=""
                  onClick={() => setIsAddSingleGroupOpen(!isAddSingleGroupOpen)}
                >
                  <CreateGroupCaller />
                </div>
              </div>
            </div>
          )}

          {/* Right Bar */}
          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
        <FormButtons isFormValid={!!isFormValid} groups={groups}/>
      </section>
    </HeaderLayout>
  );
};

<<<<<<< HEAD
export default NewGroup;
=======
export default NewGroup;


























// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import RightBar from "@/components/Rightbar";
// import PrivateGroup from "@/components/PrivateModal";
// import AddGroup from "@/components/AddGroupCaller";
// import CreateGroupCaller from "@/components/AddNew";
// import GeneralModal from "@/components/generalModal";
// import FormButtons from "@/components/aboutEvent/FormButtons";
// import { Group } from "@/app/interface/Group";
// import axiosInstance from "@/lib/axiosInstance";

// const NewGroup: React.FC = () => {
//   const [isRightBarOpen, setIsRightBarOpen] = useState(false);
//   const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   console.log(loading, error)

//   useEffect(() => {
//     const fetchGroups = async () => {
//       setLoading(true);

//       try {
//         const response = await axiosInstance.get("/view-groups/67b776125f8354be23a58874");
//         setGroups(response.data.data);
//       } catch (err) {
//         console.error("Error fetching groups:", err);
//         setError("Failed to fetch groups");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroups();
//   }, []);

//   const isFormValid = groups.length > 0 && groups.some(group => group.packages.length > 0);
//   const hasGeneralGroup = groups.some(group => group.groupPrivacy === "general");
//   const hasPrivateGroup = groups.some(group => group.groupPrivacy === "private");

//   const handleAddGroupClick = () => {
//     setIsAddGroupOpen(true);
//   };

//   return (
//     <section className="border border-gray-300 bg-[#EEEFF2] mt-14 ">
//       <div className="py-6 lg:py-12 mx-auto max-w-7xl">
//         {/* Header Section */}
//         <div className="mb-6 lg:mb-12 text-center">
//           <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Event Groups & Packages
//           </h3>
//           <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600">
//             Create groups and packages for different types of guests
//             <Image
//               onClick={() => setIsRightBarOpen(true)}
//               src="/images/information.png"
//               width={20}
//               height={20}
//               alt="information"
//               className="cursor-pointer"
//             />
//           </p>
//         </div>

//         {/* Content Section */}
//         <div className="flex flex-col items-center sm:items-start">
//           {!hasGeneralGroup && !hasPrivateGroup ? (
//             <button onClick={handleAddGroupClick} className="w-full sm:w-auto">
//               <AddGroup mode="noGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
//             </button>
//           ) : (
//             <>
//               {/* General Groups Only */}
//               {hasGeneralGroup && !hasPrivateGroup && (
//                 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
//                     {groups
//                       .filter(group => group.groupPrivacy === "general")
//                       .map(group => (
//                         <GeneralModal key={group._id} group={group} />
//                       ))}
//                   </div>

//                   {/* Sidebar Actions */}
//                   <div className="flex flex-col space-y-4">
//                     {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />}
//                     <CreateGroupCaller />
//                   </div>
//                 </div>
//               )}

//               {/* Private Groups Only */}
//               {hasPrivateGroup && !hasGeneralGroup && (
//                 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
//                     {groups
//                       .filter(group => group.groupPrivacy === "private")
//                       .map(group => (
//                         <PrivateGroup key={group._id} group={group} />
//                       ))}
//                   </div>

//                   {/* Sidebar Actions */}
//                   <div className="flex flex-col space-y-4">
//                     {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />}
//                     <CreateGroupCaller />
//                   </div>
//                 </div>
//               )}

//               {/* Both General and Private Groups */}
//               {hasGeneralGroup && hasPrivateGroup && (
//                 <div className="grid mx-8 lg:ml-24 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 md:gap-4 gap-3">

//                   {/* CreateGroupCaller - Show only for sm and md */}
//                   <div className="sm:flex md:flex lg:hidden w-full justify-center">
//                     <CreateGroupCaller />
//                   </div>

//                   {/* General Groups */}
//                   <div className="flex flex-col gap-2">
//                     {groups?.filter(group => group.groupPrivacy === "general")?.map(group => (
//                       <GeneralModal key={group._id} group={group} />
//                     ))}
//                   </div>

//                   {/* Private Groups */}
//                   <div className="lg:ml-2 flex flex-col gap-2">
//                     {groups?.filter(group => group.groupPrivacy === "private")?.map(group => (
//                       <PrivateGroup key={group._id} group={group} />
//                     ))}
//                   </div>

//                   {/* Sidebar Actions - Show only on lg */}
//                   <div className="hidden lg:flex flex-col gap-2">
//                     {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />}
//                     <CreateGroupCaller />
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Right Bar */}
//         <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
//       </div>

//       <FormButtons
//           isFormValid={!!isFormValid}
//           onContinue={() => isFormValid && setShowSuccess(!showSuccess)}
//         />
//     </section>
//   );
// };

// export default NewGroup;
>>>>>>> 384a62119b333e3a752ede669ad0fe5c3e3bcdcd
