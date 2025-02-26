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
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        eventId: eventId, 
        groupName: "",
        groupDescription: "",
        groupPrivacy: "private",
    });

    console.log(formData);

    const [errors, setErrors] = useState({
        groupName: "",
        groupDescription: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        setFormData((prev) => ({ 
            ...prev, 
            [id as keyof typeof formData]: value 
        }));
    
        setErrors((prev) => ({
            ...prev,
            [id as keyof typeof errors]: value.trim() ? "" : prev[id as keyof typeof errors]
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setErrors((prev) => ({
            ...prev,
            [id]: value.trim() ? "" : `${id === "groupName" ? "Group name" : "Description"} is required`
        }));
    };

    const handlePrivacyChange = (privacyType: "general" | "private") => {
        setFormData((prev) => ({ ...prev, groupPrivacy: privacyType }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.groupName.trim() || !formData.groupDescription.trim()) return;

        try {
            const response = await axiosInstance.post("/add-group", formData);
            console.log("Group created:", response.data);
            setShowSuccess(true);
            window.location.reload()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error creating group:", error.response?.data || error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    const isFormValid = !!(
        formData.groupName.trim() &&
        formData.groupDescription.trim() &&
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
                    touched={{
                        groupName: false,
                        groupDescription: false,
                    }}
                />
                <GroupPrivacySelector
                    groupPrivacy={formData.groupPrivacy as "private" | "general"}
                    onPrivacyChange={handlePrivacyChange}
                />
                <FormButton isFormValid={isFormValid} onSubmit={() => handleSubmit} />
            </form>
        </>
    );
};

export default AddGroup;
