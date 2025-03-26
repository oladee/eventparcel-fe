"use client";

import { Suspense } from "react";
// import PickupDetailsContent from "./PickupDetailsContent";
import dynamic from "next/dynamic";

const PickupDetailsContent = dynamic(() => import("./page"), { ssr: false });


const PickupDetails = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PickupDetailsContent />
    </Suspense>
  );
};

export default PickupDetails;