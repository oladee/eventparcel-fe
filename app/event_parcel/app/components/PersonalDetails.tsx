import React from 'react';

interface PersonalDetailsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  errors: {
    firstName: string;
    lastName: string;
    email: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  formData,
  errors,
  handleChange,
  handleBlur,
}) => {
  return (
    <div>
      <label className="block font-semibold text-[#111827]">Your Details</label>
      <p className="text-sm text-[#718096]">
        We will not share your personal details publicly
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block mb-2 font-semibold text-[#111827]"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
            placeholder="First name"
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block mb-2 font-semibold text-[#111827]"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
            placeholder="Last name"
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block mb-2 font-semibold text-[#111827]"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="input-field outline-primary w-full p-2 rounded-[5px] bg-slate-50"
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;