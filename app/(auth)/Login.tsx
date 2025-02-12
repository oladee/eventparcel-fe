"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";
import axiosInstance from "@/lib/axiosInstance";
import SocialSignup from "@/components/auth/SocialSignup";
import AuthLeft from "@/components/auth/AuthLeft";



const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email and password are required!");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post("/login", { email, password });

            toast.success("Login successful!");
            localStorage.setItem("authToken", response.data.token); // Adjust based on API response

            // router.push("/dashboard"); // Redirect after successful login
        } catch (error: any) {
            if (error.response?.status === 403) {
                localStorage.setItem("email", email);
                toast.error(error.response?.data?.message || "User not verified. Please verify OTP first");
                setTimeout(() => {
                    router.push("/otp-verification");
                }, 3000);
            } else {
                toast.error(error.response?.data?.message || "Login failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid lg:grid-cols-2 min-h-screen mt-8 md:mt-4 lg:mt-0">
                {/* Left Side - Login Form */}
                <div className="flex items-center justify-center px-6 py-10">
                    <div className="max-w-md w-full">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">Login to your account</h2>

                        {/* Email Input */}
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="authInput"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="authInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex justify-between items-center mb-6">
                            <label className="flex items-center text-sm text-black-100">
                                <input type="checkbox" className="mr-2 outline-none" id="checkbox" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary text-sm">Forgot Password?</a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            className="button_v1 mb-4"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? <BiLoaderCircle className="animate-spin mr-2" size={22} /> : "Sign in with email"}
                        </button>

                        {/* Or Login With */}
                        <div className="text-center text-gray-500 text-sm mb-4">Or login with</div>

                        {/* Social Login Buttons */}
                        <SocialSignup />

                        {/* Signup Link */}
                        <div className="text-left text-sm text-gray-500 mt-6">
                            Don’t have an account? <a href="#" className="text-primary font-bold" onClick={() => router.push("/signup")}>Get Started</a>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image & Carousel */}
                <AuthLeft />
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;





























// "use client"

// import { Facebook, Google, Apple } from "@/components/icons/Icons";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next-nprogress-bar";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";

// const carouselData = [
//     {
//         img: "/images/Illustration.png",
//         title: "The easiest way to sell, track & deliver Aso Ebi",
//         description:
//             "Create an Aso Ebi sales page backed by powerful tools that help you track payments, delivery, and manage your buyers.",
//     },
//     {
//         img: "/images/Illustration.png",
//         title: "Seamless Order Management",
//         description:
//             "Track and manage orders in real-time. Stay informed and keep your customers updated effortlessly.",
//     },
//     {
//         img: "/images/Illustration.png",
//         title: "Secure and Easy Payments",
//         description:
//             "Accept payments from multiple gateways and provide your buyers with a seamless checkout experience.",
//     },
// ];

// const Login: React.FC = () => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     // Auto-slide every 5 seconds
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentSlide((prev) => (prev + 1) % carouselData.length);
//         }, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <>
//             <div className="grid lg:grid-cols-2 min-h-screen">
//                 {/* Left Side - Login Form */}
//                 <div className="flex items-center justify-center px-6 py-10">
//                     <div className="max-w-md w-full">
//                         <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black-100">Login to your account</h2>

//                         {/* Email Input */}
//                         <div className="mb-4">
//                             <input
//                                 type="email"
//                                 placeholder="Email"
//                                 className="authInput"
//                             />
//                         </div>

//                         {/* Password Input */}
//                         <div className="mb-4 relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="Password"
//                                 className="authInput"
//                             />
//                             <button
//                                 type="button"
//                                 aria-label="Toggle password visibility"
//                                 className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                                 onClick={() => setShowPassword(!showPassword)}
//                             >
//                                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                             </button>
//                         </div>

//                         {/* Remember Me & Forgot Password */}
//                         <div className="flex justify-between items-center mb-6">
//                             <label className="flex items-center text-sm text-black-100">
//                                 <input type="checkbox" className="mr-2" />
//                                 Remember me
//                             </label>
//                             <a href="#" className="text-primary text-sm">Forgot Password?</a>
//                         </div>

//                         {/* Sign In Button */}
//                         <button className="button_v1 mb-4">
//                             Sign in with email
//                         </button>

//                         {/* Or Login With */}
//                         <div className="text-center text-gray-500 text-sm mb-4">Or login with</div>

//                         {/* Social Login Buttons */}
//                         <div className="flex justify-center gap-4">
//                             <button className="authButton">
//                                 <Google width={20} height={20} /> Google
//                             </button>
//                             <button className="authButton">
//                                 <Facebook width={20} height={20} /> Facebook
//                             </button>
//                             <button className="authButton">
//                                 <Apple width={20} height={20} /> Apple
//                             </button>
//                         </div>

//                         {/* Signup Link */}
//                         <div className="text-left text-sm text-gray-500 mt-6">
//                             Don’t have an account? <a href="#" className="text-primary font-bold">Get Started</a>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side - Image & Carousel */}
//                 <div className="hidden lg:flex flex-col items-center justify-center bg-[#263C57] text-white px-8 relative">
//                     <motion.div
//                         key={currentSlide}
//                         initial={{ opacity: 0, x: 50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.8 }}
//                         className="w-full max-w-md text-center"
//                     >
//                         <Image
//                             src={carouselData[currentSlide].img}
//                             alt="Feature"
//                             width={400}
//                             height={300}
//                             className="rounded-lg shadow-md mb-6"
//                         />
//                         <h2 className="text-2xl font-bold mb-4">{carouselData[currentSlide].title}</h2>
//                         <p className="text-gray-300 text-sm">{carouselData[currentSlide].description}</p>
//                     </motion.div>

//                     {/* Carousel Dots */}
//                     <div className="absolute bottom-8 flex gap-2">
//                         {carouselData.map((_, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => setCurrentSlide(index)}
//                                 className={`h-3 w-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-gray-500"
//                                     }`}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             <ToastContainer />
//         </>
//     );
// };

// export default Login;
