"use client";

import React, { useEffect, useRef } from "react";
import { PiCaretRightBold } from "react-icons/pi";
import { LuMessagesSquare, LuPencilLine } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";

interface EventOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendContactModal: React.FC<EventOptionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null; // Don't render if modal is closed

  return (
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
        className="bg-white w-full max-w-md rounded-t-[35px] p-5 pb-10 shadow-lg transition-transform transform translate-y-0 outline-none"
      >
        {/* Slider indicator */}
        <div className="w-full flex justify-center">
          <div className="w-10 h-[6px] rounded-full bg-[#E8EAED]"></div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-bold">
            Invite Options
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
            onClick={() => console.log("Edit Event clicked")}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <BiMessageSquareDetail size={20} />
              </span>
              <div className="ml-3 font-medium">
                <span className="capitalize">Send Via SMS</span>
                <p className="text-xs text-[#667085]">
                  Invite using text message only, charges apply
                </p>
              </div>
            </div>
            <PiCaretRightBold />
          </div>
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Disable Event clicked")}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <FaWhatsapp size={20} />
              </span>
              <div className="ml-3 font-medium">
                <span className="capitalize">Send Via Whatsapp</span>
                <p className="text-xs text-[#667085]">
                  Invite using Whatsapp only
                </p>
              </div>
            </div>
            <PiCaretRightBold />
          </div>
          <div
            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Delete Event clicked")}
          >
            <div className="flex items-center">
              <span className="p-2 bg-[#FFF7F2] rounded-full text-primary">
                <LuMessagesSquare size={20} />
              </span>
              <div className="ml-3 font-medium">
                <span className="capitalize"> Send Via Both</span>
                <p className="text-xs text-[#667085]">
                  This will try via Whatsapp before sending text messges,
                  charges applies
                </p>
              </div>
            </div>
            <PiCaretRightBold />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendContactModal;
