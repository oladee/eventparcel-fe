"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import RightBar from "@/components/Rightbar";

const Page = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state only contains firstName, lastName, and email
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  // Error messages for each field
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Validate the entire form whenever formData or errors change
  useEffect(() => {
    const allFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    const noErrors = Object.values(errors).every((error) => error === "");
    setIsFormValid(allFilled && noErrors);
  }, [formData, errors]);

  // Field validation
  const validateField = (field: string, value: string): string => {
    if (field === "firstName" || field === "lastName") {
      if (!/^[A-Za-z\s]+$/.test(value))
        return `${
          field === "firstName" ? "First" : "Last"
        } name must only contain letters and spaces`;
      if (value.length < 2 || value.length > 50)
        return `${
          field === "firstName" ? "First" : "Last"
        } name must be between 2 and 50 characters`;
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email address";
    }
    return "";
  };

  // Handle change events and validate on the fly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  // Submit the form to the /add-cohost endpoint
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    // setLoading(true);
    // setTimeout(() => {
    //   setShowModal(true);
    // }, 3000);
    try {
      setLoading(true);
      const response = await axiosInstance.post("/add-cohost", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim()
      });
      console.log("Response:", response.data);
      setShowModal(true);
    } catch (error: any) {
      console.error("Error:", error);
      if (error.isAxiosError && !error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setErrors((prev) => ({ ...prev, [key]: serverErrors[key] }));
        });
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error(
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="bg-[#F9FAFB] !overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-screen overflow-y-auto no-scrollbar">
          <div className="mb-4 md:mb-12 text-center p-3 sm:p-0 space-y-3">
            <h1
              id="payment_deliveryHeader"
              className="text-2xl sm:text-3xl font-bold text-[#111827]"
            >
              Add a Co-host
            </h1>
            <p id="payment_deliveryDesc" className="gap-3">
              <span className="mr-2">
                Enter the name and email address of your co-host
              </span>
              <span
                onClick={() => setIsRightBarOpen(true)}
                className="px-2 text-sm cursor-pointer rounded-[200px] bg-[#ECB795] text-white"
              >
                !
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
          >
            <div>
              <div className="mb-5">
                <h2
                  id="paymentDetailsHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Co-host Details
                </h2>
              </div>
              <label
                htmlFor="accountNumber"
                className="block mb-2 font-semibold text-[#111827]"
                aria-required="true"
              >
                Co-host Name
              </label>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="accountName"
                  className="block mb-2 font-semibold text-[#111827]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`bg-primary mt-5 text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <BiLoaderCircle className="animate-spin mr-2" size={22} />
                ) : (
                  "Add Co-Host"
                )}
              </button>
            </div>

            <div className="bg-[#FFFF] py-4 flex justify-center absolute z-10 right-0 bottom-0 w-full">
              <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full">
                <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
                  Save for later
                </button>
                <button
                  type="submit"
                  disabled={true}
                  className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                    true ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <BiLoaderCircle className="animate-spin mr-2" size={22} />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </form>

          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
      </section>
      {showModal && (
        <ReusuableSuccess
          title="You've successfully added your co-host"
          subtitle="Co-host details have been saved successfully."
          route="/view-cohost"
          buttonText="Continue"
        />
      )}
    </>
  );
};

export default Page;
