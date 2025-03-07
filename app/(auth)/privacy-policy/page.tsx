import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto leading-relaxed font-sans mt-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4"><strong>Effective Date:</strong> January 1, 2025</p>

      <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
      <p className="mb-4">
        Welcome to [Your Project Name]! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with our application and services. By using our services, you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li className="mb-2">
          <strong>Personal Information:</strong> When you sign up or interact with our services, we may collect personal data such as your name, email address, profile picture, and any other details you choose to provide.
        </li>
        <li className="mb-2">
          <strong>Usage Data:</strong> We automatically collect information on how you access and use our application, including your IP address, browser type, device information, and pages visited.
        </li>
        <li className="mb-2">
          <strong>Cookies and Tracking:</strong> Our website uses cookies and similar tracking technologies to enhance your experience. You can adjust your browser settings to refuse cookies; however, this may affect some functionalities of our service.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
      <p className="mb-4">We may use the collected information to:</p>
      <ul className="list-disc list-inside mb-4">
        <li className="mb-2">Provide, maintain, and improve our services.</li>
        <li className="mb-2">Personalize your experience.</li>
        <li className="mb-2">Communicate with you about updates, offers, or changes to our services.</li>
        <li className="mb-2">Monitor and analyze usage and trends to improve the service.</li>
        <li className="mb-2">Comply with legal obligations and enforce our policies.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Disclosure of Your Information</h2>
      <p className="mb-4">We do not sell your personal information. We may share your data with:</p>
      <ul className="list-disc list-inside mb-4">
        <li className="mb-2"><strong>Service Providers:</strong> Third parties who assist us in operating our services.</li>
        <li className="mb-2"><strong>Legal Compliance:</strong> Authorities if required by law or to protect our rights.</li>
        <li className="mb-2"><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of assets.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Security</h2>
      <p className="mb-4">
        We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is completely secure.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
      <p className="mb-4">
        Depending on your location, you may have the right to access, correct, or delete your personal data. Please contact us at <a href="mailto:your-email@example.com" className="text-blue-500 underline">your-email@example.com</a> with any requests or concerns.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update our Privacy Policy periodically. Changes will be posted on this page with an updated effective date.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:your-email@example.com" className="text-blue-500 underline">your-email@example.com</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;









// import React from "react";

// const PrivacyPolicy= () => {
//   return (
//     <div style={styles.container} className="mt-12">
//       <h1>Privacy Policy</h1>
//       <p><strong>Effective Date:</strong> January 1, 2025</p>

//       <h2>Introduction</h2>
//       <p>
//         Welcome to [Your Project Name]! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with our application and services. By using our services, you agree to the collection and use of information in accordance with this policy.
//       </p>

//       <h2>Information We Collect</h2>
//       <ul>
//         <li>
//           <strong>Personal Information:</strong> When you sign up or interact with our services, we may collect personal data such as your name, email address, profile picture, and any other details you choose to provide.
//         </li>
//         <li>
//           <strong>Usage Data:</strong> We automatically collect information on how you access and use our application, including your IP address, browser type, device information, and pages visited.
//         </li>
//         <li>
//           <strong>Cookies and Tracking:</strong> Our website uses cookies and similar tracking technologies to enhance your experience. You can adjust your browser settings to refuse cookies; however, this may affect some functionalities of our service.
//         </li>
//       </ul>

//       <h2>How We Use Your Information</h2>
//       <p>We may use the collected information to:</p>
//       <ul>
//         <li>Provide, maintain, and improve our services.</li>
//         <li>Personalize your experience.</li>
//         <li>Communicate with you about updates, offers, or changes to our services.</li>
//         <li>Monitor and analyze usage and trends to improve the service.</li>
//         <li>Comply with legal obligations and enforce our policies.</li>
//       </ul>

//       <h2>Disclosure of Your Information</h2>
//       <p>We do not sell your personal information. We may share your data with:</p>
//       <ul>
//         <li><strong>Service Providers:</strong> Third parties who assist us in operating our services.</li>
//         <li><strong>Legal Compliance:</strong> Authorities if required by law or to protect our rights.</li>
//         <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of assets.</li>
//       </ul>

//       <h2>Security</h2>
//       <p>
//         We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is completely secure.
//       </p>

//       <h2>Your Rights</h2>
//       <p>
//         Depending on your location, you may have the right to access, correct, or delete your personal data. Please contact us at <a href="mailto:your-email@example.com">your-email@example.com</a> with any requests or concerns.
//       </p>

//       <h2>Changes to This Privacy Policy</h2>
//       <p>
//         We may update our Privacy Policy periodically. Changes will be posted on this page with an updated effective date.
//       </p>

//       <h2>Contact Us</h2>
//       <p>
//         If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:your-email@example.com">your-email@example.com</a>
//       </p>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: "2rem",
//     maxWidth: "800px",
//     margin: "0 auto",
//     lineHeight: "1.6",
//     fontFamily: "Arial, sans-serif",
//     marginTop : "100px"
//   },
// };

// export default PrivacyPolicy;