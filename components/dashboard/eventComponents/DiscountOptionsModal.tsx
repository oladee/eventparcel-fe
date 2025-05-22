import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { PiCaretRightBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { trackEvent } from "@/lib/mixpanel";

interface DiscountOptionsModalProps {
  isOpen: boolean;
  onClose: (dataUpdated: boolean) => void;
  discountData?: any;
}

const DiscountOptionsModal = ({ isOpen, onClose, discountData }: DiscountOptionsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose(false); // Send false for no data update
  };

  const handleEdit = () => {
    if (!discountData) {
      toast.error("No discount data available for editing");
      return;
    }

    try {
      const discountToEdit = {
        _id: discountData._id,
        event: discountData.event?.eventName,
        discountTitle: discountData.discountTitle,
        discountValue: discountData.discountValue,
        discountValueType: discountData.discountValueType,
        discountCode: discountData.discountCode,
        isDisabled: discountData.isDisabled
      };

      router.push(`/dashboard/editDiscount/?data=${encodeURIComponent(JSON.stringify(discountToEdit))}`);
    } catch (error) {
      console.error("Error preparing discount data for edit:", error);
      toast.error("Failed to prepare discount for editing");
    }
  };

  const handleDisableDiscount = async () => {
    if (!discountData?._id) {
      toast.error("No discount selected");
      return;
    }

    trackEvent("Disable/Delete Discount Started", {
      source: "dashboard discount page",
      timestamp: new Date().toISOString(),
      page_name: "dashboard discount page",
      discount_id: discountData?._id
    });

    try {
      const isCurrentlyDisabled = discountData.discountStatus;

      // Toggle the discount status between "active" and "inactive"
      const updatedStatus = isCurrentlyDisabled === "inactive" ? "active" : "inactive";
      
      // Set loading state and message
      setLoading(true);
      setLoadingMessage(isCurrentlyDisabled ? "Enabling..." : "Disabling...");

      // Prepare the payload with the correct discount status
      const payload = {
        discountStatus: updatedStatus, 
      };

      // Make the API request to update the discount status
      const response = await axiosInstance.put(
        `/update-discount/${discountData._id}`,
        payload
      );

      trackEvent("Disable/Delete Discount End", {
        source: "dashboard discount page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard discount page",
        discount_id: discountData?._id,
        discount_title: discountData.discountTitle,
        discount_value: discountData.discountValue,
        discount_value_type: discountData.discountValueType,
        discount_code: discountData.discountCode,
        status: "Successfull"
      });

      // Trigger a refresh of the discounts list
      window.dispatchEvent(new Event("refreshDiscounts"));
      toast.success(response.data.message);
      onClose(true); // Send true for data update
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to update discount status. Please try again.";
      toast.error(errMsg);
      
      trackEvent("Disable/Delete Discount Failed", {
        source: "dashboard discount page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard discount page",
        discount_id: discountData?._id,
        discount_title: discountData.discountTitle,
        discount_value: discountData.discountValue,
        discount_value_type: discountData.discountValueType,
        discount_code: discountData.discountCode,
        status: "Failed"
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50`}
        onClick={() => onClose(false)} 
        role="presentation"
      >
        <div
          ref={modalRef}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0"
        >
          {/* Slider indicator */}
          <div className="w-full flex justify-center mb-3">
            <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]" />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-lg font-bold">Options</h2>
            <button 
              onClick={() => onClose(false)} // Send false when clicking close button
              className="text-xl" 
              aria-label="Close Modal"
              disabled={loading}
            >
              <AiOutlineClose color={loading ? "#ccc" : "gray"} />
            </button>
          </div>

          <div className="grid gap-4">
            <button
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100 w-full text-left"
              onClick={handleEdit}
              disabled={loading}
            >
              <div className="flex items-center">
                <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                  <LuPencilLine size={20} />
                </span>
                <span className="ml-3 font-medium">Edit Discount</span>
              </div>
              <PiCaretRightBold />
            </button>

            <button
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100 w-full text-left"
              onClick={handleDisableDiscount}
              disabled={loading}
            >
              <div className="flex items-center">
                <span
                  className={`p-2 bg-[#FFF7F2] rounded-full ${discountData?.isDisabled ? "text-[#5cba52]" : "text-primary"}`}
                >
                  <MdOutlinePowerSettingsNew size={20} />
                </span>
                <span className="ml-3 font-medium">
                  {loading ? loadingMessage : discountData?.discountStatus === "inactive" ? "Enable Discount" : "Disable Discount"}
                </span>
              </div>
              <PiCaretRightBold />
            </button>
          </div>
        </div>
      </div>

      <ToastContainer aria-live="polite" />
    </>
  );
};

export default DiscountOptionsModal;
