"use client";

import { useEffect, useState } from "react";
import GroupHeader from "./addGroup/GroupHeader";
import GroupFormFields from "./addGroup/GroupFormFields";
import GroupPrivacySelector from "./addGroup/GroupPrivacySelector";
import FormButton from "./addGroup/FormButton";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { Group } from "@/app/interface/Group";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { trackEvent } from "@/lib/mixpanel";

interface AddGroupProps {
  setIsAddGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "noGroup" | "availGroup";
  selectedGroup?: Group | null;
}

const AddGroup: React.FC<AddGroupProps> = ({
  setIsAddGroupOpen,
  mode,
  selectedGroup
}) => {
  const eventId = localStorage.getItem("eventId");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [formData, setFormData] = useState({
    eventId: eventId,
    groupName: selectedGroup?.groupName || "",
    groupDescription: selectedGroup?.groupDescription || "",
    groupPrivacy: selectedGroup?.groupPrivacy.toLocaleLowerCase() || "private",
    groupCurrency: selectedGroup?.groupCurrency || ""
  });

  const [errors, setErrors] = useState({
    groupName: "",
    groupDescription: ""
  });

  const [touched, setTouched] = useState({
    groupName: false,
    groupDescription: false
  });

  useEffect(() => {
  localStorage.removeItem("redirectBackToCreateGroup");
}, []);

  const validateField = (id: string, value: string) => {
    if (id === "groupName") {
      if (!value.trim()) return "Group name is required";
      if (value.length < 5) return "Group name must be at least 5 characters";
      if (value.length > 60) return "Group name must not exceed 60 characters";
    }
    if (id === "groupDescription") {
      if (value.length > 150)
        return "Description must not exceed 150 characters";
    }
    if (id === "groupCurrency") {
      if (!value || value === "Select Currency")
        return "Please select a currency";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value)
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [id]: true
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value)
    }));
  };

  const handlePrivacyChange = (privacyType: "general" | "private") => {
    setFormData((prev) => ({ ...prev, groupPrivacy: privacyType }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedGroup) {
      trackEvent("Edit Group Started", {
        source: "new-group page",
        timestamp: new Date().toISOString(),
        page_name: "New-group page"
      });
    } else {
      trackEvent("New Group Creation Started", {
        source: "new-group page",
        timestamp: new Date().toISOString(),
        page_name: "New-group page"
      });
    }

    setLoading(true);

    // Validate before submission
    const newErrors = {
      groupName: validateField("groupName", formData.groupName),
      groupDescription: validateField(
        "groupDescription",
        formData.groupDescription
      )
    };

    setErrors(newErrors);
    setTouched({ groupName: true, groupDescription: true });

    if (newErrors.groupName || newErrors.groupDescription) return;

    const formDataToSend = new FormData();

    formDataToSend.append("groupName", formData.groupName);
    formDataToSend.append("groupDescription", formData.groupDescription);
    formDataToSend.append("groupPrivacy", formData.groupPrivacy.toLowerCase());
    formDataToSend.append("groupCurrency", formData.groupCurrency);

    for (const [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      if (selectedGroup) {
        const response = await axiosInstance.put(
          `/update-group/${selectedGroup._id}`,
          formDataToSend
        );

        trackEvent("Group Edit Completed", {
          source: "event-creation page",
          timestamp: new Date().toISOString(),
          page_name: "new-group page",
          group_Id: response.data.data._id,
          group_name: response.data.data.groupName,
          currency_type: response.data.data.groupCurrency,
          group_type: response.data.data.groupPrivacy,
          status: "Successful"
        });
      } else {
        const response = await axiosInstance.post("/add-group", formData);
        console.log("add group", response.data.data);

        trackEvent("New Group Creation Completed", {
          source: "event-creation page",
          timestamp: new Date().toISOString(),
          page_name: "new-group page",
          group_Id: response.data.data._id,
          group_name: response.data.data.groupName,
          currency_type: response.data.data.groupCurrency,
          group_type: response.data.data.groupPrivacy,
          status: "Successful"
        });
      }

      toast.success(
        `Group ${selectedGroup ? "updated" : "created"} successfully `,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light"
        }
      );

      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred.";
        setError(errorMessage);

        if (selectedGroup) {
          const failedGroupName = formData.groupName;
          const failedCurrency = formData.groupCurrency;
          const failedPrivacy = formData.groupPrivacy;

          trackEvent("Group Edit Failed", {
            source: "event-creation page",
            timestamp: new Date().toISOString(),
            page_name: "new-group page",
            group_name: failedGroupName,
            currency_type: failedCurrency,
            group_type: failedPrivacy,
            status: "Failed"
          });
        } else {
          const failedGroupName = formData.groupName;
          const failedCurrency = formData.groupCurrency;
          const failedPrivacy = formData.groupPrivacy;

          trackEvent("New Group Creation Failed", {
            source: "event-creation page",
            timestamp: new Date().toISOString(),
            page_name: "new-group page",
            group_name: failedGroupName,
            currency_type: failedCurrency,
            group_type: failedPrivacy,
            status: "Failed"
          });
        }

        // Show toast notification
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Boolean(
    formData.groupName.trim().length >= 5 &&
      formData.groupName.trim().length <= 60 &&
      (formData.groupDescription.trim().length === 0 ||
        formData.groupDescription.trim().length <= 150) &&
      Object.values(errors).every((err) => !err) &&
      formData.groupCurrency &&
      formData.groupCurrency !== "Select Currency"
  );

  return (
    <>
      <ToastContainer />

      <form
        className="w-[320px] h-[545px] space-y-4 bg-[#FFFFFF] px-5 py-6 rounded-3xl"
        onSubmit={handleSubmit}
      >
        <GroupHeader mode={mode} onClose={() => setIsAddGroupOpen(false)} />
        <GroupFormFields
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
        />
        <GroupPrivacySelector
          groupPrivacy={formData.groupPrivacy as "Private" | "General"}
          onPrivacyChange={handlePrivacyChange}
        />
        <FormButton
          isFormValid={isFormValid}
          onSubmit={() => handleSubmit}
          loading={loading}
          mode={mode}
        />
      </form>
    </>
  );
};

export default AddGroup;
