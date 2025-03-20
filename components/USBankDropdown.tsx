import React, { useState } from "react";
import { usBanks } from "@/data/usBanks";

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

interface BankDropdownProps {
  selectedUSBank: USBank | null;
  setSelectedUSBank: (usBank: USBank) => void;
  setFormData: (data: any) => void;
}

const USBankDropdown: React.FC<BankDropdownProps> = ({
  selectedUSBank,
  setSelectedUSBank,
  setFormData,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const filteredBanks = usBanks.filter((bank: USBank) =>
    bank.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSelectBank = (bank: USBank) => {
    setSelectedUSBank(bank);
    setIsDropdownOpen(false);
    setFormData((prev: any) => ({
      ...prev,
      dollarAccount: {
        ...prev.dollarAccount,
        usBankName: bank.name,
      },
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, bank?: USBank) => {
    switch (e.key) {
      case "Enter":
      case " ":
        if (bank) {
          handleSelectBank(bank);
        } else {
          setIsDropdownOpen(!isDropdownOpen);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredBanks.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredBanks.length - 1
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative mb-6">
      <div
        role="combobox"
        aria-expanded={isDropdownOpen}
        aria-controls="us-bank-list"
        aria-haspopup="listbox"
        className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        tabIndex={0}
      >
        {selectedUSBank ? (
          <span className="font-medium">{selectedUSBank.name}</span>
        ) : (
          <span>Select Bank</span>
        )}
      </div>
      {isDropdownOpen && (
        <div
          id="us-bank-list"
          role="listbox"
          className="absolute z-10 w-full bg-white border rounded mt-2 max-h-60 overflow-y-auto"
        >
          <input
            type="text"
            placeholder="Search for a bank..."
            className="w-full p-2 border-b"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search for a bank"
          />
          {filteredBanks.length > 0 ? (
            filteredBanks.map((bank: USBank, index: number) => (
              <div
                key={bank.bankId}
                role="option"
                aria-selected={selectedUSBank?.bankId === bank.bankId}
                className={`flex flex-col p-2 cursor-pointer hover:bg-gray-100 ${
                  focusedIndex === index ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectBank(bank)}
                onKeyDown={(e) => handleKeyDown(e, bank)}
                tabIndex={0}
                onMouseEnter={() => setFocusedIndex(index)} 
              >
                <span className="font-medium">{bank.name}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center">Not found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default USBankDropdown;