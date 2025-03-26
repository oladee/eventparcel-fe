"use client";

import { Suspense, lazy } from "react";

const PaymentSetupContent = lazy(() => import("./payment-setup/page"));

const SuspensePaymentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSetupContent />
    </Suspense>
  );
};

export default SuspensePaymentPage;
