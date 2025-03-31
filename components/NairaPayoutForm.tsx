import React, { useEffect, useState } from "react";
import BankDropdown from "./BankDropdown";
import axiosInstance from "@/lib/axiosInstance";
import { CheckCircle, XCircle } from "lucide-react";


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
      bankCode: string;
    };
  };

  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const NairaPayoutForm: React.FC<NairaPayoutFormProps> = ({
  formData,
  errors,
  handleChange,
  handleBlur,
  selectedBank,
  setSelectedBank,
  setFormData,
  setErrors
}) => {

  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (selectedBank) {
      setFormData((prev: any) => ({
        ...prev,
        nairaAccount: {
          ...prev.nairaAccount,
          bankName: selectedBank.name,
          bankCode: selectedBank.code, 
        },
      }));
    }
  }, [selectedBank, setFormData]);

  useEffect(() => {
    const validateBankAccount = async () => {
      const { accountNumber } = formData.nairaAccount;
      if (!selectedBank || accountNumber.length !== 10) return;

      setIsValidating(true);
      try {
        const response = await axiosInstance.post("/validate-bank-account", {
          accountNumber,
          bankCode: selectedBank.code,
        });

        if (response.data?.data?.account_name) {
          setFormData((prev: any) => ({
            ...prev,
            nairaAccount: {
              ...prev.nairaAccount,
              accountName: response.data.data.account_name,
            },
          }));
          setErrors((prev) => ({ ...prev, accountName: "" })); // Clear previous errors
        } else {
          setErrors((prev) => ({ ...prev, accountName: "Invalid account details" }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, accountName: "Error validating account" }));
        console.log(error)
      } finally {
        setIsValidating(false);
      }
    };

    validateBankAccount();
  }, [formData.nairaAccount.accountNumber, selectedBank,formData.nairaAccount,setErrors,setFormData]);

   const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleChange(e);
  
    const newErrors = { ...errors };
  
    if (e.target.name === "nairaAccount.accountNumber") {
      if (!/^\d{10}$/.test(value)) {
        newErrors.accountNumber = "Account number must be 10 digits.";
      } else {
        delete newErrors.accountNumber;
      }
    }
  
    setErrors(newErrors);
  };
  

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
          name="nairaAccount.accountNumber"
          value={formData.nairaAccount.accountNumber}
          maxLength={10}
          onChange={handleValidation}
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
      <div className="flex flex-col -mt-5 relative">
        <label htmlFor="accountName" className="block mb-2 font-semibold text-[#111827]">
          Account Name
        </label>
        <div className="relative w-full">
          <input
            type="text"
            id="nairaAccount.accountName"
            placeholder="Account name"
            value={isValidating ? "Validating..." : formData.nairaAccount.accountName}
            disabled
            className={`px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50 pr-10
              ${errors.accountName ? "border-red-500" : "border-green-500"}
            `}
          />
          {/* Validation Icons */}
          {!isValidating && formData.nairaAccount.accountName && (
            <span className="absolute inset-y-0 right-3 flex items-center">
              {errors.accountName ? (
                <XCircle size={20} className="text-red-500" />
              ) : (
                <CheckCircle size={20} className="text-green-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NairaPayoutForm;
