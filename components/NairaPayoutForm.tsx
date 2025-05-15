"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import BankDropdown from "./BankDropdown";
import axiosInstance from "@/lib/axiosInstance";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

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
  const [validationState, setValidationState] = useState<{
    status: 'idle' | 'validating' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const prevValues = useRef({
    accountNumber: "",
    bankCode: ""
  });

  // Set bank details when selected
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
      // Reset validation when bank changes
      setValidationState({ status: 'idle', message: '' });
    }
  }, [selectedBank, setFormData]);

  // Memoized validation function
  const validateBankAccount = useCallback(async (accountNumber: string, bankCode: string) => {
    if (!bankCode || accountNumber.length !== 10) {
      setValidationState({ status: 'idle', message: '' });
      return;
    }

    if (accountNumber === prevValues.current.accountNumber && 
        bankCode === prevValues.current.bankCode) {
      return;
    }

    setValidationState({ status: 'validating', message: 'Validating account...' });

    try {
      const response = await axiosInstance.post("/validate-bank-account", {
        accountNumber,
        bankCode,
      });

      if (response.data?.data?.account_name) {
        setFormData((prev: any) => ({
          ...prev,
          nairaAccount: {
            ...prev.nairaAccount,
            accountName: response.data.data.account_name,
          },
        }));
        setErrors((prev) => ({ ...prev, accountName: '' }));
        setValidationState({ status: 'success', message: 'Account validated successfully' });
      } else {
        setErrors((prev) => ({ ...prev, accountName: 'Invalid account details' }));
        setValidationState({ status: 'error', message: 'Invalid account details' });
      }
    } catch (error) {
      const errorMessage = 'Invalid account details';
      setErrors((prev) => ({ ...prev, accountName: errorMessage }));
      setValidationState({ status: 'error', message: errorMessage });
      console.error(error)
    } finally {
      prevValues.current = { accountNumber, bankCode };
    }
  }, [setErrors, setFormData]);

  // Run validation when account number or bank changes
  useEffect(() => {
    const timer = setTimeout(() => {
      validateBankAccount(
        formData.nairaAccount.accountNumber, 
        selectedBank?.code || ""
      );
    }, 500); // Debounce to prevent rapid firing

    return () => clearTimeout(timer);
  }, [formData.nairaAccount.accountNumber, selectedBank?.code, validateBankAccount]);

  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    handleChange(e);

    const newErrors = { ...errors };

    if (name === "nairaAccount.accountNumber") {
      if (!/^\d{10}$/.test(value)) {
        newErrors.accountNumber = "Account number must be 10 digits.";
      } else {
        delete newErrors.accountNumber;
      }
      // Reset validation state when account number changes
      setValidationState({ status: 'idle', message: '' });
    }

    setErrors(newErrors);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Account Number Field */}
      <div className="flex flex-col w-full">
        <div className="w-full">
          <p className="font-general font-semibold text-[#111827] text-xl mb-5">Naira Payout</p>
        </div>
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
          <p id="accountNumberError" className="text-red-500 text-xs mt-1 w-full" role="alert">
            {errors.accountNumber}
          </p>
        )}
      </div>

      {/* Bank Name Dropdown */}
      <div className="lg:mt-12">
        <label className="block mb-2 font-semibold text-[#111827]">Bank Name</label>
        <BankDropdown
          formData={formData}
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
            value={
              validationState.status === 'validating'
                ? ''
                : formData.nairaAccount.accountName
            }
            disabled
            className={`px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50 pr-10
              ${validationState.status === 'error' ? 'border-red-500' : ''}
              ${validationState.status === 'success' ? 'border-green-500' : ''}
            `}
          />
          
          {/* Validation Status Indicators */}
          <span className="absolute inset-y-0 right-3 flex items-center">
            {validationState.status === 'validating' && (
              <Loader2 size={20} className="animate-spin text-gray-500" />
            )}
            {validationState.status === 'success' && (
              <CheckCircle size={20} className="text-green-500" />
            )}
            {validationState.status === 'error' && (
              <XCircle size={20} className="text-red-500" />
            )}
          </span>
        </div>
        
        {/* Validation Status Message */}
        {validationState.message && (
          <p className={`text-sm mt-1 ${
            validationState.status === 'error' ? 'text-red-500' : 
            validationState.status === 'success' ? 'text-green-500' : 
            'text-gray-500'
          }`}>
            {validationState.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NairaPayoutForm;