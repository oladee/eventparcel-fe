import React, { useRef, useState } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";

interface EventImagePickerProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  setFormData: (data: any) => void;
  setErrors: (errors: any) => void;
  formData: any;
  errors: any;
}

const EventImagePicker: React.FC<EventImagePickerProps> = ({
  selectedImage,
  setSelectedImage,
  setFormData,
  setErrors,
  formData,
  errors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const handleBrowseClick = () => {
    if (window.innerWidth < 768) {
      setShowImagePickerModal(true);
    } else {
      fileInputRef.current?.click();
    }
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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData({ ...formData, eventImage: null });
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

  return (
    <div>
      <label className="block mb-2 font-semibold text-[#111827]">
        Event Cover Image
      </label>
      <div
        className="border-2 border-dashed border-[#718096] rounded-xl flex flex-col justify-center items-center gap-4 cursor-pointer relative"
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedImage ? (
          <>
            <img
              src={selectedImage}
              alt="Preview"
              className="rounded object-cover w-full h-full"
            />
            <XCircle
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              size={24}
              onClick={handleRemoveImage}
            />
          </>
        ) : (
          <div className="py-24 px-2 flex flex-col justify-center items-center gap-4 cursor-pointer">
            <Image
              src="/images/photo.png"
              alt="Upload"
              width={30}
              height={30}
            />
            <span className="text-sm text-[#718096] text-center">
              Drop your image here, or{" "}
              <span className="text-[#751423]">Click to browse</span>
            </span>
          </div>
        )}
      </div>
      {errors.eventImage && (
        <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default EventImagePicker;