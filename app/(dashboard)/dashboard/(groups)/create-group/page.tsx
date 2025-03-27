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
import { useRouter } from "next/navigation";
import Container from "@/components/dashboard/Container";
import { toast } from "react-toastify";
import axios from "axios";

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
  const [, setIsDialogOpen] = useState(false);
  

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

   
  const handleDuplicate = async (groupId: string) => {
    try {
      const response = await axiosInstance.get(`/clone-group/${groupId}`);
  
      if (!response) throw new Error("Failed to duplicate group");
  
      await response.data.data;
      // setGroups((prevGroups) => [...prevGroups, data]);
      window.location.reload()
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {

    try {
      await axiosInstance.delete(`/delete-group/${groupId}`);
      setGroups((prevGroups) => prevGroups.filter((group) => group._id !== groupId));

      toast.success(`Group deleted successfully `, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light"
      });

      setIsDialogOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred.";

        // Show toast notification
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

 

  return (
    <Container>
      <section className="w-auto h-full">
        <div className="py-6 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 lg:mb-12 text-start pl-5 lg:text-center">
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
            <div className="h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#751423] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-[#751423] mt-4">Loading groups...</p>
            </div>
          </div>
          ) : groups.length === 0 ? (
            <div
              onClick={handleAddGroupClick}
              className="w-full flex justify-center xl:justify-start xl:pl-[380px]"
              >
              <AddGroup mode="noGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
            </div>
          ) : groups.length === 1 ? (
            <div className="flex flex-col md:flex-row gap-7 justify-center px-5">
              {groups.map((group) => (
                  <GeneralModal key={group._id} group={group} handleDuplicate={handleDuplicate}  handleDeleteGroup={handleDeleteGroup} />
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
              <div className=" flex flex-wrap w-full max-w-3xl space-x-2 space-y-4 pl-3 md:pl-2 xl:pl-24 -mr-6">
                {groups.map((group) => (
                  <GeneralModal key={group._id} group={group} handleDuplicate={handleDuplicate}  handleDeleteGroup={handleDeleteGroup} />
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
        <FormButtons fromDashboard={true} isFormValid={!!isFormValid} groups={groups}/>
      </section>
    </Container>
  );
};

export default NewGroup;
