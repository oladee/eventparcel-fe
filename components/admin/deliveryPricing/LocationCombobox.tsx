"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";

export interface ComboboxItem {
  _id: string;
  name: string;
}

interface LocationComboboxProps {
  label: string;
  items: ComboboxItem[];
  value: string; // selected _id
  onChange: (id: string, name: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  error?: string;
  /** Allow free-text entry not in the list */
  allowFreeText?: boolean;
}

const LocationCombobox: React.FC<LocationComboboxProps> = ({
  label,
  items,
  value,
  onChange,
  disabled = false,
  loading = false,
  placeholder = "Type to search...",
  error,
  allowFreeText = false,
}) => {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  const selectedItem = items.find((i) => i._id === value) ?? null;

  useEffect(() => {
    if (selectedItem) {
      setInputValue(selectedItem.name);
      return;
    }

    if (!value) {
      setInputValue("");
      return;
    }

    // Free-text fallback uses raw value when no option matches.
    setInputValue(value);
  }, [selectedItem, value]);

  const filtered = useMemo(() => {
    if (query === "") return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, query]);

  const handleChange = (item: ComboboxItem | null) => {
    if (item) {
      onChange(item._id, item.name);
      setInputValue(item.name);
      setQuery("");
    }
  };

  const handleBlur = () => {
    const normalizedInput = inputValue.trim().toLowerCase();
    const exactMatch = items.find(
      (item) => item.name.trim().toLowerCase() === normalizedInput
    );

    if (exactMatch) {
      onChange(exactMatch._id, exactMatch.name);
      setInputValue(exactMatch.name);
      setQuery("");
      return;
    }

    if (allowFreeText && inputValue && !selectedItem) {
      // Accept free text only when explicitly enabled by caller.
      onChange(inputValue, inputValue);
      setQuery("");
      return;
    }

    if (!allowFreeText && !selectedItem) {
      // Keep ID-backed fields safe by not leaving unmatched manual text.
      setInputValue("");
      setQuery("");
    }
  };

  const inputBorder = error ? "border-red-400" : "border-[#E5E7EB]";

  return (
    <div>
      <label className="block text-sm font-medium text-[#718096] mb-1">
        {label}
      </label>
      <Combobox
        value={selectedItem}
        onChange={handleChange}
        disabled={disabled || loading}
      >
        <div className="relative">
          <ComboboxInput
            className={`w-full h-[44px] pl-3 pr-9 rounded-[8px] border text-sm text-[#111827] bg-[#FAFAFA] outline-none focus:ring-1 focus:ring-[#7A1626] disabled:opacity-50 disabled:cursor-not-allowed ${inputBorder}`}
            value={inputValue}
            onChange={(e) => {
              const nextValue = e.target.value;
              setInputValue(nextValue);
              setQuery(nextValue);

              // If user edits a previously selected option, clear stale selection.
              if (
                selectedItem &&
                nextValue.trim().toLowerCase() !==
                  selectedItem.name.trim().toLowerCase()
              ) {
                onChange("", "");
              }
            }}
            onBlur={handleBlur}
            placeholder={loading ? "Loading..." : placeholder}
            autoComplete="off"
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown className="text-[#A0AEC0]" size={18} />
          </ComboboxButton>

          <ComboboxOptions className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-[8px] bg-white py-1 shadow-lg border border-[#E5E7EB] text-sm">
            {filtered.length === 0 && query !== "" ? (
              allowFreeText ? (
                <div
                  className="px-3 py-2 text-[#7A1626] cursor-pointer hover:bg-[#fdf2f4]"
                  onMouseDown={() => {
                    onChange(query, query);
                    setInputValue(query);
                    setQuery("");
                  }}
                >
                  Use &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="px-3 py-2 text-[#A0AEC0]">No matches found</div>
              )
            ) : (
              filtered.map((item) => (
                <ComboboxOption
                  key={item._id}
                  value={item}
                  className="relative cursor-pointer select-none px-3 py-2 text-[#111827] data-[focus]:bg-[#fdf2f4] data-[focus]:text-[#7A1626]"
                >
                  {({ selected }) => (
                    <span className={`flex items-center gap-2 ${selected ? "font-medium" : "font-normal"}`}>
                      {selected && <HiCheck size={14} className="text-[#7A1626] shrink-0" />}
                      {!selected && <span className="w-[14px] shrink-0" />}
                      {item.name}
                    </span>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default LocationCombobox;
