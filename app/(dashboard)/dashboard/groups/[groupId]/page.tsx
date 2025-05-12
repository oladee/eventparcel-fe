"use client";

import Container from '@/components/dashboard/Container';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Search, Settings2 } from "lucide-react";
import { cn } from '@/utils/cn';
import { useParams, useRouter } from 'next/navigation';
import { IoIosSend } from 'react-icons/io';
import GroupOptionsModal from '@/components/dashboard/eventComponents/GroupOptionsModal';
import { Group } from '@/app/interface/Group';
import { FiMoreHorizontal } from 'react-icons/fi';
import axiosInstance from '@/lib/axiosInstance';
import { OrderDashboardResponse } from '@/app/interface/Order';
import useDebounce from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import useUpdateOrderStatus from '@/hooks/useUpdateOrderStatus';
import OrderPagination from '@/components/OrderPagination';
import { motion } from 'framer-motion';

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  orderStatus: string;
  items: {
    _id: string;
    packageId: {
      packageImgUrls: string[];
      packageTitle: string;
      packagePrice: number;
      packagePriceCurrency: string;
    };
    quantity: number;
    deliveryMethod: string;
  }[];
  guestName: string;
  totalAmount: number;
  paymentStatus: string;
}

const tabs = ["All Orders", "Pending", "Shipped", "Completed"];

