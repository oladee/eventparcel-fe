// pages/admin/change-pass.tsx
"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AdminContainer from "@/components/admin/AdminContainer";

const ChangePass: React.FC = () => {
  const [currentVisible, setCurrentVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <AdminContainer>
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl grid gap-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900">
            Change Password
          </h2>
          <div className="h-0.5 bg-gray-200 w-full" />

          {/* Current Password */}
          <div className="flex flex-col">
            <label className="text-gray-500 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={currentVisible ? "text" : "password"}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setCurrentVisible(v => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {currentVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-gray-500 mb-2">New Password</label>
            <div className="relative">
              <input
                type={newVisible ? "text" : "password"}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setNewVisible(v => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {newVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col">
            <label className="text-gray-500 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={confirmVisible ? "text" : "password"}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setConfirmVisible(v => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {confirmVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full bg-red-900 text-white font-semibold py-4 rounded-xl hover:bg-red-800 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </AdminContainer>
  );
};

export default ChangePass;
