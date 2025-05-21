"use client"

import Container from '@/components/dashboard/Container'
import React, { useEffect, useState } from 'react'
import BoxTime from "../../../../assets/orderIcons/box-time.png";
import Cart from "../../../../assets/orderIcons/cart.png";
import Image from 'next/image';
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { Order } from '@/app/interface/Order';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/useDebounce';
import axiosInstance from '@/lib/axiosInstance';
import OrderPagination from '@/components/OrderPagination';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/mixpanel';

const Page = () => {
  const [orders, setOrders] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [openBreakdownOrderId, setOpenBreakdownOrderId] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { icon: Cart, title: "Overall Sales", count: 0, change: "0.00%" },
    { icon: BoxTime, title: "Net Sales", count: 0, change: "0.00%" },
  ]);


    useEffect(() => {
      const loggedInUserString = localStorage.getItem("loggedInUserId");
      // const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;
  
      if (!loggedInUserString) {
        router.replace("/");
        return;
      }

      const fetchOrders = async () => {
        setLoading(true);
        try {
          
          const params: Record<string, any> = { 
            page, 
            limit, 
            search: debouncedSearchQuery 
          };
  
          const response = await axiosInstance.get(
              `payment-history/${loggedInUserString}`,
            { params }
          );

          trackEvent("View Transactions", {
            source: "transactions page",
            timestamp: new Date().toISOString(),
            page_name: "Transactions Page",
          });

              const safeCount = (value?: number) => {
                return typeof value === 'number' && !isNaN(value) ? value : 0;
              };
        
              const safeChange = (value?: string | number) => {
                if (value === undefined || value === null) return "0.00";
                const num = Number(value);
                return isNaN(num) ? "0.00" : `${num.toFixed(2)}`;
              };      

              setStats([
                { 
                  icon: Cart, 
                  title: "Overall Sales", 
                  count: safeCount(response?.data?.data?.summary?.summaryByCurrency?.NGN?.overallSales),
                  change: safeChange(response?.data?.data?.summary?.summaryByCurrency?.USD?.overallSales),
                },
                { 
                  icon: BoxTime, 
                  title: "Net Sales", 
                  count: safeCount(response?.data?.data?.summary?.summaryByCurrency?.NGN?.netSales),
                  change: safeChange(response?.data?.data?.summary?.summaryByCurrency?.USD?.netSales),
                },
              ]);
            
          if (response.data && response.data.data) {
            setOrders(response?.data?.data?.payments);
            setTotalPages(response.data.data.totalPages || 1); 
          } else {
            setOrders(response.data?.data || []);          
            setTotalPages(String(1));       
          }
            
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false)
        }
      };
      fetchOrders();
    }, [page, limit, debouncedSearchQuery, router]);

    const formatCurrency = (value: number) => {
      if (value >= 1_000_000) {
        return `₦${(value / 1_000_000).toFixed(2)}M`;
      } else if (value >= 1_000) {
        return `₦${(value / 1_000).toFixed(2)}K`;
      }
      return `₦${value.toFixed(2)}`;
    };

    const formatDollarCurrency = (value: number) => {
      if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
      } else if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(2)}K`;
      }
      return `$${value.toFixed(2)}`;
    };
    
      const handleOrderClick = (order: Order) => {
        localStorage.setItem("selectedOrder", JSON.stringify(order));
        router.push(`/dashboard/orderDetails`);
      };

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        const day = date.toLocaleString("en-GB", { day: "2-digit" });
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear();
      
        return `${day} ${month}, ${year}`;
      };
          

    if (loading) {
      return (
        <div>
          <div className="flex flex-col justify-center items-center min-h-screen">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-t-[#751423] border-gray-300 rounded-full"
            ></motion.div>
  
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
    <div className="w-[343px] lg:w-full h-full flex flex-col gap-5 items-center justify-center">
      <div id="discount-header" className="w-full flex justify-start">
        <h2 id="discount-title" className="font-general text-2xl font-bold text-[#111827]">Transactions</h2>
      </div>
       {/* Stats Grid */}
        <div id="stats-grid" className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {stats.map((stat, index) => (
            <div 
            id={`stat-card-${index}`}
            key={index} 
              className="w-[163px] lg:w-[226px] h-[121px] bg-[#FFFFFF] shadow-sm p-3 rounded-[12px]"
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
              <p id={`stat-count-${index}`} className="text-2xl font-bold text-[#111827]">
              {formatCurrency(stat.count)}
              </p>
              <p 
                id={`stat-change-${index}`}
                className={`text-xs font-general font-normal mt-1 ${String(stat.change).startsWith('-') ? 'text-red-600' : 'text-green-600'}`}
                >
                {formatDollarCurrency(Number(stat.change))} <span className='text-[#718096]'>in Dollar</span>
              </p>
            </div>
          ))}
        </div>

        <div id="orders-content-container" className='bg-[#FFFFFF] w-full p-5 mt-6 rounded-[12px]'>
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
        </div>

        {/* Orders details page */}
        <div id="orders-list" className="mt-6 space-y-4">
        {!orders ||  orders?.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-500">No transactions found</span>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {orders?.map((order: any) => (
            <div
              key={order?.orderNumber}
              className="rounded-xl p-4 w-full bg-white max-w-full space-y-4 text-sm"
            >
              {/* Header: Date & View Order */}
              <div className="flex items-center justify-between font-medium text-[#718096] border-t pt-4 text-sm">
                <span>{formatDate(order?.orderId?.createdAt)}</span>
                <button
                  onClick={() => handleOrderClick(order?.orderId)}
                  className="text-xs text-[#751423] bg-[#7514231F] px-3 py-1 rounded-full font-medium"
                >
                  View Order
                </button>
              </div>

              {/* Transaction Info */}
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium text-[#718096] text-sm">Order Number</span>
                  <span className="text-[#111827] text-sm font-semibold">{order?.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#718096] text-sm">Guest Payment</span>
                  <span className="text-[#111827] text-sm font-semibold">
                    {order?.guestPaymentCurrency === "NGN"
                      ? formatCurrency(order?.guestPayment)
                      : formatDollarCurrency(order?.guestPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#718096] text-sm">Amount Received</span>
                  <span className="text-[#0CAF60] text-sm font-semibold">
                    {order?.amountReceivedCurrency === "NGN"
                      ? formatCurrency(order?.amountReceived)
                      : formatDollarCurrency(order?.amountReceived)}
                  </span>
                </div>

                <div className="h-px bg-gray-100 my-2" />

                {openBreakdownOrderId === order.orderId && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#acb9ca] text-sm">
                        {order?.items} Item(s)
                      </span>
                      <span>
                        {order?.amountReceivedCurrency === "NGN"
                          ? formatCurrency(order?.amountReceived)
                          : formatDollarCurrency(order?.amountReceived)}
                      </span>
                    </div>

                    {order?.homeDeliveryFee && (
                      <div className="flex justify-between">
                        <span className="font-medium text-[#acb9ca] text-sm">Home Delivery</span>
                        <span>
                          {order?.guestPaymentCurrency === "NGN"
                            ? formatCurrency(order?.homeDeliveryFee)
                            : formatDollarCurrency(order?.homeDeliveryFee)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-medium text-[#acb9ca] text-sm">Tax</span>
                      <span>
                        {order?.totalAmountCurrency === "NGN"
                          ? formatCurrency(order?.tax)
                          : formatDollarCurrency(order?.tax)}
                      </span>
                    </div>

                    <div className="h-px bg-gray-100 my-2" />

                    <div className="flex justify-between font-semibold text-black">
                      <span className="text-[#111827] text-sm font-semibold">Total</span>
                      <span className="text-[#111827] text-sm font-semibold">
                        {order?.totalAmountCurrency === "NGN"
                          ? formatCurrency(order?.totalAmount)
                          : formatDollarCurrency(order?.totalAmount)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Collapse Button */}
              <button
                onClick={() =>
                  setOpenBreakdownOrderId((prev) =>
                    prev === order.orderId ? null : order.orderId
                  )
                }
                className="w-full h-[32px] flex items-center justify-center text-[#751423] border border-[#751423] py-1.5 rounded-[8px] font-medium"
              >
                {openBreakdownOrderId === order.orderId ? "See Less" : "See Breakdown"}
                {openBreakdownOrderId === order.orderId ? (
                  <ChevronUp size={16} className="ml-1 text-[#A0AEC0]" />
                ) : (
                  <ChevronDown size={16} className="ml-1 text-[#A0AEC0]" />
                )}
              </button>
            </div>
          ))}
        </div>
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