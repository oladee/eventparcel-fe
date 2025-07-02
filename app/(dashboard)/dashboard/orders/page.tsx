"use client";

import Container from "@/components/dashboard/Container";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Cart from "../../../../assets/orderIcons/cart.png";
import BoxTime from "../../../../assets/orderIcons/box-time.png";
import Package from "../../../../assets/orderIcons/package.png";
import Eye from "../../../../assets/orderIcons/eye.png";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import OrderPagination from "@/components/OrderPagination";
import { usePathname, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import useDebounce from "@/hooks/useDebounce";
import { Order, OrderDashboardResponse } from "@/app/interface/Order";
import useUpdateOrderStatus from "@/hooks/useUpdateOrderStatus";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/mixpanel";
import { HiOutlineDocumentDownload } from "react-icons/hi";

const tabs = ["All Orders", "Pending", "Shipped", "Completed"];

const Page: React.FC = ({}) => {
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
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { icon: Cart, title: "Total Orders", count: 0, change: "0%" },
    { icon: Eye, title: "Total Invites", count: 0, change: "0%" },
    { icon: Package, title: "Total Delivered", count: 0, change: "0%" },
    { icon: BoxTime, title: "Pending Orders", count: 0, change: "0%" }
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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

  useEffect(() => {
    const fetchOrders = async () => {
      const loggedInUserString = localStorage.getItem("loggedInUserId");
      // const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;

      if (!loggedInUserString) {
        router.replace("/login");
        return;
      }
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          limit,
          search: debouncedSearchQuery
        };

        if (activeTab && activeTab !== "All Orders") {
          const normalizedStatus = activeTab.trim().toLowerCase();
          params.orderStatus =
            normalizedStatus === "completed" ? "delivered" : normalizedStatus;
        }

        const response = await axiosInstance.post(
          `view-orders/`,
          { hostId: loggedInUserString },
          { params }
        );

          trackEvent("View Orders", {
            source: "orders page",
            timestamp: new Date().toISOString(),
            page_name: "Orders Page",
          });

        const safeParse = (value?: string | number) => {
          const num = Number(value);
          return isNaN(num) ? "0.00%" : `${num.toFixed(1)}%`;
        };

        setStats([
          {
            icon: Cart,
            title: "Total Orders",
            count:
              response?.data?.data?.orderSummary?.ordersSummary?.totalOrders
                ?.overall,
            change: safeParse(
              response?.data?.data?.orderSummary?.ordersSummary?.totalOrders
                ?.growthRate
            )
          },
          {
            icon: Eye,
            title: "Total Invites",
            count:
              response?.data?.data?.orderSummary?.invitesSummary?.totalInvites,
            change: safeParse(
              response?.data?.data?.orderSummary?.invitesSummary?.viewedRate
            )
          },
          {
            icon: Package,
            title: "Total Delivered",
            count:
              response?.data?.data?.orderSummary?.ordersSummary?.totalDelivered
                ?.overall,
            change: safeParse(
              response?.data?.data?.orderSummary?.ordersSummary?.totalDelivered
                ?.growthRate
            )
          },
          {
            icon: BoxTime,
            title: "Pending Orders",
            count:
              response?.data?.data?.orderSummary?.ordersSummary?.pendingOrders
                ?.overall,
            change: safeParse(
              response?.data?.data?.orderSummary?.ordersSummary?.pendingOrders
                ?.growthRate
            )
          }
        ]);

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
  }, [page, limit, debouncedSearchQuery, activeTab, router]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  

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
            )
          };
        });
      } else {
        // toast.error("Failed to update status. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsModalOpen(false);
    }
  };

   const capitalize = (str?: string) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';


  const exportToCSV = (data: OrderDashboardResponse, filename = "orders.csv") => {
    if (!data || !data.orders || data.orders.length === 0) return;

    const headers = [
      "Order ID",
      "Order Date",
      "Guest Name",
      "Event Name",
      "Price",
      "Delivery Type",
      "Status"
    ];

    const csvRows = [headers.join(",")];

    for (const row of data.orders) {
      const values = headers.map((header) => {
        let value;

        switch (header) {
          case "Order ID":
            value = row.orderId;
            break;
          case "Order Date":
            value = row.createdAt ? new Date(row.createdAt).toLocaleString() : "";
            break;
          case "Guest Name":
            value = `${capitalize(row.guestFirstName || "")} ${capitalize(row.guestLastName || "")}`.trim();
            break;
          case "Event Name":
            value = row.eventId?.eventName ? capitalize(row.eventId.eventName) : "";
            break;
          case "Price":
            value =
              row.totalAmount != null
                ? `="${row.totalAmountCurrency === "NGN" ? "₦" : "$"}${row.totalAmount.toLocaleString()}"`
                : "";
            break;
          case "Delivery Type":
            value = row.deliveryType || "";
            break;
          case "Status":
            value = row.orderStatus || "";
            break;
          default:
            value = "";
        }

        const escaped = String(value ?? "").replace(/"/g, '""');
        return `"${escaped}"`;
      });

      csvRows.push(values.join(","));
    }

    try {
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      // Optional tracking
      trackEvent?.("Export Data", {
        source: `${pathname} page`,
        timestamp: new Date().toISOString(),
        page_name: `${pathname} Page`,
        route: pathname,
        status: "Successful"
      });

    } catch (error) {
      console.error("CSV export failed", error);
      trackEvent?.("Export Data", {
        source: `${pathname} page`,
        timestamp: new Date().toISOString(),
        page_name: `${pathname} Page`,
        route: pathname,
        status: "Failed"
      });
    }
  };


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
                <div
                  key={i}
                  className="w-[163px] h-[121px] bg-white shadow-sm p-3 rounded-[12px]"
                >
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
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-200 rounded animate-pulse"
                  ></div>
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
            <div className="flex justify-between items-center mb-6">
              <h4
                id="orders-page-heading"
                className="text-2xl font-general font-bold text-[#111827]"
                >
                All Orders
              </h4>
              {/* Right: Export */}
              <div id="table-export" className="w-[90.71px] h-[37px] md:w-auto">
                <button
                onClick={() => orders && exportToCSV(orders)}
                className="w-full h-full flex items-center justify-center gap-1 bg-[#FFFFFF] rounded-[12px] px-3 py-1.5 text-sm text-[#718096] font-medium shadow-sm">
                  <HiOutlineDocumentDownload size={16} />
                  Export 
                  {/* <MdOutlineKeyboardArrowDown className="w-6 h-6 text-[#718096]"/> */}
                </button>
              </div>
            </div>


            {/* Stats Grid */}
            <div
              id="stats-grid"
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div
                  id={`stat-card-${index}`}
                  key={index}
                  className="w-full h-[121px] bg-[#FFFFFF] shadow-sm p-3 rounded-[12px]"
                >
                  <div
                    id={`stat-header-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Image
                      id={`stat-icon-${index}`}
                      src={stat.icon}
                      alt={stat.title}
                      height={16}
                      width={16}
                    />
                    <p
                      id={`stat-title-${index}`}
                      className="font-general font-semibold text-xs text-[#111827]"
                    >
                      {stat.title}
                    </p>
                  </div>
                  <div
                    id={`stat-divider-${index}`}
                    className="border-t border-[#EEEFF2] my-3"
                  ></div>
                  <p
                    id={`stat-count-${index}`}
                    className="text-2xl font-bold text-[#111827]"
                  >
                    {stat.count}
                  </p>
                  <p
                    id={`stat-change-${index}`}
                    className={`text-xs font-general font-normal mt-1 ${
                      stat.change.startsWith("-")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {stat.change}{" "}
                    <span className="text-[#718096]">from last week</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div
              id="orders-content-container"
              className="bg-[#FFFFFF] p-5 mt-6 rounded-[12px]"
            >
              <div
                id="orders-tabs"
                className="flex items-center border-b space-x-6 mt-6 mb-6"
              >
                {tabs.map((tab) => (
                  <button
                    id={`tab-${tab.toLowerCase().replace(" ", "-")}`}
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
              <div
                id="search-filter-container"
                className="flex items-center gap-3 rounded-md mt-3"
              >
                <div
                  id="search-container"
                  className="flex items-center bg-[#FAFAFA] px-4 py-2 rounded-[12px] w-[80%] h-[56px]"
                >
                  <Search id="search-icon" className="h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-3 w-full h-full outline-none text-base bg-[#FAFAFA] placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* <div
                  id="filter-button-container"
                  className="bg-[#FAFAFA] h-14 w-14 flex justify-center items-center"
                >
                  <button id="filter-button" className="p-2 rounded-[12x]">
                    <Settings2 id="filter-icon" className="text-[#A0AEC0]" />
                  </button>
                </div> */}
              </div>

              {/* Order List */}
              <div id="orders-list" className="mt-6 space-y-4">
                {orders?.orders?.length ? (
                  orders?.orders?.map((order) => (
                    <React.Fragment key={order._id}>
                      <div className="border-t border-[#EEEFF2] my-3"></div>
                      <div
                        onClick={() => handleOrderClick(order)}
                        className="rounded-lg font-general cursor-pointer"
                      >
                        <div className="flex justify-between text-[#718096] font-medium text-sm mb-2 py-4">
                          <p>
                            {new Date(order?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric"
                              }
                            )}
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
                            {order.orderStatus?.charAt(0).toUpperCase() +
                              order.orderStatus?.slice(1)}{" "}
                            ▼
                          </div>
                        </div>

                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-3 mb-2 h-[91px] bg-[#FAFAFA] rounded-[12px] space-x-4 px-2 py-2"
                          >
                            <Image
                              src={
                                item?.packageImgUrls?.[0] ||
                                "/fallback-image.png"
                              }
                              alt={
                                item?.packageTitle || "Order Image"
                              }
                              width={42}
                              height={42}
                              className="rounded-md h-[42px] w-[42px] object-contain"
                            />

                            <div className="flex-1">
                              <p className="font-semibold text-sm text-[#111827]">
                                {item?.packageTitle
                                  ? item.packageTitle
                                      .charAt(0)
                                      .toUpperCase() +
                                    item?.packageTitle.slice(1)
                                  : "No Title"}
                              </p>
                              <p className="text-[#718096] font-normal text-sm">
                                {item?.packagePriceCurrency === "NGN"
                                  ? "₦"
                                  : "$"}
                                {item?.packagePrice?.toLocaleString() ||
                                  "N/A"}
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
                          <p className="font-bold text-gray-900 truncate">
                            {order?.orderId}
                          </p>
                          <p className="font-medium">Guest</p>
                          <p className="font-bold text-gray-900">
                            {order?.guestFirstName
                              ? order.guestFirstName.charAt(0).toUpperCase() +
                                order.guestFirstName.slice(1)
                              : "No"}{" "}
                            {order?.guestLastName
                              ? order.guestLastName.charAt(0).toUpperCase() +
                                order.guestLastName.slice(1)
                              : "Name"}
                          </p>
                          <p className="font-medium">Delivery</p>
                          <p className="font-bold text-gray-900">
                          {order?.items[0]?.deliveryMethod
                            ? order.items[0].deliveryMethod === "homeDelivery"
                              ? "Home Delivery"
                              : "Pick Up"
                            : "N/A"}
                          </p>
                          <p className="font-medium">Total Price</p>
                          <p className="font-bold text-gray-900">
                            {order?.items[0]?.packageId
                              ?.packagePriceCurrency === "NGN"
                              ? "₦"
                              : "$"}
                            {order.totalAmount?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                      </div>

                      {isModalOpen && selectedOrder && (
                        <div
                          id="status-modal"
                          className="fixed inset-0 flex items-center justify-center z-50"
                        >
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
                                  { key: "pickedUp", label: "Picked Up" }
                                ];

                                const deliveryType =
                                  typeof selectedOrder.deliveryType === "string"
                                    ? selectedOrder.deliveryType.toLowerCase()
                                    : "";

                                const filteredStatuses =
                                  deliveryType === "pickup"
                                    ? allStatuses.filter((s) =>
                                        ["pending", "pickedUp"].includes(s.key)
                                      )
                                    : allStatuses.filter(
                                        (s) => s.key !== "pickedUp"
                                      );

                                return filteredStatuses.map((status) => (
                                  <li
                                    key={status.key}
                                    id={`status-option-${status.key}`}
                                    onClick={() =>
                                      handleStatusChange(status.key)
                                    }
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
