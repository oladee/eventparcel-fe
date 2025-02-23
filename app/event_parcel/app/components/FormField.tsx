import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  isTextArea?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  isTextArea = false,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 font-semibold text-[#111827]">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="input-field outline-primary h-[140px] w-full resize-none p-4 rounded-[5px] bg-slate-50"
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
          placeholder={placeholder}
          required={required}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;