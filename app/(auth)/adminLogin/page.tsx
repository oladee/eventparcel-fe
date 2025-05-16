"use client";
import Image from "next/image";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
// import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/lib/axiosInstance";
import { BiLoaderCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
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
        "/login-admin",
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
      localStorage.setItem("loggedInUserEmail", response.data.email);
      localStorage.setItem("loggedInUserId", response.data.data._id);
      console.log("User profile fetched successfully:", response.data.data._id);

      toast.success(response?.data?.message);

      router.replace("/admin");
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
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] px-4">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-6">
            {/* Place your logo.svg in /public */}
            <Image
              src="/images/logo4.png"
              alt="Event Parcel"
              width={70}
              height={70}
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          {/* Heading */}
          <h2 className="text-center text-lg font-bold text-gray-900 mb-6">
            Login to your admin account
          </h2>

          {/* Form */}
          <form onSubmit={handleLogin} className="grid gap-4">
            {/* Email Input */}
            <div className="">
              <input
                type="email"
                placeholder="Email"
                id="login-email"
                aria-describedby="email-desc"
                name="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                aria-required="true"
                className="w-full py-3 px-4 bg-gray-100 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#7E1C2B] focus:bg-white"
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

            {/* Password Input with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                name="password"
                placeholder="Password"
                aria-describedby="password-desc"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                aria-required="true"
                className="w-full py-3 px-4 bg-gray-100 pr-12 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#7E1C2B] focus:bg-white"
                autoComplete="current-password"
              />
              <button
                type="button"
                id="login-password-toggle"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={20} color="gray" />
                ) : (
                  <HiOutlineEye size={20} color="gray" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="rounded-checkbox"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a
                href="/admin-forgotPassword"
                className="text-primary text-xs font-semibold hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={!isFormValid || loading}
              aria-disabled={!isFormValid || loading}
              type="submit"
              className={`button_v1 ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <BiLoaderCircle className="animate-spin mr-2" size={22} />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
      {/* Toast Notifications */}
      <ToastContainer aria-live="polite" />
    </>
  );
};

export default Page;
