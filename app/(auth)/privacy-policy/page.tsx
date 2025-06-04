import HeaderLayout from "@/components/layout/HeaderLayout";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <HeaderLayout>
      <div className="p-8 max-w-3xl mx-auto leading-relaxed font-sans mt-12">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          <strong>Last updated:</strong> 19 May 2025
        </p>
        <p className="mb-4">
          This Privacy Policy outlines how The Events Parcel Limited ("we", "us", or "our") collects, uses, discloses, and protects your personal information when you use our website, platform, or services (collectively, the “Platform”).
        </p>
        <p className="mb-4">
          By accessing or using our Platform, you consent to the practices described in this Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold mb-2">1. Who We Are</h2>
        <p className="mb-4">
          The Events Parcel Limited is a technology company incorporated in Nigeria. We provide event coordination and package management solutions that allow event hosts to manage guest groups and distribute items such as Aso Ebi and event kits through our digital platform.
        </p>

        <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
        <p className="mb-2 font-semibold">a. Information You Provide:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Name, phone number, email address</li>
          <li>Event details (e.g., event type, date, host identity)</li>
          <li>Delivery address (if applicable)</li>
          <li>Payment and transaction data (handled via Paystack and/or PayPal)</li>
        </ul>
        <p className="mb-2 font-semibold">b. Automatically Collected Information:</p>
        <ul className="list-disc list-inside mb-4">
          <li>IP address and browser information</li>
          <li>Device type, operating system</li>
          <li>Date and time of access</li>
          <li>Usage logs and interaction data</li>
        </ul>
        <p className="mb-2 font-semibold">c. Information from Third Parties:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Payment processors (e.g., confirmation of payment status)</li>
          <li>Logistics or courier services (e.g., delivery updates)</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Provide and improve our services</li>
          <li>Facilitate event group management and package purchases</li>
          <li>Send confirmations, updates, and notifications</li>
          <li>Process payments and manage refunds</li>
          <li>Communicate with you regarding your account or orders</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">4. Sharing of Information</h2>
        <p className="mb-4">
          We may share your information with:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Event hosts (as necessary to fulfill your participation in an event)</li>
          <li>Payment processors (e.g., Paystack, PayPal)</li>
          <li>Logistics partners (e.g., courier companies for deliveries)</li>
          <li>Government authorities or regulators where required by law</li>
          <li>Our legal and professional advisers</li>
        </ul>
        <p className="mb-4">
          We do not sell your personal data to third parties.
        </p>

        <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. However, no online transmission is 100% secure, and we encourage you to also take appropriate safeguards.
        </p>

        <h2 className="text-2xl font-semibold mb-2">6. Data Retention</h2>
        <p className="mb-4">
          We retain your personal information only for as long as necessary to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Fulfill the purposes for which it was collected</li>
          <li>Comply with legal or regulatory obligations</li>
          <li>Resolve disputes or enforce our agreements</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">7. Your Rights</h2>
        <p className="mb-4">
          Subject to applicable Nigerian data protection laws, you have the right to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate or outdated information</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Request deletion of your data (subject to legal retention requirements)</li>
          <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC)</li>
        </ul>
        <p className="mb-4">
          To exercise your rights, contact us at <a href="mailto:hi@eventparcel.com" className="text-blue-500 underline">hi@eventparcel.com</a>
        </p>

        <h2 className="text-2xl font-semibold mb-2">8. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies and similar technologies to improve functionality, analyze usage, and enhance user experience. You can control the use of cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mb-2">9. Children's Privacy</h2>
        <p className="mb-4">
          Our services are not intended for use by individuals under 18 years of age. We do not knowingly collect personal data from children. If we become aware that we have collected such data, we will delete it.
        </p>

        <h2 className="text-2xl font-semibold mb-2">10. International Transfers</h2>
        <p className="mb-4">
          If your data is transferred outside Nigeria (e.g., for processing by PayPal), we ensure that such transfers comply with applicable laws and safeguard your privacy rights through appropriate mechanisms.
        </p>

        <h2 className="text-2xl font-semibold mb-2">11. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised date will be indicated at the top. We encourage you to review this page periodically.
        </p>

        <h2 className="text-2xl font-semibold mb-2">12. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The Events Parcel Limited</li>
          <li>Email: <a href="mailto:hi@eventparcel.com" className="text-blue-500 underline">hi@eventparcel.com</a></li>
          <li>Website: <a href="https://www.eventparcel.com" className="text-blue-500 underline">www.eventparcel.com</a></li>
        </ul>
      </div>
    </HeaderLayout>
  );
};

