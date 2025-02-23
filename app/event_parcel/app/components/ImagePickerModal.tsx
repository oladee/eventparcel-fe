import React from 'react';

interface ImagePickerModalProps {
  show: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onTakePhoto: () => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  show,
  onClose,
  onSelectGallery,
  onTakePhoto,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[80%] p-6 rounded-[10px] text-center">
        <h2 className="text-xl font-bold mb-4">Select Image Source</h2>
        <div className="flex flex-col gap-4">
          <button onClick={onSelectGallery} className="button_v2">
            Gallery
          </button>
          <button onClick={onTakePhoto} className="button_v1">
            Take Photo
          </button>
          <button onClick={onClose} className="">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;