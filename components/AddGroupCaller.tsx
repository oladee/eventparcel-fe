"use client";

import Image from "next/image";
import { useState } from "react";

interface AddGroupProps {
  setIsAddGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "noGroup" | "availGroup";
}

const AddGroup: React.FC<AddGroupProps> = ({ setIsAddGroupOpen, mode }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  console.log(showSuccess);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "private"
  });

  const [errors, setErrors] = useState({
    name: "",
    description: ""
  });

  const [touched, setTouched] = useState({
    name: false,
    description: false
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user starts typing after blur
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Handle blur to validate fields
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));

    // If the field is empty, show an error
    if (value.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        [id]: `${id === "name" ? "Group name" : "Description"} is required`
      }));
    }
  };

  // Handle privacy selection
  const handlePrivacyChange = (privacyType: "general" | "private") => {
    setFormData((prev) => ({ ...prev, privacy: privacyType }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowSuccess(true);
  };

  // Form validation
  const isFormValid =
    formData.name.trim() &&
    formData.description.trim() &&
    Object.values(errors).every((err) => err === "");

  return (
    <form
      className="w-[320px] h-auto space-y-8 bg-[#FFFFFF] px-5 py-6 rounded-3xl shadow-lg"
      onSubmit={handleSubmit}
    >
      {/* Header */}
      <div>
        <div className="flex justify-between">
          <span className="block mb-2 font-general text-xl text-[#111827] font-semibold">
            New Group
          </span>
          {mode === "availGroup" && (
            <div
              onClick={() => setIsAddGroupOpen(false)}
              className="font-general text-gray-600 cursor-pointer"
            >
              X
            </div>
          )}
        </div>
        <span className="font-general font-medium text-sm text-[#718096]">
          Create a group for specific guests
        </span>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-14 shadow-sm bg-gray-50 border rounded-xl border-gray-300 text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
          placeholder="Group name"
          required
        />
        {touched.name && errors.name && (
          <p className="flex justify-start text-xs text-red-500">
            {errors.name}
          </p>
        )}

        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Group description"
          className="h-[120px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
          required
        />
        {touched.description && errors.description && (
          <p className="flex justify-start text-xs text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      {/* Group Privacy Selection */}
      <div className="flex flex-col gap-3 mt-4">
        <span className=" flex justify-start font-general text-base font-semibold text-[#111827]">
          Select group privacy
        </span>
        <div className="flex gap-14 mb-3">
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => handlePrivacyChange("general")}
          >
            <Image
              src={
                formData.privacy === "general"
                  ? "/images/check.png"
                  : "/images/unchecked.png"
              }
              alt="check"
              width={20}
              height={20}
            />
            <span className="font-general font-medium text-base text-[#111827]">
              {" "}
              General{" "}
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => handlePrivacyChange("private")}
          >
            <Image
              src={
                formData.privacy === "private"
                  ? "/images/check.png"
                  : "/images/unchecked.png"
              }
              alt="check"
              width={20}
              height={20}
            />
            <span className="font-general font-medium text-base text-[#111827]">
              {" "}
              Private{" "}
            </span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`bg-[#751423] text-white text-sm py-3 px-3 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-general ${
          !isFormValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Continue Group
      </button>
    </form>
  );
};

export default AddGroup;
