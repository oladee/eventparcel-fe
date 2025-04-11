"use client";
import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface CohostActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohost: {
    _id: string;
    eventId: string;
    status: boolean;
  };
}

const CohostActionsModal: React.FC<CohostActionsModalProps> = ({ isOpen, onClose, cohost }) => {
  const router = useRouter();

  if (!isOpen) return null;

  // Route to view activity log for the given co-host
  const handleViewActivityLog = () => {
    router.push(`/view-cohost/${cohost._id}`);
    onClose();
  };

  // Toggle status: if cohost.status is true, show "Enable Co-host", if false, show "Disable Co-host"
  const handleToggleStatus = async () => {
    // Toggle the status
    const newStatus = !cohost.status;
    try {
      await axiosInstance.post(`/disable-cohost/${cohost._id}`, {
        status: newStatus,
      });
      toast.success(`Co-host ${newStatus ? "Disabled" : "Enabled"} successfully.`);
      onClose();
      // Optionally trigger a refresh in the parent view to update the list
    } catch (error: any) {
      console.error("Error toggling cohost status:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Remove co-host after confirmation
  const handleRemoveCohost = async () => {
    const confirmation = window.confirm("Are you sure you want to remove the co-host?");
    if (!confirmation) return;
    try {
      await axiosInstance.delete(`/remove-cohost/${cohost._id}`);
      toast.success("Co-host removed successfully.");
      onClose();
      // Optionally trigger a refresh in the parent view to update the list
    } catch (error: any) {
      console.error("Error removing cohost:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Co-host Actions</h2>
        <button
          onClick={handleViewActivityLog}
          className="w-full py-2 px-4 mb-3 border rounded hover:bg-gray-100"
        >
          View Activity Log 
        </button>
        <button
          onClick={handleToggleStatus}
          className="w-full py-2 px-4 mb-3 border rounded hover:bg-gray-100"
        >
          {cohost.status ? "Enable Co-host" : "Disable Co-host"}
        </button>
        <button
          onClick={handleRemoveCohost}
          className="w-full py-2 px-4 mb-3 border rounded hover:bg-gray-100"
        >
          Remove Co-host
        </button>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CohostActionsModal;
