"use client"

import React, { useEffect, useMemo, useState } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import OrdersStatCardGroup from "@/components/admin/dashboard/OrderStartCardGroup";
import OrdersHeader from "@/components/admin/dashboard/OrderTable";
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
import { motion } from "framer-motion";
import debounce from "lodash/debounce";


interface EventGroup {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupCurrency: string;
  groupPrivacy: string;
}

interface Event {
  _id: string;
  eventName: string;
  eventImgUrl: string;
  eventImgPublicId: string;
  eventDescription: string;
}

interface OrderItem {
  [key: string]: any;
}

interface Order {
  city: string;
  createdAt: string;
  deliveryType: string; 
  dispatchType: string;
  eventGroupId: EventGroup;
  eventId: Event;
  guestEmail: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhoneNumber: string;
  homeDeliveryFee: number;
  hostId: string;
  items: OrderItem[];
  orderId: string;
  orderStatus: string; 
  paymentStatus: string; 
  shippingAddress: string;
  state: string;
  tax: number;
  totalAmount: number;
  totalAmountCurrency: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [orderSummary, setOrderSummary] = useState<any>();
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [totalPages, setTotalPages ] = useState();
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 1000),
      []
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => {
      debouncedSearch.cancel();
    }
  },[search, debouncedSearch]);
  
  useEffect(() => {
    const fetchOrders = async() => {
      setLoading(true);

      try {
        const params: Record<string, any> = {
          page,
          limit,
          ...(debouncedSearchTerm && {
            search: debouncedSearchTerm,
          }),
          ...(orderStatus && orderStatus !== "All Orders" && {
            orderStatus,
          }),
        };

        const response = await axiosInstance.get(
          `/admin-orders/`,
          { params }
        );
        setOrderSummary(response.data.data.orderSummary);
        setOrderData(response.data.data.orders);
        setTotalPages(response.data.data.totalPages)
      }catch (error: any) {
        setError(error?.response?.data?.message || error.message || "Something went wrong");
      } finally {
        setLoading(false)
      }
    };
    fetchOrders();
  }, [page, limit, debouncedSearchTerm, orderStatus]);

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
      <div id="orders-page" className="w-full h-full flex flex-col gap-2 items-center justify-center">
        {/* Top section: stat cards*/}
        <div className="w-full">
            <OrdersStatCardGroup orderSummary={orderSummary} />
        </div>
        {/* Table section */}
        <div className="w-full">
          <OrdersHeader 
            orders={orderData}
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={totalPages}
            setLimit={setLimit}
            limit={limit}
            searchTerm={search}
            setSearchTerm={setSearch}
            setOrderStatus={setOrderStatus}
            orderStatus={orderStatus}
          />
        </div>
      </div>
    </AdminContainer>
  );
};

export default Page;
