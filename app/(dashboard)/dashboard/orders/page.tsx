"use client";

import Container from '@/components/dashboard/Container';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Cart from "../../../../assets/orderIcons/cart.png";
import BoxTime from "../../../../assets/orderIcons/box-time.png";
import Eye from "../../../../assets/orderIcons/eye.png";
import Package from "../../../../assets/orderIcons/package.png";
import { Search, Settings2  } from "lucide-react";
import { cn } from '@/utils/cn';
import OrderPagination from '@/components/OrderPagination';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import useDebounce from '@/hooks/useDebounce';
import { Order, OrderDashboardResponse,  } from '@/app/interface/Order';
import useUpdateOrderStatus from '@/hooks/useUpdateOrderStatus';
import { toast, ToastContainer } from 'react-toastify';

const tabs = ["All Orders", "Pending", "Shipped", "Completed"];


const Page: React.FC = ({  }) => {
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

  console.log(orders)

  const [stats, setStats] = useState([
    { icon: Cart, title: "Total Orders", count: 0, change: "0%" },
    { icon: Eye, title: "Total Invites", count: 0, change: "0%" },
    { icon: Package, title: "Total Delivered", count: 0, change: "0%" },
    { icon: BoxTime, title: "Pending Orders", count: 0, change: "0%" },
  ]);
  
  
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



  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`view-orders/67dd1f5f48f2e5b414f3efb7`, {
          params: { page, limit, query: debouncedSearchQuery, filter: activeTab === "All Orders" ? "" : activeTab }
        });

        setStats([
          { icon: Cart, title: "Total Orders", count: response.data.data.summary.ordersSummary.totalOrders.overall, change: `${response.data.data.summary.ordersSummary.totalOrders.growthRate}%` },
          { icon: Eye, title: "Total Invites", count:  response.data.data.summary.invitesSummary.totalInvites, change: `${response.data.data.summary.invitesSummary.viewedRate}%` },
          { icon: Package, title: "Total Delivered", count: response.data.data.summary.ordersSummary.totalDelivered.overall, change: `${response.data.data.summary.ordersSummary.totalDelivered.growthRate}%` },
          { icon: BoxTime, title: "Pending Orders", count: response.data.data.summary.ordersSummary.pendingOrders.overall, change: `${response.data.data.summary.ordersSummary.pendingOrders.growthRate}%` },
        ]);

        setOrders(response.data.data as OrderDashboardResponse);
        setTotalPages(response.data.data.totalPages)
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false)
      }
    };
    fetchOrders();
  }, [page, limit, debouncedSearchQuery, activeTab]);


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
  
      await updateOrderStatus(
        selectedOrder?._id,
        selectedOrder.paymentStatus ?? "Unknown", 
        status
      );
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsModalOpen(false)
    }
  };
  

  return (
    <Container>
      <ToastContainer />
      <div id="orders-page-container" className="min-h-screen mt-2">
        {loading ? (
            <div className="min-h-screen mt-2">
            {/* Header Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[163px] h-[121px] bg-white shadow-sm p-3 rounded-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="border-t border-[#EEEFF2] my-3"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="bg-white p-5 rounded-[12px]">
              {/* Tabs Skeleton */}
              <div className="flex space-x-6 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>

              {/* Search Bar Skeleton */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 h-14 bg-gray-100 rounded-[12px] animate-pulse"></div>
                <div className="w-14 h-14 bg-gray-100 rounded-[12px] animate-pulse"></div>
              </div>

              {/* Orders List Skeleton */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="border-t border-[#EEEFF2] my-4"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-[12px] p-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mt-4 w-full max-w-md">
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="space-y-1">
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="mt-6 flex justify-center">
                <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            </div>
        ) : (
          <div>

          {/* Heading */}
        <h4 id="orders-page-heading" className="text-2xl font-general font-bold text-[#111827] mb-6">
          All Orders
        </h4>
  
        {/* Stats Grid */}
        <div id="stats-grid" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className={`text-xs font-general font-normal mt-1 ${stat.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}
                >
                {stat.change} <span className='text-[#718096]'>from last week</span>
              </p>
            </div>
          ))}
        </div>
  
        {/* Tabs */}
        <div id="orders-content-container" className='bg-[#FFFFFF] p-5 mt-6 rounded-[12px]'>
          <div id="orders-tabs" className="flex items-center border-b space-x-6 mt-6 mb-6">
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
  
          {/* Order List */}
          <div id="orders-list" className="mt-6 space-y-4">
            {orders?.orders.map((order) => (
              <React.Fragment key={order._id}>
                <div id={`order-divider-${order._id}`} className="border-t border-[#EEEFF2] my-3"></div>
                <div 
                  id={`order-card-${order._id}`}
                  onClick={() => handleOrderClick(order)} 
                  className="rounded-lg font-general cursor-pointer"
                >
                  <div id={`order-header-${order._id}`} className="flex justify-between text-[#718096] font-medium text-sm mb-2 py-4">
                  <p id={`order-date-${order._id}`}>
                    {new Date(order?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>

                    <div 
                      id={`order-status-${order._id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                        setSelectedOrder(order)
                      }}
                      className={
                        order.orderStatus === "pending" ? "bg-[#FFF0E6] text-[#FE964A] px-2 py-1 text-xs rounded flex items-center" :
                        order.orderStatus === "delivered" ? "bg-[#ecfdeb] text-[#33ca5e] px-2 py-1 text-xs rounded flex items-center" :
                        "bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded flex items-center"
                      }
                    >
                  {order?.orderStatus
                    ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                    : "Status"} ▼
                    </div>
                  </div>
                  {order.items.map((item, index) => (
                    <div 
                      key={item._id} 
                      id={`order-content-${order._id}-${index}`} 
                      className="flex items-center gap-3 mb-2 h-[91px] bg-[#FAFAFA] rounded-[12px] space-x-4 px-2 py-2"
                    >
                      {/* Order Image */}
                      <Image 
                        id={`order-image-${order._id}-${index}`}
                        src={item.packageId?.packageImgUrls?.[0] || "/fallback-image.png"}
                        alt={item.packageId?.packageTitle || "Order Image"} 
                        width={42} 
                        height={42} 
                        className="rounded-md h-[42px] w-[42px] object-contain"
                        objectFit="cover" 
                      />

                      {/* Order Details */}
                      <div id={`order-details-${order._id}-${index}`} className="flex-1">
                        <p id={`order-title-${order._id}-${index}`} className="font-semibold text-sm text-[#111827]">
                        {item.packageId?.packageTitle
                          ? item.packageId.packageTitle
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase())
                          : "No Title"}
                        </p>
                        <p 
                          id={`order-price-${order._id}-${index}`} 
                          className="text-[#718096] font-normal font-general text-sm"
                          >
                          {order?.items[0].packageId.packagePriceCurrency === "NGN" ? "₦" : "$"}{item.packageId?.packagePrice
                            ? item.packageId.packagePrice.toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      {/* Order Quantity */}
                      <div id={`order-quantity-${order._id}-${index}`} className="flex items-center text-[#718096] text-xs">
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}

                </div>
                <div id={`order-summary-${order._id}`} className="bg-white rounded-lg p-4 w-full max-w-md">
                  <div id={`order-summary-grid-${order._id}`} className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
                    <p className="font-medium">Order Number</p>
                    <p className="font-bold text-gray-900 truncate">{order?.orderId}</p>
  
                    <p className="font-medium">Guest</p>
                    <p className="font-bold text-gray-900">
                      {order?.guestName
                        ? order.guestName
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase())
                        : "Guest Name"}
                    </p>
  
                    <p className="font-medium">Delivery</p>
                    <p className="font-bold text-gray-900">{order?.items[0].deliveryMethod}</p>
  
                    <p className="font-medium">Total Price</p>
                    <p className="font-bold text-gray-900">{order?.items[0].packageId.packagePriceCurrency === "NGN" ? "₦" : "$"}{order.totalAmount ? order.totalAmount.toLocaleString() : "N/A"}</p>
                  </div>
                </div>
                {isModalOpen && (
                  <div id="status-modal" className="fixed inset-0 flex items-center justify-center">
                  <div 
                      id="status-modal-content"
                      ref={modalRef} 
                      className="bg-white p-4 rounded-[15px] shadow-md w-64"
                    >
                      <ul id="status-options" className="mt-1 space-y-2">
                        <li 
                          id="status-option-pending"
                          onClick={() => handleStatusChange("pending")}
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-general font-medium text-xl text-gray-700"
                        >
                          Pending
                        </li>
                        <li 
                          id="status-option-shipped"
                          onClick={() => handleStatusChange("shipped")}
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-general font-medium text-xl text-gray-700"
                          >
                          Shipped
                        </li>
                        <li 
                          id="status-option-delivered"
                          onClick={() => handleStatusChange("delivered")}
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-general font-medium text-xl text-gray-700"
                          >
                          Delivered
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
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
        </div>
      </div>
      )}
      </div>
    </Container>
  );
};

export default Page;