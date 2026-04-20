"use client";

import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DeliveryRouteDisplay } from "./types";

interface DeleteRouteModalProps {
  route: DeliveryRouteDisplay;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
  loading?: boolean;
  error?: string | null;
}

const DeleteRouteModal: React.FC<DeleteRouteModalProps> = ({
  route,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {/* Close */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-[#A0AEC0] hover:text-[#111827] transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center">
            <RiDeleteBin6Line size={26} className="text-[#D1344A]" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-center text-lg font-bold text-[#111827] mb-2">
          Delete Route
        </h2>
        <p className="text-center text-sm text-[#718096] mb-1">
          Are you sure you want to delete this route?
        </p>
        <p className="text-center text-xs text-[#98A2B3] mb-2">
          Routes linked to active or pending orders cannot be deleted.
        </p>
        <p className="text-center text-sm font-semibold text-[#111827] mb-6">
          {route.pickupState} ({route.pickupCity}) → {route.destState} ({route.destCity})
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-[44px] rounded-[8px] border border-[#EEEFF2] text-[#718096] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              const deleted = await onConfirm(route._id);
              if (deleted) {
                onClose();
              }
            }}
            disabled={loading}
            className="flex-1 h-[44px] rounded-[8px] bg-[#D1344A] text-white text-sm font-semibold hover:bg-[#a8283b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRouteModal;
