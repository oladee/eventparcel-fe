"use client"

import React, { useEffect, useMemo, useState } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import TransactionStatCard from "@/components/admin/dashboard/TransactionStatCard";
import TransactionTable from "@/components/admin/dashboard/TransactionTable";
import axiosInstance from '@/lib/adminAxiosInterceptor/axiosInstance'
import { debounce } from "lodash";
import { Order } from "@/app/interface/Order";
import { motion } from "framer-motion";

interface OrderSummaryItem {
  amountReceived: number;
  amountReceivedCurrency: string;
  guestPayment: number;
  guestPaymentCurrency: string;
  homeDeliveryFee: number;
  items: number;
  orderNumber: string;
  tax: number;
  totalAmount: number;
  totalAmountCurrency: string;
  orderId: Order;
}

export interface CurrencySalesData {
  deliveryFee: number;
  deliveryFeeChange: number;
  netSales: number;
  netSalesChange: number;
  overallSales: number;
  serviceFee: number;
  serviceFeeChange: number;
}

export interface SalesSummary {
  NGN: CurrencySalesData;
  USD: CurrencySalesData;
}


const Page: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [orderSummary, setOrderSummary] = useState<SalesSummary>();
    const [orderData, setOrderData] = useState<OrderSummaryItem[]>([]);
    const [totalPages, setTotalPages ] = useState();
    const [search, setSearch] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
          const params: Record<string, any> ={
            page,
            limit,
            ...(debouncedSearchTerm && {
              search:debouncedSearchTerm,
            })
          };
  
          const response = await axiosInstance.get(
            `/admin-transactions/`,
            { params }
          );
          setOrderSummary(response.data.data.summary.summaryByCurrency);
          setOrderData(response.data.data.payments);
          setTotalPages(response.data.data.totalPages)
        }catch (error: any) {
          setError(error?.response?.data?.message || error.message || "Something went wrong");
        } finally {
          setLoading(false)
        }
      };
      fetchOrders();
    }, [page, limit, debouncedSearchTerm]);

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
            <TransactionStatCard 
              orderSummary={orderSummary} 
            />
        </div>
        {/* Table section */}
        <div className="w-full">
          <TransactionTable
            orders={orderData}
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={totalPages}
            setLimit={setLimit}
            limit={limit}
            searchTerm={search}
            setSearchTerm={setSearch}
          />
        </div>
      </div>
    </AdminContainer>
  );
};

export default Page;