const Page = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [orders, setOrders] = useState<OrderDashboardResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.groupId as string;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState<any>(1);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusModal, setIsStatusModal] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState("");



  useEffect(() => {
    if (!id) return;

    const fetchGroup = async () => {
      try {
        const response = await axiosInstance.get(`/view-group/${id}`);
        console.log("order", response.data)
        setGroup(response.data.data); 
      } catch (error: any) {
        setError(error);
        toast.error('Failed to fetch group data');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setIsModalOpen(false);
        }
      }
      if(isModalOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [statusModal, isModalOpen]);
  
  

  useEffect(() => {
    if (!id) return;

    const fetchOrders = async () => {
      setLoading(true);
  
      try {
        const params: Record<string, any> = { 
          page, 
          limit, 
          // query: debouncedSearchQuery 
        };
  
        if (activeTab && activeTab !== "All Orders") {
          const normalizedStatus = activeTab.trim().toLowerCase();
          params.orderStatus = normalizedStatus === "completed" ? "delivered" : normalizedStatus;
        }
  
        const response = await axiosInstance.post(
          `view-orders/`,
          { eventGroupId: id },
          { params }
        );
  
        // Ensure response data exists before setting state
        if (response.data && response.data.data) {
          setOrders(response.data.data as OrderDashboardResponse);
          setTotalPages(response.data.data.totalPages || 1); 
        } else {
          setOrders(response.data?.data || []);          
          setTotalPages(String(1));       
       }
  
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [page, limit, debouncedSearchQuery, activeTab, id]);
  
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }
    
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleOrderClick = (order: Order) => {
    router.push(`/dashboard/orderDetails?order=${encodeURIComponent(JSON.stringify(order))}`);
  };

  const handleSendInviteClick = () => {
    router.push("/share-contact");
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const { updateOrderStatus } = useUpdateOrderStatus();

  const handleStatusChange = async (status: string) => {
    try {
      if (!selectedOrder?._id) {
        toast.error("Invalid order. Please try again.");
        return;
      }

      await updateOrderStatus(
        selectedOrder._id,
        selectedOrder.paymentStatus ?? "unknown",
        status.toLowerCase()
      );

      setOrders((prevOrders) => {
        if (!prevOrders) return prevOrders;

        return {
          ...prevOrders,
          orders: prevOrders.orders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, orderStatus: status.toLowerCase() }
              : order
          ),
        };
      });

    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsStatusModal(false);
    }
  };

  function formatCurrencyShort(amount: number): string {
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (amount >= 1_000) {
      return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return amount.toString();
  }
  

  if (loading) {
    return (
      <Container>
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
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center min-h-screen text-center">
          {/* Error Icon or Emoji */}
          <div className="text-5xl mb-4">⚠️</div>
  
          {/* Error Message */}
          <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn’t load the group data. Please try again.</p>
        </div>
      </Container>
    );
  }
  

  
    // Open modal and store selected group
    const openGroupOptions = (group: Group) => {
      setSelectedGroup(group);
      setIsModalOpen(true);
    };

  return (
    <Container>
      <div id="orders-page-container" className="min-h-screen mt-2">
        <div>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <span 
                    className={`w-[76px] h-[22px] flex justify-center items-center px-10 py-2 rounded-[50px] font-general font-medium text-sm 
                      ${
                        group?.groupPrivacy === "private"
                          ? "text-[#DE4222] border border-[#DE4222] bg-[#f6ebe9]"
                          : "text-[#2B9EA0] border border-[#2B9EA0] bg-[#ebf3f3]"
                      }`}
              >
                {group?.groupPrivacy
                  ? group?.groupPrivacy.charAt(0).toUpperCase() +
                    group?.groupPrivacy.slice(1)
                  : ""}
              </span>
              <FiMoreHorizontal
                size={24}
                onClick={() => openGroupOptions(group!)}
                className="text-gray-500 cursor-pointer"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111827] mt-2 capitalize">
              {group?.groupName}
              </h2>
              <p className="text-[#718096] text-sm mt-1 truncate-text2">
              {group?.groupDescription ? group.groupDescription[0].toUpperCase() + group.groupDescription.slice(1) : ''}
              </p>
            </div>

            <div className="flex items-center space-x-6 py-4 text-sm text-gray-500 font-medium">
              <div className="flex flex-col items-start">
                <span className="font-semibold text-[20px] text-[#111827] mb-2">{group?.groupCurrency === "NGN" ? "₦" : "$"}{formatCurrencyShort(group?.summary[0]?.overallSales || 0)}</span>
                <span className='font-general'>Overall sales</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex flex-col items-start">
                <span className="text-black font-bold text-lg">{group?.summary[0]?.packagesSold || 0}</span>
                <span>Sold</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg text-[#111827]">{group?.summary[0]?.stock || 0}</span>
                <span className='text-green-600'>In stock</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button className="text-gray-500 text-sm font-medium outline-none">
                Contacts: <span className="text-gray-900 font-bold">{group?.contacts?.length}</span>
              </button>
              <button
                onClick={handleSendInviteClick}
                className="text-primary flex items-center gap-1 font-medium outline-none"
              >
                <IoIosSend size={18} /> Send Invite
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div id="orders-content-container" className='bg-[#FFFFFF] p-5 mt-6 rounded-[12px]'>
          <div id="orders-tabs" className="flex items-center border-b space-x-6 mt-6 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={cn(
                  "font-general text-sm pb-2 transition-all",
                  activeTab === tab
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-[#718096] font-normal hover:text-primary/80"
                )}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div id="search-filter-container" className="flex items-center gap-3 rounded-md mt-3">
            <div id="search-container" className="flex items-center bg-[#FAFAFA] px-4 py-2 rounded-[12px] w-[80%] h-[56px]">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-3 w-full h-full outline-none text-base bg-[#FAFAFA] placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='bg-[#FAFAFA] h-14 w-14 flex justify-center items-center'>
              <button className="p-2 rounded-[12x]">
                <Settings2 className='text-[#A0AEC0]' />
              </button>
            </div>
          </div>

          {/* Order List */}
          <div id="orders-list" className="mt-6 space-y-4">
          {orders?.orders?.length 
              ? (
                orders?.orders?.map((order) => (
                  <React.Fragment key={order._id}>
                    <div className="border-t border-[#EEEFF2] my-3"></div>
                    <div
                      onClick={() => handleOrderClick(order)}
                      className="rounded-lg font-general cursor-pointer"
                    >
                      <div className="flex justify-between text-[#718096] font-medium text-sm mb-2 py-4">
                        <p>
                          {new Date(order?.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setIsStatusModal(true);
                          }}
                          className={
                            order.orderStatus === "pending"
                              ? "bg-[#FFF0E6] text-[#FE964A] px-2 py-1 text-xs rounded flex items-center"
                              : order.orderStatus === "delivered"
                              ? "bg-[#ecfdeb] text-[#33ca5e] px-2 py-1 text-xs rounded flex items-center"
                              : "bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded flex items-center"
                          }
                        >
                          {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)} ▼
                        </div>
                      </div>

                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 mb-2 h-[91px] bg-[#FAFAFA] rounded-[12px] space-x-4 px-2 py-2"
                        >
                          <Image
                            src={item.packageId?.packageImgUrls?.[0] || "/fallback-image.png"}
                            alt={item.packageId?.packageTitle || "Order Image"}
                            width={42}
                            height={42}
                            className="rounded-md h-[42px] w-[42px] object-contain"
                          />

                          <div className="flex-1">
                            <p className="font-semibold text-sm text-[#111827]">
                            {item.packageId?.packageTitle
                              ?.split(" ")
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ") || "No Title"}

                            </p>
                            <p className="text-[#718096] font-normal text-sm">
                              {item.packageId?.packagePriceCurrency === "NGN" ? "₦" : "$"}
                              {item.packageId?.packagePrice?.toLocaleString() || "N/A"}
                            </p>
                          </div>

                          <div className="flex items-center text-[#718096] text-xs">
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-lg p-4 w-full max-w-md">
                      <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
                        <p className="font-medium">Order Number</p>
                        <p className="font-bold text-gray-900 truncate">{order?.orderId}</p>

                        <p className="font-medium">Guest</p>
                        <p className="font-bold text-gray-900">
                        {order?.guestName
                          ?.split(" ")
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ") || "Guest Name"}

                        </p>

                        <p className="font-medium">Delivery</p>
                        <p className="font-bold text-gray-900">
                          {order?.items[0]?.deliveryMethod || "N/A"}
                        </p>

                        <p className="font-medium">Total Price</p>
                        <p className="font-bold text-gray-900">
                          {order?.items[0]?.packageId?.packagePriceCurrency === "NGN" ? "₦" : "$"}
                          {order.totalAmount?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <p>No orders available</p>
              )}
          </div>
        </div>

        {/* Status Modal */}
        {statusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={modalRef}
              className="bg-white p-4 rounded-[15px] shadow-md w-64"
            >
              <ul className="mt-1 space-y-2">
                {["pending", "shipped", "delivered"].map((status) => (
                  <li
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-medium text-xl text-gray-700"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <GroupOptionsModal
          isOpen={isModalOpen && !!selectedGroup}
          onClose={toggleModal}
          group={selectedGroup} 
          eventData={{
            isShared: undefined
          }}        
          />
      </div>

       {/* Pagination */}
        <div id="orders-pagination">
        <OrderPagination 
            totalPages={totalPages} 
            currentPage={page} 
            setCurrentPage={setPage} 
            setLimit={setLimit}
          />
        </div>
    </Container>
  );
};

export default Page;