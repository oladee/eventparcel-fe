"use client";

import Container from '@/components/dashboard/Container';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Vector from "../../../../public/icons/Vector.png";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import DiscountOptionsModal from '@/components/dashboard/eventComponents/DiscountOptionsModal';
import { trackEvent } from '@/lib/mixpanel';

interface Discount {
  isShared: any;
  _id: string;
  discountCode: string;
  discountTitle: string;
  discountValue: number;
  discountValueType: string;
  discountStatus: string;
  totalUsed: number;
  overallValue: number;
}

const Page = () => {
  const [hostId, setHostId] = useState("");
  const [discountData, setDiscountData] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const loggedInUserString = localStorage.getItem("loggedInUserId");
    // const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;

    if (!loggedInUserEmail || !loggedInUserString) {
      router.replace("/");
      return;
    }

    setHostId(loggedInUserString);
    setIsReady(true);
  }, [router]);

  const fetchDiscountData = useCallback(async () => {
    if (!hostId) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`/get-all-discounts/${hostId}`);
      console.log(response.data)
      if (response.data.success) {
        setDiscountData(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  }, [hostId]); 

  useEffect(() => {
    fetchDiscountData();
  }, [hostId, fetchDiscountData]);

  useEffect(() => {
    fetchDiscountData();
  }, [hostId, fetchDiscountData]);

  const handleShareDiscountCode = async (discount: Discount) => {
  
    trackEvent("Share Discount Started", {
      source: "dashboard discount page",
      timestamp: new Date().toISOString(),
      page_name: "dashboard discount page",
      discount_id: discount?._id
    });

    const discountCode = discount.discountCode;
  
    if (!discountCode) {
      console.log("No discount code found in selectedDiscount");
      return;
    }

  
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Special Discount Offer",
          text: `Use this discount code: ${discountCode}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else if (navigator.clipboard) {
      // Fallback: copy the link to clipboard
      navigator.clipboard.writeText(discountCode);
      alert("Discount code copied to clipboard!");

      trackEvent("Share Discount End", {
        source: "dashboard discount page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard discount page",
        discount_id: discount?._id,
        discount_title: discount.discountTitle,
        discount_value: discount.discountValue,
        discount_value_type: discount.discountValueType,
        discount_code: discount.discountCode,
        status: "Successfull"
      });

    } else {
      trackEvent("Share Discount End", {
        source: "dashboard discount page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard discount page",
        discount_id: discount?._id,
        discount_title: discount.discountTitle,
        discount_value: discount.discountValue,
        discount_value_type: discount.discountValueType,
        discount_code: discount.discountCode,
        status: "Failed"
      });
      alert("Sharing not supported on this browser.");
    }
  };

  const handleModalClose = (dataUpdated: boolean) => {
    setIsModalOpen(false);
    if (dataUpdated) {
      fetchDiscountData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen min-h-[300px]">
        <div className="w-[280px] animate-pulse">
          <div className="bg-white rounded-lg shadow-sm border p-3 space-y-2">
            {/* Top row */}
            <div className="flex justify-between">
              <div className="h-4 w-14 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-200 rounded"></div>
            </div>

            {/* Middle content */}
            <div className="space-y-1.5">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>

            {/* Stats */}
            <div className="flex justify-between pt-2">
              <div className="space-y-1">
                <div className="h-5 w-8 bg-gray-200 rounded"></div>
                <div className="h-3 w-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-5 w-10 bg-gray-200 rounded"></div>
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-gray-200 rounded"></div>
                <div className="h-3 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <Container>
      <div className="w-full space-y-6">
        <div className="w-[343px] h-[82.62px] flex flex-col gap-2">
          <h2 className="font-general text-2xl font-bold text-[#111827]">Discounts</h2>
          <p className="text-sm font-medium text-[#718096] w-[343px] h-[44px]">
            {discountData.length === 0 ? (
              " Treat your guests to something special! Set a custom discount by value or percentage"
            ) : (
              "Create a special discount for some of your guest, can be in percent or actual value"
            )}
          </p>
        </div>
        <div className="w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {discountData.map((discount) => (
            <div key={discount._id} id={discount._id} className="bg-[#FFFFFF] rounded-[20px] shadow-sm border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className='flex gap-3'>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border 
                      ${discount?.discountStatus === "active" ? "bg-[#2B9EA01F] text-[#2B9EA0] border-[#2B9EA0]" : "bg-[#F2D1D1] text-[#D9534F] border-[#D9534F]"}`}
                      >
                    {discount?.discountStatus === "active" ? 'Active' : 'Inactive'}
                  </span>

                  {discount?.isShared && (  
                  <div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border 
                        ${discount?.discountStatus === "active" ? "bg-[#2B9EA01F] text-[#2B9EA0] border-[#2B9EA0]" : "bg-[#F2D1D1] text-[#D9534F] border-[#D9534F]"}`}
                    >
                      Shared
                    </span>
                  </div>
                  )}
                </div>
                {!discount?.isShared && (
                  <button
                    onClick={() => {
                      setSelectedDiscount(discount); 
                      setIsModalOpen(true); 
                    }}
                    className="text-[#A0AEC0] text-2xl font-bold"
                    >
                    ⋯
                  </button>
              )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-[#111827]">{discount.discountTitle}</h3>
                <p className="text-sm font-medium text-[#718096]">
                  Discount Value:{" "}
                  <span className="font-bold text-base">
                    {discount.discountValueType === 'percentage'
                      ? `${Number(discount.discountValue).toLocaleString()}%`
                      : discount.discountValueType === 'NGN'
                      ? `₦${Number(discount.discountValue).toLocaleString('en-NG')}`
                      : discount.discountValueType === 'USD'
                      ? `$${Number(discount.discountValue).toLocaleString('en-US')}`
                      : Number(discount.discountValue).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="h-auto flex items-center justify-between text-xs text-gray-600">
                <div className="flex-1 pr-4 border-r border-gray-200">
                  <p className="font-semibold text-xl text-[#111827]">{discount.totalUsed || 0}</p>
                  <p className="text-[#718096] font-medium text-xs">Total Used</p>
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <p className="font-semibold text-xl text-[#111827] pr-8">{discount.overallValue.toLocaleString() || '0.00'}</p>
                  <p className="text-[#718096] font-medium text-xs">Overall Value</p>
                </div>
              </div>

              <div className="h-[61px] flex items-center justify-between">
                <span className="text-[#718096] text-[13px]">
                  Code: <span className="text-base font-semibold text-[#111827]">{discount.discountCode}</span>
                </span>
                <div
                  onClick={() => {
                    handleShareDiscountCode(discount); 
                  }}                  
                  className="flex gap-1 items-center text-red-500 hover:underline text-xs font-medium cursor-pointer"
                >
                  <Image src={Vector} alt="copy" width={16} height={16} />
                  <span className="text-[14px] text-[#751423]">Share Code</span>
                </div>
              </div>
            </div>
          ))}

          {/* Create Discount Button */}
          <button
            onClick={() => router.push("/dashboard/createDiscount")}
            className="flex flex-col items-center justify-center border border-dashed border-[#11182752] rounded-xl p-6 bg-[#FFFFFF66] transition"
          >
            <Plus className="text-[#751423] w-5 h-5 mb-2" />
            <span className="text-[#751423] font-semibold text-sm">Create Discount</span>
          </button>
        </div>

        {isModalOpen && selectedDiscount && (
          <DiscountOptionsModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            discountData={selectedDiscount}
          />
        )}
      </div>
    </Container>
  );
};

export default Page;
