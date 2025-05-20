"use client";

import { useEffect, useState } from "react";
// import Image from "next/image";
import RightBar from "@/components/Rightbar";
import CreateGroupCaller from "@/components/AddNew";
import GeneralModal from "@/components/generalModal";
import FormButtons from "@/components/aboutEvent/FormButtons";
import { Group } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Container from "@/components/dashboard/Container";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { trackEvent } from "@/lib/mixpanel";


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
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [selectedGroupToDelete, setSelectedGroupToDelete] = useState<Group | null>(null);


  useEffect(() => {
    Cookies.remove("redirectAfterLogin");
  }, []);
  

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
    setLoadingGroup(true);
    try {
      const response = await axiosInstance.get(`/clone-group/${groupId}`);

      if (!response) throw new Error("Failed to duplicate group");

      await response.data.data;
      trackEvent("Duplicate Group", {
        source: "New-group page",
        timestamp: new Date().toISOString(),
        page_name: "new-group page",
        group_Id: response.data.data._id,
        group_name: response.data.data.groupName,
        currency_type: response.data.data.groupCurrency,
        group_type: response.data.data.groupPrivacy,
        status: "Successful"
      });
      // setGroups((prevGroups) => [...prevGroups, data]);
      window.location.reload();
    } catch (error: any) {
      toast.error("Error duplicating group");
      console.error(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred."
      );

      trackEvent("Duplicate Group Failed", {
        source: "New-group page",
        timestamp: new Date().toISOString(),
        page_name: "new-group page",
        status: "Failed",
      });

    } finally {
      setLoadingGroup(false);
    }
  };


  const handleSelectGroupToDelete = (group: Group) => {
    setSelectedGroupToDelete(group); 
  };

  const handleDeleteGroup = async (groupId: string) => {
    console.log("del", selectedGroupToDelete)

    trackEvent("Delete Group Started", {
      source: "New-group page",
      timestamp: new Date().toISOString(),
      page_name: "new-group page",
      group_Id: selectedGroupToDelete?._id,
      group_name: selectedGroupToDelete?.groupName,
      currency_type: selectedGroupToDelete?.groupCurrency,
      group_type: selectedGroupToDelete?.groupPrivacy,
    });
    
    try {
      await axiosInstance.delete(`/delete-group/${groupId}`);
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group._id !== groupId)
      );

      trackEvent("Deleted Group Completed", {
        source: "New-group page",
        timestamp: new Date().toISOString(),
        page_name: "new-group page",
        group_Id: selectedGroupToDelete?._id,
        group_name: selectedGroupToDelete?.groupName,
        currency_type: selectedGroupToDelete?.groupCurrency,
        group_type: selectedGroupToDelete?.groupPrivacy,
        status: "Successful"
      });

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
      
      trackEvent("Deleted Group Failed", {
        source: "New-group page",
        timestamp: new Date().toISOString(),
        page_name: "new-group page",
        group_Id: selectedGroupToDelete?._id,
        group_name: selectedGroupToDelete?.groupName,
        currency_type: selectedGroupToDelete?.groupCurrency,
        group_type: selectedGroupToDelete?.groupPrivacy,
        status: "Failed"
      });

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
    <>
    <ToastContainer />
    <Container>
      <section className="flex flex-col w-auto h-screen">
        <div className="py-6 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 lg:mb-12 text-start pl-5 lg:text-center">
            <h3
              id="header"
              className="text-2xl sm:text-3xl font-bold text-gray-900"
              >
              Event Groups & Packages
            </h3>
            <div className="w-[313px] lg:w-full flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600">
              <span id="desc">
                Create groups and packages for different types of guests
                <span
                  onClick={() => setIsRightBarOpen(true)}
                  className="px-2 text-sm cursor-pointer ml-2 rounded-[200px] bg-[#ECB795] text-white"
                >
                  !
                </span> 
              </span>
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
            className="w-full flex justify-center xl:justify-start xl:pl-[380px] h-full"
            >
              <AddGroup mode="noGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
            </div>
          ) : groups.length === 1 ? (
            <div className="flex flex-col md:flex-row gap-7 justify-center px-5">
               {groups.map((group) => (
                <GeneralModal
                  key={group._id}
                  group={group}
                  handleDuplicate={handleDuplicate}
                  handleDeleteGroup={handleDeleteGroup}
                  loadingGroup={loadingGroup}
                  onSelectGroupToDelete={handleSelectGroupToDelete}
                />
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
                <GeneralModal
                  key={group._id}
                  group={group}
                  handleDuplicate={handleDuplicate}
                  handleDeleteGroup={handleDeleteGroup}
                  loadingGroup={loadingGroup}
                  onSelectGroupToDelete={handleSelectGroupToDelete}
                />
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
          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
          {/* Right Bar */}
            <FormButtons fromDashboard={true} isFormValid={!!isFormValid} groups={groups}/>
      </section>
    </Container>
    </>
  );
};

export default NewGroup;
