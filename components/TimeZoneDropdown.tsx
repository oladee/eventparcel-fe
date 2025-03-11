import React, { useState, useRef, useEffect } from "react";

interface TimeZoneDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const TimeZoneDropdown: React.FC<TimeZoneDropdownProps> = ({
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelection = (zone: string) => {
    onChange(zone);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50 text-left"
      >
        {value || "Select Time Zone"}
      </button>
      {isOpen && (
        <ul className="absolute z-10 no-scrollbar w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((zone) => (
            <li
              key={zone}
              onClick={() => handleSelection(zone)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {zone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeZoneDropdown;











// import React from "react";

// interface TimeZoneDropdownProps {
//   value: string;
//   onChange: (value: string) => void;
//   options: string[];
// }

// const TimeZoneDropdown: React.FC<TimeZoneDropdownProps> = ({
//   value,
//   onChange,
//   options,
// }) => {
//   return (
//     <div className="relative">
//       <button className="px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50 w-full text-left">
//         {value}
//       </button>
//       <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
//         {options.map((option) => (
//           <div
//             key={option}
//             className="px-3 py-2 cursor-pointer hover:bg-gray-200"
//             onClick={() => onChange(option)}
//           >
//             {option}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TimeZoneDropdown;