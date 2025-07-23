"use client";

import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
import { useRouter as Route } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";
import axiosInstance from "@/lib/axiosInstance";
import AuthLeft from "@/components/auth/AuthLeft";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { trackEvent, identifyUser } from "@/lib/mixpanel";
import getBrowserType from "@/lib/getBrowserType";
import SocialSignin from "@/components/auth/SocialSignin";
import HeaderLayout from "@/components/layout/HeaderLayout";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();
  const route = Route();
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude},${longitude}`);
      });
    }
  }, []);

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

    trackEvent("Started sign-in", {
      source: "login page",
      sign_in_method: "email_password",
      timestamp: new Date().toISOString(),
      page_name: "Login Page",
      browser_type: getBrowserType(),
      location
    });

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("authToken", response.data.accessToken);
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("loggedInUserEmail", response.data.email);
      localStorage.setItem("loggedInUserId", response.data.data.hostId);

      identifyUser(response.data.data.hostId, {
        userType: response.data.data.role,
        location,
        browser_type: getBrowserType(),
        email: response.data.data.email,
        user_first_name: response.data.data.firstName,
        user_last_name: response.data.data.lastName
      });

      trackEvent("Completed sign-in", {
        source: "login page",
        sign_in_method: "email_password",
        timestamp: new Date().toISOString(),
        page_name: "Login Page",
        browser_type: getBrowserType(),
        location,
        email,
        status: "Successful"
      });

      toast.success(response?.data?.message);

      const redirectPath = Cookies.get("redirectAfterLogin") || "/dashboard";
      const goToEventDashboard = localStorage.getItem("goToEventDashboard");
      const formData = localStorage.getItem("unsavedFormData");

      if (redirectPath || formData) {
        // router.push(`${redirectPath}?resumeForm=true`);
        // router.push("/dashboard/add-cohost");
        router.push(redirectPath)
        return;
      } else if (goToEventDashboard) {
        router.replace(goToEventDashboard);
        return;
      } else {
        route.push("/dashboard");
      }
    } catch (error: any) {
      trackEvent("Failed sign-in", {
        source: "login page",
        sign_in_method: "email_password",
        error_message: error.response?.data?.message || "Unknown error",
        timestamp: new Date().toISOString(),
        page_name: "Login Page",
        browser_type: getBrowserType(),
        location,
        status: "Failed"
      });

      if (
        error.response?.data?.message ===
       "User not verified. Please verify OTP first, check your mail"
      ) {
        localStorage.setItem("email", email);
        toast.error(
          error.response?.data?.message ||
            "User not verified. Please verify OTP first, check your mail"
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
    <HeaderLayout>
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
              <a href="/forgot-password" className="text-primary text-sm">
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
            <SocialSignin />

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
    </HeaderLayout>
  );
};

export default Login;

// "use client";

// import { useEffect, useState } from "react";
// import { IoEyeOutline } from "react-icons/io5";
// import { FiEyeOff } from "react-icons/fi";
// import { useRouter as Route } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";
// import AuthLeft from "@/components/auth/AuthLeft";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { trackEvent, identifyUser } from "@/lib/mixpanel";
// import getBrowserType from "@/lib/getBrowserType";
// import SocialSignin from "@/components/auth/SocialSignin";
// import HeaderLayout from "@/components/layout/HeaderLayout";

// const Login: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({ email: "", password: "" });
//   const router = useRouter();
//   const route = Route();
//   const [location, setLocation] = useState<string | null>(null);

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         const { latitude, longitude } = pos.coords;
//         setLocation(`${latitude},${longitude}`);
//       });
//     }
//   }, []);

//   useEffect(() => {
//     // Get eventDetails from localStorage
//     const eventDetails = localStorage.getItem("eventDetails");

//     if (eventDetails) {
//       const parsedDetails = JSON.parse(eventDetails);

//       if (parsedDetails.data?.hostEmail) {
//         setEmail(parsedDetails.data.hostEmail);
//       }
//     }
//   }, []);

//   const validateInput = (name: string, value: string) => {
//     let errorMessage = "";

//     if (name === "email") {
//       if (!/^\S+@\S+\.\S+$/.test(value)) {
//         errorMessage = "Enter a valid email address";
//       }
//     }

//     setErrors((prev) => ({ ...prev, [name]: errorMessage }));
//   };

//   const handleChange = (name: string, value: string) => {
//     if (name === "email") {
//       setEmail(value);
//     } else if (name === "password") {
//       setPassword(value);
//     }
//     validateInput(name, value);
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       toast.error("Email and password are required!");
//       return;
//     }

//     trackEvent("Started sign-in", {
//       source: "login page",
//       sign_in_method: "email_password",
//       timestamp: new Date().toISOString(),
//       page_name: "Login Page",
//       browser_type: getBrowserType(),
//       location,
//     });

//     try {
//       setLoading(true);
//       const response = await axiosInstance.post(
//         "/login",
//         { email, password },
//         { withCredentials: true }
//       );

//       localStorage.setItem("authToken", response.data.accessToken);
//       localStorage.setItem("loggedInUser", JSON.stringify(response.data));
//       localStorage.setItem("loggedInUserEmail", response.data.email);
//       localStorage.setItem("loggedInUserId", response.data.data.hostId);

//       identifyUser(response.data.data.hostId, {
//         userType: response.data.data.role,
//         location,
//         browser_type: getBrowserType(),
//         email: response.data.data.email,
//         user_first_name: response.data.data.firstName,
//         user_last_name: response.data.data.lastName,
//       });

//       trackEvent("Completed sign-in", {
//         source: "login page",
//         sign_in_method: "email_password",
//         timestamp: new Date().toISOString(),
//         page_name: "Login Page",
//         browser_type: getBrowserType(),
//         location,
//         email,
//         status: "Successful"
//       });

//       toast.success(response?.data?.message);

//       const redirectPath = Cookies.get("redirectAfterLogin");
//       const formData = localStorage.getItem("unsavedFormData");

//       if (redirectPath || formData) {
//         router.push(`${redirectPath}?resumeForm=true`);
//         return;
//       } else {
//         route.push("/dashboard");
//       }
//     } catch (error: any) {
//       trackEvent("Failed sign-in", {
//         source: "login page",
//         sign_in_method: "email_password",
//         error_message: error.response?.data?.message || "Unknown error",
//         timestamp: new Date().toISOString(),
//         page_name: "Login Page",
//         browser_type: getBrowserType(),
//         location,
//         status: "Failed"
//       });

//       if (
//         error.response?.data?.message ===
//         "User not verified. Please verify OTP first"
//       ) {
//         localStorage.setItem("email", email);
//         toast.error(error.response?.data?.message || "User not verified. Please verify OTP first");
//         setTimeout(() => {
//           router.push("/otp-verification");
//         }, 3000);
//       } else {
//         toast.error(error.response?.data?.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormValid =
//     email && password && Object.values(errors).every((err) => err === "");

//   return (
//     <HeaderLayout>
//       <main
//         className="grid lg:grid-cols-2 min-h-screen mt-8 md:mt-4 lg:mt-0"
//         role="main"
//       >
//         {/* Left Side - Login Form */}
//         <div className="flex items-center justify-center px-6 py-10">
//           <div className="max-w-md w-full">
//             <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Login to your account
//             </h2>

//             {/* Email Input */}
//             <div className="mb-4">
//               <label htmlFor="login-email" className="sr-only">
//                 Email Address
//               </label>
//               <input
//                 id="login-email"
//                 type="email"
//                 placeholder="Email"
//                 className="authInput"
//                 aria-describedby="email-desc"
//                 name="email"
//                 value={email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 required
//                 aria-required="true"
//               />
//               {errors.email && (
//                 <p
//                   id="email-desc"
//                   className="text-red-500 text-sm"
//                   role="alert"
//                 >
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Input */}
//             <div className="mb-4 relative">
//               <label htmlFor="login-password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="login-password"
//                 name="password"
//                 placeholder="Password"
//                 className="authInput"
//                 aria-describedby="password-desc"
//                 value={password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//                 required
//                 aria-required="true"
//               />
//               <button
//                 id="login-password-toggle"
//                 type="button"
//                 aria-label="Toggle password visibility"
//                 className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <FiEyeOff size={20} />
//                 ) : (
//                   <IoEyeOutline size={20} />
//                 )}
//               </button>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex justify-between items-center mb-6">
//               <label
//                 id="remember_me"
//                 className="flex items-center text-sm text-black-100"
//               >
//                 <input
//                   type="checkbox"
//                   className="mr-2 outline-none"
//                   id="checkbox"
//                 />
//                 Remember me
//               </label>
//               <a href="/forgot-password" className="text-primary text-sm">
//                 Forgot Password?
//               </a>
//             </div>

//             {/* Sign In Button */}
//             <button
//               className={`button_v1 mb-4 w-full flex justify-center items-center ${
//                 !isFormValid ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               onClick={handleLogin}
//               disabled={!isFormValid || loading}
//               aria-disabled={!isFormValid || loading}
//             >
//               {loading ? (
//                 <BiLoaderCircle className="animate-spin mr-2" size={22} />
//               ) : (
//                 "Sign in with email"
//               )}
//             </button>

//             {/* Or Login With */}
//             <div className="text-center text-gray-500 text-sm mb-4">
//               Or login with
//             </div>

//             {/* Social Login Buttons */}
//             <SocialSignin />

//             {/* Signup Link */}
//             <div className="text-left text-sm text-gray-500 mt-6">
//               Don’t have an account?{" "}
//               <a
//                 href="#"
//                 className="text-primary font-bold"
//                 onClick={() => router.push("/signup")}
//               >
//                 Get Started
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </main>

//       {/* Toast Notifications */}
//       <ToastContainer aria-live="polite" />
//     </HeaderLayout>
//   );
// };

// export default Login;
