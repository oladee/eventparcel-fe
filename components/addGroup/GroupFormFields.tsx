import React, { useState } from "react";

interface GroupFormFieldsProps {
  formData: { groupName: string; groupDescription: string; groupCurrency: string };
  errors: { groupName: string; groupDescription: string };
  touched: { groupName: boolean; groupDescription: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GroupFormFields: React.FC<GroupFormFieldsProps> = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  
    const currencies = [
      { id: "NGN", name: "Nigerian Naira (₦)" },
      { id: "USD", name: "US Dollar ($)" },
    ];
  
  // Set default currency name
  const selectedCurrencyName =
    formData.groupCurrency === ""
      ? "Select Currency"
      : currencies.find((c) => c.id === formData.groupCurrency)?.name || "Select Currency";

  return (
    <div className="flex flex-col gap-2">
      {/* Group Name Input */}
      <input
        type="text"
        id="groupName"
        value={formData.groupName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`h-14 bg-gray-50 outline-primary rounded-xl text-gray-900 text-sm w-full p-2.5 capitalize ${
          touched.groupName && errors.groupName ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Group name"
        required
      />

      {touched.groupName && errors.groupName && (
        <p className="text-xs text-red-500">{errors.groupName}</p>
      )}

      {/* Group Description Input (Optional) */}
      <textarea
        id="groupDescription"
        value={formData.groupDescription}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Group description (optional)"
        className={`h-[120px] shadow-sm bg-gray-50 text-gray-900 text-sm rounded-xl outline-primary block w-full p-2.5 ${
          touched.groupDescription && errors.groupDescription ? "border-red-500" : "border-gray-300"
        }`}
      />
      {touched.groupDescription && errors.groupDescription && (
        <p className="text-xs text-red-500">{errors.groupDescription}</p>
      )}

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center justify-between w-full h-14 pl-3 pr-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm outline-primary focus:outline-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={`text-base font-general font-medium ${formData.groupCurrency ? "text-[#111827]" : "text-[#A0AEC0]"} leading-none`}>
            {selectedCurrencyName}
          </span>
          <svg
            className="w-4 h-4 mt-px ml-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown List */}
        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 shadow-lg rounded-xl z-10">
            {currencies.map((currency) => (
              <button
                key={currency.id}
                className="flex items-center font-general font-medium text-[#111827] w-full h-12 px-3 text-base hover:bg-primary hover:text-white"
                onClick={() => {
                  // Create a synthetic event for Formik or parent state handling
                  const event = {
                    target: { id: "groupCurrency", value: currency.id },
                  } as React.ChangeEvent<HTMLInputElement>;

                  handleChange(event); // Call parent function to update formData
                  setIsOpen(false);
                }}
              >
                {currency.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupFormFields;
