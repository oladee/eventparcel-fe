import React from "react";

interface GroupHeaderProps {
  mode: "noGroup" | "availGroup";
  onClose: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ mode, onClose }) => {
  return (
    <div className="">
      <div className="flex justify-between">
        <span className="block mb-2 font-general text-xl text-[#111827] font-semibold">
          New Group
        </span>
        {mode === "availGroup" && (
          <div onClick={onClose} className="font-general text-gray-600 cursor-pointer">
            X
          </div>
        )}
      </div>
      <span className="flex justify-start font-general font-medium text-sm text-[#718096]">
        Create a group for specific guests
      </span>
    </div>
  );
};

export default GroupHeader;
