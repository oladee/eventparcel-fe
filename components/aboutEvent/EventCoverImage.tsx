// components/EventCoverImage.tsx
import React from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";

interface EventCoverImageProps {
  selectedImage: string | null;
  onClick: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemoveImage: () => void;
}

const EventCoverImage: React.FC<EventCoverImageProps> = ({
  selectedImage,
  onClick,
  onDrop,
  onDragOver,
  onRemoveImage,
}) => {
  return (
    <div
      className="border-2 border-dashed border-[#718096] rounded-xl flex flex-col justify-center items-center gap-4 cursor-pointer relative"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {selectedImage ? (
        <>
          <Image
            src={selectedImage}
            alt="Preview"
            className="rounded object-cover w-full max-w-fit h-full max-h-fit"
            width={100}
            height={100}
          />
          <XCircle
            className="absolute top-2 right-2 text-red-500 cursor-pointer"
            size={24}
            onClick={onRemoveImage}
          />
        </>
      ) : (
        <div className="py-24 px-2 flex flex-col justify-center items-center gap-4 cursor-pointer">
          <Image src="/images/photo.png" alt="Upload" width={30} height={30} />
          <span className="text-sm text-[#718096] text-center">
            Drop your image here, or{" "}
            <span className="text-[#751423]">Click to browse</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default EventCoverImage;
