import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const PhoneNumberInput = ({
  onPhoneChange,
  phoneValue = ""
}: {
  onPhoneChange: (value: string) => void;
  phoneValue?: string;
}) => {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("NG"); 
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setPhone(phoneValue || "");
  }, [phoneValue]);

  const handlePhoneChange = (value: string, countryData: any) => {
    const countryCode = countryData.countryCode?.toUpperCase();
    setPhone(value);
    onPhoneChange(value);
    setCountry(countryCode);

    // Parse phone number
    const phoneNumber = parsePhoneNumberFromString(value, countryCode);
    const isPhoneValid = phoneNumber?.isValid() ?? false;

    if (isPhoneValid) {
      setError(""); 
    } else {
      setError("Invalid phone number for selected country");
    }

    // Get expected length range 
    const nationalNumber = phoneNumber?.nationalNumber || "";
    const expectedMinLength = 7;  
    const expectedMaxLength = 15; 

    if (nationalNumber.length < expectedMinLength || nationalNumber.length > expectedMaxLength) {
      setError(`Phone number must be between ${expectedMinLength}-${expectedMaxLength} digits`);
    }
  };

  return (
    <div className="h-14">
      <PhoneInput
        country={country.toLowerCase()} 
        value={phone}
        onChange={handlePhoneChange}
        enableSearch
        disableDropdown={false}
        onFocus={() => setTouched(true)}
        inputClass="!w-full !py-6 !border-none !rounded-[12px] !bg-gray-100 !focus:outline-none !focus:ring-2 !focus:ring-gray-300"
        buttonClass="!border-none !rounded-l-[12px]"
        containerClass="custom-phone-input"
      />
      {touched && error && <p style={{ color: "red", fontSize: "12px"}}>{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
