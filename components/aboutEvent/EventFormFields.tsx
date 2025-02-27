"use client"


import React from "react";
import { MapPin } from "lucide-react";
import EventCoverImage from "./EventCoverImage";

interface EventFormFieldsProps {
  formData: any;
  errors: any;
  selectedImage: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBrowseClick: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // New prop for handling map location selection
  handleMapLocationSelect: () => void;
}

const EventFormFields: React.FC<EventFormFieldsProps> = ({
  formData,
  errors,
  selectedImage,
  handleChange,
  handleBlur,
  handleBrowseClick,
  handleDrop,
  handleDragOver,
  handleRemoveImage,
  fileInputRef,
  handleFileChange,
  handleMapLocationSelect,
}) => {
  return (
    <>
      {/* Event Name */}
      <div>
        <label htmlFor="eventName" className="block mb-2 font-semibold text-[#111827]">
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          value={formData.eventName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
          placeholder="Enter event name"
          required
        />
        {errors.eventName && (
          <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
        )}
      </div>

      {/* Event Cover Image */}
      <div>
        <label className="block mb-2 font-semibold text-[#111827]">
          Event Cover Image
        </label>
        <EventCoverImage
          selectedImage={selectedImage}
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onRemoveImage={handleRemoveImage}
        />
        {errors.eventImage && (
          <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>
        )}
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block mb-2 font-semibold text-[#111827]">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Write description"
          className="input-field outline-primary h-[140px] w-full resize-none p-4 rounded-[5px] bg-slate-50"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventDate" className="block mb-2 font-semibold text-[#111827]">
            Date
          </label>
          <input
            type="date"
            id="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
            required
          />
          {errors.eventDate && (
            <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="eventTime" className="block mb-2 font-semibold text-[#111827]">
            Time
          </label>
          <input
            type="time"
            id="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
            required
          />
          {errors.eventTime && (
            <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>
          )}
        </div>
      </div>

      {/* Event Location */}
      <div>
        <label htmlFor="location" className="block mb-2 font-semibold text-[#111827]">
          Event Location
        </label>
        <div className="relative">
          <MapPin
            onClick={handleMapLocationSelect}
            className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            size={20}
          />
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-slate-50"
            placeholder="Enter location of the event"
            required
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EventFormFields;







































// // components/EventFormFields.tsx
// import React from "react";
// import { MapPin } from "lucide-react";
// import EventCoverImage from "./EventCoverImage";

// interface EventFormFieldsProps {
//   formData: any;
//   errors: any;
//   selectedImage: string | null;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   handleBrowseClick: () => void;
//   handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
//   handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
//   handleRemoveImage: () => void;
//   fileInputRef: React.RefObject<HTMLInputElement | null>;
//   handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   // New prop for handling map location selection
//   handleMapLocationSelect: () => void;
// }

// const EventFormFields: React.FC<EventFormFieldsProps> = ({
//   formData,
//   errors,
//   selectedImage,
//   handleChange,
//   handleBlur,
//   handleBrowseClick,
//   handleDrop,
//   handleDragOver,
//   handleRemoveImage,
//   fileInputRef,
//   handleFileChange,
//   handleMapLocationSelect,
// }) => {
//   return (
//     <>
//       {/* Event Name */}
//       <div>
//         <label htmlFor="eventName" className="block mb-2 font-semibold text-[#111827]">
//           Event Name
//         </label>
//         <input
//           type="text"
//           id="eventName"
//           value={formData.eventName}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//           placeholder="Enter event name"
//           required
//         />
//         {errors.eventName && (
//           <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
//         )}
//       </div>

//       {/* Event Cover Image */}
//       <div>
//         <label className="block mb-2 font-semibold text-[#111827]">
//           Event Cover Image
//         </label>
//         <EventCoverImage
//           selectedImage={selectedImage}
//           onClick={handleBrowseClick}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onRemoveImage={handleRemoveImage}
//         />
//         {errors.eventImage && (
//           <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>
//         )}
//         {/* Hidden file input */}
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />
//       </div>

//       {/* Description */}
//       <div>
//         <label htmlFor="description" className="block mb-2 font-semibold text-[#111827]">
//           Description
//         </label>
//         <textarea
//           id="description"
//           value={formData.description}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           placeholder="Write description"
//           className="input-field outline-primary h-[140px] w-full resize-none p-4 rounded-[5px] bg-slate-50"
//           required
//         />
//         {errors.description && (
//           <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//         )}
//       </div>

//       {/* Date & Time */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="eventDate" className="block mb-2 font-semibold text-[#111827]">
//             Date
//           </label>
//           <input
//             type="date"
//             id="eventDate"
//             value={formData.eventDate}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
//             required
//           />
//           {errors.eventDate && (
//             <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
//           )}
//         </div>
//         <div>
//           <label htmlFor="eventTime" className="block mb-2 font-semibold text-[#111827]">
//             Time
//           </label>
//           <input
//             type="time"
//             id="eventTime"
//             value={formData.eventTime}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
//             required
//           />
//           {errors.eventTime && (
//             <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>
//           )}
//         </div>
//       </div>

//       {/* Event Location */}
//       <div>
//         <label htmlFor="location" className="block mb-2 font-semibold text-[#111827]">
//           Event Location
//         </label>
//         <div className="relative">
//           <MapPin
//             onClick={handleMapLocationSelect}
//             className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
//             size={20}
//           />
//           <input
//             type="text"
//             id="location"
//             value={formData.location}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-slate-50"
//             placeholder="Enter location of the event"
//             required
//           />
//           {errors.location && (
//             <p className="text-red-500 text-sm mt-1">{errors.location}</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default EventFormFields;





















// // components/EventFormFields.tsx
// import React from "react";
// import { MapPin } from "lucide-react";
// import EventCoverImage from "./EventCoverImage";

// interface EventFormFieldsProps {
//   formData: any;
//   errors: any;
//   selectedImage: string | null;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   handleBrowseClick: () => void;
//   handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
//   handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
//   handleRemoveImage: () => void;
//   fileInputRef: React.RefObject<HTMLInputElement | null>;
//   handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const EventFormFields: React.FC<EventFormFieldsProps> = ({
//   formData,
//   errors,
//   selectedImage,
//   handleChange,
//   handleBlur,
//   handleBrowseClick,
//   handleDrop,
//   handleDragOver,
//   handleRemoveImage,
//   fileInputRef,
//   handleFileChange,
// }) => {
//   return (
//     <>
//       {/* Event Name */}
//       <div>
//         <label htmlFor="eventName" className="block mb-2 font-semibold text-[#111827]">
//           Event Name
//         </label>
//         <input
//           type="text"
//           id="eventName"
//           value={formData.eventName}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
//           placeholder="Enter event name"
//           required
//         />
//         {errors.eventName && (
//           <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
//         )}
//       </div>

//       {/* Event Cover Image */}
//       <div>
//         <label className="block mb-2 font-semibold text-[#111827]">
//           Event Cover Image
//         </label>
//         <EventCoverImage
//           selectedImage={selectedImage}
//           onClick={handleBrowseClick}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onRemoveImage={handleRemoveImage}
//         />
//         {errors.eventImage && (
//           <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>
//         )}
//         {/* Hidden file input */}
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />
//       </div>

//       {/* Description */}
//       <div>
//         <label htmlFor="description" className="block mb-2 font-semibold text-[#111827]">
//           Description
//         </label>
//         <textarea
//           id="description"
//           value={formData.description}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           placeholder="Write description"
//           className="input-field outline-primary h-[140px] w-full resize-none p-4 rounded-[5px] bg-slate-50"
//           required
//         />
//         {errors.description && (
//           <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//         )}
//       </div>

//       {/* Date & Time */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="eventDate" className="block mb-2 font-semibold text-[#111827]">
//             Date
//           </label>
//           <input
//             type="date"
//             id="eventDate"
//             value={formData.eventDate}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
//             required
//           />
//           {errors.eventDate && (
//             <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
//           )}
//         </div>
//         <div>
//           <label htmlFor="eventTime" className="block mb-2 font-semibold text-[#111827]">
//             Time
//           </label>
//           <input
//             type="time"
//             id="eventTime"
//             value={formData.eventTime}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="w-full p-2 input-field outline-primary rounded-[5px] bg-slate-50"
//             required
//           />
//           {errors.eventTime && (
//             <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>
//           )}
//         </div>
//       </div>

//       {/* Event Location */}
//       <div>
//         <label htmlFor="location" className="block mb-2 font-semibold text-[#111827]">
//           Event Location
//         </label>
//         <div className="relative">
//           <MapPin
//             className="absolute left-4 top-5 transform -translate-y-1/2 text-gray-500"
//             size={20}
//           />
//           <input
//             type="text"
//             id="location"
//             value={formData.location}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="input-field outline-primary pl-12 w-full p-2 rounded-[5px] bg-slate-50"
//             placeholder="Enter location of the event"
//             required
//           />
//           {errors.location && (
//             <p className="text-red-500 text-sm mt-1">{errors.location}</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default EventFormFields;
