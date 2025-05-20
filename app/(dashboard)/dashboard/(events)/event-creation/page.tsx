"use client";
import { Suspense, useState, useRef, useEffect } from "react";
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
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/dashboard/Container";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/mixpanel";

// Dynamically import LocationPickerModal with SSR disabled.
const LocationPickerModal = dynamic(
  () => import("@/components/aboutEvent/LocationPickerModal"),
  { ssr: false }
);

interface FormData {
  eventName: string;
  eventDate: Date | null;
  eventTime: Date | null;
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfGroups: string;
  description: string;
  eventImage: File | null;
}

interface Errors {
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  numberOfGroups: string;
  eventImage: string;
}

const PageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccess2, setShowSuccess2] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for modals
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
    const pathname = usePathname();

  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    eventDate: new Date(),
    eventTime: new Date(),
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    numberOfGroups: "",
    eventImage: null
  });

  const [errors, setErrors] = useState<Errors>({
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
  
  useEffect(() => {
    Cookies.remove("redirectAfterLogin");
  }, []);

  useEffect(() => {
    const redirect = Cookies.get("redirectAfterLogin");
    if (redirect === "co-host") {
      const userConfirmed = window.confirm(
        "Do you want to continue co-host creation?"
      );
      if (userConfirmed) {
        router.push("/add-cohost");
      } else {
        Cookies.remove("redirectAfterLogin");
      }
    }
  }, [router]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authToken in localStorage
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken); // Set to true if authToken exists, false otherwise
  }, []);

  // Check for token in URL using useSearchParams
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = searchParams.get("token");
      if (token) {
        localStorage.setItem("authToken", token);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Check for authToken in localStorage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);

      // Consume the profile endpoint
      const fetchUserProfile = async () => {
        try {
          const response = await axiosInstance.post("/profile-details", {
            token: authToken
          });
          // Save the response to localStorage as the logged-in user
          localStorage.setItem("loggedInUser", JSON.stringify(response.data));
          localStorage.setItem("loggedInUserEmail", response.data.email)
          console.log("User profile fetched successfully:", response.data);
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          toast.error(
            error.response?.data?.message || "Failed to fetch user profile."
          );
        }
      };

      fetchUserProfile();
    }
  }, [router]);

  // Handlers for input changes and validations
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
  
    if (id === "numberOfGroups" && value.startsWith("-")) {
      return; // Prevent negative values
    }
  
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const validateField = (id: string, value: any): string => {
    // Skip personal details validations if user is authenticated
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
      const trimmed = value.toString().trim();
    
      // If user hasn't entered anything, don't treat it as an error
      if (!trimmed) {
        return "";
      }
      // Must be digits only
      if (!/^\d+$/.test(trimmed)) {
        return "Enter a valid number.";
      }
      const numValue = Number(trimmed);
      // Enforce range 1–99
      if (numValue < 1 || numValue > 99) {
        return "Number must be between 1 and 99.";
      }
      return "";
    }
     else if (
      id !== "description" &&
      (typeof value !== "string" || !value.trim())
    ) {
      return "This field is required.";
    }

    if (
      id === "email" &&
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

    if (id === "description" && value.trim() && value.length < 5) {
      return "Description must be at least 5 characters.";
    }

    if (id === "description" && value.length > 300) {
      return "Description must have a maximum of 300 characters.";
    }

    if (id === "eventName" && value.length < 5) {
      return "Event name must be at least 5 characters.";
    }

    if (id === "eventName" && value.length > 60) {
      return "Event name must not exceed 60 characters.";
    }

    return "";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

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

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "This field is required." }));
    }
  };

  // API call triggered on clicking Continue
  const handleContinue = async () => {

    trackEvent("New Event Creation Started", {
      source: "event-creation page",
      timestamp: new Date().toISOString(),
      page_name: "Event-creation page",
    });
    
    const newErrors = { ...errors };
    Object.keys(formData).forEach((key) => {
      if (key !== "eventImage") {
        // Remove eventImage validation
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
      submissionData.append(
        "date",
        formData.eventDate?.toISOString().split("T")[0] || ""
      );

      // Convert eventTime if needed
      const formattedTime = formData.eventTime
        ? convertTo12Hour(formData.eventTime.toISOString().split("T")[1])
        : "";
      submissionData.append("time", formattedTime);

      submissionData.append("eventLocation", formData.location);
      submissionData.append("hostFirstName", formData.firstName);
      submissionData.append("hostLastName", formData.lastName);
      submissionData.append("hostEmail", formData.email);
      submissionData.append("numberOfGroups", formData.numberOfGroups);
      
      // Append isDraft as a string "false", backend converts to boolean 
      submissionData.append("isDraft", "false");

      if (formData.eventImage) {
        submissionData.append("eventImgUrl", formData.eventImage);
      }

      const response = await axiosInstance.post("/add-event", submissionData, {
        withCredentials: true, // Ensure cookies are sent with the request
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Event created:", response.data);
      localStorage.setItem("eventId", response.data.data._id);
      localStorage.setItem("eventDetails", JSON.stringify(response.data));
      setShowSuccess(true);

      trackEvent("New Event Creation Completed", {
        source: "dashboard-event-creation page",
        timestamp: new Date().toISOString(),
        page_name: "Dashboard-event-creation page",
        event_Id: response.data.data._id,
        event_name: response.data.data.eventName,
        add_image: response.data.data.eventImgUrl ? "Yes" : "No",
        add_group_number: response.data.data.numberOfGroups ? "Yes" : "No",
        status: "Successful"
      });

    } catch (error: any) {
      toast.error(error.response?.data?.message);

      trackEvent("New Event Creation Failed", {
        source: "event-creation page",
        timestamp: new Date().toISOString(),
        page_name: "Event-creation page",
        event_name: formData?.eventName,
        add_image: formData?.eventImage ? "Yes" : "No",
        add_group_number: formData?.numberOfGroups ? "Yes" : "No",
        status: "Failed"
      });
    } finally {
      setLoading(false);
    }
  };

  // API call triggered on clicking Continue
  // API call triggered on clicking Continue
  const handleSaveLater = async () => {
    const authToken = localStorage.getItem("authToken");
  
    if (!authToken) {
      localStorage.setItem("unsavedFormData", JSON.stringify(formData));
      Cookies.set("redirectAfterLogin", pathname); 
      setShowSuccess2(true);
      return;
    }
  
    // Validate all fields
    const newErrors = { ...errors };
    Object.keys(formData).forEach((key) => {
      if (key !== "eventImage") {
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
      
      // Append all standard fields
      submissionData.append("eventName", formData.eventName);
      submissionData.append("eventDescription", formData.description);
      submissionData.append("numberOfGroups", formData.numberOfGroups);
      submissionData.append(
        "date",
        formData.eventDate?.toISOString().split("T")[0] || ""
      );
  
      // Convert eventTime if needed
      const formattedTime = formData.eventTime
        ? convertTo12Hour(formData.eventTime.toISOString().split("T")[1])
        : "";
      submissionData.append("time", formattedTime);
  
      submissionData.append("eventLocation", formData.location);
      submissionData.append("hostFirstName", formData.firstName);
      submissionData.append("hostLastName", formData.lastName);
      submissionData.append("hostEmail", formData.email);
      
      // Append isDraft as a string "true", backend converts to boolean 
      submissionData.append("isDraft", "true");
      
      // Append image file if it exists
      if (formData.eventImage) {
        submissionData.append("eventImgUrl", formData.eventImage);
      }
  
      // Debug: Log the FormData before sending
      // console.log("Submitting form data:");
      // for (let [key, value] of submissionData.entries()) {
      //   console.log(key, value instanceof File ? value.name : value);
      // }
  
      const response = await axiosInstance.post("/add-event", submissionData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Event created:", response.data);
      toast.success("Saved! Continue from your dashboard.");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to save event");
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
    (isAuthenticated ||
      (formData.firstName && formData.lastName && formData.email)) &&
    formData.location &&
    formData.eventName &&
    formData.eventTime &&
    Object.values(errors).every((err) => err === "");

  return (
    <Container>
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
      <section className="bg-[#F9FAFB]">
        <div className="py-8 lg:py-16 px-3 sm:px-4 mx-auto max-w-screen-md">
          <EventHeader />
          <form
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
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
              handleDateChange={handleDateChange}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleMapLocationSelect={handleMapLocationSelect}
            />
            {/* Conditionally render PersonalDetails */}
            {!isAuthenticated && (
              <PersonalDetails
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                isAuthenticated={isAuthenticated}
              />
            )}
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
    </Container>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>
      <div className="flex flex-col justify-center items-center min-h-screen">
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-[#751423] border-gray-300 rounded-full"
        ></motion.div>

        {/* Skeleton Effect for Loading Content */}
        <div className="mt-6 w-[80%] max-w-md bg-white p-4 shadow-lg rounded-xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>}>
      <PageContent />
    </Suspense>
  );
}





















// "use client";
// import { Suspense, useState, useRef, useEffect } from "react";
// import EventSuccess from "@/components/EventSuccess";
// import ImagePickerModal from "@/components/aboutEvent/ImagePickerModal";
// import EventHeader from "@/components/aboutEvent/EventHeader";
// import EventFormFields from "@/components/aboutEvent/EventFormFields";
// import PersonalDetails from "@/components/aboutEvent/PersonalDetails";
// import dynamic from "next/dynamic";
// import axiosInstance from "@/lib/axiosInstance";
// import FormButtons2 from "@/components/aboutEvent/FormButtons2";
// import EventSaveSuccess from "@/components/aboutEvent/EventSaveSuccess";
// import { toast, ToastContainer } from "react-toastify";
// import "react-datepicker/dist/react-datepicker.css";
// import Cookies from "js-cookie";
// import { useRouter, useSearchParams } from "next/navigation";
// import Container from "@/components/dashboard/Container";
// import { motion } from "framer-motion";

// // Dynamically import LocationPickerModal with SSR disabled.
// const LocationPickerModal = dynamic(
//   () => import("@/components/aboutEvent/LocationPickerModal"),
//   { ssr: false }
// );

// interface FormData {
//   eventName: string;
//   eventDate: Date | null;
//   eventTime: Date | null;
//   location: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   numberOfGroups: string;
//   description: string;
//   eventImage: File | null;
// }

// interface Errors {
//   eventName: string;
//   eventDate: string;
//   eventTime: string;
//   location: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   description: string;
//   numberOfGroups: string;
//   eventImage: string;
// }

// const PageContent: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showSuccess2, setShowSuccess2] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [loading2, setLoading2] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // State for modals
//   const [showImagePickerModal, setShowImagePickerModal] = useState(false);
//   const [showMapPickerModal, setShowMapPickerModal] = useState(false);

//   const [formData, setFormData] = useState<FormData>({
//     eventName: "",
//     eventDate: new Date(),
//     eventTime: new Date(),
//     location: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     description: "",
//     numberOfGroups: "0",
//     eventImage: null
//   });

//   const [errors, setErrors] = useState<Errors>({
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
//     const redirect = Cookies.get("redirectAfterLogin");
//     if (redirect === "co-host") {
//       const userConfirmed = window.confirm(
//         "Do you want to continue co-host creation?"
//       );
//       if (userConfirmed) {
//         router.push("/add-cohost");
//       } else {
//         Cookies.remove("redirectAfterLogin");
//       }
//     }
//   }, [router]);

//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Check for authToken in localStorage
//     const authToken = localStorage.getItem("authToken");
//     setIsAuthenticated(!!authToken); // Set to true if authToken exists, false otherwise
//   }, []);

//   // Check for token in URL using useSearchParams
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const token = searchParams.get("token");
//       if (token) {
//         localStorage.setItem("authToken", token);
//       }
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     // Check for authToken in localStorage
//     const authToken = localStorage.getItem("authToken");
//     if (authToken) {
//       setIsAuthenticated(true);

//       // Consume the profile endpoint
//       const fetchUserProfile = async () => {
//         try {
//           const response = await axiosInstance.post("/profile-details", {
//             token: authToken
//           });
//           // Save the response to localStorage as the logged-in user
//           localStorage.setItem("loggedInUser", JSON.stringify(response.data));
//           localStorage.setItem("loggedInUserEmail", response.data.email)
//           console.log("User profile fetched successfully:", response.data);
//         } catch (error: any) {
//           console.error("Error fetching user profile:", error);
//           toast.error(
//             error.response?.data?.message || "Failed to fetch user profile."
//           );
//         }
//       };

//       fetchUserProfile();
//     }
//   }, [router]);

//   // Handlers for input changes and validations
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//     setErrors({ ...errors, [e.target.id]: "" });
//   };

//   const validateField = (id: string, value: any): string => {
//     // Skip personal details validations if user is authenticated
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
//       // Check that the input is a number and within 1 to 99
//       if (!value.trim() || isNaN(Number(value))) {
//         return "Enter a valid number.";
//       }
//       const numValue = Number(value);
//       if (numValue < 0 || numValue > 99) {
//         return "Number must be between 0 and 99.";
//       }
//     } else if (
//       id !== "description" &&
//       (typeof value !== "string" || !value.trim())
//     ) {
//       return "This field is required.";
//     }

//     if (
//       id === "email" &&
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

//     if (id === "description" && value.trim() && value.length < 5) {
//       return "Description must be at least 5 characters.";
//     }

//     if (id === "description" && value.length > 300) {
//       return "Description must have a maximum of 300 characters.";
//     }

//     if (id === "eventName" && value.length < 5) {
//       return "Event name must be at least 5 characters.";
//     }

//     if (id === "eventName" && value.length > 60) {
//       return "Event name must not exceed 60 characters.";
//     }

//     return "";
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
//   };

//   // Helper function to convert 24-hour time (HH:mm) to 12-hour format (hh:mm AM/PM) matching the regex
//   const convertTo12Hour = (time24: string): string => {
//     const [hourStr, minute] = time24.split(":");
//     let hours = parseInt(hourStr, 10);
//     const ampm = hours >= 12 ? "PM" : "AM";
//     // Convert hour '0' to '12'
//     hours = hours % 12 || 12;
//     // Pad hours with a leading zero if necessary
//     const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
//     return `${paddedHours}:${minute} ${ampm}`;
//   };

//   const handleDateChange = (date: Date | null, field: string) => {
//     if (date) {
//       setFormData((prev) => ({ ...prev, [field]: date }));
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     } else {
//       setErrors((prev) => ({ ...prev, [field]: "This field is required." }));
//     }
//   };

//   // API call triggered on clicking Continue
//   const handleContinue = async () => {
//     const newErrors = { ...errors };
//     Object.keys(formData).forEach((key) => {
//       if (key !== "eventImage") {
//         // Remove eventImage validation
//         newErrors[key as keyof typeof formData] = validateField(
//           key,
//           formData[key as keyof typeof formData] as string
//         );
//       }
//     });
//     setErrors(newErrors);
//     if (Object.values(newErrors).some((error) => error !== "")) return;

//     setLoading(true);
//     try {
//       // Create FormData to match endpoint requirements
//       const submissionData = new FormData();
//       submissionData.append("eventName", formData.eventName);
//       submissionData.append("eventDescription", formData.description);
//       submissionData.append(
//         "date",
//         formData.eventDate?.toISOString().split("T")[0] || ""
//       );

//       // Convert eventTime if needed
//       const formattedTime = formData.eventTime
//         ? convertTo12Hour(formData.eventTime.toISOString().split("T")[1])
//         : "";
//       submissionData.append("time", formattedTime);

//       submissionData.append("eventLocation", formData.location);
//       submissionData.append("hostFirstName", formData.firstName);
//       submissionData.append("hostLastName", formData.lastName);
//       submissionData.append("hostEmail", formData.email);
//       submissionData.append("numberOfGroups", formData.numberOfGroups);
//       if (formData.eventImage) {
//         submissionData.append("eventImgUrl", formData.eventImage);
//       }

//       const response = await axiosInstance.post("/add-event", submissionData, {
//         withCredentials: true, // Ensure cookies are sent with the request
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       console.log("Event created:", response.data);
//       localStorage.setItem("eventId", response.data.data._id);
//       localStorage.setItem("eventDetails", JSON.stringify(response.data));
//       setShowSuccess(true);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // API call triggered on clicking Continue
//   const handleSaveLater = async () => {
//     // Validate all fields
//     const newErrors = { ...errors };
//     Object.keys(formData).forEach((key) => {
//       if (key !== "eventImage") {
//         // Remove eventImage validation
//         newErrors[key as keyof typeof formData] = validateField(
//           key,
//           formData[key as keyof typeof formData] as string
//         );
//       }
//     });
//     setErrors(newErrors);
//     if (Object.values(newErrors).some((error) => error !== "")) return;

//     setLoading2(true);
//     try {
//       // Create FormData to match endpoint requirements
//       const submissionData = new FormData();
//       submissionData.append("eventName", formData.eventName);
//       submissionData.append("eventDescription", formData.description);
//       submissionData.append("numberOfGroups", formData.numberOfGroups);
//       submissionData.append(
//         "date",
//         formData.eventDate?.toISOString().split("T")[0] || ""
//       );

//       // Convert eventTime if needed
//       const formattedTime = formData.eventTime
//         ? convertTo12Hour(formData.eventTime.toISOString().split("T")[1])
//         : "";
//       submissionData.append("time", formattedTime);

//       submissionData.append("eventLocation", formData.location);
//       submissionData.append("hostFirstName", formData.firstName);
//       submissionData.append("hostLastName", formData.lastName);
//       submissionData.append("hostLastName", formData.numberOfGroups);
//       submissionData.append("hostEmail", formData.email);
//       if (formData.eventImage) {
//         submissionData.append("eventImgUrl", formData.eventImage);
//       }

//       const response = await axiosInstance.post("/add-event", submissionData, {
//         withCredentials: true, // Ensure cookies are sent with the request
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       console.log("Event created:", response.data);
//       setShowSuccess2(true);
//     } catch (error: any) {
//       console.error("Error creating event:", error);
//       toast.error(error.response?.data?.message);
//     } finally {
//       setLoading2(false);
//     }
//   };

//   // Image file handling
//   const handleBrowseClick = () => {
//     if (typeof window !== "undefined") {
//       if (window.innerWidth < 768) {
//         setShowImagePickerModal(true);
//       } else {
//         fileInputRef.current?.click();
//       }
//     }
//   };

//   const handleSelectGallery = () => {
//     fileInputRef.current?.removeAttribute("capture");
//     fileInputRef.current?.click();
//     setShowImagePickerModal(false);
//   };

//   const handleTakePhoto = () => {
//     fileInputRef.current?.setAttribute("capture", "environment");
//     fileInputRef.current?.click();
//     setShowImagePickerModal(false);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//       setFormData({ ...formData, eventImage: file });
//       setErrors({ ...errors, eventImage: "" });
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//       setFormData({ ...formData, eventImage: file });
//       setErrors({ ...errors, eventImage: "" });
//     }
//   };

//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//     setFormData({ ...formData, eventImage: null });
//   };

//   // Map location handler
//   const handleMapLocationSelect = () => {
//     setShowMapPickerModal(true);
//   };

//   const isFormValid =
//     (isAuthenticated ||
//       (formData.firstName && formData.lastName && formData.email)) &&
//     formData.location &&
//     formData.eventName &&
//     formData.eventTime &&
//     Object.values(errors).every((err) => err === "");

//   return (
//     <Container>
//       {showImagePickerModal && (
//         <ImagePickerModal
//           onSelectGallery={handleSelectGallery}
//           onTakePhoto={handleTakePhoto}
//           onCancel={() => setShowImagePickerModal(false)}
//         />
//       )}
//       {showMapPickerModal && (
//         <LocationPickerModal
//           onLocationSelect={(location) => {
//             setFormData({ ...formData, location });
//             setShowMapPickerModal(false);
//           }}
//           onCancel={() => setShowMapPickerModal(false)}
//         />
//       )}
//       <div>{showSuccess && <EventSuccess />}</div>
//       <div>{showSuccess2 && <EventSaveSuccess />}</div>
//       <section className="bg-[#F9FAFB]">
//         <div className="py-8 lg:py-16 px-3 sm:px-4 mx-auto max-w-screen-md">
//           <EventHeader />
//           <form
//             className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
//             onSubmit={(e) => e.preventDefault()}
//           >
//             <EventFormFields
//               formData={formData}
//               errors={errors}
//               selectedImage={selectedImage}
//               handleChange={handleChange}
//               handleBlur={handleBlur}
//               handleBrowseClick={handleBrowseClick}
//               handleDrop={handleDrop}
//               handleDragOver={handleDragOver}
//               handleRemoveImage={handleRemoveImage}
//               handleDateChange={handleDateChange}
//               fileInputRef={fileInputRef}
//               handleFileChange={handleFileChange}
//               handleMapLocationSelect={handleMapLocationSelect}
//             />
//             {/* Conditionally render PersonalDetails */}
//             {!isAuthenticated && (
//               <PersonalDetails
//                 formData={formData}
//                 errors={errors}
//                 handleChange={handleChange}
//                 handleBlur={handleBlur}
//                 isAuthenticated={isAuthenticated}
//               />
//             )}
//           </form>
//         </div>
//         <FormButtons2
//           isFormValid={!!isFormValid}
//           onContinue={handleContinue}
//           onContinue2={handleSaveLater}
//           loading={loading}
//           loading2={loading2}
//         />
//       </section>
//       <ToastContainer />
//     </Container>
//   );
// };

// export default function Page() {
//   return (
//     <Suspense fallback={<div>
//       <div className="flex flex-col justify-center items-center min-h-screen">
//         {/* Animated Spinner */}
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-12 h-12 border-4 border-t-[#751423] border-gray-300 rounded-full"
//         ></motion.div>

//         {/* Skeleton Effect for Loading Content */}
//         <div className="mt-6 w-[80%] max-w-md bg-white p-4 shadow-lg rounded-xl">
//           <div className="animate-pulse">
//             <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
//             <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
//             <div className="h-4 bg-gray-300 rounded w-5/6"></div>
//           </div>
//         </div>
//       </div>
//     </div>}>
//       <PageContent />
//     </Suspense>
//   );
// }
