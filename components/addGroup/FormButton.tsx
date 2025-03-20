import React from "react";

interface FormButtonsProps {
  isFormValid: boolean;
  onSubmit: () => void;
  loading: boolean
}


const FormButton: React.FC<FormButtonsProps> = ({ isFormValid, onSubmit, loading }) => {
  return (
    <button
      type="submit"
      disabled={!isFormValid}
      onClick={onSubmit}
      className={`bg-[#751423] text-white text-sm py-3 px-3 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-general ${
        !isFormValid ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Creating..." : "Create Group"}
    </button>
  );
};

export default FormButton;
