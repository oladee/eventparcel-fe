"use client";

import { useState, useRef } from "react";
import EventSuccess from "@/components/EventSuccess";
import ImagePickerModal from "@/components/aboutEvent/ImagePickerModal";
import EventHeader from "@/components/aboutEvent/EventHeader";
import EventFormFields from "@/components/aboutEvent/EventFormFields";
import PersonalDetails from "@/components/aboutEvent/PersonalDetails";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";
import FormButtons2 from "@/components/aboutEvent/FormButtons2";
import EventSaveSuccess from "@/components/aboutEvent/EventSaveSuccess";
import { toast, ToastContainer } from "react-toastify";



// Dynamically import LocationPickerModal with SSR disabled.
const LocationPickerModal = dynamic(
  () => import("@/components/aboutEvent/LocationPickerModal"),
  { ssr: false }
);

const About: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccess2, setShowSuccess2] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for modals
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);

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

  // Handlers for input changes and validations
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateField = (id: string, value: any): string => {
    if (typeof value !== 'string' || !value.trim()) return "This field is required.";
    if (
      id === "email" &&
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
    )
      return "Enter a valid email address.";
    if (
      (id === "firstName" || id === "lastName") &&
      /[^a-zA-Z\s]/.test(value)
    )
      return "Name cannot include numbers or special characters.";
    if (id === "description" && value.length < 20)
      return "Description must be at least 20 characters.";
    return "";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };


// Helper function to convert 24-hour time (HH:mm) to 12-hour format (hh:mm AM/PM)
// const convertTo12Hour = (time24: string): string => {
//   const [hourStr, minute] = time24.split(":");
//   let hours = parseInt(hourStr, 10);
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12 || 12; // Convert hour '0' to '12'
//   return `${hours}:${minute} ${ampm}`;
// };


