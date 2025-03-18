import React from "react";
import Container from "@/components/dashboard/Container";
// import PackagesSection from "@/components/dashboard/eventComponents/PackagesSection";
import EventDetailsSection from "@/components/dashboard/eventComponents/EventDetailsSection";

const Page: React.FC = () => {

  return (
    <Container>
      {/* Top Banner Section */}
      <EventDetailsSection />

      {/* Packages Section (Separate Component) */}
      {/* <PackagesSection /> */}
    </Container>
  );
};

export default Page;
