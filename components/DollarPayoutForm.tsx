import React from "react";
import USBankDropdown from "./USBankDropdown";

interface USBank {
  _id: {
    $oid: string;
  };
  bankId: string;
  name: string;
  country: string;
  currency: string;
  routingNumber: string[];
}

interface DollarPayoutFormProps {
  formData: {
    dollarAccount: {
      usAccountNumber: string;
      routingNumber: string;
      usBankName: string;
      usAccountName: string;
    };
  };
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  selectedUSBank: USBank | null;
  setSelectedUSBank: (usBank: USBank) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const DollarPayoutForm: React.FC<DollarPayoutFormProps> = ({
  formData,
  errors,
  handleChange,
  handleBlur,
  selectedUSBank,
  setSelectedUSBank,
  setFormData,
  setErrors
}) => {

  // Function to validate routing number
  const validateRoutingNumber = (routingNumber: string): boolean => {
    if (!selectedUSBank) return false; 
    return selectedUSBank.routingNumber.includes(routingNumber);
  };

  // Handle routing number input change
  const handleRoutingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleChange(e);

    const newErrors = { ...errors };

    if (selectedUSBank) {
      if (!/^\d{9}$/.test(value)) {
        newErrors.routingNumber = "Must be 9 digits";
      } else if (!validateRoutingNumber(value)) {
        newErrors.routingNumber = "Invalid routing number";
      } else {
        delete newErrors.routingNumber;
      }
    }
    
    if (e.target.name === "dollarAccount.usAccountNumber") {
      console.log(value)
      if (!/^\d{7,17}$/.test(value)) {
        newErrors.usAccountNumber = "Must be 7-17 digits";
      } else {
        delete newErrors.usAccountNumber;
      }
    }

    setErrors(newErrors);
  };

  return (
    <div className="space-y-6">
      <p className="font-general font-semibold text-[#111827] text-xl">Dollar Payout</p>
      
      <div className="flex flex-col gap-2 lg:gap-6">
        {/* First row - Account Number and Bank Name */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label
              htmlFor="accountNumber"
              className="block mb-2 font-semibold text-[#111827]"
              aria-required="true"
            >
              Account Number
            </label>
            <input
              type="number"
              id="dollarAccount.usAccountNumber"
              name="dollarAccount.usAccountNumber"
              placeholder="Enter account number"
              value={formData.dollarAccount.usAccountNumber}
              maxLength={10}
              onChange={handleRoutingNumberChange}
              onBlur={handleBlur}
              className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
              aria-describedby="accountNumberError"
              aria-invalid={!!errors.usAccountNumber}
              required
            />
            {errors.usAccountNumber && (
              <p id="accountNumberError" className="text-red-500 text-[12px] mt-1 whitespace-nowrap" role="alert">
                {errors.usAccountNumber}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-semibold text-[#111827]">Bank Name</label>
            <USBankDropdown
              selectedUSBank={selectedUSBank}
              setSelectedUSBank={setSelectedUSBank}
              setFormData={setFormData}
            />
          </div>
        </div>

        {/* Second row - Routing Number and Account Name */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label
              htmlFor="routingNumber"
              className="block mb-2 font-semibold text-[#111827]"
              aria-required="true"
            >
              Routing Number
            </label>
            <input
              type="number"
              id="dollarAccount.routingNumber"
              name="dollarAccount.routingNumber"
              placeholder="Enter routing number"
              value={formData.dollarAccount.routingNumber}
              maxLength={10}
              onChange={handleRoutingNumberChange}
              onBlur={handleBlur}
              className={`px-3 py-2 input-field outline-primary w-full rounded-[5px] ${
                !selectedUSBank ? "bg-gray-50 cursor-not-allowed" : "bg-slate-50"
              }`}
              aria-describedby="routingNumberError"
              aria-invalid={!!errors.routingNumber}
              required
              disabled={!selectedUSBank} 
            />
            {errors.routingNumber && (
              <p id="routingNumberError" className="text-red-500 text-sm mt-1" role="alert">
                {errors.routingNumber}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="accountName" className="block mb-2 font-semibold text-[#111827]">
              Account Name
            </label>
            <input
              type="text"
              id="dollarAccount.usAccountName"
              name="dollarAccount.usAccountName"
              placeholder="Account name"
              value={formData.dollarAccount.usAccountName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
              required
            />
            {errors.usAccountName && (
              <p className="text-red-500 text-sm mt-1">{errors.usAccountName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DollarPayoutForm;