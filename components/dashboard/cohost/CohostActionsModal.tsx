"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import FocusLock from "react-focus-lock";
import { useRouter } from "next-nprogress-bar";
interface CohostActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohost: {
    _id: string;
    eventId: string;
    status: boolean;
  };
  onRemove: (deletedCohostId: string) => void; 
}


const CohostActionsModal: React.FC<CohostActionsModalProps> = ({
  isOpen,
  onClose,
  cohost,
  onRemove
}) => {
  const router = useRouter();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // When the modal opens, focus the modal for accessibility.
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Close modal if clicking on the backdrop.
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Close modal on Escape key.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleViewActivityLog = useCallback(() => {
    // router.push(`/dashboard/co-host/${cohost._id}`);
    router.push(`/dashboard/co-host/${cohost._id}?eventId=${cohost.eventId}`);
    onClose();
  }, [cohost._id, onClose, router, cohost.eventId]);

  const handleToggleStatus = useCallback(async () => {
    setLoadingToggle(true);
    const newStatus = false;
    try {
      await axiosInstance.post(`/disable-cohost/${cohost._id}`, {
        status: newStatus,
      });
      toast.success(`Co-host ${newStatus ? "enabled" : "disabled"} successfully.`);
      onClose();
    } catch (error: any) {
      console.error("Error toggling cohost status:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoadingToggle(false);
    }
  }, [cohost._id, onClose]);

  const handleRemoveCohost = useCallback(async () => {
    const confirmed = window.confirm("Are you sure you want to remove the co-host?");
    if (!confirmed) return;
    setLoadingRemove(true);
    try {
      await axiosInstance.put(`/remove-cohost/${cohost._id}/${cohost.eventId}`);
      toast.success("Co-host removed successfully.");
      onRemove(cohost._id); 
      onClose();
    } catch (error: any) {
      console.error("Error removing cohost:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoadingRemove(false);
    }
  }, [cohost._id, onClose, cohost.eventId, onRemove]);

  // Render into a portal so that the modal overlays the rest of the app.
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <FocusLock returnFocus>
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              tabIndex={-1}
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h2 id="modal-title" className="text-lg font-bold mb-4">
                Cohost Actions
              </h2>
              <p id="modal-description" className="text-sm text-gray-600 mb-4">
                Select an action to manage the cohost.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleViewActivityLog}
                  className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View Activity Log
                </button>
                <button
                  onClick={handleToggleStatus}
                  disabled={loadingToggle}
                  className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loadingToggle
                    ? "Processing..."
                    : cohost.status
                    ? "Disable Co-host"
                    : "Disable Co-host"}
                </button>
                <button
                  onClick={handleRemoveCohost}
                  disabled={loadingRemove}
                  className="w-full py-2 px-4 rounded-md hover:bg-red-200 text-red-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loadingRemove ? "Processing..." : "Remove Co-host"}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-md hover:bg-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </FocusLock>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CohostActionsModal;
