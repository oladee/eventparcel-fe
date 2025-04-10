"use client";

import React, { Suspense } from "react";
import EditDiscountPage from "./EditDiscountPage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditDiscountPage />
    </Suspense>
  );
};

export default Page;