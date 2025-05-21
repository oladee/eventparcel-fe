"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import AuthLeft from "@/components/auth/AuthLeft";
import axiosInstance from "@/lib/axiosInstance";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { CheckCircle, XCircle } from "lucide-react";
import Cookies from "js-cookie";
// import SocialSignup from "@/components/auth/SocialSignup";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useSearchParams } from "next/navigation";

const CompleteCohost: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [cohostId,setCohostId] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const router = useRouter();
  const searchParams = useSearchParams(); 

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    if (!id) {
      router.replace("/");
      return;
    }
 setCohostId(id)

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/view-user/${id}`);
        const { firstName, lastName, email } = response.data.data;


        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
          email
        }));
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch user data."
        );
      }
    };

    fetchUserData();
  }, [searchParams, router]);






  // Validate input fields
  const validateInput = (name: string, value: string) => {
    let errorMessage = "";

    if (name === "firstName" || name === "lastName") {
      if (!/^[A-Za-z]+$/.test(value)) {
        errorMessage = "Only letters are allowed";
      }
    }

    if (name === "email") {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        errorMessage = "Enter a valid email address";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  // Password validation checks
  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one number", regex: /[0-9]/ },
    { label: "At least one special character (!@#$%^&*)", regex: /[!@#$%^&*]/ }
  ];

  // Handle input change
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.put(`/update-user/${cohostId}`, formData);
      toast.success(response.data.message || "Signup successful!");

      Cookies.set("cohost-email", formData.email, { expires: 1, path: "/" }); //expire in one day

      // Redirect to OTP verification page
      // router.push("/verify-cohost");
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const errors = requirements.map((req) => ({
      label: req.label,
      isValid: req.regex.test(password)
    }));

    return errors.every((error) => error.isValid);
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    // formData.phoneNumber &&
    formData.password &&
    validatePassword(formData.password) &&
    Object.values(errors).every((err) => err === "");

  return (
    <HeaderLayout>
      <main
        role="main"
        className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen bg-[#F9FAFB]"
      >
        <div className="flex flex-col items-center justify-center px-6 py-6 lg:mt-12">
          <div className="max-w-md w-full space-y-2 mt-16">
            <h1 className="font-bold text-[#111827] text-2xl lg:text-3xl">
              Complete your profile
            </h1>
            <p className="font-medium text-sm text-[#718096]">
             Enter your preffered password and phone number to continue
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full bg-white p-4 rounded-[20px] mt-4"
          >
            <h2
              role="heading"
              className="text-xl font-bold mb-6 text-black-100"
            >
              Create account to continue
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="authInput"
                  value={formData.firstName}
                  // onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  readOnly
                  aria-required="true"
                  aria-describedby="firstNameError"
                />
                {errors.firstName && (
                  <p
                    id="firstNameError"
                    className="text-red-500 text-sm"
                    role="alert"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Last name"
                  id="Last name"
                  className="authInput"
                  value={formData.lastName}
                  // onChange={(e) => handleChange("lastName", e.target.value)}
                  readOnly
                  required
                  aria-required="true"
                  aria-describedby="lastNameError"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <input
                type="email"
                id="Email"
                placeholder="Email"
                className="authInput"
                value={formData.email}
                // onChange={(e) => handleChange("email", e.target.value)}
                  readOnly
                  required
                aria-required="true"
                aria-describedby="email-desc"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="pb-3  w-full">
              <PhoneNumberInput
                onPhoneChange={(value: string) =>
                  handleChange("phoneNumber", value)
                }
              />
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                placeholder="Password"
                className="authInput"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                onFocus={() => setTouched(true)}
                onBlur={() => setTouched(false)}
                aria-required="true"
                aria-describedby="password-desc"
              />
              <button
                type="button"
                className="absolute right-3 top-[16px] text-gray-500 outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            {(touched || formData.password) && (
              <ul className="mt-2 text-sm">
                {requirements.map((req, index) => {
                  const isValid = req.regex.test(formData.password);
                  return (
                    <li
                      key={index}
                      className={`flex text-xs items-center gap-2 ${
                        isValid ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isValid ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}{" "}
                      {req.label}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="text-left text-black-100 my-2 text-sm">
              By proceeding, you agree to the{" "}
              <a href="/terms" className="text-primary font-bold">
                Terms and Conditions
              </a>
            </div>

            <button
              id="submit"
              type="submit"
              className={`button_v1 mb-4 w-full flex justify-center items-center ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isFormValid || isLoading}
              aria-disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <BiLoaderCircle
                  className="animate-spin h-6 w-6"
                  aria-hidden="true"
                />
              ) : (
                "Complete profile"
              )}
            </button>
          <div className="text-left text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <a
                href="#"
                className="text-primary font-bold"
                onClick={() => router.push("/")}
              >
                Sign In
              </a>
            </div>
          </form>
        </div>

        <AuthLeft />
      </main>
      <ToastContainer role="alert" />
    </HeaderLayout>
  );
};

export default CompleteCohost;





















// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import "react-phone-input-2/lib/style.css";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import { BiLoaderCircle } from "react-icons/bi";
// import AuthLeft from "@/components/auth/AuthLeft";
// import axiosInstance from "@/lib/axiosInstance";
// import PhoneNumberInput from "@/components/PhoneNumberInput";
// import { CheckCircle, XCircle } from "lucide-react";
// import Cookies from "js-cookie";
// // import SocialSignup from "@/components/auth/SocialSignup";
// import HeaderLayout from "@/components/layout/HeaderLayout";

// const AddCoHost: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [touched, setTouched] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     password: ""
//   });

//   const [errors, setErrors] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: ""
//   });

//   const router = useRouter();

//   // Validate input fields
//   const validateInput = (name: string, value: string) => {
//     let errorMessage = "";

//     if (name === "firstName" || name === "lastName") {
//       if (!/^[A-Za-z]+$/.test(value)) {
//         errorMessage = "Only letters are allowed";
//       }
//     }

//     if (name === "email") {
//       if (!/^\S+@\S+\.\S+$/.test(value)) {
//         errorMessage = "Enter a valid email address";
//       }
//     }

//     setErrors((prev) => ({ ...prev, [name]: errorMessage }));
//   };

//   // Password validation checks
//   const requirements = [
//     { label: "At least 8 characters", regex: /.{8,}/ },
//     { label: "At least one uppercase letter", regex: /[A-Z]/ },
//     { label: "At least one lowercase letter", regex: /[a-z]/ },
//     { label: "At least one number", regex: /[0-9]/ },
//     { label: "At least one special character (!@#$%^&*)", regex: /[!@#$%^&*]/ }
//   ];

//   // Handle input change
//   const handleChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     validateInput(name, value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await axiosInstance.post("/signup", formData);
//       toast.success(response.data.message || "Signup successful!");

//       Cookies.set("cohost-email", formData.email, { expires: 1, path: "/" }); //expire in one day

//       // Redirect to OTP verification page
//       router.push("/verify-cohost");
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Signup failed. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validatePassword = (password: string) => {
//     const errors = requirements.map((req) => ({
//       label: req.label,
//       isValid: req.regex.test(password)
//     }));

//     return errors.every((error) => error.isValid);
//   };

//   const isFormValid =
//     formData.firstName &&
//     formData.lastName &&
//     formData.email &&
//     formData.phoneNumber &&
//     formData.password &&
//     validatePassword(formData.password) &&
//     Object.values(errors).every((err) => err === "");

//   return (
//     <HeaderLayout>
//       <main
//         role="main"
//         className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen bg-[#F9FAFB]"
//       >
//         <div className="flex flex-col items-center justify-center px-6 py-6 lg:mt-12">
//           <div className="max-w-md w-full space-y-2 mt-16">
//             <h1 className="font-bold text-[#111827] text-2xl lg:text-3xl">
//               Complete your profile
//             </h1>
//             <p className="font-medium text-sm text-[#718096]">
//              Enter your preffered password and phone number to continue
//             </p>
//           </div>
//           <form
//             onSubmit={handleSubmit}
//             className="max-w-md w-full bg-white p-4 rounded-[20px] mt-4"
//           >
//             <h2
//               role="heading"
//               className="text-xl font-bold mb-6 text-black-100"
//             >
//               Create account to continue
//             </h2>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="mb-4">
//                 <input
//                   type="text"
//                   id="firstName"
//                   placeholder="First name"
//                   className="authInput"
//                   value={formData.firstName}
//                   onChange={(e) => handleChange("firstName", e.target.value)}
//                   required
//                   aria-required="true"
//                   aria-describedby="firstNameError"
//                 />
//                 {errors.firstName && (
//                   <p
//                     id="firstNameError"
//                     className="text-red-500 text-sm"
//                     role="alert"
//                   >
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   placeholder="Last name"
//                   id="Last name"
//                   className="authInput"
//                   value={formData.lastName}
//                   onChange={(e) => handleChange("lastName", e.target.value)}
//                   required
//                   aria-required="true"
//                   aria-describedby="lastNameError"
//                 />
//                 {errors.lastName && (
//                   <p className="text-red-500 text-sm">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mb-4">
//               <input
//                 type="email"
//                 id="Email"
//                 placeholder="Email"
//                 className="authInput"
//                 value={formData.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 required
//                 aria-required="true"
//                 aria-describedby="email-desc"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm">{errors.email}</p>
//               )}
//             </div>

//             <div className="pb-3  w-full">
//               <PhoneNumberInput
//                 onPhoneChange={(value: string) =>
//                   handleChange("phoneNumber", value)
//                 }
//               />
//             </div>

//             <div className="mb-4 relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="Password"
//                 placeholder="Password"
//                 className="authInput"
//                 value={formData.password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//                 required
//                 onFocus={() => setTouched(true)}
//                 onBlur={() => setTouched(false)}
//                 aria-required="true"
//                 aria-describedby="password-desc"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             {/* Password Requirements */}
//             {(touched || formData.password) && (
//               <ul className="mt-2 text-sm">
//                 {requirements.map((req, index) => {
//                   const isValid = req.regex.test(formData.password);
//                   return (
//                     <li
//                       key={index}
//                       className={`flex text-xs items-center gap-2 ${
//                         isValid ? "text-green-600" : "text-gray-500"
//                       }`}
//                     >
//                       {isValid ? (
//                         <CheckCircle size={14} />
//                       ) : (
//                         <XCircle size={14} />
//                       )}{" "}
//                       {req.label}
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}

//             <div className="text-left text-black-100 my-2 text-sm">
//               By proceeding, you agree to the{" "}
//               <a href="/terms" className="text-primary font-bold">
//                 Terms and Conditions
//               </a>
//             </div>

//             <button
//               id="submit"
//               type="submit"
//               className={`button_v1 mb-4 w-full flex justify-center items-center ${
//                 !isFormValid ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={!isFormValid || isLoading}
//               aria-disabled={!isFormValid || isLoading}
//             >
//               {isLoading ? (
//                 <BiLoaderCircle
//                   className="animate-spin h-6 w-6"
//                   aria-hidden="true"
//                 />
//               ) : (
//                 "Sign up with email"
//               )}
//             </button>

//             {/* <div className="text-center text-gray-500 text-sm mb-4">
//               Or sign up with
//             </div> */}
//             {/* <SocialSignup /> */}

//             {/* <div className="text-left text-sm text-gray-500 mt-6">
//               Already have an account?{" "}
//               <a
//                 href="#"
//                 className="text-primary font-bold"
//                 onClick={() => router.push("/")}
//               >
//                 Sign In
//               </a>
//             </div> */}
//           </form>
//         </div>

//         <AuthLeft />
//       </main>
//       <ToastContainer role="alert" />
//     </HeaderLayout>
//   );
// };

// export default AddCoHost;
