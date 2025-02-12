import React from "react";

const DataDeletionPolicy = () => {
  return (
    <div style={styles.container}>
      <h1>Data Deletion Policy</h1>
      <p><strong>Effective Date:</strong> January 1, 2025</p>

      <h2>Introduction</h2>
      <p>
        At [Your Project Name], we value your privacy and provide you with the ability to manage your personal data. This Data Deletion Policy explains how you can request the deletion of your data from our system.
      </p>

      <h2>How to Request Data Deletion</h2>
      <p>If you would like to have your personal data removed from our records, please follow these steps:</p>
      <ol>
        <li>
          <strong>Submit a Request:</strong> Send an email to <a href="mailto:your-email@example.com">your-email@example.com</a> with the subject line “Data Deletion Request”. In your email, include:
          <ul>
            <li>Your registered email address.</li>
            <li>Your username (if applicable).</li>
            <li>A statement confirming that you request the deletion of your personal data.</li>
          </ul>
        </li>
        <li>
          <strong>Verification:</strong> We may ask for additional information to verify your identity before processing your request.
        </li>
        <li>
          <strong>Processing Your Request:</strong> Once your identity is verified, we will remove your data from our active systems within 30 days. Please note that some data may be retained for legal, accounting, or security purposes as required by law.
        </li>
      </ol>

      <h2>Data Retention and Backups</h2>
      <p>
        Data stored in backup systems may persist for a short period. However, this data will be overwritten during the next backup cycle and will no longer be associated with your account.
      </p>

      <h2>Consequences of Data Deletion</h2>
      <p>
        Please note that once your data is deleted:
      </p>
      <ul>
        <li>You will lose access to your account and any associated information.</li>
        <li>You may not be able to recover data that has been permanently removed.</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about our Data Deletion Policy or need further assistance, please contact us at: <a href="mailto:your-email@example.com">your-email@example.com</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.6",
    fontFamily: "Arial, sans-serif",
  },
};

export default DataDeletionPolicy;