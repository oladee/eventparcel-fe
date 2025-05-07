import React, { useState } from "react";
import { X } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddNewUser: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  if (!isOpen) return null;
  const roles = ["Super Admin", "Admin", "Logistics", "Audit"];

  const handleSelect = (role: string) => {
    setSelectedRole(role);
    setIsOpenDropdown(false);
    console.log(role)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md md:max-w-2xl rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Add New User</h2>
            <p className="text-lg text-[#718096] font-medium">Fill the details below to add a new admin</p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-base font-semibold text-[#111827] mb-1">Admin Name</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-[#111827] mb-1">Admin Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-[#111827] mb-1">Role</label>
            <div className="relative">
                <div
                className="w-full px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm text-gray-700 cursor-pointer"
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                >
                {selectedRole || "Select role"}
                </div>
                {isOpenDropdown && (
                <div className="absolute z-10 mt-1 w-full border rounded-[12px] bg-white shadow-md">
                    {roles.map((role) => (
                    <div
                        key={role}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(role)}
                    >
                        {role}
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border h-10 w-[120px] border-[#111827] text-[#111827] rounded-[12px] text-base font-extrabold"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 rounded-[12px] h-10 w-[160px] text-sm font-bold bg-[#751423] text-[#FFFFFF]"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;
