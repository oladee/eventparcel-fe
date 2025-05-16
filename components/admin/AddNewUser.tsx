import React, { useState } from "react";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";
import { AdminInterface } from "./adminUsers/AdminUsersTable";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (newUser: AdminInterface) => void;
}

const AddNewUser: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const roles = ["Super Admin", "Admin"];

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);  

  const handleEmailBlur = () => {
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  
  const handleSelect = (role: string) => {
    setSelectedRole(role);
    setIsOpenDropdown(false);
  };

  const handleSubmit = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
  
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !selectedRole) return;
  
    setIsSubmitting(true);
  
    const adminRole = selectedRole === "Super Admin" ? "superAdmin" : "admin";
  
    const newUser = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      role: adminRole,
    };
  
    try {
      const res = await axiosInstance.post("/add-admin", newUser);
      const createdAdmin: AdminInterface = res.data.data;
  
      if (!res) throw new Error("Failed to add admin");
  
      toast.success("New Admin added!!!", {
        autoClose: 100,
        onClose: () => {
          setFirstName("");
          setLastName("");
          setEmail("");
          setSelectedRole(null);
          onClose();
          onSubmit?.(createdAdmin);
        },
      });
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add admin. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <>
    <ToastContainer />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5" aria-modal="true" role="dialog">
      <div className="bg-white w-full max-w-md md:max-w-2xl rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Add New User</h2>
            <p className="text-lg text-[#718096] font-medium">Fill the details below to add a new admin</p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-base font-semibold text-[#111827] mb-1" htmlFor="firstName">Admin Name</label>
            <div className="flex gap-4">
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                className="w-1/2 px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-[#111827] mb-1" htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
                )}
          </div>
          <div>
            <label className="block text-base font-semibold text-[#111827] mb-1">Role</label>
            <div className="relative">
              <div
                className="w-full px-4 py-2 border rounded-[12px] bg-[#FAFAFA] text-sm text-gray-700 cursor-pointer"
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                aria-haspopup="listbox"
                role="button"
                >
                {selectedRole || "Select role"}
              </div>
              {isOpenDropdown && (
                <div className="absolute z-10 mt-1 w-full border rounded-[12px] bg-white shadow-md" role="listbox">
                  {roles.map((role) => (
                    <div
                    key={role}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(role)}
                      role="option"
                      aria-selected={selectedRole === role}
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
            onClick={handleSubmit}
            disabled={!firstName || !lastName || !email || !selectedRole || isSubmitting}
            className="px-6 py-2 rounded-[12px] h-10 w-[160px] text-sm font-bold text-white bg-[#751423] disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add User"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddNewUser;
