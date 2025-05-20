"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import { FiSearch } from "react-icons/fi";
import AdminUsersTable, { AdminInterface } from "@/components/admin/adminUsers/AdminUsersTable";
import AddNewUser from "@/components/admin/AddNewUser";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/adminAxiosInterceptor/axiosInstance";
import { motion } from "framer-motion";

const statusTabs: ("All Users" | "active" | "suspended" | "disabled")[] = [
  "All Users",
  "active",
  "suspended",
  "disabled"
];

const AdminPage: React.FC = () => {
  const Router = useRouter();

  const [newUser, setNewUser] = useState(false);
  const [activeTab, setActiveTab] = useState<"All Users" | "active" | "suspended" | "disabled">("All Users");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [adminData, setAdminData] = useState<AdminInterface[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [role, setRole] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = adminData;
    if (activeTab !== "All Users") {
      data = data.filter((h) => h.status === activeTab);
    }
    if (search) {
      data = data?.filter(
        (h) =>
          h?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          h?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [activeTab, search, adminData]);

  
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const user = loggedInUser ? JSON.parse(loggedInUser) : null

    if (!user) {
      Router.push("/");
      return;
    }
    setRole(user.data.role);
  }, [Router]);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
  
      try {
        const response = await axiosInstance.get("/get-all-admin-users");
        setAdminData(response.data.data);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdmins();
  }, []);
  

  const pageCount = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const [inputId] = useState(() => `search-${Math.random().toString(36).substr(2, 9)}`);

   
  if (loading) {
    return (
      <AdminContainer>
        <div className="flex flex-col justify-center items-center min-h-screen">
          {/* Animated Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-[#751423] border-gray-300 rounded-full"
          ></motion.div>

          {/* Skeleton Effect for Loading Content */}
          <div className="mt-6 w-[80%] max-w-md bg-white p-4 shadow-lg rounded-xl">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </AdminContainer>
    );
  }

  if (error) {
    return (
      <AdminContainer>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <span>{error}</span>
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <div className="">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full max-w-2xl ">
            <div id="tab" className="flex items-center bg-white rounded-[12px] px-4 py-2">
              <span className="text-[#A0AEC0]">Show:</span>
              <select
                className="ml-2 text-black font-bold border-none focus:ring-0 outline-none"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as "All Users" | "active" | "suspended" | "disabled")}
              >
                {statusTabs.map((tab) => (
                  <option key={tab} value={tab}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div id="search-input" className="flex-1 flex items-center bg-white rounded-[12px] px-4 py-2">
              <FiSearch className="text-[#000]" />
              <input
                type="text"
                placeholder="Search by name, email, or others..."
                className="ml-2 w-full border-none focus:ring-0 outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                autoComplete="new-password" 
                name="searchQuery"
                id={inputId}
                readOnly  // Temporarily readonly to prevent autofill
                onFocus={(e) => e.target.removeAttribute('readonly')}  // Enable on focus
              />
            </div>
          </div>
          
        {role === "superAdmin" && (
          <div id="permission&newUser" className="flex flex-row justify-between">
            <button id="permissions" className="w-[153px] h-[40px] border border-[#751423] bg-[#FFFFFF] text-[#751423] rounded-[12px] font-medium text-base" onClick={() => Router.push("admin-permissions")}>Permissions</button>
            <button id="newUser" className="w-[171px] h-[40px] ml-3 bg-[#751423] text-[#FFFFFF] rounded-[12px] font-bold text-base" onClick={() => setNewUser(true)}>Add New User</button>
          </div>
        )}
        </div>

        {/* Table */}
        <AdminUsersTable admins={pageData} />

        {/* Pagination */}
        <div id="pagination" className="flex items-center justify-between rounded-b-2xl p-4 bg-white">
          <div id="change-limit" className="flex items-center space-x-2">
            <span className="text-gray-500">Show result:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border rounded-md px-2 py-1"
            >
              {[6, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div id="decrease-page" className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2"
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-md ${p === page ? "bg-green-100 text-green-600" : "text-gray-500"}`}
              >
                {p}
              </button>
            ))}
            <button
              id="increase-page"
              disabled={page === pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="px-2"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {newUser && (
        <AddNewUser 
          isOpen={newUser}
          onClose={() => setNewUser(false)}
          onSubmit={(newlyCreatedUser: AdminInterface) => {
            setNewUser(false);
            if (newlyCreatedUser) {
              setAdminData((prev) => [newlyCreatedUser, ...prev]);
            }
          }}
        />
      )}
    </AdminContainer>
  );
};

export default AdminPage;
