"use client";
import { useRouter } from "next-nprogress-bar";
import React, { useState, useRef, useEffect } from "react";
import { FiMoreHorizontal, FiPackage } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const day = date.toLocaleString("en-GB", { day: "2-digit" });
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
  
    return `${day} ${month}, ${year}`;
  };
  

  return (
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
              admins.map((a) => (
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
                    {a.status}
                    </span>
                    </td>
                    <td className="p-4 text-right relative">
                    <button onClick={() => toggleMenu(a._id)}>
                    <FiMoreHorizontal className="text-gray-400" />
                    </button>
                    {menuOpenId === a._id && (
                      <div
                    ref={menuRef}
                    className="absolute right-4 top-10 bg-white shadow-lg rounded-lg w-40 z-10"
                    >
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() =>
                            router.push(`/admin/admin-hosts/${a._id}`)
                          }
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Admin
                        </button>
                      </li>
                      <li>
                        <button className="w-full text-left px-4 py-2 text-sm text-orange-300 hover:bg-gray-100">
                          Suspend Admin
                        </button>
                      </li>
                      <li>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Disable Admin
                        </button>
                      </li>
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
  );
};

export default AdminUsersTable;
