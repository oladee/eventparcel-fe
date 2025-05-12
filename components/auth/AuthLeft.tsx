"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import carouselData from "@/data/carouselData";

const AuthLeft = () => {
      const [currentSlide, setCurrentSlide] = useState(0);
    
    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="hidden lg:flex flex-col items-center justify-center bg-[#263C57] text-white px-8 relative">
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md text-center"
            >
                <Image
                    src={carouselData[currentSlide].img}
                    alt="Feature"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md mb-6"
                />
                <h2 className="text-2xl font-bold mb-4">{carouselData[currentSlide].title}</h2>
                <p className="text-gray-300 text-sm">{carouselData[currentSlide].description}</p>
            </motion.div>

            {/* Carousel Dots */}
            <div className="absolute bottom-8 flex gap-2">
                {carouselData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 w-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-gray-500"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default AuthLeft
