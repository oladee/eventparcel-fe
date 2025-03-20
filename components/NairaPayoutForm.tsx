import React from "react";
import BankDropdown from "./BankDropdown";

interface Bank {
    name: string;
    code: string;
    url: string;
  }

interface NairaPayoutFormProps {
  formData: {
    nairaAccount: {
      accountNumber: string;
      accountName: string;
      bankName: string;
    };
  };
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const NairaPayoutForm: React.FC<NairaPayoutFormProps> = ({
  formData,
  errors,
  handleChange,
  handleBlur,
  selectedBank,
  setSelectedBank,
  setFormData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Account Number Field */}
      <div className="flex flex-col">
        <p className="font-general font-semibold text-[#111827] text-xl mb-5">Naira Payout</p>
        <label
          htmlFor="accountNumber"
          className="block mb-2 font-semibold text-[#111827]"
          aria-required="true"
        >
          Account Number
        </label>
        <input
          type="number"
          id="nairaAccount.accountNumber"
          placeholder="Enter account number"
          value={formData.nairaAccount.accountNumber}
          maxLength={10}
          onChange={handleChange}
          onBlur={handleBlur}
          className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
          aria-describedby="accountNumberError"
          aria-invalid={!!errors.accountNumber}
          required
        />
        {errors.accountNumber && (
          <p id="accountNumberError" className="text-red-500 text-sm mt-1" role="alert">
            {errors.accountNumber}
          </p>
        )}
      </div>

      {/* Bank Name Dropdown */}
      <div>
        <label className="block mb-2 font-semibold text-[#111827]">Bank Name</label>
        <BankDropdown
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          setFormData={setFormData}
        />
      </div>

      {/* Account Name Field */}
      <div className="flex flex-col">
        <label htmlFor="accountName" className="block mb-2 font-semibold text-[#111827]">
          Account Name
        </label>
        <input
          type="text"
          id="nairaAccount.accountName"
          placeholder="Account name"
          value={formData.nairaAccount.accountName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
        />
        {errors.accountName && <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>}
      </div>
    </div>
  );
};

export default NairaPayoutForm;
