// pages/About.tsx or app/about/page.tsx
"use client";
import { useState, useRef } from "react";
import EventSuccess from "@/components/EventSuccess";
import ImagePickerModal from "@/components/aboutEvent/ImagePickerModal";
import EventHeader from "@/components/aboutEvent/EventHeader";
import EventFormFields from "@/components/aboutEvent/EventFormFields";
import PersonalDetails from "@/components/aboutEvent/PersonalDetails";
import FormButtons from "@/components/aboutEvent/FormButtons";

const About: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for modal visibility
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    eventImage: null as File | null,
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
    eventImage: "",
  });

  // Handlers for input changes and validations
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateField = (id: string, value: string) => {
    if (!value.trim()) return "This field is required.";
    if (
      id === "email" &&
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
    )
      return "Enter a valid email address.";
    if ((id === "firstName" || id === "lastName") && /[^a-zA-Z\s]/.test(value))
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
    if (Object.values(newErrors).some((error) => error !== "")) return;
    console.log("Form submitted:", formData);
  };

  // Image file handling
  const handleBrowseClick = () => {
    if (window.innerWidth < 768) {
      setShowImagePickerModal(true);
    } else {
      fileInputRef.current?.click();
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
      <div>{showSuccess && <EventSuccess />}</div>
      <section className="bg-[#F9FAFB] mt-14 md:mt-10">
        <div className="py-8 lg:py-16 px-3 sm:px-4 mx-auto max-w-screen-md">
<<<<<<< HEAD
          <EventHeader />
=======
          {/* Header */}
          <div className="mb-12 text-center p-3 sm:p-0">
            <h3 className="text-2xl sm:text-[32px] sm:font-general font-bold text-[#111827]">
              Tell us about your event
            </h3>
            <p className="text-lg sm:font-general font-medium text-[#718096] sm:text-xl">
              We&apos;ll help you get started based on your responses
            </p>
          </div>

          {/* Form */}
>>>>>>> 647822a4fcb7a73605939299173563047c7a5319
          <form
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
            onSubmit={handleSubmit}
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
            />
            <PersonalDetails
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </form>
        </div>
        <FormButtons
          isFormValid={!!isFormValid}
          onContinue={() => isFormValid && setShowSuccess(!showSuccess)}
        />
      </section>
    </>
  );
};

export default About;











// "use client";
// import { useState, useRef } from "react";
// import Image from "next/image";
// import { MapPin, XCircle } from "lucide-react";
// import EventSuccess from "@/components/EventSuccess";

// const About: React.FC = () => {
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // New state for modal visibility
//   const [showImagePickerModal, setShowImagePickerModal] = useState(false);

//   const [formData, setFormData] = useState({
//     eventName: "",
//     eventDate: "",
//     eventTime: "",
//     location: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     description: "",
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
//     eventImage: ""
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//     setErrors({ ...errors, [e.target.id]: "" });
//   };

//   const validateField = (id: string, value: string) => {
//     if (!value.trim()) {
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
//     if (id === "description" && value.length < 20) {
//       return "Description must be at least 20 characters.";
//     }
//     return "";
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const newErrors = { ...errors };
//     Object.keys(formData).forEach((key) => {
//       newErrors[key as keyof typeof formData] = validateField(
//         key,
//         formData[key as keyof typeof formData] as string
//       );
//     });

//     setErrors(newErrors);

//     if (Object.values(newErrors).some((error) => error !== "")) {
//       return; // Stop form submission if errors exist
//     }

//     console.log("Form submitted:", formData);
//   };

//   // Modified to show the modal on mobile
//   const handleBrowseClick = () => {
//     if (window.innerWidth < 768) {
//       setShowImagePickerModal(true);
//     } else {
//       fileInputRef.current?.click();
//     }
//   };

//   // Function to trigger gallery selection (no capture attribute)
//   const handleSelectGallery = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.removeAttribute("capture");
//       fileInputRef.current.click();
//     }
//     setShowImagePickerModal(false);
//   };

//   // Function to trigger camera capture (with capture attribute)
//   const handleTakePhoto = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.setAttribute("capture", "environment");
//       fileInputRef.current.click();
//     }
//     setShowImagePickerModal(false);
//   };

//   // Handle file selection via the file input
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       // Create a preview URL for the image
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//       setFormData({ ...formData, eventImage: file });
//       setErrors({ ...errors, eventImage: "" });
//     }
//   };

//   // Handle drag over to allow drop
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   // Handle file drop
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

//   const isFormValid =
//     formData.firstName &&
//     formData.lastName &&
//     formData.email &&
//     formData.description &&
//     formData.location &&
//     formData.eventName &&
//     formData.eventTime &&
//     formData.eventImage &&
//     Object.values(errors).every((err) => err === "");

