"use client";

import Container from '@/components/dashboard/Container';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
// import Cart from "../../../../../assets/orderIcons/cart.png";
// import BoxTime from "../../../../../assets/orderIcons/box-time.png";
import Eye from "../../../../../assets/orderIcons/eye.png"
// import Package from "../../../../../assets/orderIcons/package.png";
import { Search, Settings2  } from "lucide-react";
import { cn } from '@/utils/cn';
// import OrderPagination from '@/components/OrderPagination';
import { useRouter } from 'next/navigation';
// import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosSend } from 'react-icons/io';
import GroupOptionsModal from '@/components/dashboard/eventComponents/GroupOptionsModal';
import { Group } from '@/app/interface/Group';
import { FiMoreHorizontal } from 'react-icons/fi';

interface Order {
  id: number;
  date: string;
  status: string;
  image: any;
  title: string;
  price: string;
  quantity: number;
}

// const stats = [
//   { icon: Cart, title: "Total Orders", count: "1,256", change: "+1.0%" },
//   { icon: Eye, title: "Total Invites", count: "324", change: "+65%" },
//   { icon: Package, title: "Total Delivered", count: "186", change: "-4.0%" },
//   { icon: BoxTime, title: "Pending Orders", count: "58", change: "-2.5%" },
// ];

const tabs = ["All Orders", "Pending", "Shipped", "Completed"];