export default PrivacyPolicy;



























// import HeaderLayout from "@/components/layout/HeaderLayout";
// import React from "react";

// const PrivacyPolicy = () => {
//   return (
//     <HeaderLayout>
//       <div className="p-8 max-w-3xl mx-auto leading-relaxed font-sans mt-12">
//         <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
//         <p className="mb-4">
//           <strong>Effective Date:</strong> January 1, 2025
//         </p>

//         <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
//         <p className="mb-4">
//           Welcome to [Your Project Name]! This Privacy Policy explains how we
//           collect, use, disclose, and safeguard your information when you
//           interact with our application and services. By using our services, you
//           agree to the collection and use of information in accordance with this
//           policy.
//         </p>

//         <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
//         <ul className="list-disc list-inside mb-4">
//           <li className="mb-2">
//             <strong>Personal Information:</strong> When you sign up or interact
//             with our services, we may collect personal data such as your name,
//             email address, profile picture, and any other details you choose to
//             provide.
//           </li>
//           <li className="mb-2">
//             <strong>Usage Data:</strong> We automatically collect information on
//             how you access and use our application, including your IP address,
//             browser type, device information, and pages visited.
//           </li>
//           <li className="mb-2">
//             <strong>Cookies and Tracking:</strong> Our website uses cookies and
//             similar tracking technologies to enhance your experience. You can
//             adjust your browser settings to refuse cookies; however, this may
//             affect some functionalities of our service.
//           </li>
//         </ul>

//         <h2 className="text-2xl font-semibold mb-2">
//           How We Use Your Information
//         </h2>
//         <p className="mb-4">We may use the collected information to:</p>
//         <ul className="list-disc list-inside mb-4">
//           <li className="mb-2">Provide, maintain, and improve our services.</li>
//           <li className="mb-2">Personalize your experience.</li>
//           <li className="mb-2">
//             Communicate with you about updates, offers, or changes to our
//             services.
//           </li>
//           <li className="mb-2">
//             Monitor and analyze usage and trends to improve the service.
//           </li>
//           <li className="mb-2">
//             Comply with legal obligations and enforce our policies.
//           </li>
//         </ul>

//         <h2 className="text-2xl font-semibold mb-2">
//           Disclosure of Your Information
//         </h2>
//         <p className="mb-4">
//           We do not sell your personal information. We may share your data with:
//         </p>
//         <ul className="list-disc list-inside mb-4">
//           <li className="mb-2">
//             <strong>Service Providers:</strong> Third parties who assist us in
//             operating our services.
//           </li>
//           <li className="mb-2">
//             <strong>Legal Compliance:</strong> Authorities if required by law or
//             to protect our rights.
//           </li>
//           <li className="mb-2">
//             <strong>Business Transfers:</strong> In connection with any merger,
//             sale, or transfer of assets.
//           </li>
//         </ul>

//         <h2 className="text-2xl font-semibold mb-2">Security</h2>
//         <p className="mb-4">
//           We implement a variety of security measures to maintain the safety of
//           your personal information. However, no method of transmission over the
//           Internet is completely secure.
//         </p>

//         <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
//         <p className="mb-4">
//           Depending on your location, you may have the right to access, correct,
//           or delete your personal data. Please contact us at{" "}
//           <a
//             href="mailto:your-email@example.com"
//             className="text-blue-500 underline"
//           >
//             your-email@example.com
//           </a>{" "}
//           with any requests or concerns.
//         </p>

//         <h2 className="text-2xl font-semibold mb-2">
//           Changes to This Privacy Policy
//         </h2>
//         <p className="mb-4">
//           We may update our Privacy Policy periodically. Changes will be posted
//           on this page with an updated effective date.
//         </p>

//         <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
//         <p className="mb-4">
//           If you have any questions or concerns about this Privacy Policy,
//           please contact us at:{" "}
//           <a
//             href="mailto:your-email@example.com"
//             className="text-blue-500 underline"
//           >
//             your-email@example.com
//           </a>
//         </p>
//       </div>
//     </HeaderLayout>
//   );
// };

// export default PrivacyPolicy;
