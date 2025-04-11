"use client"

import Container from '@/components/dashboard/Container';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from 'react-icons/bi';

const currencyOptions = [
  { label: 'Nigerian Naira (₦)', value: '₦' },
  { label: 'US Dollar ($)', value: '$' },
  { label: 'Percentage (%)', value: '%' },
];

const Page = () => {
  const [symbol, setSymbol] = useState('₦');
  const [eventData, setEventData] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = useState(false);
  const [discountTitle, setDiscountTitle] = useState('');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [discountCode, setDiscountCode] = useState('');
  const [searchEvent, setSearchEvent] = useState("");
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(true);
  const [fetchingCode, setFetchingCode] = useState(false);
  const router = useRouter();
  const symbolDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const loggedInUserString = localStorage.getItem("loggedInUser");
    const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;

    setHostId(loggedInUser?._id);

    if (!loggedInUserEmail) {
      router.replace("/");
      return;
    }

    const fetchEventData = async () => {
      try {
        setFetchingEvents(true);
        const response = await axiosInstance.post("/view-events", {
          email: loggedInUserEmail
        });
        if (response.data.success) {
          setEventData(response.data.data || []);
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load events");
        setEventData([]);
      } finally {
        setFetchingEvents(false);
      }
    };

    fetchEventData();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (symbolDropdownRef.current && !symbolDropdownRef.current.contains(event.target as Node)) {
        setIsSymbolDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchDiscountCode = async () => {
      if (!selectedEvent) {
        setDiscountCode('');
        return;
      }
      
      setFetchingCode(true);
      try {
        const response = await axiosInstance.get("/discount-code");
        if (response.data.success) {
          setDiscountCode(response.data.data || '');
        } else {
          setDiscountCode('');
        }
      } catch (error) {
        console.error("Error fetching discount code:", error);
        toast.error("Failed to generate discount code");
        setDiscountCode('');
      } finally {
        setFetchingCode(false);
      }
    };

    fetchDiscountCode();
  }, [selectedEvent]);

  const filteredEvents = eventData.filter((event) =>
    event.eventName.toLowerCase().includes(searchEvent.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedEvent || !discountTitle || !discountValue || !discountCode) {
      toast.error('Please fill all required fields.');
      return;
    }
  
    let discountValueType = 'NGN';
    if (symbol === '$') discountValueType = 'USD';
    if (symbol === '%') discountValueType = 'percentage';
  
    const payload = {
      event: selectedEvent._id,
      hostId,
      discountTitle,
      discountValue: Number(discountValue),
      discountValueType,
      discountCode
    };
  
    try {
      setLoading(true);
      const res = await axiosInstance.post('/add-discount', payload);
      if (res.data.success) {
        toast.success('Discount created successfully!');
        router.push("/dashboard/discounts");
      } else {
        toast.error(res.data.message || 'Something went wrong!');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <div id="discount-container" className="w-full space-y-6">
        {/* Header */}
        <div id="discount-header" className="w-[343px] flex flex-col gap-2">
          <h2 id="discount-title" className="font-general text-2xl font-bold text-[#111827]">Create Discounts</h2>
          <p id="discount-description" className="text-sm font-medium text-[#718096]">
            Create a special discount for some of your guest, can be in percent or actual value
          </p>
        </div>

        {/* Form */}
        <form id="discount-form" onSubmit={handleSubmit} className="w-[343px] flex flex-col gap-6 bg-white rounded-[20px] p-6 pb-8">
          {/* Event Dropdown */}
          <div id="event-section" className="space-y-1">
            <label id="event-label" className="text-base font-semibold text-[#111827]">Event</label>
            <div className="relative">
              <div
                id="event-dropdown-trigger"
                className="w-full h-[56px] bg-[#FAFAFA] rounded-[12px] px-4 py-3 flex items-center justify-between cursor-pointer"
                onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
              >
                <span id="selected-event" className="text-sm font-medium text-gray-700">
                  {selectedEvent ? selectedEvent.eventName : "Select event"}
                </span>
                <ChevronDown className="text-gray-500" />
              </div>
              {isEventDropdownOpen && (
                <div id="event-dropdown" className="absolute z-10 mt-2 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-lg">
                  <input
                    id="event-search"
                    type="text"
                    placeholder="Search events..."
                    value={searchEvent}
                    onChange={(e) => setSearchEvent(e.target.value)}
                    className="w-full px-3 py-2 border-b text-sm outline-none"
                  />
                  {fetchingEvents ? (
                    <div className="p-3 text-center text-sm flex items-center justify-center gap-2">
                      <BiLoaderCircle className="animate-spin" size={16} />
                      Loading events...
                    </div>
                  ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div
                        id={`event-option-${event._id}`}
                        key={event._id}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEventDropdownOpen(false);
                          setSearchEvent("");
                        }}
                      >
                        {event.eventName}
                      </div>
                    ))
                  ) : (
                    <div id="no-event-message" className="p-3 text-center text-sm">
                      {eventData.length === 0 ? "No events found" : "No matching events found"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Discount Title */}
          <div id="discount-title-section" className="space-y-1">
            <label id="discount-title-label" className="text-base font-semibold text-[#111827]">Discount Title</label>
            <input
                id="discount-title-input"
                type="text"
                value={discountTitle}
                onChange={(e) => setDiscountTitle(e.target.value)}
                placeholder="Enter discount title"
                className="w-full h-[56px] bg-[#FAFAFA] text-sm font-medium text-gray-700 rounded-[12px] px-4 py-3 focus:outline-none"
                />
          </div>

          {/* Discount Value */}
          <div id="discount-value-section" className="space-y-1">
            <label id="discount-value-label" className="text-base font-semibold text-[#111827]">Discount Value</label>
            <div className="flex items-center bg-[#F9FAFB] rounded-[12px] relative">
              {/* Symbol Selector */}
              <div 
                id="symbol-selector"
                className="flex items-center w-[86px] h-[56px] justify-between px-5 py-3 bg-[#FAFAFA] text-sm font-medium text-gray-700 cursor-pointer relative"
                onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
                ref={symbolDropdownRef}
              >
                <span id="selected-symbol" className="font-bold text-xl">{symbol}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isSymbolDropdownOpen ? 'rotate-180' : ''}`} />

                {/* Dropdown - Moved outside the overflow-hidden container */}
                {isSymbolDropdownOpen && (
                  <div id="symbol-dropdown" className="absolute top-full left-0 mt-1 w-[303px] z-[1000] bg-white border border-gray-200 rounded-md shadow-lg">
                    {currencyOptions.map((option) => (
                      <div
                        id={`symbol-option-${option.value}`}
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

              {/* Discount Value Input */}
              <input
                id="discount-value-input"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Add discount value"
                className="flex-1 px-4 py-3 text-sm font-medium bg-[#FAFAFA] text-gray-700 focus:outline-none"
             />
            </div>
          </div>

          {/* Discount Code */}
          <div id="discount-code-section" className="space-y-1">
            <label id="discount-code-label" className="text-base font-semibold text-[#111827]">Discount Code</label>
            <div className="relative">
              <input
                id="discount-code-input"
                type="text"
                value={discountCode}
                readOnly
                placeholder={fetchingCode ? "Generating code..." : "Discount code will appear here"}
                className="w-full h-[56px] bg-[#FAFAFA] text-sm font-medium text-gray-700 rounded-[12px] px-4 py-3 focus:outline-none"
              />
              {fetchingCode && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <BiLoaderCircle className="animate-spin text-gray-400" size={20} />
                </div>
              )}
            </div>
          </div>

          <button
            id="submit-discount-button"
            type="submit"
            disabled={loading || fetchingCode || !selectedEvent}
            className="w-[160px] h-[48px] mt-3 bg-[#751423] text-white text-sm font-medium rounded-[12px] px-4 py-3 hover:bg-[#631818] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <BiLoaderCircle className="animate-spin mr-2" size={22} />
            ) : (
              "Create Discount"
            )}
          </button>
        </form>     
      {/* Toast Notifications */}
      <ToastContainer aria-live="polite" />
      </div>
    </Container>
  );
};

export default Page;