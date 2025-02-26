"use client";


import { useState } from "react";
import GroupHeader from "./addGroup/GroupHeader";
import GroupFormFields from "./addGroup/GroupFormFields";
import GroupPrivacySelector from "./addGroup/GroupPrivacySelector";
import FormButton from "./addGroup/FormButton";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

interface AddGroupProps {
  setIsAddGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "noGroup" | "availGroup";
}

const AddGroup: React.FC<AddGroupProps> = ({ setIsAddGroupOpen, mode }) => {
  const eventId = localStorage.getItem("eventId");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventId: eventId,
    groupName: "",
    groupDescription: "",
    groupPrivacy: "private",
  });

  const [errors, setErrors] = useState({
    groupName: "",
    groupDescription: "",
  });

  const [touched, setTouched] = useState({
    groupName: false,
    groupDescription: false,
  });

  const validateField = (id: string, value: string) => {
    if (id === "groupName") {
      if (!value.trim()) return "Group name is required";
      if (value.length < 5) return "Group name must be at least 5 characters";
      if (value.length > 60) return "Group name must not exceed 60 characters";
    }
    if (id === "groupDescription") {
      if (value.length > 150) return "Description must not exceed 150 characters";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value),
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value),
    }));
  };

  const handlePrivacyChange = (privacyType: "general" | "private") => {
    setFormData((prev) => ({ ...prev, groupPrivacy: privacyType }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true)

    // Validate before submission
    const newErrors = {
      groupName: validateField("groupName", formData.groupName),
      groupDescription: validateField("groupDescription", formData.groupDescription),
    };

    setErrors(newErrors);
    setTouched({ groupName: true, groupDescription: true });

    if (newErrors.groupName || newErrors.groupDescription) return;

    try {
      const response = await axiosInstance.post("/add-group", formData);
      console.log("Group created:", response.data);
      setShowSuccess(true);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating group:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
        setLoading(false)
    }
  };

 const isFormValid = Boolean(
    formData.groupName.trim().length >= 5 &&
    formData.groupName.trim().length <= 60 &&
    (formData.groupDescription.trim().length === 0 || formData.groupDescription.trim().length <= 150) &&
    Object.values(errors).every((err) => !err)
  );

  return (
    <>
      {/* Success message handling */}
      {showSuccess && <p className="text-green-600 font-bold">Group created successfully!</p>}

      <form className="w-[320px] space-y-8 bg-white px-5 py-6 rounded-3xl shadow-lg" onSubmit={handleSubmit}>
        <GroupHeader mode={mode} onClose={() => setIsAddGroupOpen(false)} />
        <GroupFormFields
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
        />
        <GroupPrivacySelector
          groupPrivacy={formData.groupPrivacy as "private" | "general"}
          onPrivacyChange={handlePrivacyChange}
        />
        <FormButton isFormValid={isFormValid} onSubmit={() => handleSubmit} loading={loading} />
      </form>
      {}
    </>
  );
};

export default AddGroup;
