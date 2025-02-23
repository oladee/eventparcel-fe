// components/FormButtons.tsx
import React from "react";

interface FormButtonsProps {
  isFormValid: boolean;
  onContinue: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, onContinue }) => (
  <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
    <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
      <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
        Save for later
      </button>
      <button
        disabled={!isFormValid}
        className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
          !isFormValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  </div>
);

export default FormButtons;
