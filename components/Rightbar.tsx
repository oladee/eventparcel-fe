"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const RightBar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
    const steps = [
        {
            number: 1,
            title: "Create a group for guests",
            description: "Group your guests into required categories in order to create a package for them.",
        },
        {
            number: 2,
            title: "Create packages",
            description: "Create as many as required packages for each group",
        },
        {
            number: 3,
            title: "Edit to your taste",
            description: "You can create and edit groups and packages as much as required",
        },
    ];

    return (
        <>
            {/* Sidebar with increased width */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? "0%" : "100%" }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="
                    fixed top-0 right-0 h-full bg-white shadow-xl flex flex-col z-50
                    w-[85%] sm:w-[80%] md:w-[65%] lg:w-[40%] 
                    p-4 sm:p-6 lg:p-8
                "
            >
                {/* Header */}
                <h2 className="font-general font-semibold text-2xl sm:text-xl lg:text-2xl text-[#111827]">
                    Event Groups & Packages
                </h2>
                <h3 className="text-base sm:text-base font-general text-[#718096]">
                    Create groups and packages for different types of guests
                </h3>

                {/* Steps */}
                <div className="relative">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative flex items-start gap-4 mt-5 sm:mt-6">
                            {/* Vertical Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[11px] top-[28px] w-[2px] h-[calc(100%-15px)] bg-gray-300"></div>
                            )}
                            {/* Step Number */}
                            <span className="text-xs sm:text-sm font-general text-[#111827] bg-[#ECB795] rounded-full flex items-center justify-center shrink-0" style={{width:"24px", height:"24px"}}>
                                {step.number}
                            </span>
                            {/* Title & Description */}
                            <div className="flex flex-col gap-1">
                                <span className="text-base sm:text-base font-general text-[#111827] font-semibold">
                                    {step.title}
                                </span>
                                <p className="text-sm sm:text-sm font-general font-medium text-[#718096]">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Close Button - Adjusted position */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="
                        fixed top-1/2 right-[88%] sm:right-[83%] md:right-[68%] lg:right-[43%] 
                        transform -translate-y-1/2 flex items-center justify-center 
                        w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-md rounded-full hover:bg-gray-100 transition z-50
                    "
                >
                    <ChevronRight size={18} className="text-gray-600" />
                </button>
            )}

            {/* Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
                />
            )}
        </>
    );
};

export default RightBar;