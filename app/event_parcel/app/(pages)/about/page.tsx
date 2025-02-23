// filepath: /event_parcel/event_parcel/app/(pages)/about/page.tsx
"use client";
import { useState, useRef } from "react";
import EventForm from "@/components/EventForm";
import EventSuccess from "@/components/EventSuccess";
import ImagePickerModal from "@/components/ImagePickerModal";

const About: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
  };

  return (
    <>
      {showImagePickerModal && (
        <ImagePickerModal onClose={() => setShowImagePickerModal(false)} />
      )}
      <div>{showSuccess && <EventSuccess />}</div>
      <section className="bg-[#F9FAFB] mt-14 md:mt-10">
        <div className="py-8 lg:py-16 px-3 sm:px-4 mx-auto max-w-screen-md">
          <div className="mb-12 text-center p-3 sm:p-0">
            <h3 className="text-2xl sm:text-[32px] sm:font-general font-bold text-[#111827]">
              Tell us about your event
            </h3>
            <p className="text-lg sm:font-general font-medium text-[#718096] dark:text-gray-400 sm:text-xl">
              We&apos;ll help you get started based on your responses
            </p>
          </div>
          <EventForm onSuccess={handleSuccess} onImagePickerOpen={() => setShowImagePickerModal(true)} />
        </div>
      </section>
    </>
  );
};

export default About;