"use client";
import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";
import { useRouter } from "next/navigation";
// import { useRouter } from "next-nprogress-bar";
import React, { useState, useRef, useEffect } from "react";
import { FiMoreHorizontal, FiPackage } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";

export type AdminInterface = {
  _id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "active" | "disabled" | "suspended" | "inactive";
};

const statusClasses: Record<AdminInterface["status"], string> = {
  active: "bg-[#2B9EA01F] text-[#2B9EA0] border border-[#2B9EA0]",
  disabled: "bg-[#FE964A1F] text-[#DE4222] border border-[#DE4222]",
  suspended: "bg-[#DE42221F] text-[#FE964A] border border-[#FE964A]",
  inactive: "bg-[#A0AEC01F] text-[#A0AEC0] border border-[#A0AEC0]",
};

const AdminUsersTable: React.FC<{ admins: AdminInterface[] }> = ({ admins }) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [adminList, setAdminList] = useState<AdminInterface[]>(admins);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loadingButton, setLoadingButton] = useState<{ id: number; action: string } | null>(null);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      const user = loggedInUser ? JSON.parse(loggedInUser) : null
  
      if (!user) {
        router.push("/");
        return;
      }
      setRole(user.role);
    }, [router]);

  useEffect(() => {
    setAdminList(admins);
  }, [admins]);

  const toggleMenu = (id: number) => {
    console.log(id)
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRandomColorClass = () => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


    const updateAdminStatus = async (id: number, status: AdminInterface["status"]) => {
      const dataToPost = {
        userId: id,
        status
      };
    
      try {
        const response = await axiosInstance.put("update-admin-status", dataToPost);
        const updatedAdmin = response.data.data;

        toast.success("Admin status update successfully!!");
        setAdminList((prev) =>
          prev.map((admin) =>
            admin._id === id ? { ...admin, status: updatedAdmin.status } : admin
          )
        );
    
        setMenuOpenId(null); // close the menu
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    };

    const handleUpdateStatus = async (id: number, newStatus: any) => {
      setLoadingButton({ id, action: newStatus });
    
      try {
        await updateAdminStatus(id, newStatus); // Replace this with your actual update function
        // Optionally: refresh data or update state
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingButton(null);
      }
    };
    
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const day = date.toLocaleString("en-GB", { day: "2-digit" });
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
  
    return `${day} ${month}, ${year}`;
  };
  

  return (
    <>
    <ToastContainer />
    <div className="bg-white min-w-full overflow-x-scroll no-scrollbar mt-8">
      <table className="w-full table-auto bg-white rounded-t-2xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">
              <input type="checkbox" />
            </th>
            <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
              <div className="flex items-center gap-2">
                Date Added <GrTransaction className="rotate-90" />
              </div>
            </th>
            <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
              <div className="flex items-center gap-2">
                Users <GrTransaction className="rotate-90" />
              </div>
            </th>
            <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
              <div className="flex items-center gap-2">
                Role <GrTransaction className="rotate-90" />
              </div>
            </th>
            <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
              <div className="flex items-center gap-2">
                Last Login <GrTransaction className="rotate-90" />
              </div>
            </th>
            <th className="p-4 text-left text-xs font-medium text-[#718096] capitalize">
              <div className="flex items-center gap-2">
                Status <GrTransaction className="rotate-90" />
              </div>
            </th>
            <th className="p-4 text-right text-gray-400">
              ...
            </th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
                <td colSpan={8} className="p-0">
                  <div className="flex flex-col items-center justify-center w-full py-16 text-center bg-white rounded-md border border-dashed border-gray-300">
                    <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Admin Not Found</h3>
                  </div>
                </td>
              </tr>
            ) : (
              adminList.map((a) => (
                <tr key={a._id} className="border-t relative">
              <td className="p-4">
                <input type="checkbox" />
                </td>
              <td className="p-4 font-semibold text-black-100 text-sm">
              {formatDate(a.createdAt)}
              </td>
              <td className="p-4 flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${getRandomColorClass()}`}
                  >
                  {a.firstName
                    .split(" ")
                    .map((n) => n[0])
                    .join("").toUpperCase()}{a.lastName
                      .split(" ")
                      .map((n) => n[0])
                      .join("").toUpperCase()}
                </div>
                <div>
                <p className="font-semibold text-black-100 text-sm">
                {a.firstName.charAt(0).toUpperCase() + a.firstName.slice(1)} {a.lastName.charAt(0).toUpperCase() + a.lastName.slice(1)}
                </p>
                <p className="text-gray-400 text-xs">{a.email}</p>
                </div>
                </td>
              <td className="p-4 font-semibold text-black-100 text-sm">
                {a.role === "superAdmin" ? "Super Admin" : "Admin"}
              </td>
              <td className="p-4 text-[#718096] text-sm">{a.lastLogin ? formatDate(a.lastLogin) : "N/A"}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    statusClasses[a.status]
                  }`}
                  >
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                    </td>
                    <td className="p-4 text-right relative">
                    <button disabled={role !== "superAdmin"} onClick={() => toggleMenu(a._id)}>
                      <FiMoreHorizontal className="text-gray-400" />
                    </button>
                    {menuOpenId === a._id && (
                      <div
                    ref={menuRef}
                    className="absolute right-8 -top-[55px] bg-white shadow-lg rounded-lg w-40 z-10"
                    >
                    <ul className="py-1">
                    <ul className="py-1">
                        {a.status === "active" && (
                          <>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "suspended")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "suspended" ? (
                                  <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Suspend Admin"
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "disabled")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "disabled" ? (
                                  <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Disable Admin"
                                )}
                              </button>
                            </li>
                          </>
                        )}

                        {a.status === "suspended" && (
                          <>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "active")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "active" ? (
                                  <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Activate Admin"
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "disabled")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "disabled" ? (
                                  <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Disable Admin"
                                )}
                              </button>
                            </li>
                          </>
                        )}

                        {a.status === "inactive" && (
                          <>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "active")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "active" ? (
                                  <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Activate Admin"
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "suspended")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "suspended" ? (
                                  <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Suspend Admin"
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "disabled")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "disabled" ? (
                                  <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Disable Admin"
                                )}
                              </button>
                            </li>
                          </>
                        )}

                        {a.status === "disabled" && (
                          <>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "active")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "active" ? (
                                  <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Activate Admin"
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleUpdateStatus(a._id, "suspended")}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                              >
                                {loadingButton?.id === a._id && loadingButton?.action === "suspended" ? (
                                  <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Suspend Admin"
                                )}
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </ul>
                  </div>
                )}
                </td>
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AdminUsersTable;
