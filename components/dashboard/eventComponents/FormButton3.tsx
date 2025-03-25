import React from "react";

interface FormButtonsProps {
  isFormValid: boolean;
  onContinue: () => void;
  onContinue2: () => void;
  loading: boolean;
  loading2: boolean;
}

const FormButtons3: React.FC<FormButtonsProps> = ({
  isFormValid,
  onContinue,
  onContinue2,
  loading,
  loading2,
}) => (
  <div className="bg-[#FFFF] pb-11 md:pb-3 pt-3 flex justify-center">
    <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full px-3 lg:px-0">
      <button disabled={!isFormValid || loading} onClick={onContinue2} className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
       
        {loading2 ? "saving..." : "Save for later"}
      </button>
      <button
        disabled={!isFormValid || loading}
        className={`bg-primary text-white py-3 px-8 rounded-[12px] transition flex items-center justify-center font-extrabold font-manrope ${
          !isFormValid || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-800"
        }`}
        onClick={onContinue}
      >
        {loading ? "Loading..." : "Continue"}
      </button>
    </div>
  </div>
);

export default FormButtons3;
