import Image from 'next/image';

// Define the interface for the component props
interface LogoProps {
    width: number;
    height: number;
}

// Logo component to display the company logo
export const Logo: React.FC<LogoProps> = ({ width, height }) => {
    return (
        <Image
            src="/images/logo.png" // Path relative to the public folder
            alt="Company Logo"
            width={width}
            height={height}
            priority // Use this prop if the image is critical (e.g., logo)
        />
    );
}

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
}

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
}

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
}

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
}