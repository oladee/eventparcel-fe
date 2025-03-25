"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePowerSettingsNew, MdDeleteOutline } from "react-icons/md";
import { PiCaretRightBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import UpdateEventModal from "./UpdateEventModal";

interface EventOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData?: any;
}

const EventOptionsModal: React.FC<EventOptionsModalProps> = ({
  isOpen,
  onClose,
  eventData
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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

  const handleClose = () => {
    setShowUpdateModal(false);
    onClose();
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <>
      {showUpdateModal && (
        <UpdateEventModal
          isOpen={showUpdateModal}
          onClose={handleClose}
          // eventData={JSON.parse(localStorage.getItem("eventData")!)}
          eventData={eventData}
        />
      )}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${showUpdateModal? "hidden": "flex"} items-end justify-center z-50`}
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
          className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0"
        >
          {/* Slider indicator */}
          <div className="w-full flex justify-center">
            <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-lg font-bold">
              Event Options
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
            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={() => {
                // onClose();
                setShowUpdateModal(true);
              }}
            >
              <div className="flex items-center">
                <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                  <LuPencilLine size={20} />
                </span>
                <span className="ml-3 font-medium">Edit Event</span>
              </div>
              <PiCaretRightBold />
            </div>
            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={() => console.log("Disable Event clicked")}
            >
              <div className="flex items-center">
                <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                  <MdOutlinePowerSettingsNew size={20} />
                </span>
                <span className="ml-3 font-medium">Disable Event</span>
              </div>
              <PiCaretRightBold />
            </div>
            <div
              className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
              onClick={() => console.log("Delete Event clicked")}
            >
              <div className="flex items-center">
                <span className="p-2 bg-[#FFF7F2] rounded-full text-red-500">
                  <MdDeleteOutline size={20} />
                </span>
                <span className="ml-3 font-medium text-red-500">
                  Delete Event
                </span>
              </div>
              <PiCaretRightBold />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventOptionsModal;
