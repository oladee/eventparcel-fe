interface GroupPrivacySelectorProps {
    groupPrivacy: "private" | "general"; 
    onPrivacyChange: (groupPrivacy: "private" | "general") => void;
  }
  
  const GroupPrivacySelector: React.FC<GroupPrivacySelectorProps> = ({ groupPrivacy, onPrivacyChange }) => {
    return (
      <div className="flex flex-col gap-3 mt-4">
        <span className="flex justify-start font-general text-base font-semibold text-[#111827]">
          Select group privacy
        </span>
        <div className="flex gap-14 mb-3">
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => onPrivacyChange("general")}
          >
            <img
              src={groupPrivacy === "general" ? "/images/check.png" : "/images/unchecked.png"}
              alt="check"
              width={20}
              height={20}
            />
            <span className="font-general font-medium text-base text-[#111827]"> General </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => onPrivacyChange("private")}
          >
            <img
              src={groupPrivacy === "private" ? "/images/check.png" : "/images/unchecked.png"}
              alt="check"
              width={20}
              height={20}
            />
            <span className="font-general font-medium text-base text-[#111827]"> Private </span>
          </button>
        </div>
      </div>
    );
  };
  
  export default GroupPrivacySelector;
  