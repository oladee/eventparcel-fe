import React from "react";
import { FaSpinner } from "react-icons/fa";

interface FormButtonsProps {
  isFormValid: boolean;
  onSubmit: () => void;
  loading: boolean
  mode: string;
}


const FormButton: React.FC<FormButtonsProps> = ({ isFormValid, onSubmit, loading, mode }) => {
  return (
    <button
      type="submit"
      disabled={!isFormValid}
      onClick={onSubmit}
      className={`bg-[#751423] w-[126.1px] whitespace-nowrap text-white text-sm py-3 px-3 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-general ${
        !isFormValid ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
         <FaSpinner className="animate-spin mr-2" /> 
      ) : (
         mode === "availGroup" ? "Update Group" : "Create Group"
      )}
    </button>
  );
};

export default FormButton;
