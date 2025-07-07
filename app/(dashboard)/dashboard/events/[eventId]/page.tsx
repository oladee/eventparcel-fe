"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/dashboard/Container";
import PackagesSection from "@/components/dashboard/eventComponents/PackagesSection";
import EventDetailsSection from "@/components/dashboard/eventComponents/EventDetailsSection";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
// import AddGroup from "@/components/AddGroupCaller";
import AddGroup2 from "@/components/AddGroupCaller2";
import Back from "@/components/layout/Back";
import { ChevronLeft } from 'lucide-react';


const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isPickupAvailable, setIsPickupAvailable] = useState<boolean>(false);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop(); // Extract eventId from the URL
    if (!id) {
      router.replace("/dashboard/events");
      return;
    }
    localStorage.setItem("eventId", id);
    const fetchEventData = async () => {
      try {
        const response = await axiosInstance.get(`/view-event/${id}`);
        if (response.data.success) {
          setEventData(response.data.data);
          localStorage.setItem("eventData", JSON.stringify(response.data.data));
        } else {
          setError("Failed to fetch event data.");
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        setError(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();

    fetchEventData();

    // Fetch payment data and check for pickup location
    const fetchPaymentData = async () => {
      try {
        const paymentRes = await axiosInstance.get(`/view-a-payment/${id}`);
        // Check if pickup location is available in the response
        if (paymentRes.data?.data?.pickupLocation) {
          setIsPickupAvailable(true);
        } else {
          setIsPickupAvailable(false);
        }
      } catch {
        setIsPickupAvailable(false);
      }
    };

    fetchPaymentData();

    window.addEventListener("refreshEvents", fetchEventData);

    return () => {
      window.removeEventListener("refreshEvents", fetchEventData);
    };
  }, [router]);

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

  if (error) {
    return (
      <Container>
        <Back />
        <div className="flex flex-col items-center justify-center min-h-screen">
          {error === "Sorry, this event has been disabled!" ? (
            <div className="text-center">
              <p className="text-red-500 font-semibold text-lg mb-4">{error}</p>
              <button
                onClick={() => router.push("/dashboard/events")}
                className="flex items-center text-primary hover:underline"
              >
                <AiOutlineArrowLeft className="mr-2" size={20} />
                click here, to return to event list
              </button>
            </div>
          ) : (
            <p className="text-red-500 font-semibold text-lg">{error}</p>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div
        className="fixed top-16 w-[90%] md:w-[90%] h-auto py-3 bg-gray-100"
        id="back-button"
      >
        <button className="w-[20%] md:w-[5%] cursor-pointer flex flex-row items-center" onClick={() => window.history.back()}>
          <ChevronLeft className="w-6 h-6 " />
          <span className="font-medium text-base text-[#111827] ml-1">Back</span>
        </button>
      </div> 
      <EventDetailsSection eventData={eventData} />
      {eventData?.eventGroups?.length > 0 ? (
        <PackagesSection eventData={eventData} isPickupAvailable={isPickupAvailable} />
      ) : (
        <div className="flex justify-center">
          <div
            className="flex w-full max-w-2xl h-[100px] mt-5 rounded-2xl flex-col border-[2px] border-dashed justify-center items-center ml-[5px] bg-[#FFFFFF66] cursor-pointer"
            // onClick={handleAddGroupClick}
            onClick={() => {
              localStorage.setItem("eventId", eventData._id);
              localStorage.setItem("groupLength", eventData.eventGroups.length);
              localStorage.setItem("isNairaAccount", eventData.isNairaAccount);
              localStorage.setItem(
                "isDollarAccount",
                eventData.isDollarAccount
              );

              setIsAddGroupOpen(true);
            }}
          >
            <Image src="/images/plus.png" alt="plus" width={32} height={32} />
            <span className="font-general font-semibold text-sm text-[#751423]">
              Add Groups
            </span>
          </div>
        </div>
      )}
      {isAddGroupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 z-50">
          <AddGroup2
            mode="noGroup"
            setIsAddGroupOpen={setIsAddGroupOpen}
            selectedGroup={null}
            isShared={eventData?.isShared}
          />
        </div>
      )}
    </Container>
  );
};

export default Page;
