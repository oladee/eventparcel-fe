import React from "react";

interface GroupFormFieldsProps {
  formData: { groupName: string; groupDescription: string };
  errors: { groupName: string; groupDescription: string };
  touched: { groupName: boolean; groupDescription: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GroupFormFields: React.FC<GroupFormFieldsProps> = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        id="groupName"
        value={formData.groupName}
        onChange={handleChange}
        onBlur={handleBlur}
        className="h-14 shadow-sm bg-gray-50 border rounded-xl border-gray-300 text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
        placeholder="Group name"
        required
      />
      {touched.groupName && errors.groupName && <p className="text-xs text-red-500">{errors.groupName}</p>}

      <textarea
        id="groupDescription"
        value={formData.groupDescription}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Group groupDescription"
        className="h-[120px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
        required
      />
      {touched.groupDescription && errors.groupDescription && <p className="text-xs text-red-500">{errors.groupDescription}</p>}
    </div>
  );
};

export default GroupFormFields;
