"use client";

import { Suspense } from "react";
import PickupDetailsContent from "./PickupDetailsContent";

const PickupDetails = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PickupDetailsContent />
    </Suspense>
  );
};

export default PickupDetails;