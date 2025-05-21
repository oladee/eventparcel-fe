"use client";

import React from "react";
import dynamic from "next/dynamic";
const Login = dynamic(() => import("./(auth)/Login"), { ssr: false });
import HeaderLayout from "@/components/layout/HeaderLayout";

const Home = () => {
  return (
    <HeaderLayout>
      <Login />
    </HeaderLayout>
  );
};

export default Home;
