"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import AuthLeft from "@/components/auth/AuthLeft";
import SocialSignup from "@/components/auth/SocialSignup";
import axiosInstance from "@/lib/axiosInstance";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { CheckCircle, XCircle } from "lucide-react";


const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // phoneNumber: "", //Phone number handling its own error
    password: "",
  });

  const router = useRouter();

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

    //New validation created in PhoneNumberInput file
    // if (name === "phoneNumber") {
    //   if (!/^\d{10,15}$/.test(value)) {
    //     errorMessage = "Enter a valid phone number";
    //   }
    // }

    //New requirement format created in requirements array
    // if (name === "password") {
    //   if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(value)) {
    //     errorMessage =
    //       "Password must contain uppercase, lowercase, number, and special character";
    //   }
    // }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

    // Password validation checks
    const requirements = [
      { label: "At least 8 characters", regex: /.{8,}/ },
      { label: "At least one uppercase letter", regex: /[A-Z]/ },
      { label: "At least one lowercase letter", regex: /[a-z]/ },
      { label: "At least one number", regex: /[0-9]/ },
      { label: "At least one special character (!@#$%^&*)", regex: /[!@#$%^&*]/ },
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
      const response = await axiosInstance.post('/signup', formData);
      toast.success(response.data.message || "Signup successful!");
      localStorage.setItem("email", formData.email);
      router.push("/otp-verification");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phoneNumber &&
    formData.password &&
    Object.values(errors).every((err) => err === "");

  return (
    <>
      <main role="main" className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
        <div className="flex items-center justify-center px-6 py-6 lg:mt-12">
          <form onSubmit={handleSubmit} className="max-w-md w-full">
            <h2 role="heading" className="text-2xl lg:text-3xl font-bold mb-6 text-black-100">
              Create an Account
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="mb-4">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="authInput"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  aria-required="true"
                  aria-describedby="firstNameError"
                />
                {errors.firstName && (
                  <p id="firstNameError" className="text-red-500 text-sm" role="alert">
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
                  onChange={(e) => handleChange("lastName", e.target.value)}
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
                onChange={(e) => handleChange("email", e.target.value)}
                required
                 aria-required="true"
                aria-describedby="email-desc"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* <div className="mb-4 relative overflow-hidden"> */}
            <div className="pb-3 overflow-hidden w-full">

              {/* <PhoneInput
                country={"ng"}
                value={formData.phoneNumber}
                onChange={(value) => handleChange("phoneNumber", value)}
                inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
                buttonClass="!border-none !rounded-l-[12px]"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )} */}
              {/* <PhoneNumberInput /> */}
              <PhoneNumberInput 
                onPhoneChange={(value: string) => handleChange("phoneNumber", value)} 
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
              {/* {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )} */}
            </div>

            {/* Password Requirements */}
            <ul className="mt-2 text-sm">
              {requirements.map((req, index) => {
                const isValid = req.regex.test(formData.password);
                return (
                  <li key={index} className={`flex text-xs items-center gap-2 ${isValid ? "text-green-600" : "text-gray-500"}`}>
                    {isValid ? <CheckCircle size={14}/> : <XCircle size={14} />} {req.label}
                  </li>
                );
              })}
            </ul>

            <div className="text-left text-black-100 my-2 text-sm md:text-base">
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
                <BiLoaderCircle className="animate-spin h-6 w-6" aria-hidden="true" />
              ) : (
                "Sign up"
              )}
            </button>

            <div className="text-center text-gray-500 text-sm mb-4">
              Or sign up with
            </div>

            <SocialSignup />

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
    </>
  );
};

export default Signup;


























// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "@/lib/axiosInstance";
// import { useForm, Controller } from "react-hook-form";
// import AuthLeft from "@/components/auth/AuthLeft";
// import { BiLoaderCircle } from "react-icons/bi";
// import SocialSignup from "@/components/auth/SocialSignup";

// interface SignupFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
// }

// const Signup: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { control, handleSubmit, formState: { errors }, watch, trigger, setError } = useForm<SignupFormData>();
//   const router = useRouter();

//   const onSubmit = async (data: SignupFormData) => {
//     setLoading(true);
    // try {
    //   const response = await axiosInstance.post('/signup', data);
    //   toast.success(response.data.message || "Signup successful!");
    //   localStorage.setItem("email", data.email);
    //   router.push("/otp-verification");
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
//   };

//   const allFieldsFilled = watch("firstName") && watch("lastName") && watch("email") && watch("phoneNumber") && watch("password");

//   const handleValidation = async (name:  keyof SignupFormData) => {
//     const result = await trigger(name);
//     if (!result) {
//       setError(name, { type: "manual", message: `${name} is required` });
//     }
//   };

//   return (
//     <>
//       <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
//         {/* Left Side - Signup Form */}
//         <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
//           <div className="max-w-md w-full">
//             <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Create an Account
//             </h2>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {/* FirstName Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="firstName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "First name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "First name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="First Name"
//                         className="authInput"
//                         onChange={(e) => {
//                           field.onChange(e);
//                           handleValidation("firstName");
//                         }}
//                         onBlur={() => trigger("firstName")}
//                       />
//                     )}
//                   />
//                   {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
//                 </div>

//                 {/* Lastname Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="lastName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "Last name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "Last name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="Last Name"
//                         className="authInput"
//                         onChange={(e) => {
//                           field.onChange(e);
//                           handleValidation("lastName");
//                         }}
//                         onBlur={() => trigger("lastName")}
//                       />
//                     )}
//                   />
//                   {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="email"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                       message: "Invalid email address"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type="email"
//                       placeholder="Email"
//                       className="authInput"
//                       onChange={(e) => {
//                         field.onChange(e);
//                         handleValidation("email");
//                       }}
//                       onBlur={() => trigger("email")}
//                     />
//                   )}
//                 />
//                 {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//               </div>

//               {/* Phone Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="phoneNumber"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "Phone number is required" }}
//                   render={({ field }) => (
//                     <PhoneInput
//                       {...field}
//                       country={"ng"}
//                       inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
//                       buttonClass="!border-none !rounded-l-[12px]"
//                       onChange={(value) => {
//                         field.onChange(value);
//                         handleValidation("phoneNumber");
//                       }}
//                       onBlur={() => trigger("phoneNumber")}
//                     />
//                   )}
//                 />
//                 {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
//               </div>

//               {/* Password Input */}
//               <div className="mb-4 relative">
//                 <Controller
//                   name="password"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters long"
//                     },
//                     pattern: {
//                       value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                       message: "Password must contain uppercase, lowercase, number, and special character"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className="authInput"
//                       onChange={(e) => {
//                         field.onChange(e);
//                         handleValidation("password");
//                       }}
//                       onBlur={() => trigger("password")}
//                     />
//                   )}
//                 />
//                 <button
//                   type="button"
//                   aria-label="Toggle password visibility"
//                   className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//               </div>

            //   {/* Terms and conditions Link */}
            //   <div className="text-left text-black-100 mb-4 text-sm md:text-base">
            //     By proceeding, you agree to the <a href="/terms" className="text-primary font-bold">Terms and Conditions</a>
            //   </div>

            //   {/* Signup Button */}
            //   <button type="submit" className="button_v1 mb-4" disabled={loading || !allFieldsFilled}>
            //     {loading ? <BiLoaderCircle className="animate-spin text-center" /> : "Sign up"}
            //   </button>
            // </form>

            // {/* Or Signup With */}
            // <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

            // {/* Social Signup Buttons */}
            // <SocialSignup />

            // {/* Login Link */}
            // <div className="text-left text-sm text-gray-500 mt-6">
            //   Already have an account? <a href="#" className="text-primary font-bold" onClick={() => router.push("/")}>sign In</a>
            // </div>
//           </div>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Signup;













// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "@/lib/axiosInstance";
// import { useForm, Controller } from "react-hook-form";
// import AuthLeft from "@/components/auth/AuthLeft";
// import { BiLoaderCircle } from "react-icons/bi";
// import SocialSignup from "@/components/auth/SocialSignup";

// interface SignupFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
// }

// const Signup: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { control, handleSubmit, formState: { errors }, watch, trigger } = useForm<SignupFormData>();
//   const router = useRouter();

//   const onSubmit = async (data: SignupFormData) => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.post('/signup', data);
//       toast.success(response.data.message || "Signup successful!");
//       localStorage.setItem("email", data.email);
//       router.push("/otp-verification");
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Signup failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const allFieldsFilled = watch("firstName") && watch("lastName") && watch("email") && watch("phoneNumber") && watch("password");

//   return (
//     <>
//       <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
//         {/* Left Side - Signup Form */}
//         <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
//           <div className="max-w-md w-full">
//             <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Create an Account
//             </h2>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {/* FirstName Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="firstName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "First name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "First name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="First Name"
//                         className="authInput"
//                         onBlur={() => trigger("firstName")}
//                       />
//                     )}
//                   />
//                   {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
//                 </div>

//                 {/* Lastname Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="lastName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "Last name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "Last name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="Last Name"
//                         className="authInput"
//                         onBlur={() => trigger("lastName")}
//                       />
//                     )}
//                   />
//                   {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="email"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                       message: "Invalid email address"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type="email"
//                       placeholder="Email"
//                       className="authInput"
//                       onBlur={() => trigger("email")}
//                     />
//                   )}
//                 />
//                 {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//               </div>

//               {/* Phone Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="phoneNumber"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "Phone number is required" }}
//                   render={({ field }) => (
//                     <PhoneInput
//                       {...field}
//                       country={"ng"}
//                       inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
//                       buttonClass="!border-none !rounded-l-[12px]"
//                       onBlur={() => trigger("phoneNumber")}
//                     />
//                   )}
//                 />
//                 {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
//               </div>

//               {/* Password Input */}
//               <div className="mb-4 relative">
//                 <Controller
//                   name="password"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters long"
//                     },
//                     pattern: {
//                       value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                       message: "Password must contain uppercase, lowercase, number, and special character"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className="authInput"
//                       onBlur={() => trigger("password")}
//                     />
//                   )}
//                 />
//                 <button
//                   type="button"
//                   aria-label="Toggle password visibility"
//                   className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//               </div>

//               {/* Terms and conditions Link */}
//               <div className="text-left text-black-100 mb-4 text-sm md:text-base">
//                 By proceeding, you agree to the <a href="/terms" className="text-primary font-bold">Terms and Conditions</a>
//               </div>

//               {/* Signup Button */}
//               <button type="submit" className="button_v1 mb-4" disabled={loading || !allFieldsFilled}>
//                 {loading ? <BiLoaderCircle className="animate-spin text-center" /> : "Sign up"}
//               </button>
//             </form>

//             {/* Or Signup With */}
//             <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

//             {/* Social Signup Buttons */}
//             <SocialSignup />

//             {/* Login Link */}
//             <div className="text-left text-sm text-gray-500 mt-6">
//               Already have an account? <a href="#" className="text-primary font-bold" onClick={() => router.push("/")}>sign In</a>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Signup;









































// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "@/lib/axiosInstance";
// import { useForm, Controller } from "react-hook-form";
// import AuthLeft from "@/components/auth/AuthLeft";
// import { BiLoaderCircle } from "react-icons/bi";
// import SocialSignup from "@/components/auth/SocialSignup";

// interface SignupFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
// }

// const Signup: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
//   const router = useRouter();

//   const onSubmit = async (data: SignupFormData) => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.post('/signup', data);
//       toast.success(response.data.message || "Signup successful!");
//       localStorage.setItem("email", data.email);
//       router.push("/otp-verification");
//     } catch (error: any) {

//       toast.error(error.response?.data?.message || "Signup failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
//         {/* Left Side - Signup Form */}
//         <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
//           <div className="max-w-md w-full">
//             <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Create an Account
//             </h2>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {/* FirstName Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="firstName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "First name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "First name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="First Name"
//                         className="authInput"
//                       />
//                     )}
//                   />
//                   {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
//                 </div>

//                 {/* Lastname Input */}
//                 <div className="mb-4">
//                   <Controller
//                     name="lastName"
//                     control={control}
//                     defaultValue=""
//                     rules={{
//                       required: "Last name is required",
//                       pattern: {
//                         value: /^[A-Za-z]+$/,
//                         message: "Last name can only contain letters"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         type="text"
//                         placeholder="Last Name"
//                         className="authInput"
//                       />
//                     )}
//                   />
//                   {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="email"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                       message: "Invalid email address"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type="email"
//                       placeholder="Email"
//                       className="authInput"
//                     />
//                   )}
//                 />
//                 {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//               </div>

//               {/* Phone Input */}
//               <div className="mb-4">
//                 <Controller
//                   name="phoneNumber"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "Phone number is required" }}
//                   render={({ field }) => (
//                     <PhoneInput
//                       {...field}
//                       country={"ng"}
//                       inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
//                       buttonClass="!border-none !rounded-l-[12px]"
//                     />
//                   )}
//                 />
//                 {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
//               </div>

//               {/* Password Input */}
//               <div className="mb-4 relative">
//                 <Controller
//                   name="password"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters long"
//                     },
//                     pattern: {
//                       value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                       message: "Password must contain uppercase, lowercase, number, and special character"
//                     }
//                   }}
//                   render={({ field }) => (
//                     <input
//                       {...field}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className="authInput"
//                     />
//                   )}
//                 />
//                 <button
//                   type="button"
//                   aria-label="Toggle password visibility"
//                   className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//               </div>

//               {/* Terms and conditions Link */}
//               <div className="text-left text-black-100 mb-4 text-sm md:text-base">
//                 By proceeding, you agree to the <a href="/terms" className="text-primary font-bold">Terms and Conditions</a>
//               </div>

//               {/* Signup Button */}
//               <button type="submit" className="button_v1 mb-4" disabled={loading}>
//                 {loading ? <BiLoaderCircle className="animate-spin text-center" /> : "Sign up"}
//               </button>
//             </form>

//             {/* Or Signup With */}
//             <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

//             {/* Social Signup Buttons */}
//             <SocialSignup />

//             {/* Login Link */}
//             <div className="text-left text-sm text-gray-500 mt-6">
//               Already have an account? <a href="#" className="text-primary font-bold" onClick={() => router.push("/")}>sign In</a>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Signup;























// "use client";

// import { Facebook, Google, Apple } from "@/components/icons/Icons";
// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";
// import AuthLeft from "@/components/auth/AuthLeft";
// import axios from "axios";

// const Signup: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     password: ''
//   });
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await axios.post('https://api-eventparcel.onrender.com/api/v1/signup', {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         password: formData.password
//       });

//       toast.success('Registration successful!');
//       router.push('/dashboard');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
//         {/* Left Side - Signup Form */}
//         <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
//           <form onSubmit={handleSubmit} className="max-w-md w-full">
//             <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Create an Account
//             </h2>

//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="mb-4">
//                 <input
//                   type="text"
//                   placeholder="First name"
//                   className="authInput"
//                   value={formData.firstName}
//                   onChange={(e) => setFormData({...formData, firstName: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   placeholder="Last name"
//                   className="authInput"
//                   value={formData.lastName}
//                   onChange={(e) => setFormData({...formData, lastName: e.target.value})}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="mb-4">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="authInput"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <PhoneInput
//                 country={"ng"}
//                 value={formData.phoneNumber}
//                 onChange={(value) => setFormData({...formData, phoneNumber: value})}
//                 inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
//                 buttonClass="!border-none !rounded-l-[12px]"
//                 // required
//               />
//             </div>

//             <div className="mb-4 relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="authInput"
//                 value={formData.password}
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             <div className="text-left text-black-100 mb-4">
//               By proceeding, you agree to the <a href="#" className="text-primary font-bold">Terms and Conditions</a>
//             </div>

//             <button
//               type="submit"
//               className="button_v1 mb-4 w-full flex justify-center items-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <BiLoaderCircle className="animate-spin h-6 w-6" />
//               ) : (
//                 'Sign up'
//               )}
//             </button>

//             {/* ... rest of the component remains the same ... */}
//           </form>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Signup;








































// "use client";

// import { Facebook, Google, Apple } from "@/components/icons/Icons";
// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import Image from "next/image";
// import { useRouter } from "next-nprogress-bar";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import axiosInstance from "@/lib/axiosInstance";
// import AuthLeft from "@/components/AuthLeft";



// const Signup: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);


//   return (
//     <>
//       <div className="mt-12 md:mt-0 grid lg:grid-cols-2 min-h-screen">
//         {/* Left Side - Signup Form */}
//         <div className="flex items-center justify-center px-6 py-10 lg:mt-12">
//           <div className="max-w-md w-full">
//             <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black-100">
//               Create an Account
//             </h2>

//             <div className="grid md:grid-cols-2 gap-4">
//               {/* FirstName Input */}
//               <div className="mb-4">
//                 <input type="text" placeholder="firstName" className="authInput" />
//               </div>

//               {/* Lastname Input */}
//               <div className="mb-4">
//                 <input type="email" placeholder="lastName" className="authInput" />
//               </div>
//             </div>

//             {/* Email Input */}
//             <div className="mb-4">
//               <input type="email" placeholder="Email" className="authInput" />
//             </div>

//             {/* Phone Input */}
//             <div className="mb-4">
//               <PhoneInput
//                 country={"ng"}
//                 inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
//                 buttonClass="!border-none !rounded-l-[12px]"
//               />
//             </div>

//             {/* Password Input */}
//             <div className="mb-4 relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="authInput"
//               />
//               <button
//                 type="button"
//                 aria-label="Toggle password visibility"
//                 className="absolute right-3 top-[16px] text-gray-500 outline-none"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             {/* Terms and conditions Link */}
//             <div className="text-left text-black-100 mb-4">
//               By proceeding, you agree to the <a href="#" className="text-primary font-bold">Terms and Conditions</a>
//             </div>

//             {/* Signup Button */}
//             <button className="button_v1 mb-4 w-full">Sign up</button>

//             {/* Or Signup With */}
//             <div className="text-center text-gray-500 text-sm mb-4">Or sign up with</div>

//             {/* Social Signup Buttons */}
//             <div className="grid lg:grid-cols-3 gap-4">
//               <button className="authButton">
//                 <Google width={20} height={20} /> Google
//               </button>
//               <button className="authButton">
//                 <Facebook width={20} height={20} /> Facebook
//               </button>
//               <button className="authButton">
//                 <Apple width={20} height={20} /> Apple
//               </button>
//             </div>

//             {/* Login Link */}
//             <div className="text-left text-sm text-gray-500 mt-6">
//               Already have an account? <a href="#" className="text-primary font-bold">sign In</a>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Image & Carousel */}
//         <AuthLeft />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default Signup;
