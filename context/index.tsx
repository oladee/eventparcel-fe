"use client";

import React, { useState, useContext, createContext } from "react";

// Define the type for the context value
interface MyContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCalendarOpen: boolean;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddBusinessOpen: boolean;
  setIsAddBusinessOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transferModal: boolean;
  setTransferModal: React.Dispatch<React.SetStateAction<boolean>>;
  transferModal2: boolean;
  setTransferModal2: React.Dispatch<React.SetStateAction<boolean>>;
  transferModal3: boolean;
  setTransferModal3: React.Dispatch<React.SetStateAction<boolean>>;
  isBusinessProfileOpen: boolean;
  setIsBusinessProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddTeamMemberOpen: boolean;
  setIsAddTeamMemberOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPricingDetailOpen: boolean;
  setIsPricingDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditPricingChargesOpen: boolean;
  setIsEditPricingChargesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSucessOpen: boolean;
  setIsSucessOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSucessOpen1: boolean;
  setIsSucessOpen1: React.Dispatch<React.SetStateAction<boolean>>;
  isEditStaffRole: boolean;
  setIssEditStaffRole: React.Dispatch<React.SetStateAction<boolean>>;
  isAddMoneyOpen: boolean;
  setIsAddMoneyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTransferSucessOpen: boolean;
  setIsTransferSucessOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTeamMemberUpdated: boolean;
  setIsTeamMemberUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  businessProfileEmail: string;
  setBusinessProfileEmail: React.Dispatch<React.SetStateAction<string>>;
  minimumTransferAmount: number | null;
  setMinimumTransferAmount: React.Dispatch<React.SetStateAction<number | null>>;
  dailyTransferLimit: number | null;
  setDailyTransferLimit: React.Dispatch<React.SetStateAction<number | null>>;
  selectedDateRange: {
    startDate: Date;
    endDate: Date;
  } | null;
  setSelectedDateRange: (
    range: { startDate: Date; endDate: Date } | null
  ) => void;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Create the context with a default value of `null`
const MyContext = createContext<MyContextType | null>(null);

// Context Provider Component
export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(
    null
  );
  const [isSucessOpen, setIsSucessOpen] = useState<boolean>(false);
  const [isSucessOpen1, setIsSucessOpen1] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState<boolean>(false);
  const [transferModal, setTransferModal] = useState<boolean>(false);
  const [transferModal2, setTransferModal2] = useState<boolean>(false);
  const [transferModal3, setTransferModal3] = useState<boolean>(false);
  const [isBusinessProfileOpen, setIsBusinessProfileOpen] =
    useState<boolean>(false);
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] =
    useState<boolean>(false);
  const [isPricingDetailOpen, setIsPricingDetailOpen] =
    useState<boolean>(false);
  const [isEditPricingChargesOpen, setIsEditPricingChargesOpen] =
    useState<boolean>(false);
  const [isEditStaffRole, setIssEditStaffRole] = useState<boolean>(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<boolean>(false);
  const [isTransferSucessOpen, setIsTransferSucessOpen] =
    useState<boolean>(false);
  const [isTeamMemberUpdated, setIsTeamMemberUpdated] =
    useState<boolean>(false);
  const [businessProfileEmail, setBusinessProfileEmail] = useState<string>("");
  const [minimumTransferAmount, setMinimumTransferAmount] = useState<
    number | null
  >(null);
  const [dailyTransferLimit, setDailyTransferLimit] = useState<number | null>(
    null
  );

  return (
    <MyContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isCalendarOpen,
        setIsCalendarOpen,
        isAddBusinessOpen,
        setIsAddBusinessOpen,
        transferModal,
        setTransferModal,
        transferModal2,
        setTransferModal2,
        transferModal3,
        setTransferModal3,
        isBusinessProfileOpen,
        setIsBusinessProfileOpen,
        isAddTeamMemberOpen,
        setIsAddTeamMemberOpen,
        isPricingDetailOpen,
        setIsPricingDetailOpen,
        isEditPricingChargesOpen,
        setIsEditPricingChargesOpen,
        isSucessOpen,
        setIsSucessOpen,
        isSucessOpen1,
        setIsSucessOpen1,
        isTransferSucessOpen,
        setIsTransferSucessOpen,
        isEditStaffRole,
        setIssEditStaffRole,
        isAddMoneyOpen,
        setIsAddMoneyOpen,
        selectedDateRange,
        setSelectedDateRange,
        isTeamMemberUpdated,
        setIsTeamMemberUpdated,
        businessProfileEmail,
        setBusinessProfileEmail,
        minimumTransferAmount,
        setMinimumTransferAmount,
        dailyTransferLimit,
        setDailyTransferLimit
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook for consuming the context
export function useMyContext(): MyContextType {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a Context provider");
  }
  return context;
}
