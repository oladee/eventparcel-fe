"use client";

import { Facebook, Google, Apple } from "@/components/icons/Icons";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";

const carouselData = [
  {
    img: "/images/Illustration.png",
    title: "The easiest way to sell, track & deliver Aso Ebi",
    description:
      "Create an Aso Ebi sales page backed by powerful tools that help you track payments, delivery, and manage your buyers.",
  },
  {
    img: "/images/Illustration.png",
    title: "Seamless Order Management",
    description:
      "Track and manage orders in real-time. Stay informed and keep your customers updated effortlessly.",
  },
  {
    img: "/images/Illustration.png",
    title: "Secure and Easy Payments",
    description:
      "Accept payments from multiple gateways and provide your buyers with a seamless checkout experience.",
  },
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
      {/* Left Side - Signup Form */}
      <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
        <div className="max-w-md w-full">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black-100">
            Create an Account
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* FirstName Input */}
            <div className="mb-4">
              <input type="text" placeholder="firstName" className="authInput" />
            </div>

            {/* Lastname Input */}
            <div className="mb-4">
              <input type="email" placeholder="lastName" className="authInput" />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <input type="email" placeholder="Email" className="authInput" />
          </div>

          {/* Phone Input */}
          <div className="mb-4">
            <PhoneInput
              country={"ng"}
              inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
              buttonClass="!border-none !rounded-l-[12px]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="authInput"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              className="absolute right-3 top-[16px] text-gray-500 outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Terms and conditions Link */}
          <div className="text-left text-black-100 mb-4">
          By proceeding, you agree to the <a href="#" className="text-primary font-bold">Terms and Conditions</a>
          </div> 

          {/* Signup Button */}
          <button className="button_v1 mb-4 w-full">Sign up</button>

          {/* Or Signup With */}
          <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

          {/* Social Signup Buttons */}
          <div className="grid lg:grid-cols-3 gap-4">
            <button className="authButton">
              <Google width={20} height={20} /> Google
            </button>
            <button className="authButton">
              <Facebook width={20} height={20} /> Facebook
            </button>
            <button className="authButton">
              <Apple width={20} height={20} /> Apple
            </button>
          </div>

          {/* Login Link */}
          <div className="text-left text-sm text-gray-500 mt-6">
            Already have an account? <a href="#" className="text-primary font-bold">sign In</a>
          </div>
        </div>
      </div>

      {/* Right Side - Image & Carousel */}
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

    </div>
  );
};

export default Signup;
