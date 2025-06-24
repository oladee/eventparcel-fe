import React from "react";
import { ChevronLeft } from "lucide-react";

const Back = () => {
  return (
    <div
      className="fixed top-16 w-[90%] md:w-[80%] h-auto py-3 bg-gray-100"
      id="back-button"
    >
      <button
        className="w-[20%] md:w-[5%] -ml-2 cursor-pointer flex flex-row items-center"
        onClick={() => window.history.back()}
      >
        <ChevronLeft className="w-6 h-6 " />
        <span className="font-medium text-base text-[#111827] ml-1">Back</span>
      </button>
    </div>
  );
};

export default Back;