const orders = [
  {
    id: 1,
    date: "Apr 24, 2025",
    status: "Pending",
    image: Eye,
    title: "6 Yards of Aso Oke and Gele for Women",
    price: "₦560,000",
    quantity: 1,
  },
  {
    id: 2,
    date: "Apr 24, 2025",
    status: "Delivered",
    image: Eye,
    title: "6 Yards of Aso Oke and Gele for Women",
    price: "₦560,000",
    quantity: 1,
  },
  {
    id: 3,
    date: "Apr 24, 2025",
    status: "Shipped",
    image: Eye,
    title: "6 Yards of Aso Oke and Gele for Women",
    price: "₦560,000",
    quantity: 1,
  },
  {
    id: 4,
    date: "Apr 24, 2025",
    status: "Pending",
    image: Eye,
    title: "6 Yards of Aso Oke and Gele for Women",
    price: "₦560,000",
    quantity: 1,
  },
  {
    id: 5,
    date: "Apr 24, 2025",
    status: "Pending",
    image: Eye,
    title: "6 Yards of Aso Oke and Gele for Women",
    price: "₦560,000",
    quantity: 1,
  },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedGroup] = useState<Group | null>(null);

  // const openGroupOptions = (group: Group) => {
  //   setSelectedGroup(group);
  //   setIsModalOpen(true);
  // };
  

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
    router.push(`/dashboard/orderDetails?order=${encodeURIComponent(JSON.stringify(order))}`);
  };

  
  const handleSendInviteClick = () => {
    router.push("/share-contact");
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

   // Open modal and store selected group
    // const openGroupOptions = (group: Group) => {
    //   setSelectedGroup(group);
    //   setIsModalOpen(true);
    // };

  return (
    <Container>
      <div id="orders-page-container" className="min-h-screen mt-2">
        <div>
          <div>
            <div className="bg-white rounded-2xl p-6">
              {/* Header Section */}
              <div className="flex justify-between items-start">
                <span
                  // className={`${
                  //   group.groupPrivacy.toLowerCase() === "private"
                  //     ? "text-red-600 border-red-600 bg-[#DE42221F]"
                  //     : "text-[#2B9EA0] border-[#2B9EA0] bg-[#2B9EA01F]"
                  // } border px-3 rounded-full text-sm font-medium capitalize`}
                  className='text-[#2B9EA0] border-[#2B9EA0] bg-[#2B9EA01F] border px-3 rounded-full text-sm font-medium capitalize'
                >
                  {/* {group.groupPrivacy} */}
                  General
                </span>
                <span 
                  // onClick={() => openGroupOptions(group)}
                  >
                  <FiMoreHorizontal
                    size={24}
                    className="text-gray-500 cursor-pointer"
                  />
                </span>
                {/* <span onClick={() => openGroupOptions(group)}>...</span> */}
              </div>
  
              {/* Group Title and Description */}
              {/* <div onClick={() => handleViewOneGroup(group._id)}> */}
              <div>
                  <h2 className="text-xl font-bold text-[#111827] mt-2 capitalize">
                    {/* {group.groupName} */} General Aso Ebi
                  </h2>
                  <p className="text-[#718096] text-sm mt-1 truncate-text2">
                    {/* {group.groupDescription} */}This is the general aso ebi for everyone who is not a family member
                  </p>
              </div>
                  
              <div className="flex items-center space-x-6 py-4 text-sm text-gray-500 font-medium">
              <div className="flex flex-col items-start">
                <span className="font-semibold text-[20px] text-[#111827] mb-2">₦121M</span>
                <span className='font-general'>Overall sales</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex flex-col items-start">
                <span className="text-black font-bold text-lg">182</span>
                <span>Sold</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg text-[#111827]">42</span>
                <span className='text-green-600'>In stock</span>
              </div>
            </div>
            
  
              {/* Contacts and Invite Section */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  className="text-gray-500 text-sm font-medium outline-none">
                  Contacts: <span className="text-gray-900 font-bold">0</span>
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
                id="search-input"
                type="text"
                placeholder="Search..."
                className="ml-3 w-full h-full outline-none text-base bg-[#FAFAFA] placeholder:text-gray-400 placeholder:text-[15px]"
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
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <div id={`order-divider-${order.id}`} className="border-t border-[#EEEFF2] my-3"></div>
                <div 
                  id={`order-card-${order.id}`}
                  onClick={() => handleOrderClick(order)} 
                  className="rounded-lg font-general cursor-pointer"
                >
                  <div id={`order-header-${order.id}`} className="flex justify-between text-[#718096] font-medium text-sm mb-2 py-4">
                    <p id={`order-date-${order.id}`}>{order.date}</p>
                    <div 
                      id={`order-status-${order.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}
                      className={
                        order.status === "Pending" ? "bg-[#FFF0E6] text-[#FE964A] px-2 py-1 text-xs rounded flex items-center" :
                        order.status === "Delivered" ? "bg-[#ecfdeb] text-[#33ca5e] px-2 py-1 text-xs rounded flex items-center" :
                        "bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded flex items-center"
                      }
                    >
                      {order.status} ▼
                    </div>
                  </div>
                  <div id={`order-content-${order.id}`} className="flex items-center gap-3 bg-[#FAFAFA] rounded-[12px] space-x-4 px-2 py-2">
                    <Image 
                      id={`order-image-${order.id}`}
                      src={order.image} 
                      alt={order.title} 
                      width={50} 
                      height={50} 
                      className="rounded-md"
                      objectFit="cover" 
                    />
                    <div id={`order-details-${order.id}`} className="flex-1">
                      <p id={`order-title-${order.id}`} className="font-semibold text-sm text-[#111827]">{order.title}</p>
                      <p id={`order-price-${order.id}`} className="text-[#718096] font-normal font-general text-sm">{order.price}</p>
                    </div>
                    <div id={`order-quantity-${order.id}`} className="flex items-center text-[#718096] text-xs">
                      <span>Qty: {order.quantity}</span>
                    </div>
                  </div>
                </div>
                <div id={`order-summary-${order.id}`} className="bg-white rounded-lg p-4 w-full max-w-md">
                  <div id={`order-summary-grid-${order.id}`} className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
                    <p className="font-medium">Order Number</p>
                    <p className="font-bold text-gray-900">#ID238976</p>
  
                    <p className="font-medium">Guest</p>
                    <p className="font-bold text-gray-900">Annabel Rohan</p>
  
                    <p className="font-medium">Delivery</p>
                    <p className="font-bold text-gray-900">Home Delivery</p>
  
                    <p className="font-medium">Total Price</p>
                    <p className="font-bold text-gray-900">₦563,000</p>
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
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-general font-medium text-xl text-gray-700"
                        >
                          Pending
                        </li>
                        <li 
                          id="status-option-shipped"
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-general font-medium text-xl text-gray-700"
                        >
                          Shipped
                        </li>
                        <li 
                          id="status-option-delivered"
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
            {/* <OrderPagination /> */}
          </div>
        </div>
        <GroupOptionsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        group={selectedGroup}
      />
      </div>
    </Container>
  );
};

export default Page;