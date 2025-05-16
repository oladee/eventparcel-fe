"use client"

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLeft from "@/components/auth/AuthLeft";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ResetSuccess from "@/components/auth/resetSuccess";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [passwordValidation, setPasswordValidation] = useState<boolean[]>([false, false, false, false, false]);
  const [showValidation, setShowValidation] = useState<boolean>(false); // New state for showing validation
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); 
  const [onSuccess, setOnSuccess] = useState<boolean>(false);

  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one number", regex: /[0-9]/ },
    { label: "At least one special character (!@#$%^&*)", regex: /[!@#$%^&*]/ }
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotPasswordEmail");
    if (!storedEmail) {
      router.push("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const validatePassword = (password: string) => {
    const validationResults = requirements.map((req) => req.regex.test(password));
    setPasswordValidation(validationResults);
    return validationResults.every(Boolean);
  };

  const handleChange = (name: string, value: string) => {
    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value) ? "" : "Password does not meet the required criteria."
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value === password ? "" : "Passwords do not match."
      }));
    }
  };

  const handlePasswordFocus = () => {
    setShowValidation(true);
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword || password !== confirmPassword) {
      toast.error("Passwords must match and cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/reset-password", {
        email,
        password,
        confirmPassword,
      });
      toast.success(response?.data?.message || "Password reset successful.");
      setOnSuccess(true);
      setTimeout(() => router.push("/adminLogin"), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = password &&
    confirmPassword &&
    password === confirmPassword &&
    passwordValidation.every(Boolean);

    return (
      <div>
        <main className="grid lg:grid-cols-2 min-h-screen mt-8 md:mt-4 lg:mt-0">
          {/* Left Side - Reset Password Form */}
          <div className="flex items-center justify-center px-6 py-10">
            <div className="max-w-md w-full">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-black-100">
                Reset Your Password
              </h2>
  
              {/* Password Input with Toggle */}
              <div className="mb-4 relative">
                <label htmlFor="reset-password" className="sr-only">
                  New Password
                </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reset-password"
                    placeholder="New Password"
                    className="authInput w-full pr-10" // Added pr-10 for icon spacing
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={handlePasswordFocus}
                    required
                    />
                  <button
                    type="button"
                    className="absolute right-3 top-7 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                {errors.password && (
                  <p className="text-red-500 text-sm" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>
  
              {/* Password Requirements */}
              {showValidation && (
                <div className="text-sm mb-4">
                  <ul className="list-disc pl-5">
                    {requirements.map((req, index) => (
                      <li
                        key={index}
                        className={passwordValidation[index] ? "text-green-500" : "text-red-500"}
                      >
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
  
              {/* Confirm Password Input with Toggle */}
              <div className="mb-4 relative">
                <label htmlFor="reset-confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="reset-confirm-password"
                  placeholder="Confirm Password"
                  className="authInput w-full pr-10"
                  value={confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-7 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
  
              {/* Reset Button */}
              <button
                className={`button_v1 mb-4 w-full flex justify-center items-center ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleResetPassword}
                disabled={!isFormValid || loading}
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
            </div>
          {onSuccess && <ResetSuccess />}
          </div>
          {/* Right Side - Image */}
          <AuthLeft />
        </main>
        <ToastContainer />
      </div>
    );
};

export default ResetPassword;