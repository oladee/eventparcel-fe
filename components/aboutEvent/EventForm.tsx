import React, { useState, useRef } from "react";
import EventSuccess from "../EventSuccess";
import FormField from "./FormField";
import EventImagePicker from "./EventImagePicker";
import PersonalDetails from "./PersonalDetails";

const EventForm: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    eventImage: null as File | null
  });

  const [errors, setErrors] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    eventImage: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateField = (id: string, value: string) => {
    if (!value.trim()) {
      return "This field is required.";
    }
    if (id === "email" && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
      return "Enter a valid email address.";
    }
    if ((id === "firstName" || id === "lastName") && /[^a-zA-Z\s]/.test(value)) {
      return "Name cannot include numbers or special characters.";
    }
    if (id === "description" && value.length < 20) {
      return "Description must be at least 20 characters.";
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = { ...errors };
    Object.keys(formData).forEach((key) => {
      newErrors[key as keyof typeof formData] = validateField(
        key,
        formData[key as keyof typeof formData] as string
      );
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return; // Stop form submission if errors exist
    }

    console.log("Form submitted:", formData);
    setShowSuccess(true);
  };

  return (
    <>
      <div>{showSuccess && <EventSuccess />}</div>
      <form className="space-y-8 bg-white p-8 rounded-3xl shadow-md" onSubmit={handleSubmit}>
        <FormField
          id="eventName"
          label="Event Name"
          value={formData.eventName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.eventName}
          placeholder="Enter event name"
        />
        <EventImagePicker fileInputRef={fileInputRef} formData={formData} setFormData={setFormData} setErrors={setErrors} />
        <FormField
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description}
          placeholder="Write description"
          textarea
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="eventDate"
            label="Date"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.eventDate}
          />
          <FormField
            id="eventTime"
            label="Time"
            type="time"
            value={formData.eventTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.eventTime}
          />
        </div>
        <FormField
          id="location"
          label="Event Location"
          value={formData.location}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.location}
          placeholder="Enter location of the event"
        />
        <PersonalDetails formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />
        <button type="submit" className="bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition">
          Submit
        </button>
      </form>
    </>
  );
};

export default EventForm;