//   return (
//     <>
//       {/* Modal for image source selection on mobile */}
//       {showImagePickerModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white w-[80%] p-6 rounded-[10px] text-center">
//             <h2 className="text-xl font-bold mb-4">Select Image Source</h2>
//             <div className="flex flex-col gap-4">
//               <button onClick={handleSelectGallery} className="button_v2">
//                 Gallery
//               </button>
//               <button onClick={handleTakePhoto} className="button_v1">
//                 Take Photo
//               </button>
//               <button
//                 onClick={() => setShowImagePickerModal(false)}
//                 className=""
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div>{showSuccess && <EventSuccess />}</div>
//       <section className="bg-[#F9FAFB] mt-14 md:mt-10">
//         <div className="py-8 lg:py-16 px-3 sm:px-4 mx-auto max-w-screen-md">
//           {/* Header */}
//           <div className="mb-12 text-center p-3 sm:p-0">
//             <h3 className="text-2xl sm:text-[32px] sm:font-general font-bold text-[#111827]">
//               Tell us about your event
//             </h3>
//             <p className="text-lg sm:font-general font-medium text-[#718096] dark:text-gray-400 sm:text-xl">
//               We&apos;ll help you get started based on your responses
//             </p>
//           </div>

//           {/* Form */}
//           <form
//             className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
//             onSubmit={handleSubmit}
//           >
//             {/* Event Name */}
//             <div>
//               <label
//                 htmlFor="eventName"
//                 className="block mb-2 font-semibold text-[#111827]"
//               >
//                 Event Name
//               </label>
//               <input
//                 type="text"
//                 id="eventName"
//                 value={formData.eventName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//                 placeholder="Enter event name"
//                 required
//               />
//               {errors.eventName && (
//                 <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
//               )}
//             </div>

//             {/* Event Cover Image */}
//             <div>
//               <label className="block mb-2 font-semibold text-[#111827]">
//                 Event Cover Image
//               </label>
//               <div
//                 className="border-2 border-dashed border-[#718096] rounded-xl flex flex-col justify-center items-center gap-4 cursor-pointer relative"
//                 onClick={handleBrowseClick}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//               >
//                 {selectedImage ? (
//                   <>
//                     <img
//                       src={selectedImage}
//                       alt="Preview"
//                       className="rounded object-cover w-full h-full"
//                     />
//                     <XCircle
//                       className="absolute top-2 right-2 text-red-500 cursor-pointer"
//                       size={24}
//                       onClick={handleRemoveImage}
//                     />
//                   </>
//                 ) : (
//                   <div className="py-24 px-2 flex flex-col justify-center items-center gap-4 cursor-pointer">
//                     <Image
//                       src="/images/photo.png"
//                       alt="Upload"
//                       width={30}
//                       height={30}
//                     />
//                     <span className="text-sm text-[#718096] text-center">
//                       Drop your image here, or{" "}
//                       <span className="text-[#751423]">Click to browse</span>
//                     </span>
//                   </div>
//                 )}
//               </div>
//               {errors.eventImage && (
//                 <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>
//               )}
//               {/* Hidden file input */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block mb-2 font-semibold text-[#111827]"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Write description"
//                 className="input-field outline-primary h-[140px] w-full resize-none p-4 rounded-[5px] bg-slate-50"
//                 required
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.description}
//                 </p>
//               )}
//             </div>

//             {/* Date & Time */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="eventDate"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Date
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     id="eventDate"
//                     value={formData.eventDate}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
//                     placeholder="Select date"
//                     required
//                   />
//                   {errors.eventDate && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.eventDate}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label
//                   htmlFor="eventTime"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Time
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="time"
//                     id="eventTime"
//                     value={formData.eventTime}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
//                     placeholder="Select time"
//                     required
//                   />
//                   {errors.eventTime && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.eventTime}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Event Location (With Icon) */}
//             <div>
//               <label
//                 htmlFor="location"
//                 className="block mb-2 font-semibold text-[#111827]"
//               >
//                 Event Location
//               </label>
//               <div className="relative">
//                 <MapPin
//                   className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   id="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-slate-50"
//                   placeholder="Enter location of the event"
//                   required
//                 />
//                 {errors.location && (
//                   <p className="text-red-500 text-sm mt-1">{errors.location}</p>
//                 )}
//               </div>
//             </div>

//             {/* Personal Details */}
//             <div>
//               <label className="block font-semibold text-[#111827]">
//                 Your Details
//               </label>
//               <p className="text-sm text-[#718096]">
//                 We will not share your personal details publicly
//               </p>
//             </div>

//             {/* Name Fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="firstName"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//                   placeholder="First name"
//                   required
//                 />
//                 {errors.firstName && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="lastName"
//                   className="block mb-2 font-semibold text-[#111827]"
//                 >
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//                   placeholder="Last name"
//                   required
//                 />
//                 {errors.lastName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             {/* Email Address */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block mb-2 font-semibold text-[#111827]"
//               >
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//                 placeholder="Enter your email"
//                 required
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>
//           </form>
//         </div>
//         <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
//           <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
//           <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//             Save for later
//           </button>
//           <button
//             disabled={!isFormValid}
//             className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//               !isFormValid ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             onClick={() => isFormValid && setShowSuccess(!showSuccess)}
//           >
//             Continue
//           </button>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default About;

