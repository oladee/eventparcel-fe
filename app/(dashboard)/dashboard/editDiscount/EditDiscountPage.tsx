"use client";

import Container from '@/components/dashboard/Container';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BiLoaderCircle } from 'react-icons/bi';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';

const currencyOptions = [
  { label: 'Nigerian Naira (₦)', value: '₦' },
  { label: 'US Dollar ($)', value: '$' },
  { label: 'Percentage (%)', value: '%' },
];

interface DiscountData {
  _id: string;
  discountTitle: string;
  discountValue: number;
  discountValueType: 'NGN' | 'USD' | 'percentage';
  discountCode: string;
  event: { _id: string; eventName: string } | string;
  isDisabled?: boolean;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbolDropdownRef = useRef<HTMLDivElement>(null);

  // State for discount data with initial empty values
  const [discountData, setDiscountData] = useState<DiscountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [symbol, setSymbol] = useState('₦');
  const [discountTitle, setDiscountTitle] = useState('');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [discountCode, setDiscountCode] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<{ _id: string; eventName: string } | null>(null);
  const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encodedData = searchParams.get('data');
        if (!encodedData) {
          throw new Error('No discount data provided');
        }
  
        const decodedData = decodeURIComponent(encodedData);
        const data: DiscountData = JSON.parse(decodedData);
  
        setDiscountData(data);
        setDiscountTitle(data.discountTitle);
        setDiscountValue(data.discountValue);
        setDiscountCode(data.discountCode);
  
        const initialSymbol = 
          data.discountValueType === 'USD' ? '$' : 
          data.discountValueType === 'percentage' ? '%' : '₦';
        setSymbol(initialSymbol);
  
        // Handling the 'event' field (string or object)
        if (typeof data.event === 'string') {
          setSelectedEvent({ _id: data.event, eventName: data.event });
        } else {
          setSelectedEvent(data.event);
        }
      } catch (error) {
        console.error('Error parsing discount data:', error);
        toast.error('Invalid discount data');
        router.push('/dashboard/discounts');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [searchParams, router]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (symbolDropdownRef.current && !symbolDropdownRef.current.contains(event.target as Node)) {
        setIsSymbolDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!discountData || !selectedEvent || !discountTitle || !discountValue || !discountCode) {
      toast.error('Please fill all required fields.');
      return;
    }

    const discountValueType =
      symbol === '$' ? 'USD' : symbol === '%' ? 'percentage' : 'NGN';

    const payload = {
      discountTitle,
      discountValue: Number(discountValue),
      discountValueType,
      discountCode,
    };

    try {
      setFormLoading(true);
      const res = await axiosInstance.put(`/update-discount/${discountData._id}`, payload);

      if (res.data.success) {
        toast.success('Discount updated successfully!');
        router.push("/dashboard/discounts");
      } else {
        toast.error(res.data.message || 'Something went wrong!');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="w-full flex justify-center items-center h-64">
          <BiLoaderCircle className="animate-spin text-2xl" />
        </div>
      </Container>
    );
  }

  if (!discountData) {
    return (
      <Container>
        <div className="w-full flex justify-center items-center h-64">
          <p>No discount data available</p>
        </div>
      </Container>
    );
  }

  console.log(discountData)

  return (
    <Container>
      <div className="w-full space-y-6">
        <div className="w-[343px] flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[#111827]">Edit Discount</h2>
          <p className="text-sm font-medium text-[#718096]">
            Update your discount details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-[343px] flex flex-col gap-6 bg-white rounded-[20px] p-6 pb-8">
          {/* Event (readonly) */}
          <div className="space-y-1">
            <label className="text-base font-semibold text-[#111827]">Event</label>
            <div className="w-full h-[56px] bg-[#FAFAFA] rounded-[12px] px-4 py-3 flex items-center text-sm font-medium text-gray-700">
              {selectedEvent?.eventName || 'N/A'}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-base font-semibold text-[#111827]">Discount Title</label>
            <input
              type="text"
              value={discountTitle}
              onChange={(e) => setDiscountTitle(e.target.value)}
              placeholder="Enter discount title"
              className="w-full h-[56px] bg-[#FAFAFA] text-sm font-medium text-gray-700 rounded-[12px] px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Value */}
          <div className="space-y-1">
            <label className="text-base font-semibold text-[#111827]">Discount Value</label>
            <div className="flex items-center bg-[#F9FAFB] rounded-[12px] relative">
              <div
                className="flex items-center w-[86px] h-[56px] justify-between px-5 py-3 bg-[#FAFAFA] text-sm font-medium text-gray-700 cursor-pointer relative"
                onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
                ref={symbolDropdownRef}
              >
                <span className="font-bold text-xl">{symbol}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isSymbolDropdownOpen ? 'rotate-180' : ''}`} />
                {isSymbolDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[303px] z-[1000] bg-white border rounded-md shadow-lg">
                    {currencyOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSymbol(option.value);
                          setIsSymbolDropdownOpen(false);
                        }}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Add discount value"
                className="flex-1 px-4 py-3 text-sm font-medium bg-[#FAFAFA] text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Code (readonly) */}
          <div className="space-y-1">
            <label className="text-base font-semibold text-[#111827]">Discount Code</label>
            <input
              type="text"
              value={discountCode}
              readOnly
              className="w-full h-[56px] bg-[#FAFAFA] text-sm font-medium text-gray-700 rounded-[12px] px-4 py-3 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-[160px] h-[48px] mt-3 bg-[#751423] text-white text-sm font-medium rounded-[12px] px-4 py-3 hover:bg-[#631818] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formLoading ? <BiLoaderCircle className="animate-spin mr-2" size={22} /> : 'Update Discount'}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default EditDiscountPage;