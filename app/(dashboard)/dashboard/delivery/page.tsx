"use client"

import Container from '@/components/dashboard/Container'
import React, { useEffect, useRef, useState } from 'react'
import BoxTime from "../../../../assets/orderIcons/box-time.png";
import Package from "../../../../assets/orderIcons/package.png";
import Image from 'next/image';
import { Search, Settings2  } from "lucide-react";
import { Order, OrderDashboardResponse } from '@/app/interface/Order';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/useDebounce';
import axiosInstance from '@/lib/axiosInstance';
import useUpdateOrderStatus from '@/hooks/useUpdateOrderStatus';
import { toast, ToastContainer } from 'react-toastify';
import OrderPagination from '@/components/OrderPagination';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

const tabs = ["All Orders", "Shipped", "Completed"];

const Page = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [orders, setOrders] = useState<OrderDashboardResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  
  const [stats, setStats] = useState([
    { icon: Package, title: "Total Delivered", count: 0, change: "0%" },
    { icon: BoxTime, title: "Total Shipped", count: 0, change: "0%" },
  ]);


    useEffect(() => {
      const loggedInUserString = localStorage.getItem("loggedInUserId");
      // const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;
  
      if (!loggedInUserString) {
        router.replace("/");
        return;
      }
      
      const fetchDeliverySummary = async () => {
        const response = await axiosInstance.get(
          `/delivery-summary/${loggedInUserString}`);

        setStats([         
          { 
            icon: Package, 
            title: "Total Delivered", 
            count: response?.data?.data?.totalDelivered, 
            change: `${parseFloat(response?.data?.data?.pctDeliveredVsLastWeek).toFixed(1)}%`
          },
          { 
            icon: BoxTime, 
            title: "Pending Shipped", 
            count: response?.data?.data?.totalShipped, 
            change: response?.data?.data?.shippedThisWeek
          },
        ]);
      };
      fetchDeliverySummary();
    }, [router]);

    useEffect(() => {
      const fetchOrders = async () => {
        const loggedInUserString = localStorage.getItem("loggedInUserId");
        // const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;
    
        if (!loggedInUserString) {
          router.replace("/");
          return;
        }

        setLoading(true);
        try {
  
          const params: Record<string, any> = { 
            page, 
            limit, 
            query: debouncedSearchQuery 
          };
  
          if (activeTab && activeTab !== "All Orders") {
            const normalizedStatus = activeTab.trim().toLowerCase();
            params.orderStatus = normalizedStatus === "completed" ? "delivered" : normalizedStatus;
          }
  
          const response = await axiosInstance.post(
              `view-orders/`,
              { hostId: loggedInUserString },
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
            
        } catch(error: any) {
          toast.error(error.response?.data?.message);
        } finally {
          setLoading(false)
        }
      };
      fetchOrders();
    }, [page, limit, debouncedSearchQuery, activeTab, router]);

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
      }, [isModalOpen]);
  
    const handleOrderClick = (order: Order) => {
      localStorage.setItem("selectedOrder", JSON.stringify(order));
      router.push(`/dashboard/orderDetails`);
    };
    
    const { updateOrderStatus } = useUpdateOrderStatus();
  
 const handleStatusChange = async (status: string) => {
    try {
      if (!selectedOrder?.orderId) {
        toast.error("Invalid order. Please try again.");
        return;
      }
  
      const response = await updateOrderStatus(
        selectedOrder._id,
        selectedOrder.paymentStatus ?? "Unknown",
        status
      );
  
      // Only update UI if status update is successful
      if (response?.success) {
        setOrders((prevOrders) => {
          if (!prevOrders) return prevOrders;
  
          return {
            ...prevOrders,
            orders: prevOrders.orders.map((order) =>
              order.orderId === selectedOrder.orderId
                ? { ...order, orderStatus: status }
                : order
            ),
          };
        });
  
      } else {
        // toast.error("Failed to update status. Please try again.");
      }
  
    } catch (error:any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsModalOpen(false);
    }
  };

    if (loading) {
      return (
        <div>
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
        </div>
      );
    }  

  return (
   <Container>
    <ToastContainer />
    <div className="w-[343px] lg:w-[700px] h-full flex flex-col gap-5 items-center justify-center">
      <div id="discount-header" className="w-full flex justify-start">
        <h2 id="discount-title" className="font-general text-2xl font-bold text-[#111827]">Delivery</h2>
      </div>

       {/* Stats Grid */}

      <div id="stats-grid" className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {stats.map((stat, index) => (
          <div 
            id={`stat-card-${index}`}
            key={index} 
            className="w-[163px] h-[121px] bg-[#FFFFFF] shadow-sm p-3 rounded-[12px]"
          >
            <div id={`stat-header-${index}`} className='flex items-center gap-2'>
              <Image 
                id={`stat-icon-${index}`}
                src={stat.icon} 
                alt={stat.title} 
                height={16} 
                width={16} 
              />
              <p id={`stat-title-${index}`} className="font-general font-semibold text-xs text-[#111827]">
                {stat.title}
              </p>
            </div>
            <div id={`stat-divider-${index}`} className="border-t border-[#EEEFF2] my-3"></div>
            <p id={`stat-count-${index}`} className="text-2xl font-bold text-[#111827]">{stat.count}</p>
            <p 
              id={`stat-change-${index}`}
              className={`text-xs font-general font-normal mt-1 ${
                index === 1 ? 'text-[#751423]' : (String(stat.change).startsWith('-') ? 'text-red-600' : 'text-green-600')
              }`}
            >
              {stat.change}{' '}
              <span className='text-[#718096]'>
                {index === 1 ? 'from this week' : 'from last week'}
              </span>
            </p>
          </div>
        ))}
      </div>

        <div id="orders-content-container" className='bg-[#FFFFFF] w-full p-5 mt-6 rounded-[12px]'>

         <div id="orders-tabs" className="flex items-center justify-between px-2 border-b space-x-6 mt-6 mb-6">
            {tabs.map((tab) => (
              <button
                id={`tab-${tab.toLowerCase().replace(' ', '-')}`}
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
            <Search id="search-icon" className="h-6 w-6 text-gray-400" /> 
            <input
            type="text"
            placeholder="Search..."
            className="ml-3 w-full h-full outline-none text-base bg-[#FAFAFA] placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div id="filter-button-container" className='bg-[#FAFAFA] h-14 w-14 flex justify-center items-center'>
            <button id="filter-button" className="p-2 rounded-[12x]">
              <Settings2 id="filter-icon" className='text-[#A0AEC0]' />
            </button>
          </div>
        </div>

        {/* Orders details page */}
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
                            setIsModalOpen(true);
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
                              ? item.packageId.packageTitle.charAt(0).toUpperCase() + item.packageId.packageTitle.slice(1)
                              : "No Title"}

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
                          ? order.guestName.charAt(0).toUpperCase() + order.guestName.slice(1) 
                          : "Guest Name"}
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

                    {isModalOpen && selectedOrder && (
                      <div id="status-modal" className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                          id="status-modal-content"
                          ref={modalRef}
                          className="bg-white p-4 rounded-[15px] shadow-md w-64"
                        >
                          <ul id="status-options" className="mt-1 space-y-2">
                            {(() => {
                              const allStatuses = [
                                { key: "pending", label: "Pending" },
                                { key: "shipped", label: "Shipped" },
                                { key: "delivered", label: "Delivered" },
                                { key: "pickedUp", label: "Picked Up" },
                              ];

                              const deliveryType = 
                              typeof selectedOrder.deliveryType === 'string' 
                                ? selectedOrder.deliveryType.toLowerCase() 
                                : '';
                            
                              const filteredStatuses =
                                deliveryType === "pickup"
                                  ? allStatuses.filter(s => ["pending", "pickedUp"].includes(s.key))
                                  : allStatuses.filter(s => s.key !== "pickedUp");

                              return filteredStatuses.map(status => (
                                <li
                                  key={status.key}
                                  id={`status-option-${status.key}`}
                                  onClick={() => handleStatusChange(status.key)}
                                  className="p-2 hover:bg-[#F9FAFB] rounded-md cursor-pointer font-general font-medium text-base text-[#111827]"
                                >
                                  {status.label}
                                </li>
                              ));
                            })()}
                          </ul>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p>No orders available</p>
              )}

               {/* Pagination */}
                  <div id="orders-pagination">
                  <OrderPagination
                      totalPages={totalPages} 
                      currentPage={page} 
                      setCurrentPage={setPage} 
                      setLimit={setLimit}
                      />
                  </div>
              </div>
          </div>
    </div>
   </Container>
  )
}

export default Page
