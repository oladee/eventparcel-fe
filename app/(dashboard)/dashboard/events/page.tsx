"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/dashboard/Container";
import PackagesSection from "@/components/dashboard/eventComponents/PackagesSection";
import EventDetailsSection from "@/components/dashboard/eventComponents/EventDetailsSection";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next-nprogress-bar";

const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEventId = localStorage.getItem("eventId");
      if (!storedEventId) {
        router.replace("/event-creation");
        return;
      }

      // Fetch event data using the stored event ID
      const fetchEventData = async () => {
        try {
          const response = await axiosInstance.get(`/view-event/${storedEventId}`);
          if (response.data.success) {
            setEventData(response.data.data);
          } else {
            setError("Failed to fetch event data.");
          }
        } catch (error:any) {
          console.error("Error fetching event:", error);
          setError(error.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();
    }
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      {/* Pass the eventData to both child components */}
      <EventDetailsSection eventData={eventData} />
      <PackagesSection eventData={eventData} />
    </Container>
  );
};

export default Page;















// import React from "react";
// import Container from "@/components/dashboard/Container";
// import PackagesSection from "@/components/dashboard/eventComponents/PackagesSection";
// import EventDetailsSection from "@/components/dashboard/eventComponents/EventDetailsSection";

// const Page: React.FC = () => {

//   return (
//     <Container>
//       {/* Top Banner Section */}
//       <EventDetailsSection />

//       {/* Packages Section (Separate Component) */}
//       <PackagesSection />
//     </Container>
//   );
// };

// export default Page;
