import React from "react";
import Login from "./(auth)/Login";
import HeaderLayout from "@/components/layout/HeaderLayout";

const Home = () => {
  return (
    <HeaderLayout>
      <Login />
    </HeaderLayout>
  );
};

export default Home;
