"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormEvent } from "react";
import { PiCalendarMinus } from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NairaPayoutForm from "@/components/NairaPayoutForm";
import DollarPayoutForm from "@/components/DollarPayoutForm";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import EventSaveSuccess from "@/components/aboutEvent/EventSaveSuccess";
import { trackEvent } from "@/lib/mixpanel";

const LocationPickerModal = dynamic(
  () => import("@/components/aboutEvent/LocationPickerModal"),
  { ssr: false }
);

interface Bank {
  name: string;
  code: string;
  url: string;
}

interface USBank {
  _id: {
    $oid: string;
  };
  bankId: string;
  name: string;
  country: string;
  currency: string;
  routingNumber: string[];
}

const validTimeZones = [
  "UTC",
  "GMT",
  "WAT",
  "CAT",
  "EAT",
  "PST",
  "CST",
  "EST",
  "MST",
  "AKST",
  "HST",
  "IST",
  "CET",
  "EET",
  "BST",
  "AST",
  "NST",
  "JST",
  "KST",
  "AEST",
  "ACST",
  "AWST"
];

const PaymentSetupContent = () => {
  // =============================================
  // IMPORTS AND INITIAL SETUP
  // =============================================
  const searchParams = useSearchParams();
  const groupsString = searchParams.get("groups");
  const groups = groupsString
    ? JSON.parse(decodeURIComponent(groupsString))
    : [];
  const firstEventId =
    groups.length > 0 && groups[0].event ? groups[0].event._id : "";
  const firstGroup = groups.length > 0 && groups[0].event ? groups[0] : "";
  const pathname = usePathname();
  const router = useRouter();

  // =============================================
  // STATE DECLARATIONS
  // =============================================
  // Modal and UI states
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [showModal] = useState<boolean>(false);
  const [showSuccess2, setShowSuccess2] = useState(false);

  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  // Bank selection states
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedUSBank, setSelectedUSBank] = useState<USBank | null>(null);
  const [savedNGN, setSavedNGN] = useState(false);
  const [savedUSD, setSavedUSD] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    event: firstEventId,
    nairaAccount: {
      accountNumber: "",
      accountName: "",
      bankName: "",
      bankCode: ""
    },
    dollarAccount: {
      usAccountNumber: "",
      routingNumber: "",
      usBankName: "",
      usAccountName: ""
    },
    isDraft: false,
    paymentDate: new Date(),
    paymentTime: new Date(),
    paymentTimeZone: "WAT"
  });

  // Form validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [eventTime, setEventTime] = useState<string | null>(null);


  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  /**
   * Checks if all packages in all groups are self-managed
   * @param groupList Array of groups to check
   * @returns Boolean indicating if all packages are self-managed
   */
  const isAllSelfManaged = (groupList: any[]) => {
    if (groupList.length === 0) return false;
    return groupList.every((group) =>
      group.packages.every((pkg: any) =>
        pkg.packageDelivery.every((delivery: string) =>
          delivery.includes("selfManaged")
        )
      )
    );
  };

  const allSelfManaged = isAllSelfManaged(groups);

  /**
   * Checks if an object has any filled values
   * @param obj Object to check
   * @returns Boolean indicating if any values are filled
   */
  const isFilled = (obj: { [key: string]: string }) =>
    Object.values(obj).some(
      (val) => val && typeof val === "string" && val.trim() !== ""
    );

  /**
   * Formats a Date object to 12-hour time string
   * @param date Date to format
   * @returns Formatted time string (HH:MM AM/PM)
   */
  const formatTime12Hour = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${paddedHours}:${paddedMinutes} ${ampm}`;
  };

  // Currency flags
  const hasNGN =
    groups.some(
      (group: { groupCurrency: string }) => group.groupCurrency === "NGN"
    ) || savedNGN;
  const hasUSD =
    groups.some(
      (group: { groupCurrency: string }) => group.groupCurrency === "USD"
    ) || savedUSD;

  // Current date reference
  const today = new Date();

  // =============================================
  // EFFECT HOOKS
  // =============================================
    useEffect(() => {
      const hasNGN = localStorage.getItem("paymentHasNGN") === "true";
      const hasUSD = localStorage.getItem("paymentHasUSD") === "true";
      setSavedNGN(hasNGN);
      setSavedUSD(hasUSD);
    }, []);

    // Clean up redirect cookie on mount
    useEffect(() => {
      Cookies.remove("redirectAfterLogin");
    }, []);

    
    useEffect(() => {
      const storedEventDetails = localStorage.getItem("eventDetails");
      
      if (storedEventDetails) {
        try {
          const parsedDetail = JSON.parse(storedEventDetails);
  
          setEventDate(parsedDetail?.data.date);
          setEventTime(parsedDetail?.data.time);
        } catch (error) {
          console.error("Failed to parse event details:", error);
        }
      }
    }, []);

    // useEffect(() => {
    //   const checkEventDate = () => {
    //     if(eventDate && formData?.paymentDate) {
    //       if(new Date(eventDate) < new Date(formData?.paymentDate)) {
    //         toast.error("Payment Deadline cannot be after event date!!");
    //       }
    //     }
    //   };

    //   checkEventDate();
    // },[formData?.paymentDate, formData.paymentTime]);
  
    // console.log("date", eventDate)
    // console.log("time", eventTime)

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("paymentFormData");
    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        ...JSON.parse(savedData),
        paymentDate: new Date(JSON.parse(savedData).paymentDate),
        paymentTime: new Date(JSON.parse(savedData).paymentTime)
      }));
    }
  }, []);

  // Validate form whenever formData or errors change
  useEffect(() => {
    const isAllFieldsFilled = Object.values(formData).every((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      } else if (value instanceof Date) {
        return !isNaN(value.getTime());
      }
      return true;
    });
    const isAllFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );
    setIsFormValid(isAllFieldsFilled && isAllFieldsValid);
  }, [formData, errors]);

  // =============================================
  // FORM HANDLERS
  // =============================================
  /**
   * Handles date picker changes
   * @param date Selected date
   * @param field Field to update
   */
  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date }));
    }
  };

  /**
   * Validates a form field based on its ID and value
   * @param id Field ID
   * @param value Field value
   * @returns Error message if invalid, empty string if valid
   */
  const validateField = (id: string, value: any) => {
    const fieldName = id.split(".").pop();

    switch (fieldName) {
      case "accountNumber":
        if (!/^\d+$/.test(value)) return "Account number must be a number";
        if (value.length !== 10) return "Account number must be 10 digits";
        return "";
      case "accountName":
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Account name must only contain letters and spaces";
        if (value.length < 3 || value.length > 50)
          return "Account name must be between 3 and 50 characters";
        return "";
      case "paymentDate":
      case "deliveryDate":
        const selectedDate = new Date(value);
        const currentDate = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        if (selectedDate < currentDate) return "Date cannot be in the past";
        return "";
      case "contactName":
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Contact name must only contain letters and spaces";
        if (value.length < 3 || value.length > 50)
          return "Contact name must be between 3 and 50 characters";
        return "";
      default:
        return "";
    }
  };

  /**
   * Handles form field changes
   * @param e Change event
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;

    if (id.includes(".")) {
      const [parentKey, childKey] = id.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...(prev[parentKey as keyof typeof formData] as object),
          [childKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value)
    }));
  };

  /**
   * Handles form field blur events (for validation)
   * @param e Blur event
   */
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  // =============================================
  // FORM SUBMISSION HANDLERS
  // =============================================
  /**
   * Handles form submission
   * @param e Form event
   */
  
  // const checkEventDateTime = () => {
  //   if (!eventDate || !formData?.paymentDate) return true;
  
  //   const formatDateToYMD = (dateInput: Date | string): string => {
  //     const date = new Date(dateInput);
  //     if (isNaN(date.getTime())) return "0000-00-00";
  //     return date.toISOString().split('T')[0];
  //   };
  
  //   const eventDateStr = formatDateToYMD(eventDate);
  //   const paymentDateStr = formatDateToYMD(formData.paymentDate);
  
  //   const eventDay = new Date(eventDateStr);
  //   const paymentDay = new Date(paymentDateStr);
  
  //   if (paymentDay > eventDay) {
  //     toast.error("Payment date cannot be after the event date!");
  //     return false;
  //   }
  
  //   if (
  //     paymentDay.getTime() === eventDay.getTime() &&
  //     formData.paymentTime &&
  //     eventTime
  //   ) {
  //     const createDateTime = (dateStr: string, time: Date | string): Date | null => {
  //       const timeStr = typeof time === "string"
  //         ? time
  //         : time.toTimeString().split(' ')[0].slice(0, 5);
  
  //       const [hours, minutes] = timeStr.split(':').map(Number);
  //       const date = new Date(dateStr);
  //       date.setHours(hours, minutes || 0, 0, 0);
  //       return isNaN(date.getTime()) ? null : date;
  //     };
  
  //     const paymentDateTime = createDateTime(paymentDateStr, formData.paymentTime);
  //     const eventDateTime = createDateTime(eventDateStr, eventTime);
  
  //     if (!paymentDateTime || !eventDateTime) return true;
  
  //     if (paymentDateTime > eventDateTime) {
  //       toast.error("Payment time cannot be after the event time!");
  //       return false;
  //     }
  //   }
  
  //   return true;
  // };
  

  const checkEventDateTime = () => {
    // First check if we have the required dates
    if (!eventDate || !formData?.paymentDate) return true;
  
    // Mobile-friendly date parser
    const parseDate = (dateInput: Date | string): Date | null => {
      // If already a Date object and valid
      if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
        return dateInput;
      }
      
      // Handle string input (for mobile compatibility)
      if (typeof dateInput === 'string') {
        // Try ISO format first
        const isoDate = new Date(dateInput);
        if (!isNaN(isoDate.getTime())) return isoDate;
        
        // Try splitting date parts (common mobile date string format)
        const parts = dateInput.split(/[-/]/);
        if (parts.length === 3) {
          // Try different formats (YYYY-MM-DD, MM/DD/YYYY, etc.)
          const formats = [
            `${parts[0]}-${parts[1]}-${parts[2]}`, // YYYY-MM-DD
            `${parts[2]}-${parts[0]}-${parts[1]}`, // MM-DD-YYYY
            `${parts[2]}-${parts[1]}-${parts[0]}`  // DD-MM-YYYY
          ];
          
          for (const format of formats) {
            const testDate = new Date(format);
            if (!isNaN(testDate.getTime())) return testDate;
          }
        }
      }
      
      return null;
    };
  
    // Parse dates with mobile compatibility
    const parsedEventDate = parseDate(eventDate);
    const parsedPaymentDate = parseDate(formData.paymentDate);
  
    if (!parsedEventDate || !parsedPaymentDate) {
      console.error('Invalid date format detected');
      return true; // or false depending on your requirements
    }
  
    // Compare dates (ignoring time)
    const eventDay = new Date(parsedEventDate.setHours(0, 0, 0, 0));
    const paymentDay = new Date(parsedPaymentDate.setHours(0, 0, 0, 0));
  
    // Debug logs for mobile testing
    console.log('Event Date:', eventDay);
    console.log('Payment Date:', paymentDay);
  
    // 1. Check if payment is after event DATE
    if (paymentDay > eventDay) {
      toast.error("Payment date cannot be after the event date!");
      return false;
    }
  
    // 2. Only check times if same day AND both times exist
    if (
      paymentDay.getTime() === eventDay.getTime() &&
      formData.paymentTime &&
      eventTime
    ) {
      // Mobile-friendly time parser
      const parseTime = (timeInput: Date | string): string => {
        if (timeInput instanceof Date) {
          return timeInput.toTimeString().split(' ')[0].slice(0, 5); // HH:mm
        }
        
        // Handle string time formats
        if (typeof timeInput === 'string') {
          // Check for HH:mm format
          if (/^\d{1,2}:\d{2}$/.test(timeInput)) {
            const [hours, minutes] = timeInput.split(':');
            return `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`;
          }
          
          // Check for HH:mm AM/PM format
          if (/^\d{1,2}:\d{2}\s?[AP]M$/i.test(timeInput)) {
            const [time, period] = timeInput.split(/(?=[AP]M)/i);
            let hours = time.split(':')[0];
            const minutes = time.split(':')[1]; 
            
            hours = period.toLowerCase() === 'pm' 
              ? `${(parseInt(hours) % 12) + 12}`
              : hours.padStart(2, '0');
            
            return `${hours}:${minutes}`;
          } 
        }
        
        return '00:00'; // Default fallback
      };
  
      // Create full datetime objects
      const paymentTimeStr = parseTime(formData.paymentTime);
      const eventTimeStr = parseTime(eventTime);
  
      const paymentDateTime = new Date(paymentDay);
      const [paymentHours, paymentMinutes] = paymentTimeStr.split(':').map(Number);
      paymentDateTime.setHours(paymentHours, paymentMinutes);
  
      const eventDateTime = new Date(eventDay);
      const [eventHours, eventMinutes] = eventTimeStr.split(':').map(Number);
      eventDateTime.setHours(eventHours, eventMinutes);
  
      // More debug logs
      console.log('Payment DateTime:', paymentDateTime);
      console.log('Event DateTime:', eventDateTime);
  
      if (paymentDateTime > eventDateTime) {
        toast.error("Payment time cannot be after the event time!");
        return false;
      }
    }
  
    return true;
  };
  
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill out all required fields");
      return;
    }
      
    if (!checkEventDateTime()) {
      setLoading(false);
      return; 
    }

    setLoading(true);

    try {
      const { nairaAccount, dollarAccount, ...rest } = formData;
      const authToken = localStorage.getItem("authToken");

      const formattedData = {
        ...rest,
        ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
        ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
        paymentTime: formatTime12Hour(formData.paymentTime)
      };

      const queryString = new URLSearchParams({
        data: JSON.stringify(formattedData)
      }).toString();

      if (allSelfManaged) {
        await axiosInstance.post("/add-payment", formattedData);
        toast.success("Payment details successfully submitted!");
        trackEvent("Add Payment Information", {
          source: "Add Payment Page",
          timestamp: new Date().toISOString(),
          page_name: "add payment page",
          event_id: firstGroup.event._id,
          event_name: firstGroup.event.eventName,
          naira_bank_name: formData.nairaAccount.bankName,
          dollar_bank_name: formData.dollarAccount.usBankName,
          status: "Successful"
        });

        if (authToken) {
          router.push("/dashboard/events");
        } else {
          router.push("/");
        }
      } else {
        const parsedEventDetails = {
          event_id: firstGroup.event._id,
          event_name: firstGroup.event.eventName
        };

        localStorage.setItem(
          "parsedEventDetails",
          JSON.stringify(parsedEventDetails)
        );

        trackEvent("Add Payment Information", {
          source: "Add Payment Page",
          timestamp: new Date().toISOString(),
          page_name: "add payment page",
          event_id: firstGroup.event._id,
          event_name: firstGroup.event.eventName,
          naira_bank_name: formData.nairaAccount.bankName || null,
          dollar_bank_name: formData.dollarAccount.usBankName || null,
          status: "Successful"
        });

        router.push(`/pickup-details?${queryString}`);
      }
    } catch (error: any) {
      console.error("Error submitting payment details:", error);
      trackEvent("Add Payment Information Failed", {
        source: "Add Payment Page",
        timestamp: new Date().toISOString(),
        page_name: "Add Payment Page",
        event_id: firstGroup.event._id,
        event_name: firstGroup.event.eventName,
        naira_bank_name: formData.nairaAccount.bankName,
        dollar_bank_name: formData.dollarAccount.usBankName,
        status: "Failed"
      });

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to submit payment details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles saving form data for later completion
   */
  const handleSaveForLater = async () => {
    setIsSaveLoading(true);

    const persistFormState = () => {
      localStorage.setItem("paymentFormData", JSON.stringify(formData));
      localStorage.setItem("paymentHasNGN", JSON.stringify(hasNGN));
      localStorage.setItem("paymentHasUSD", JSON.stringify(hasUSD));
    };

    persistFormState();

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      Cookies.set("redirectAfterLogin", pathname);
      setShowSuccess2(true);
      setIsSaveLoading(false);
      return;
    }

    try {
      const { nairaAccount, dollarAccount, ...rest } = formData;

      const fullFormData = {
        ...rest,
        ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
        ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
        paymentTime: formatTime12Hour(formData.paymentTime),
        isDraft: true
      };

      await axiosInstance.post(`/payment-save-for-later`, fullFormData);

      toast.success("Saved! Continue from your dashboard.");

      localStorage.removeItem("paymentFormData");
      localStorage.removeItem("paymentHasNGN");
      localStorage.removeItem("paymentHasUSD");

      router.push("/dashboard/events");
    } catch (error: any) {
      localStorage.removeItem("paymentFormData");
      localStorage.removeItem("paymentHasNGN");
      localStorage.removeItem("paymentHasUSD");
      toast.error(error.response?.data?.message || "Failed to save event");
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <HeaderLayout>
      <ToastContainer />
      {showMapPickerModal && (
        <LocationPickerModal
          onLocationSelect={() => {
            setErrors((prev) => ({ ...prev, location: "" }));
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <div>{showSuccess2 && <EventSaveSuccess />}</div>
      <section className="bg-[#EEEFF2] !overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-[98vh] overflow-y-auto no-scrollbar">
          <div className="md:mb-12 text-center p-3 sm:p-0 space-y-3">
            <h2
              id="payment_deliveryHeader"
              className="flex justify-start text-xl sm:text-2xl font-bold text-[#111827]"
            >
              Payment Setup
            </h2>
            <div
              id="payment_deliveryDesc"
              className="flex justify-center items-center gap-3"
            >
              <div className="flex flex-col w-full">
                <span className="flex justify-start w-full whitespace-nowrap h-6 font-general font-medium text-sm text-[#718096]">
                  Let&apos;s setup your payout process and payment
                </span>
                <span className="flex justify-start w-[313px] h-11 font-general font-medium text-sm text-[#718096]">
                  deadline
                </span>
              </div>
              {/* <span
                onClick={() => setIsRightBarOpen(true)}
                className="px-2 mb-6 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
              >
                !
              </span> */}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
          >
            <div>
              <div className="mb-5">
                <h1
                  id="paymentDetailsHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Account Details
                </h1>
                <span
                  id="paymentDetailsDesc"
                  className="text-sm text-[#718096] font-medium"
                >
                  Add your payout bank details
                </span>
              </div>

              {/* NAIRA PAYOUT */}
              <div className=" rounded-[10px]">
                {hasNGN && (
                  <div className="border border-[#CBD5E0] mb-7 p-4 rounded-[10px]">
                    <NairaPayoutForm
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      selectedBank={selectedBank}
                      setSelectedBank={setSelectedBank}
                      setFormData={setFormData}
                      setErrors={setErrors}
                    />
                  </div>
                )}

                {/* DOLLAR PAYOUT */}
                {hasUSD && (
                  <div className="border border-[#CBD5E0] p-4 rounded-[10px]">
                    <DollarPayoutForm
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      selectedUSBank={selectedUSBank}
                      setSelectedUSBank={setSelectedUSBank}
                      setFormData={setFormData}
                      setErrors={setErrors}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
              <div className="mb-5">
                <h2
                  id="payment_deadlineHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Payment Deadline
                </h2>
                <span
                  id="payment_deadlineDesc"
                  className="text-sm text-[#718096] font-medium"
                >
                  Select the payment deadline date and time
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="paymentDate"
                    className="block mb-2 font-semibold text-[#111827]"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                    <div className="w-full bg-slate-50">
                      <DatePicker
                        selected={formData.paymentDate}
                        minDate={today}
                        id="paymentDate"
                        onChange={(date) =>
                          handleDateChange(date, "paymentDate")
                        }
                        dateFormat="yyyy-MM-dd"
                        className="pl-10 px-3 py-2 z-20 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
                  </div>
                  {errors.paymentDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentDate}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="paymentTime"
                    className="block mb-2 font-semibold text-[#111827]"
                  >
                    Time
                  </label>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
                      <DatePicker
                        selected={formData.paymentTime}
                        id="paymentTime"
                        onChange={(date) =>
                          handleDateChange(date, "paymentTime")
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="hh:mm aa"
                        placeholderText="Select Payment Time"
                        className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                        popperClassName="custom-datepicker"
                      />
                    </div>
                    <select
                      id="paymentTimeZone"
                      value={formData.paymentTimeZone}
                      onChange={handleChange}
                      className="px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50"
                    >
                      {validTimeZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
              <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
                <button
                  id="save"
                  type="button"
                  className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
                  onClick={() => handleSaveForLater()}
                >
                  {isSaveLoading ? "saving..." : "Save for later"}
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                    !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <BiLoaderCircle className="animate-spin mr-2" size={22} />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      {showModal && (
        <ReusuableSuccess
          title="You've successfully uploaded your details"
          subtitle="Congratulations you have successfully created your Payment details"
          route="/event-creation"
          buttonText="continue"
        />
      )}
    </HeaderLayout>
  );
};

export default PaymentSetupContent;
