// i will be storing all the icons in this file
import Image from "next/image";

// Define the interface for the component props
interface LogoProps {
  width: number;
  height: number;
}
// interface LogoProps2 {
//   width: number;
//   height: number;
//   cla
// }

// Logo component to display the company logo
export const Logo: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/logo4.png" // Path relative to the public folder
      alt="Company Logo"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

// Facebook icon component
export const Facebook: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/icons/facebook.svg" // Path relative to the public folder
      alt="Facebook Icon"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

// Google icon component
export const Google: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/icons/google.svg" // Path relative to the public folder
      alt="Google Icon"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

// Apple icon component
export const Apple: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/icons/apple.svg" // Path relative to the public folder
      alt="Apple Icon"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

// Calendar icon component
export const Calendar: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/icons/calendar.svg"
      alt="Calendar Icon"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

// Checked icon component
export const Checked: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/icons/checked.svg" // Path relative to the public folder
      alt="Apple Icon"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

export const Warning: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/warning.png" // Path relative to the public folder
      alt="warning Icon"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

export const Done: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/check.png" // Path relative to the public folder
      alt="done"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

export const Logo2: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/logo2.png" // Path relative to the public folder
      alt="logo"
      width={width}
      height={height}
      // priority 
    />
  );
};

export const Doc: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/doc.png" // Path relative to the public folder
      alt="doc"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

export const CSV: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/csv.png" // Path relative to the public folder
      alt="csv"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};

export const FileUpload: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <Image
      src="/images/file-upload.png" // Path relative to the public folder
      alt="FileUpload"
      width={width}
      height={height}
      priority // Use this prop if the image is critical (e.g., logo)
    />
  );
};
