"use client";

import React from "react";
import { MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import EventCoverImage from "@/components/aboutEvent/EventCoverImage";

interface EventFormFieldsProps {
  formData: any;
  errors: any;
  selectedImage: string | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBrowseClick: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // New prop for handling map location selection
  handleMapLocationSelect: () => void;
  handleDateChange: (date: Date | null, field: string) => void;
}

const EventFormFields2: React.FC<EventFormFieldsProps> = ({
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
  handleDateChange
}) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();

  return (
    <>
      {/* Event Name */}
      <div>
        <label
          htmlFor="eventName"
          className="block mb-2 font-semibold text-[#111827]"
        >
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
        <label
          htmlFor="description"
          className="block mb-2 font-semibold text-[#111827]"
        >
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
          <label
            htmlFor="eventDate"
            className="block mb-2 font-semibold text-[#111827]"
          >
            Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform z-10 -translate-y-1/2 text-gray-500" />
            <DatePicker
              id="eventDate"
              selected={formData.eventDate}
              minDate={today}
              onChange={(date) => handleDateChange(date, "eventDate")}
              dateFormat="yyyy-MM-dd"
              popperClassName="custom-datepicker"
              className="!w-full pl-10 px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50 !z-50"
            />
          </div>
          {errors.eventDate && (
            <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="eventTime"
            className="block mb-2 font-semibold text-[#111827]"
          >
            Time
          </label>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 transform z-10 -translate-y-1/2 text-gray-500" />
            <DatePicker
              selected={formData.eventTime}
              id="eventTime"
              onChange={(date) => handleDateChange(date, "eventTime")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="hh:mm aa"
              popperClassName="custom-datepicker"
              className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
            />
          </div>
          {errors.eventTime && (
            <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>
          )}
        </div>
      </div>

      {/* Event Location */}
      <div>
        <label
          htmlFor="location"
          className="block mb-2 font-semibold text-[#111827]"
        >
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
      {/*  How many groups do you have */}
      <div>
        <label
          id="numberOfGroupsLabel"
          htmlFor="numberOfGroups"
          className="block font-semibold text-[#111827] capitalize"
        >
          How many groups do you have?
        </label>
        <p id="numberOfGroups" className="text-sm text-[#718096] mb-3 font-medium">
          This caters for the number of Aso Ebi types
        </p>
        <input
          type="number"
          id="numberOfGroups"
          value={formData.numberOfGroups}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
          placeholder="Enter number of groups"
          required
        />
        {errors.numberOfGroups && (
          <p className="text-red-500 text-sm mt-1">{errors.numberOfGroups}</p>
        )}
      </div>
    </>
  );
};

export default EventFormFields2;
