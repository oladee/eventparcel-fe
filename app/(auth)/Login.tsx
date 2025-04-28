"use client";

import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
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
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();
  // const [localEmail, setLocalEmail] = useState("");

  useEffect(() => {
    // Get eventDetails from localStorage
    const eventDetails = localStorage.getItem("eventDetails");

    if (eventDetails) {
      const parsedDetails = JSON.parse(eventDetails);

      if (parsedDetails.data?.hostEmail) {
        setEmail(parsedDetails.data.hostEmail);
      }
    }
  }, []);

  const validateInput = (name: string, value: string) => {
    let errorMessage = "";

    if (name === "email") {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        errorMessage = "Enter a valid email address";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleChange = (name: string, value: string) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    validateInput(name, value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/login",
        { email, password },
        {
          withCredentials: true // Ensure cookies are sent with the request
        }
      );
      console.log(response.data);

      // Store the accessToken in localStorage
      localStorage.setItem("authToken", response.data.accessToken);
      // Save the response to localStorage as the logged-in user
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("loggedInUserEmail", response.data.email)
      toast.success(response?.data?.message);

      router.push("/dashboard");
      // router.push("/event-creation");
    } catch (error: any) {
      if (
        error.response?.data?.message ===
        "User not verified. Please verify OTP first"
      ) {
        localStorage.setItem("email", email);
        toast.error(
          error.response?.data?.message ||
            "User not verified. Please verify OTP first"
        );
        setTimeout(() => {
          router.push("/otp-verification");
        }, 3000);
      } else {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    email && password && Object.values(errors).every((err) => err === "");

  return (
    <>
      <main
        className="grid lg:grid-cols-2 min-h-screen mt-8 md:mt-4 lg:mt-0"
        role="main"
      >
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="max-w-md w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
              Login to your account
            </h2>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="login-email" className="sr-only">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                className="authInput"
                aria-describedby="email-desc"
                name="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                aria-required="true"
              />
              {errors.email && (
                <p
                  id="email-desc"
                  className="text-red-500 text-sm"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <label htmlFor="login-password" className="sr-only">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                name="password"
                placeholder="Password"
                className="authInput"
                aria-describedby="password-desc"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                aria-required="true"
              />
              <button
                id="login-password-toggle"
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-3 top-[16px] text-gray-500 outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <label
                id="remember_me"
                className="flex items-center text-sm text-black-100"
              >
                <input
                  type="checkbox"
                  className="mr-2 outline-none"
                  id="checkbox"
                />
                Remember me
              </label>
              <a href="#" className="text-primary text-sm">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              className={`button_v1 mb-4 w-full flex justify-center items-center ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleLogin}
              disabled={!isFormValid || loading}
              aria-disabled={!isFormValid || loading}
            >
              {loading ? (
                <BiLoaderCircle className="animate-spin mr-2" size={22} />
              ) : (
                "Sign in with email"
              )}
            </button>

            {/* Or Login With */}
            <div className="text-center text-gray-500 text-sm mb-4">
              Or login with
            </div>

            {/* Social Login Buttons */}
            <SocialSignup />

            {/* Signup Link */}
            <div className="text-left text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-primary font-bold"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Image & Carousel */}
        <AuthLeft />
      </main>

      {/* Toast Notifications */}
      <ToastContainer aria-live="polite" />
    </>
  );
};

export default Login;


