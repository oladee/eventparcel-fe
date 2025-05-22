"use client";

import React, { useEffect, useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import PersonalDetails from "@/components/aboutEvent/PersonalDetails";
import ImagePickerModal from "@/components/aboutEvent/ImagePickerModal";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { convertTo12Hour } from "@/utils/timeUtils";
import Container from "../Container";
import FormButtons3 from "./FormButton3";
import EventFormFields2 from "./EventFormFields2";
import { trackEvent } from "@/lib/mixpanel";

interface UpdateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
}

const UpdateEventModal: React.FC<UpdateEventModalProps> = ({
  isOpen,
  onClose,
  eventData
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: new Date(),
    eventTime: new Date(),
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    numberOfGroups: "",
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
    numberOfGroups: "",
    eventImage: ""
  });

  //   useEffect(() => {
  //     const authToken = localStorage.getItem("authToken");
  //     setIsAuthenticated(!!authToken);

  //     if (eventData) {
  //       const {
  //         eventName = "",
  //         date = new Date().toISOString(),
  //         time = "12:00 PM",
  //         eventLocation = "",
  //         hostFirstName = "",
  //         hostLastName = "",
  //         hostEmail = "",
  //         eventDescription = "",
  //         numberOfGroups = "1",
  //         eventImgUrl = null
  //       } = eventData;

  //       setFormData({
  //         eventName,
  //         eventDate: new Date(date),
  //         eventTime: parseTimeString(time),
  //         location: eventLocation,
  //         firstName: hostFirstName,
  //         lastName: hostLastName,
  //         email: hostEmail,
  //         description: eventDescription,
  //         numberOfGroups: numberOfGroups.toString(),
  //         eventImage: null
  //       });
  //       setSelectedImage(eventImgUrl);
  //     }
  //   }, [eventData]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
    if (eventData) {
      const {
        eventName = "",
        date = new Date().toISOString().split("T")[0], // Ensures date is in 'YYYY-MM-DD' format
        time = "12:00 PM",
        eventLocation = "",
        hostFirstName = "",
        hostLastName = "",
        hostEmail = "",
        eventDescription = "",
        numberOfGroups = "1",
        eventImgUrl = null
      } = eventData;

      setFormData({
        eventName,
        eventDate: new Date(date), // Ensures a valid date object
        eventTime: parseTimeString(time), // Parse time correctly
        location: eventLocation,
        firstName: hostFirstName,
        lastName: hostLastName,
        email: hostEmail,
        description: eventDescription,
        numberOfGroups: numberOfGroups?.toString() ?? "0",
        eventImage: null
      });

      setSelectedImage(eventImgUrl);
    }
  }, [eventData]);

  const parseTimeString = (timeString: string): Date => {
    try {
      const [time, modifier] = timeString.split(" ");
      let [hours] = time.split(":");
      const [minutes] = time.split(":");

      if (modifier === "PM" && parseInt(hours) !== 12) {
        hours = (parseInt(hours) + 12).toString();
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      return new Date(`1970-01-01T${hours.padStart(2, "0")}:${minutes}:00`);
    } catch (error) {
      console.error("Error parsing time string:", error);
      return new Date(); // Fallback to current time
    }
  };

  const validateField = (id: string, value: any): string => {
    if (
      isAuthenticated &&
      (id === "firstName" || id === "lastName" || id === "email")
    ) {
      return "";
    }

    if (id === "eventDate" || id === "eventTime") {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        return "This field is required.";
      }
    } else if (id === "numberOfGroups") {
      if (!value.trim() || isNaN(Number(value))) {
        return "Enter a valid number.";
      }
      const numValue = Number(value);
      if (numValue < 1 || numValue > 99) {
        return "Number must be between 1 and 99.";
      }
    } else if (
      id !== "description" &&
      (typeof value !== "string" || !value.trim())
    ) {
      return "This field is required.";
    }

    if (
      id === "email" &&
      value &&
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
    ) {
      return "Enter a valid email address.";
    }

    if (
      (id === "firstName" || id === "lastName") &&
      /[^a-zA-Z\s]/.test(value)
    ) {
      return "Name cannot include numbers or special characters.";
    }

    if (id === "description") {
      if (value.trim() && value.length < 5)
        return "Description must be at least 5 characters.";
      if (value.length > 300)
        return "Description must have a maximum of 300 characters.";
    }

    if (id === "eventName") {
      if (value.length < 5) return "Event name must be at least 5 characters.";
      if (value.length > 60) return "Event name must not exceed 60 characters.";
    }

    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  //   const handleDateChange = (date: Date | null, field: string) => {
  //     if (date) {
  //       setFormData((prev) => ({ ...prev, [field]: date }));
  //       setErrors((prev) => ({ ...prev, [field]: "" }));
  //     }
  //   };

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "This field is required." }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setFormData({ ...formData, eventImage: file });
    }
  };

  const handleSubmit = async (isSaveLater: boolean = false) => {
      trackEvent("Edit An Event - Started", {
        source: "dashboard event page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard event page",
        event_id: eventData?._id,
        event_name: formData.eventName,
      });
      
    const newErrors = { ...errors };
    Object.keys(formData).forEach((key) => {
      if (key !== "eventImage") {
        newErrors[key as keyof typeof formData] = validateField(
          key,
          formData[key as keyof typeof formData]
        );
      }
    });

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) return;

    const submissionData = new FormData();
    submissionData.append("eventName", formData.eventName);
    submissionData.append("eventDescription", formData.description);
    submissionData.append(
      "date",
      formData.eventDate.toISOString().split("T")[0]
    );
    submissionData.append(
      "time",
      convertTo12Hour(formData.eventTime.toTimeString().split(" ")[0])
    );
    submissionData.append("eventLocation", formData.location);
    submissionData.append("hostFirstName", formData.firstName);
    submissionData.append("hostLastName", formData.lastName);
    submissionData.append("hostEmail", formData.email);
    if (formData.eventImage) {
      submissionData.append("eventImgUrl", formData.eventImage);
    }

    try {
      isSaveLater ? setLoading2(true) : setLoading(true);
      const response = await axiosInstance.put(
        `/update-event/${eventData._id}`,
        submissionData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("eventData", JSON.stringify(response.data));
      window.dispatchEvent(new Event("refreshEvents"));
      toast.success("Event updated successfully!");

      trackEvent("Edit An Event - End", {
        source: "dashboard event page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard event page",
        event_id: eventData?._id,
        event_name: formData.eventName,
        status: "Successfull"
      });
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update event");
      trackEvent("Edit An Event - End", {
        source: "dashboard event page",
        timestamp: new Date().toISOString(),
        page_name: "dashboard event page",
        event_id: eventData?._id,
        event_name: formData.eventName,
        status: "Failed"
      });
    } finally {
      isSaveLater ? setLoading2(false) : setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Container>
      <ToastContainer />
      <div className="fixed h-screen overflow-y-auto inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center md:p-11">
        <div className="relative bg-white w-full h-full overflow-y-auto no-scrollbar z-[99] max-w-md md:rounded-t-[35px] shadow-lg md:rounded-xl md:max-w-2xl">
          <div className="sticky top-0 right-0 !z-50 flex w-full justify-between items-center mb-4 p-4 bg-white border-b">
            <h2 className="text-lg font-bold">Update Event</h2>
            <button onClick={onClose} className="text-xl">
              <AiOutlineClose />
            </button>
          </div>

          <div className="relative space-y-8 p-5">
            <EventFormFields2
              formData={formData}
              errors={errors}
              selectedImage={selectedImage}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleBrowseClick={() => setShowImagePickerModal(true)}
              handleDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                setSelectedImage(URL.createObjectURL(file));
                setFormData({ ...formData, eventImage: file });
              }}
              handleDragOver={(e) => e.preventDefault()}
              handleRemoveImage={() => {
                setSelectedImage(null);
                setFormData({ ...formData, eventImage: null });
              }}
              handleDateChange={handleDateChange}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleMapLocationSelect={() => {}}
            />

            {!isAuthenticated && (
              <PersonalDetails
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>

          <div className="sticky bottom-0 w-full bg-white p-5 border-t border-gray-200">
            <FormButtons3
              isFormValid={Object.values(errors).every((err) => err === "")}
              onContinue={() => handleSubmit()}
              onContinue2={() => handleSubmit(true)}
              loading={loading}
              loading2={loading2}
            />
          </div>
          {showImagePickerModal && (
            <ImagePickerModal
              onSelectGallery={() => {
                fileInputRef.current?.click();
                setShowImagePickerModal(false);
              }}
              onTakePhoto={() => {
                fileInputRef.current?.setAttribute("capture", "environment");
                fileInputRef.current?.click();
                setShowImagePickerModal(false);
              }}
              onCancel={() => setShowImagePickerModal(false)}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default UpdateEventModal;

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import EventFormFields from "@/components/aboutEvent/EventFormFields";
// import PersonalDetails from "@/components/aboutEvent/PersonalDetails";
// import ImagePickerModal from "@/components/aboutEvent/ImagePickerModal";
// import { toast, ToastContainer } from "react-toastify";
// import axiosInstance from "@/lib/axiosInstance";
// // import DatePicker from "react-datepicker";
// import { convertTo12Hour } from "@/utils/timeUtils";
// import Container from "../Container";
// import FormButtons3 from "./FormButton3";

// interface UpdateEventModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventData: any;
// }

// const UpdateEventModal: React.FC<UpdateEventModalProps> = ({
//   isOpen,
//   onClose,
//   eventData
// }) => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [showImagePickerModal, setShowImagePickerModal] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);
//   const [loading2, setLoading2] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const [formData, setFormData] = useState({
//     eventName: "",
//     eventDate: new Date(),
//     eventTime: new Date(),
//     location: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     description: "",
//     numberOfGroups: "",
//     eventImage: null as File | null
//   });

//   const [errors, setErrors] = useState({
//     eventName: "",
//     eventDate: "",
//     eventTime: "",
//     location: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     description: "",
//     numberOfGroups: "",
//     eventImage: ""
//   });

//   useEffect(() => {
//     const authToken = localStorage.getItem("authToken");
//     setIsAuthenticated(!!authToken);

//     if (eventData) {
//       const {
//         eventName = "",
//         date = new Date().toISOString(),
//         time = "12:00 PM",
//         eventLocation = "",
//         hostFirstName = "",
//         hostLastName = "",
//         hostEmail = "",
//         eventDescription = "",
//         numberOfGroups = "1",
//         eventImgUrl = null
//       } = eventData;

//       setFormData({
//         eventName,
//         eventDate: new Date(date),
//         eventTime: parseTimeString(time),
//         location: eventLocation,
//         firstName: hostFirstName,
//         lastName: hostLastName,
//         email: hostEmail,
//         description: eventDescription,
//         numberOfGroups: numberOfGroups.toString(),
//         eventImage: null
//       });
//       setSelectedImage(eventImgUrl);
//     }
//   }, [eventData]);

//   const parseTimeString = (timeString: string): Date => {
//     try {
//       const [time, modifier] = timeString.split(" ");
//       let [hours, minutes] = time.split(":");

//       if (modifier === "PM" && parseInt(hours) !== 12) {
//         hours = (parseInt(hours) + 12).toString();
//       }
//       if (modifier === "AM" && hours === "12") {
//         hours = "00";
//       }

//       return new Date(`1970-01-01T${hours.padStart(2, "0")}:${minutes}:00`);
//     } catch (error) {
//       console.error("Error parsing time string:", error);
//       return new Date(); // Fallback to current time
//     }
//   };

//   const validateField = (id: string, value: any): string => {
//     if (
//       isAuthenticated &&
//       (id === "firstName" || id === "lastName" || id === "email")
//     ) {
//       return "";
//     }

//     if (id === "eventDate" || id === "eventTime") {
//       if (!(value instanceof Date) || isNaN(value.getTime())) {
//         return "This field is required.";
//       }
//     } else if (id === "numberOfGroups") {
//       if (!value.trim() || isNaN(Number(value))) {
//         return "Enter a valid number.";
//       }
//       const numValue = Number(value);
//       if (numValue < 1 || numValue > 99) {
//         return "Number must be between 1 and 99.";
//       }
//     } else if (
//       id !== "description" &&
//       (typeof value !== "string" || !value.trim())
//     ) {
//       return "This field is required.";
//     }

//     if (
//       id === "email" &&
//       value &&
//       !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
//     ) {
//       return "Enter a valid email address.";
//     }

//     if (
//       (id === "firstName" || id === "lastName") &&
//       /[^a-zA-Z\s]/.test(value)
//     ) {
//       return "Name cannot include numbers or special characters.";
//     }

//     if (id === "description") {
//       if (value.trim() && value.length < 5)
//         return "Description must be at least 5 characters.";
//       if (value.length > 300)
//         return "Description must have a maximum of 300 characters.";
//     }

//     if (id === "eventName") {
//       if (value.length < 5) return "Event name must be at least 5 characters.";
//       if (value.length > 60) return "Event name must not exceed 60 characters.";
//     }

//     return "";
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//     setErrors({ ...errors, [e.target.id]: "" });
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
//   };

//   const handleDateChange = (date: Date | null, field: string) => {
//     if (date) {
//       setFormData((prev) => ({ ...prev, [field]: date }));
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setSelectedImage(URL.createObjectURL(file));
//       setFormData({ ...formData, eventImage: file });
//     }
//   };

//   const handleSubmit = async (isSaveLater: boolean = false) => {
//     const newErrors = { ...errors };
//     Object.keys(formData).forEach((key) => {
//       if (key !== "eventImage") {
//         newErrors[key as keyof typeof formData] = validateField(
//           key,
//           formData[key as keyof typeof formData]
//         );
//       }
//     });

//     setErrors(newErrors);
//     if (Object.values(newErrors).some((error) => error !== "")) return;

//     const submissionData = new FormData();
//     submissionData.append("eventName", formData.eventName);
//     submissionData.append("eventDescription", formData.description);
//     submissionData.append(
//       "date",
//       formData.eventDate.toISOString().split("T")[0]
//     );
//     submissionData.append(
//       "time",
//       convertTo12Hour(formData.eventTime.toTimeString().split(" ")[0])
//     );
//     submissionData.append("eventLocation", formData.location);
//     submissionData.append("hostFirstName", formData.firstName);
//     submissionData.append("hostLastName", formData.lastName);
//     submissionData.append("hostEmail", formData.email);
//     if (formData.eventImage) {
//       submissionData.append("eventImgUrl", formData.eventImage);
//     }

//     try {
//       isSaveLater ? setLoading2(true) : setLoading(true);
//       const response = await axiosInstance.put(
//         `/update-event/${eventData._id}`,
//         submissionData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       localStorage.setItem("eventData", JSON.stringify(response.data));
//       window.dispatchEvent(new Event("refreshEvents"));
//       toast.success("Event updated successfully!");
//       setTimeout(() => {
//         onClose();
//       }, 3000);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to update event");
//     } finally {
//       isSaveLater ? setLoading2(false) : setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <Container>
//       <ToastContainer />
//       <div className="fixed h-screen overflow-y-auto inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center md:p-11">
//         <div className="relative bg-white w-full h-full overflow-y-auto no-scrollbar z-[99] max-w-md md:rounded-t-[35px] shadow-lg md:rounded-xl md:max-w-2xl">
//           <div className="sticky top-0 right-0 !z-50 flex w-full justify-between items-center mb-4 p-4 bg-white border-b">
//             <h2 className="text-lg font-bold">Update Event</h2>
//             <button onClick={onClose} className="text-xl">
//               <AiOutlineClose />
//             </button>
//           </div>

//           <div className="relative space-y-8 p-5">
//             <EventFormFields
//               formData={formData}
//               errors={errors}
//               selectedImage={selectedImage}
//               handleChange={handleChange}
//               handleBlur={handleBlur}
//               handleBrowseClick={() => setShowImagePickerModal(true)}
//               handleDrop={(e) => {
//                 e.preventDefault();
//                 const file = e.dataTransfer.files[0];
//                 setSelectedImage(URL.createObjectURL(file));
//                 setFormData({ ...formData, eventImage: file });
//               }}
//               handleDragOver={(e) => e.preventDefault()}
//               handleRemoveImage={() => {
//                 setSelectedImage(null);
//                 setFormData({ ...formData, eventImage: null });
//               }}
//               handleDateChange={handleDateChange}
//               fileInputRef={fileInputRef}
//               handleFileChange={handleFileChange}
//               handleMapLocationSelect={() => {}}
//             />

//             {!isAuthenticated && (
//               <PersonalDetails
//                 formData={formData}
//                 errors={errors}
//                 handleChange={handleChange}
//                 handleBlur={handleBlur}
//                 isAuthenticated={isAuthenticated}
//               />
//             )}

//            {/* <div className="bg-black-100 h-max fixed buttom-0">
//            <FormButtons2
//               isFormValid={Object.values(errors).every((err) => err === "")}
//               onContinue={() => handleSubmit()}
//               onContinue2={() => handleSubmit(true)}
//               loading={loading}
//               loading2={loading2}
//             />
//            </div> */}
//           </div>

//             <div className="sticky bottom-0 w-full bg-white p-5 border-t border-gray-200">
//                 <FormButtons3
//                 isFormValid={Object.values(errors).every((err) => err === "")}
//                 onContinue={() => handleSubmit()}
//                 onContinue2={() => handleSubmit(true)}
//                 loading={loading}
//                 loading2={loading2}
//                 />
//      </div>
//           {showImagePickerModal && (
//             <ImagePickerModal
//               onSelectGallery={() => {
//                 fileInputRef.current?.click();
//                 setShowImagePickerModal(false);
//               }}
//               onTakePhoto={() => {
//                 fileInputRef.current?.setAttribute("capture", "environment");
//                 fileInputRef.current?.click();
//                 setShowImagePickerModal(false);
//               }}
//               onCancel={() => setShowImagePickerModal(false)}
//             />
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default UpdateEventModal;
