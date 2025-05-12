"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/dashboard/Container";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next-nprogress-bar";
// import Image from "next/image";
import { motion } from "framer-motion";
import EventDetailsSection2 from "@/components/dashboard/eventComponents/EventDetailsSection2";
import { TbCalendarCheck } from "react-icons/tb";

const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
      // const storedEventId = "67d4b39a98acd292aa0daa32";
      if (!loggedInUserEmail) {
        router.replace("/");
        return;
      }

      const fetchEventData = async () => {
        try {
          const response = await axiosInstance.post("/view-events", {
            email: loggedInUserEmail
          });
          if (response.data.success) {
            setEventData(response.data.data);
            localStorage.setItem(
              "eventData",
              JSON.stringify(response.data.data)
            );
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

      window.addEventListener("refreshEvents", fetchEventData);

      return () => {
        window.removeEventListener("refreshEvents", fetchEventData);
      };
    }
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
          <div className="mt-6 w-[80%] max-w-md bg-white p-4 rounded-xl">
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
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {eventData && eventData.length > 0 ? (
        <EventDetailsSection2 eventData={eventData} />
      ) : (
        // <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-cente flex flex-col items-center justify-center p-8 bg-white rounded-2xl max-w-xl mt-9">
            <div className="rounded-[50%] w-max bg-[#EEEFF2] p-4 mb-4">
              <TbCalendarCheck className="text-6xl text-[#751423]" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#751423] mb-4">
              No Events Found
            </h1>
            <p className="text-sm lg:text-lg font-medium text-center text-[#718096] mb-6">
              It looks like you haven&apos;t created any events yet. Start
              organizing your events today!
            </p>
            <button
              onClick={() => router.push("/dashboard/event-creation")}
              className="px-6 py-3 bg-[#751423] text-white text-lg font-semibold rounded-xl hover:bg-[#5e101b] transition duration-300"
            >
              Create Your First Event
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Page;
