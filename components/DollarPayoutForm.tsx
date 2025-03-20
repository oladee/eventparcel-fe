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
}

const DollarPayoutForm: React.FC<DollarPayoutFormProps> = ({
  formData,
  errors,
  handleChange,
  handleBlur,
  selectedUSBank,
  setSelectedUSBank,
  setFormData,
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

    // Validate routing number
    if (selectedUSBank) {
      const isValid = validateRoutingNumber(value);
      if (!isValid) {
        errors.routingNumber = "Invalid routing number for the selected bank.";
      } else {
        delete errors.routingNumber;
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <p className="font-general font-semibold text-[#111827] text-xl mb-5">Dollar Payout</p>
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
          onChange={handleChange}
          onBlur={handleBlur}
          className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
          aria-describedby="accountNumberError"
          aria-invalid={!!errors.usAccountNumber}
          required
        />
        {errors.usAccountNumber && (
          <p id="accountNumberError" className="text-red-500 text-sm mt-1" role="alert">
            {errors.usAccountNumber}
          </p>
        )}

        <div>
          <label className="block mb-2 mt-3 font-semibold text-[#111827]">Bank Name</label>
          <USBankDropdown
            selectedUSBank={selectedUSBank}
            setSelectedUSBank={setSelectedUSBank}
            setFormData={setFormData}
          />
        </div>

        <label
          htmlFor="routingNumber"
          className="block mb-2 -mt-2 font-semibold text-[#111827]"
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
          className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
          aria-describedby="routingNumberError"
          aria-invalid={!!errors.routingNumber}
          required
        />
        {errors.routingNumber && (
          <p id="routingNumberError" className="text-red-500 text-sm mt-1" role="alert">
            {errors.routingNumber}
          </p>
        )}
      </div>

      <div className="flex flex-col">
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
  );
};

export default DollarPayoutForm;