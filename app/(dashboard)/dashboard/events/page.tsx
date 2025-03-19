"use client";

// pages/yourPage.tsx (or wherever your Page component is located)
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
    }
  }, [router]);

  // 67d4b39a98acd292aa0daa32

  useEffect(() => {
    axiosInstance
      .get("/view-event/storedEventId")
      .then((response) => {
        if (response.data.success) {
          setEventData(response.data.data);
        } else {
          setError("Failed to fetch event data.");
        }
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setError("Error fetching event data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
