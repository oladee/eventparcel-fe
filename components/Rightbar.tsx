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
            {/* Sidebar with smooth slide animation */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? "0%" : "100%" }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="
                    fixed top-0 right-0 h-full bg-white shadow-xl flex flex-col z-50
                    w-[75%] sm:w-[75%] md:w-[50%] lg:w-[25%] 
                    p-4 sm:p-6 lg:p-8
                "
            >
                {/* Header */}
                <h2 className="font-general font-semibold text-lg sm:text-xl lg:text-2xl text-[#111827]">
                    Event Groups & Packages
                </h2>
                <h3 className="text-sm sm:text-base font-general text-[#718096]">
                    Create groups and packages for different types of guests
                </h3>

                {/* Steps */}
                <div className="relative">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative flex items-start gap-2 mt-5 sm:mt-6">
                            {/* Vertical Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[10px] sm:left-[13px] top-7 w-[2px] h-[calc(100%+8px)] bg-gray-300"></div>
                            )}
                            {/* Step Number */}
                            <span className="text-xs sm:text-sm font-general text-[#111827] bg-[#ECB795] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center z-10">
                                {step.number}
                            </span>
                            {/* Title & Description */}
                            <div>
                                <span className="text-sm sm:text-base font-general text-[#111827] font-semibold">
                                    {step.title}
                                </span>
                                <p className="text-xs sm:text-sm font-general font-medium text-[#718096]">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Close Button */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="
                        fixed top-1/2 right-[78%] sm:right-[78%] md:right-[53%] lg:right-[26%] 
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
