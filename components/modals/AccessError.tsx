"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Warning } from "../icons/Icons";
import { FiX } from "react-icons/fi";

interface SuccessModalProps {
  title: string;
  subtitle: string;
  buttonText: string;
  route: string;
}

const AccessError: React.FC<SuccessModalProps> = ({
  title,
  subtitle,
  buttonText,
  route
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed p-4 w-screen inset-0 overflow-y-auto bg-[#00000098] h-screen left-0 top-0 z-30 flex items-center justify-center md:justify-center px-2">
      <div className="bg-white p-6 rounded-[24px] w-full max-w-md grid place-items-center text-center gap-4 relative">
        <Warning width={100} height={100} />
        <p className="font-bold text-2xl md:text-3xl">{title}</p>
        <p className="font-medium text-[#718096]">{subtitle}</p>
        <button
          onClick={() => {
            router.push(route);
          }}
          className="button_v1"
        >
          {buttonText}
        </button>
        <FiX
          className="absolute top-4 right-4 cursor-pointer text-gray-600"
          size={24}
          onClick={() => setIsVisible(false)}
        />
      </div>
    </div>
  );
};

export default AccessError;







// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { Warning } from "../icons/Icons";

// interface SuccessModalProps {
//   title: string;
//   subtitle: string;
//   buttonText: string;
//   route: string;
// }

// const AccessError: React.FC<SuccessModalProps> = ({
//   title,
//   subtitle,
//   buttonText,
//   route
// }) => {
//   const router = useRouter();

//   return (
//     <div className="fixed p-4 w-screen inset-0  overflow-y-auto  bg-[#00000098] h-screen left-0 top-0 z-30 flex items-center justify-center md:justify-center px-2">
//       <div className="bg-white p-6 rounded-[24px] w-full max-w-md grid place-items-center text-center gap-4">
//         <Warning width={100} height={100} />
//         <p className="font-bold text-2xl md:text-3xl">{title}</p>
//         <p className="font-medium text-[#718096]">{subtitle}</p>
//         <button
//           onClick={() => {
//             router.push(route);
//           }}
//           className="button_v1"
//         >
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AccessError;
