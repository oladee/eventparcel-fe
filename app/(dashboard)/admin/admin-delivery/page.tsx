"use client"

import AdminContainer from "@/components/admin/AdminContainer";
import DeliveryStatCardGroup, { OrderSummary } from "@/components/admin/dashboard/DeliveryStatCardGroup";
import DeliveryTable from "@/components/admin/dashboard/DeliveryTable";
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
import { motion } from "framer-motion";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export interface GuestOrder {
  _id: string;
  orderId: string;
  hostId: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  city: string;
  state: string;
  shippingAddress: string;
  deliveryType: string;
  dispatchType: string;
  homeDeliveryFee: number;
  tax: number;
  totalAmount: number;
  totalAmountCurrency: string;
  paymentStatus: string;
  orderStatus: string;
  eventId: any;
  eventGroupId: any;
  items: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [orderSummary, setOrderSummary] = useState<OrderSummary>();
    const [orderData, setOrderData] = useState<GuestOrder[]>([]);
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
            `/admin-delivery/`,
            { params }
          );
          
          setOrderSummary(response.data.data.summary)
          setOrderData(response.data.data.deliveries);
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
      <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
        {/* Top section: stat cards*/}
        <div className="w-full">
            <DeliveryStatCardGroup orderSummary={orderSummary} />
        </div>
        {/* Table section */}
        <div className="w-full">
          <DeliveryTable 
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
