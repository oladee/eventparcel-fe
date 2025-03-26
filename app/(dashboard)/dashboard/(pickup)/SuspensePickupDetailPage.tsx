"use client";

import { lazy, Suspense } from "react";
// import PickupDetailsContent from "./PickupDetailsContent";

const PickupDetailsContent = lazy(() => import("./pickup-details/page"));


const PickupDetails = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PickupDetailsContent />
    </Suspense>
  );
};

export default PickupDetails;