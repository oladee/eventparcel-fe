"use client";

import { Suspense } from "react";
import PaymentSetupContent from "./PaymentSetupContent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSetupContent />
    </Suspense>
  );
};

export default Page;
