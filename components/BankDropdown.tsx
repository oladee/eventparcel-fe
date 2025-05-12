import React, { useState } from "react";
import Image from "next/image";
import { banks } from "@/data/banks";

interface Bank {
  name: string;
  code: string;
  url: string;
}

interface BankDropdownProps {
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  setFormData: (data: any) => void;
}

const BankDropdown: React.FC<BankDropdownProps> = ({
  selectedBank,
  setSelectedBank,
  setFormData,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const filteredBanks = banks.filter((bank: Bank) =>
    bank.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="relative mb-6">
      <div
        role="combobox"
        aria-expanded={isDropdownOpen}
        aria-controls="bank-list"
        aria-haspopup="listbox"
        className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsDropdownOpen(!isDropdownOpen);
          }
        }}
        tabIndex={0}
      >
        {selectedBank ? (
          <div className="flex items-center">
            <Image
              src={selectedBank.url}
              alt={selectedBank.name}
              className="w-6 h-6 mr-2"
              width={24}
              height={24}
            />
            <span>{selectedBank.name}</span>
            <span className="ml-auto">({selectedBank.code})</span>
          </div>
        ) : (
          <span>Select Bank</span>
        )}
      </div>
      {isDropdownOpen && (
        <div
          id="nairaAccount.bank-list"
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
            filteredBanks.map((bank: Bank) => (
              <div
                key={bank.code}
                role="option"
                aria-selected={selectedBank?.code === bank.code}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedBank(bank);
                  setIsDropdownOpen(false);
                  setFormData((prev: any) => ({ ...prev, nairaAccount: {...prev.nairaAccount, bankName: bank.name }}));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedBank(bank);
                    setIsDropdownOpen(false);
                    setFormData((prev: any) => ({ ...prev, nairaAccount: {...prev.nairaAccount, bankName: bank.name }}));
                  }
                }}
                tabIndex={0}
              >
                <Image
                  src={bank.url}
                  alt={bank.name}
                  className="w-6 h-6 mr-2"
                  width={24}
                  height={24}
                />
                <span>{bank.name}</span>
                <span className="ml-auto">({bank.code})</span>
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

export default BankDropdown;