"use client";

import React from "react";
import dynamic from "next/dynamic";
const EventCreation = dynamic(() => import("./(pages)/PageContent"), { ssr: false });
import HeaderLayout from "@/components/layout/HeaderLayout";

const Home = () => {
  return (
    <HeaderLayout>
      {/* <Login /> */}
      <EventCreation />
    </HeaderLayout>
  );
};

export default Home;