// Helper function to convert 24-hour time (HH:mm) to 12-hour format (hh:mm AM/PM) matching the regex
const convertTo12Hour = (time24: string): string => {
  const [hourStr, minute] = time24.split(":");
  let hours = parseInt(hourStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  // Convert hour '0' to '12'
  hours = hours % 12 || 12;
  // Pad hours with a leading zero if necessary
  const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${paddedHours}:${minute} ${ampm}`;
};


// API call triggered on clicking Continue
const handleContinue = async () => {
  // Validate all fields
  const newErrors = { ...errors };
  Object.keys(formData).forEach((key) => {
    if (key === "eventImage") {
      newErrors.eventImage = formData.eventImage ? "" : "Image is required.";
    } else {
      newErrors[key as keyof typeof formData] = validateField(
        key,
        formData[key as keyof typeof formData] as string
      );
    }
  });
  setErrors(newErrors);
  if (Object.values(newErrors).some((error) => error !== "")) return;

  setLoading(true);
  try {
    // Create FormData to match endpoint requirements
    const submissionData = new FormData();
    submissionData.append("eventName", formData.eventName);
    submissionData.append("eventDescription", formData.description);
    submissionData.append("date", formData.eventDate);

    // Convert eventTime if needed
    let formattedTime = formData.eventTime;
    // If time matches the 24-hour format (e.g., "22:28"), convert it.
    if (/^\d{2}:\d{2}$/.test(formData.eventTime)) {
      formattedTime = convertTo12Hour(formData.eventTime);
    }
    submissionData.append("time", formattedTime);

    submissionData.append("eventLocation", formData.location);
    submissionData.append("hostFirstName", formData.firstName);
    submissionData.append("hostLastName", formData.lastName);
    submissionData.append("hostEmail", formData.email);
    if (formData.eventImage) {
      submissionData.append("eventImgUrl", formData.eventImage);
    }

    const response = await axiosInstance.post("/add-event", submissionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Event created:", response.data);
    setShowSuccess(true);
  } catch (error) {
    console.error("Error creating event:", error);
  } finally {
    setLoading(false);
  }
};

// API call triggered on clicking Continue
const handleSaveLater = async () => {
  // Validate all fields
  const newErrors = { ...errors };
  Object.keys(formData).forEach((key) => {
    if (key === "eventImage") {
      newErrors.eventImage = formData.eventImage ? "" : "Image is required.";
    } else {
      newErrors[key as keyof typeof formData] = validateField(
        key,
        formData[key as keyof typeof formData] as string
      );
    }
  });
  setErrors(newErrors);
  if (Object.values(newErrors).some((error) => error !== "")) return;

  setLoading2(true);
  try {
    // Create FormData to match endpoint requirements
    const submissionData = new FormData();
    submissionData.append("eventName", formData.eventName);
    submissionData.append("eventDescription", formData.description);
    submissionData.append("date", formData.eventDate);

    // Convert eventTime if needed
    let formattedTime = formData.eventTime;
    // If time matches the 24-hour format (e.g., "22:28"), convert it.
    if (/^\d{2}:\d{2}$/.test(formData.eventTime)) {
      formattedTime = convertTo12Hour(formData.eventTime);
    }
    submissionData.append("time", formattedTime);

    submissionData.append("eventLocation", formData.location);
    submissionData.append("hostFirstName", formData.firstName);
    submissionData.append("hostLastName", formData.lastName);
    submissionData.append("hostEmail", formData.email);
    if (formData.eventImage) {
      submissionData.append("eventImgUrl", formData.eventImage);
    }

    const response = await axiosInstance.post("/add-event", submissionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Event created:", response.data);
    setShowSuccess2(true);
  } catch (error:any) {
    console.error("Error creating event:", error);
    toast.error(error.response?.data?.message);
  } finally {
    setLoading2(false);
  }
};




  // Image file handling
const handleBrowseClick = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setShowImagePickerModal(true);
      } else {
        fileInputRef.current?.click();
      }
    }
  };


  const handleSelectGallery = () => {
    fileInputRef.current?.removeAttribute("capture");
    fileInputRef.current?.click();
    setShowImagePickerModal(false);
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.setAttribute("capture", "environment");
    fileInputRef.current?.click();
    setShowImagePickerModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFormData({ ...formData, eventImage: file });
      setErrors({ ...errors, eventImage: "" });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFormData({ ...formData, eventImage: file });
      setErrors({ ...errors, eventImage: "" });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData({ ...formData, eventImage: null });
  };

  // Map location handler
  const handleMapLocationSelect = () => {
    setShowMapPickerModal(true);
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.description &&
    formData.location &&
    formData.eventName &&
    formData.eventTime &&
    formData.eventImage &&
    Object.values(errors).every((err) => err === "");

  return (
    <>
      {showImagePickerModal && (
        <ImagePickerModal
          onSelectGallery={handleSelectGallery}
          onTakePhoto={handleTakePhoto}
          onCancel={() => setShowImagePickerModal(false)}
        />
      )}
      {showMapPickerModal && (
        <LocationPickerModal
          onLocationSelect={(location) => {
            setFormData({ ...formData, location });
            setShowMapPickerModal(false);
          }}
          onCancel={() => setShowMapPickerModal(false)}
        />
      )}
      <div>{showSuccess && <EventSuccess />}</div>
      <div>{showSuccess2 && <EventSaveSuccess />}</div>
      <section className="bg-[#F9FAFB] mt-14 md:mt-10">
        <div className="py-8 lg:py-16 px-3 sm:px-4 mx-auto max-w-screen-md">
          <EventHeader />
          <form
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
            // onSubmit={handleSubmit}
            onSubmit={(e) => e.preventDefault()}
          >
            <EventFormFields
              formData={formData}
              errors={errors}
              selectedImage={selectedImage}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleBrowseClick={handleBrowseClick}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              handleRemoveImage={handleRemoveImage}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleMapLocationSelect={handleMapLocationSelect}
            />
            <PersonalDetails
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </form>
        </div>
        <FormButtons2
          isFormValid={!!isFormValid}
          onContinue={handleContinue}
          onContinue2={handleSaveLater}
          loading={loading}
          loading2={loading2}
        />
      </section>
      <ToastContainer />
    </>
  );
};

export default About;