import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

interface FormButtonsProps {
  isFormValid: boolean;
  onContinue: () => void;
  onContinue2: () => void;
  loading: boolean;
  loading2: boolean;
}

const FormButtons2: React.FC<FormButtonsProps> = ({
  isFormValid,
  onContinue,
  onContinue2,
  loading,
  loading2
}) => (
  // <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
  //   <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full px-3 lg:px-0">
  //     <button disabled={!isFormValid || loading} onClick={onContinue2} className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">

  //       {loading2 ? "saving..." : "Save for later"}
  //     </button>
  //     <button
  //       disabled={!isFormValid || loading}
  //       className={`bg-primary text-white py-3 px-8 rounded-[12px] transition flex items-center justify-center font-extrabold font-manrope ${
  //         !isFormValid || loading
  //           ? "opacity-50 cursor-not-allowed"
  //           : "hover:bg-red-800"
  //       }`}
  //       onClick={onContinue}
  //     >
  //       {loading ? "Loading..." : "Continue"}
  //     </button>
  //   </div>
  // </div>
  <div className="bg-[#FFFF] pt-4 pb-11 flex justify-center fixed z-10 left-0 bottom-0 w-full">
    <div className="max-w-5xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
      <button
        id="save"
        type="button"
        disabled={!isFormValid || loading} onClick={onContinue2}
        className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]"
        // onClick={() => handleSaveForLater()}
      >
        {loading2 ? "saving..." : "Save for later"}
      </button>
      <button
        type="submit"
        onClick={onContinue}
        disabled={!isFormValid}
        className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
          !isFormValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <BiLoaderCircle className="animate-spin mr-2" size={22} />
        ) : (
          "Continue"
        )}
      </button>
    </div>
  </div>
);

export default FormButtons2;

// // components/FormButtons.tsx
// import React from "react";

// interface FormButtonsProps {
//   isFormValid: boolean;
//   onContinue: () => void;
// }

// const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, onContinue }) => (
//   <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
//     <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
//       <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
//         Save for later
//       </button>
//       <button
//         disabled={!isFormValid}
//         className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
//           !isFormValid ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         onClick={onContinue}
//       >
//         Continue
//       </button>
//     </div>
//   </div>
// );

// export default FormButtons;
