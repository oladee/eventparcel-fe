"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePowerSettingsNew, MdDeleteOutline } from "react-icons/md";
import { PiCaretRightBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { GoShareAndroid } from "react-icons/go";
import AddGroup from "@/components/AddGroupCaller";
import { Group } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DeleteConfirmationDialog from "@/components/modals/DeleteConfirmationDialog";
import { trackEvent } from "@/lib/mixpanel";

interface GroupOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  // eventData: {
  //   isShared?: boolean;
  // };
}

const GroupOptionsModal: React.FC<GroupOptionsModalProps> = ({
  isOpen,
  onClose,
  group,
  // eventData
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>("");

  // Focus on the modal when it opens and add Escape key support
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Share group link function
  const handleShareGroupLink = async () => {
    if (!group || !group.link) {
      alert("No link available to share.");
      return;
    }
    const shareUrl = group.link;

    if (navigator.share) {
      try {
        await navigator.share({
          title: group.groupName,
          text: `Check out the group: ${group.groupName}`,
          url: shareUrl
        });
        console.log("Group link shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else if (navigator.clipboard) {
      // Fallback: copy the link to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleDelete = async () => {
    if (!group?._id) return;

        trackEvent("Delete Group Started", {
          source: "dashboard events page",
          timestamp: new Date().toISOString(),
          page_name: "dashboard events page",
          group_Id: group?._id,
          group_name: group?.groupName,
          currency_type: group?.groupCurrency,
          group_type: group?.groupPrivacy,
        });

    try {
      await axiosInstance.delete(`/delete-group/${group._id}`);

      trackEvent("Delete Group Completed", {
        source: "dashboard events page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard events page",
        group_Id: group?._id,
        group_name: group?.groupName,
        currency_type: group?.groupCurrency,
        group_type: group?.groupPrivacy,
        status: "Sucessfull"
      });

      toast.success(`Group deleted successfully`);

      setIsDeleteModal(false);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred.";
        // setError(errorMessage);

        // Show toast notification
        toast.error(errorMessage);
        trackEvent("Delete Group Failed", {
          source: "dashboard events page",
          timestamp: new Date().toISOString(),
          page_name: "dashboard events page",
          group_Id: group?._id,
          group_name: group?.groupName,
          currency_type: group?.groupCurrency,
          group_type: group?.groupPrivacy,
          status: "Failed"
        });
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const handleDisableGroup = async () => {
    if (!group?._id) return;

    trackEvent("Disable Group Started", {
      source: "dashboard events page",
      timestamp: new Date().toISOString(),
      page_name: "dashboard events page",
      group_Id: group?._id,
      group_name: group?.groupName,
      currency_type: group?.groupCurrency,
      group_type: group?.groupPrivacy,
    });

    try {
      const isCurrentlyDisabled = group.isDisabled;
      setLoading(true);
      setLoadingMessage(isCurrentlyDisabled ? "Enabling..." : "Disabling..."); // Set appropriate loading message

      await axiosInstance.put(`/disable-enable-group/${group._id}`, {
        isDisabled: !isCurrentlyDisabled // Toggle the isDisabled state
      });
      // toast.success(response.data.message || "Group status updated successfully");
      toast.success(
        `Group ${isCurrentlyDisabled ? "enabled" : "disabled"} successfully`
      );
      
      trackEvent("Disable Group Completed", {
        source: "dashboard events page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard events page",
        group_Id: group?._id,
        group_name: group?.groupName,
        currency_type: group?.groupCurrency,
        group_type: group?.groupPrivacy,
        status: "Sucessfull"
      });

      setTimeout(() => {
        window.dispatchEvent(new Event("refreshEvents"));
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error disabling/enabling group:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update group status. Please try again.");
      }
      trackEvent("Disable Group Completed", {
        source: "dashboard events page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard events page",
        group_Id: group?._id,
        group_name: group?.groupName,
        currency_type: group?.groupCurrency,
        group_type: group?.groupPrivacy,
        status: "Failed"
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
        onClick={onClose}
        role="presentation"
      >
        <div
          ref={modalRef}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          className={`bg-white ${
            isAddGroupOpen ? "hidden" : "block"
          } w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0`}
        >
          {/* Slider indicator */}
          <div className="w-full flex justify-center">
            <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-lg font-bold">
              Group Options
            </h2>
            <button
              onClick={onClose}
              className="text-xl"
              aria-label="Close Modal"
            >
              <AiOutlineClose color="gray" />
            </button>
          </div>
          <div className="grid gap-4">
            {/* {!eventData.isShared && !group?.isDisabled && (
              <div
                className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
                onClick={() => setIsAddGroupOpen(true)}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                    <LuPencilLine size={20} />
                  </span>
                  <span className="ml-3 font-medium">Edit Group</span>
                </div>
                <PiCaretRightBold />
              </div>
            )} */}
            {!group?.isDisabled && (
              <div
                className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
                onClick={() => setIsAddGroupOpen(true)}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                    <LuPencilLine size={20} />
                  </span>
                  <span className="ml-3 font-medium">Edit Group</span>
                </div>
                <PiCaretRightBold />
              </div>
            )}

            {!group?.isDisabled && (
              <div
                className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
                onClick={handleShareGroupLink}
              >
                <div className="flex items-center">
                  <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                    <GoShareAndroid size={20} />
                  </span>
                  <span className="ml-3 font-medium">Share Group Link</span>
                </div>
                <PiCaretRightBold />
              </div>
            )}

            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={handleDisableGroup}
            >
              <div className="flex items-center">
                <span
                  className={`p-2 bg-[#FFF7F2] rounded-full ${
                    group?.isDisabled ? "text-[#319b29]" : "text-primary"
                  }`}
                >
                  <MdOutlinePowerSettingsNew size={20} />
                </span>
                <span className="ml-3 font-medium">
                  {/* {group?.isDisabled ? "Enable Group" : "Disable Group"} */}
                  {loading
                    ? loadingMessage
                    : group?.isDisabled
                    ? "Enable Group"
                    : "Disable Group"}
                </span>
              </div>
              <PiCaretRightBold />
            </div>
            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={() => setIsDeleteModal(true)}
            >
              <div className="flex items-center">
                <span className="p-2 bg-[#FFF7F2] rounded-full text-red-500">
                  <MdDeleteOutline size={20} />
                </span>
                <span className="ml-3 font-medium text-red-500">
                  Delete Group
                </span>
              </div>
              <PiCaretRightBold />
            </div>
          </div>
        </div>
      </div>
      {isAddGroupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 z-50">
          <AddGroup
            mode="availGroup"
            setIsAddGroupOpen={setIsAddGroupOpen}
            selectedGroup={group}
          />
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        onDelete={handleDelete}
      />
      <ToastContainer aria-live="polite" className="absolute " />
    </>
  );
};

export default GroupOptionsModal;
