import HeaderLayout from "@/components/layout/HeaderLayout";
import React from "react";

const TermsAndConditions = () => {
  return (
    <HeaderLayout>
      <div className="p-8 max-w-3xl mx-auto leading-relaxed font-sans mt-12">
        {/* Main Title */}
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        {/* Terms for Hosts */}
        <h2 className="text-2xl font-semibold mb-4">Terms for Hosts</h2>

        {/* I. Binding Agreement */}
        <h3 className="text-xl font-semibold mb-2">I. Binding Agreement</h3>
        <p className="mb-4">
          These Terms of Service (this “Agreement”) constitute a binding and enforceable agreement between you (the “Event Host”) and The Events Parcel Limited (“Event Parcel”). Please read this Agreement carefully before using our services.
        </p>
        <p className="mb-4">
          <strong>Definitions:</strong> An “Event Host” is any individual or organization using our platform to create or manage an event, assign packages, coordinate Aso Ebi groups, or invite guests.
        </p>
        <p className="mb-4">
          A “Guest” is any individual invited to an event created on Event Parcel.
          A “Purchaser” is any individual who makes a payment on the platform (e.g., for tickets, packages, Aso ebi or group items).
        </p>
        <p className="mb-4">
          Event Parcel provides a digital platform that facilitates Aso Ebi coordination, sales, and invitation management for events. Event Parcel is not affiliated with any Event Host and solely acts as an intermediary between the Event Host and the Purchaser or Guest.
        </p>
        <p className="mb-6">
          This Agreement applies only to the specific Events which the Event Host has engaged Event Parcel. Therefore, any other events hosted or produced by Event Host shall be governed by a separate agreement.
        </p>

        {/* II. Events */}
        <h3 className="text-xl font-semibold mb-2">II. Events</h3>
        <p className="mb-2">
          <strong>Advertising:</strong> This Agreement does not create any obligation on the part of Event Parcel to sponsor, support, advertise, promote, or otherwise perform any action on behalf of the Event Host with respect to, or in furtherance of, any Event.
        </p>
        <p className="mb-2">
          <strong>Use of Information:</strong> If the Event Host chooses to enable a public event page for any Event, Event Parcel may, in its sole and absolute discretion, use the public information for Event Parcel marketing purposes on its website, social platform and business development purposes, provided the Event Host originally made such information public.
        </p>
        <p className="mb-6">
          <strong>Limitation of Liability:</strong> Event Parcel is not liable for issues arising from any event including but not limited to cancellations, no-shows, or venue capacity limitations. Our liability is limited to any fees paid to our platform by the Event Host in sending out the invitations, in the event of an outage or technical issue.
        </p>

        {/* III. Representations and Warranties of Event Host */}
        <h3 className="text-xl font-semibold mb-2">III. Representations and Warranties of Event Host</h3>
        <p className="mb-4">
          <strong>Representations &amp; Warranties:</strong> Event Host agrees, and represents and warrants to Event Parcel that:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            Event Host has the sole authority to organize and coordinate the Event and determine the quantity and types of Packages (including Aso Ebi, souvenirs, etc.) made available for purchase through the platform.
          </li>
          <li>
            Event Host is responsible for all state, local, federal and other taxes with respect to the Event and the sale of packages therefore.
          </li>
          <li>
            Event Host owns or is otherwise entitled to use, all material posted to the Event Parcel website by Event Host or provided to Event Parcel for any purpose, and the use of such material or information does not infringe on any patent, copyright, or other intellectual property right of any third party.
          </li>
        </ul>

        {/* IV. Package Pricing; Fees */}
        <h3 className="text-xl font-semibold mb-2">IV. Package Pricing; Fees</h3>
        <p className="mb-4">
          <strong>Pricing:</strong> The Event Host shall be solely responsible for setting the price(s) for the event package(s) or parcel(s).
        </p>
        <p className="mb-4">
          <strong>Service Fees:</strong> Event Parcel charges a platform fee as detailed in the current Pricing Schedule. These fees may vary depending on the service level or transaction method.
        </p>
        <p className="mb-6">
          <strong>Host Payouts:</strong> Host payouts will be processed via Paystack (NGN) or PayPal (USD), subject to transaction fees and scheduled payouts.
        </p>

        {/* V. Event Management and Refunds */}
        <h3 className="text-xl font-semibold mb-2">V. Event Management and Refunds</h3>
        <p className="mb-4">
          <strong>Capacity:</strong> The Host determines the event capacity. Event Parcel bears no responsibility for oversubscription or guest management.
        </p>
        <p className="mb-2">
          <strong>Refund Policy:</strong>
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            All sales made on behalf of the Event Host are final.
          </li>
          <li>
            Hosts are responsible for refunding guests in cases of cancellation or changes.
          </li>
          <li>
            Event Parcel does not issue refunds except where legally mandated.
          </li>
        </ul>

        {/* VI. Link Sharing */}
        <h3 className="text-xl font-semibold mb-2">VI. Link Sharing</h3>
        <p className="mb-6">
          Each guest receives a unique recipient link to access their assigned Event Package. For Private Groups, these personalized links are exclusive to each guest and must not be shared or forwarded. Sharing personalized links may result in access issues or incorrect order attribution. If broader access is needed, the Host should configure the group as a General Group and generate a public link that can be shared freely. It is the Host’s responsibility to select the appropriate group type and manage link distribution accordingly.
        </p>

        {/* VII. Account Settlement */}
        <h3 className="text-xl font-semibold mb-2">VII. Account Settlement</h3>
        <p className="mb-4">
          <strong>Sales Records:</strong> Event Parcel provides real-time dashboards showing all transactions.
        </p>
        <p className="mb-6">
          <strong>Payouts:</strong> Payouts are managed by Paystack or PayPal, depending on the Host’s currency. Processing timelines vary by payment processor.
        </p>

        {/* VIII. Indemnification */}
        <h3 className="text-xl font-semibold mb-2">VIII. Indemnification</h3>
        <p className="mb-6">
          You agree to indemnify The Events Parcel Limited against any losses, claims, or liabilities arising from:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Breach of this Agreement</li>
          <li>Violation of laws or regulations</li>
          <li>Intellectual property infringement</li>
        </ul>

        {/* IX. Miscellaneous */}
        <h3 className="text-xl font-semibold mb-2">IX. Miscellaneous</h3>
        <p className="mb-4">
          <strong>Waiver:</strong> Any failure on the part of any Party to comply with any of its obligations, agreements or conditions hereunder may be waived by any other Party to whom such compliance is owed. No waiver of any provision of this Agreement shall be deemed, or shall constitute, a waiver of any other provision, whether or not similar, nor shall any waiver constitute a continuing waiver.
        </p>
        <p className="mb-4">
          <strong>Assignment:</strong> Neither this Agreement nor any rights hereunder shall be assignable by either party hereto without the written consent of the other party. Any such assignment in violation of this provision shall be void and of no force or effect.
        </p>
        <p className="mb-4">
          <strong>Headings:</strong> The section and other headings in this Agreement are inserted solely as a matter of convenience and for reference, and are not a part of this Agreement.
        </p>
        <p className="mb-4">
          <strong>Entire Agreement:</strong> This Agreement, and the other documents linked herein, including the Pricing Schedule and the Privacy Policy, contain and constitute the entire agreement among the parties and supersede and cancel any prior agreements, representations, warranties, or communications, whether oral or written, among the parties relating to the transactions contemplated by this Agreement.
        </p>
        <p className="mb-4">
          <strong>Severability:</strong> The provisions of this Agreement are severable and the invalidity of one or more of the provisions herein shall not have any effect upon the validity or enforceability of any other provision.
        </p>
        <p className="mb-4">
          <strong>Consent to Conduct Business Electronically:</strong> The parties may use and rely upon electronic records and electronic signatures for execution and delivery of this Agreement and any other agreement, understandings, notices, disclosures or other documents, communications or information of any type sent or received in accordance with this Agreement.
        </p>
        <p className="mb-4">
          <strong>Disclaimer of Warranties:</strong><br />
          Event Host understands and hereby acknowledges that Event Parcel provides all services on an “as is” and “where is” basis, and Event Parcel makes no warranty or representation regarding, and assumes no responsibility for, the timeliness, accurate transmission, or retention of any communication effect through its website or otherwise.<br />
          Event Parcel disclaims all liability for, and makes no representation or warranty regarding, the availability of its website from any region or for any user.<br />
          Event Parcel shall not be obligated to perform any service required to be performed by it under this Agreement in the event that such performance is made impossible or impractical by any internet outage, delay, unauthorized access, act of God, or other contingency outside of Event Parcel’s control.
        </p>
        <p className="mb-6">
          <strong>Amendment:</strong> We may modify these Terms at any time. Updated terms will be posted on this page with a new effective date. Your continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.
        </p>

        {/* X. Dispute Resolution */}
        <h3 className="text-xl font-semibold mb-2">X. Dispute Resolution</h3>
        <p className="mb-4">
          <strong>Arbitration:</strong> Except as otherwise expressly provided in this Agreement, any dispute, controversy, or claim arising out of or relating to this Agreement or any agreement contemplated herein—including any question regarding its existence, validity, interpretation, breach, or termination—shall be referred to and finally resolved by binding arbitration in Nigeria. The arbitration shall be conducted in accordance with the Arbitration and Mediation Act 2023 of Nigeria, or any applicable replacement legislation, and administered by a recognized arbitration body within Nigeria, unless otherwise agreed by the parties.
        </p>
        <p className="mb-4">
          If the parties fail to agree on the appointment of an arbitrator within fifteen (15) days of written notice of intent to arbitrate, either party may request the arbitration body to appoint an arbitrator in accordance with its applicable rules.
        </p>
        <p className="mb-2">
          Unless otherwise determined by the arbitrator:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>The costs and fees of the arbitration, including the arbitrator’s fees, shall be shared equally by both parties.</li>
          <li>Each party shall bear its own legal fees and related expenses. However, where the arbitrator finds that a claim or defense was frivolous or lacked a reasonable basis in fact or law, the arbitrator may direct the responsible party to pay part or all of the other party’s legal costs.</li>
          <li>The award rendered by the arbitrator shall be final and binding on the parties and may be enforced by any court of competent jurisdiction in Nigeria.</li>
        </ul>
        <p className="mb-4">
          <strong>Litigation as a Last Resort:</strong> If, and only if, the arbitration provision above is held to be invalid or unenforceable by a competent legal authority, any dispute shall be submitted to the courts of competent jurisdiction in Nigeria. Each party agrees to submit to the exclusive jurisdiction of such courts and waives any objection to venue.
        </p>
        <p className="mb-6">
          Notwithstanding the foregoing, The Events Parcel Limited reserves the right to seek interim, injunctive, or equitable relief in any court of competent jurisdiction as may be necessary to protect its rights or enforce its interests, including but not limited to intellectual property protection or breach of confidentiality. Service of legal process in such actions may be effected by delivery to the party’s registered email address or physical address, and shall be valid irrespective of location.
        </p>

        {/* Terms for Guests */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Terms for Guest (Purchasers)</h2>

        {/* I. Agreement to Terms */}
        <h3 className="text-xl font-semibold mb-2">I. Agreement to Terms</h3>
        <p className="mb-6">
          These Terms of Service (“Terms”) constitute a legally binding agreement between you (“Guest,” “you,” or “Purchaser”) and The Events Parcel Limited (“Event Parcel,” “we,” “our,” or “us”) governing your use of our platform to purchase event-related packages, including outfits (Aso Ebi), and other items (collectively referred to as “Packages”). 
          “Event Host” refers to any individual or entity using our platform to create, manage, or coordinate an event, including defining guest groups, assigning Packages, and monitoring orders. A “Guest” is any person invited to an event via our platform and who makes a purchase through our website. 
          Event Parcel is an independent service provider offering digital coordination tools for events. We act solely as an intermediary between the Event Host and Guests, and are not a party to the event itself. By accessing our platform and completing a transaction, you agree to abide by these Terms.
        </p>

        {/* II. Events, Packages & Pricing */}
        <h3 className="text-xl font-semibold mb-2">II. Events, Packages &amp; Pricing</h3>
        <p className="mb-6">
          All event details, including available guest groups, assigned Packages (e.g., attire, souvenirs), and pricing are determined solely by the Event Host. Event Parcel facilitates the sale and distribution but does not control pricing or availability. The Event Host sets the quantity and availability of Packages. Event Parcel is not liable for overselling or stock-related issues. Package descriptions, images, delivery timelines, and any associated logistics are the responsibility of the Event Host. Event Parcel does not verify or guarantee the accuracy of this information.
        </p>

        {/* III. Ordering, Delivery & Refunds */}
        <h3 className="text-xl font-semibold mb-2">III. Ordering, Delivery &amp; Refunds</h3>
        <p className="mb-4">
          <strong>Delivery:</strong> All orders will be confirmed via email. Depending on the Host’s selected fulfillment method, items may be delivered to the Guest via courier, digital access, or on-site pickup. Event Parcel is not responsible for delivery delays, losses, or misdeliveries once the item has left the control of our platform.
        </p>
        <p className="mb-4">
          <strong>All Sales Final:</strong> Purchases are final. Refunds or exchanges will not be offered by Event Parcel. If an event is canceled, rescheduled, or if a Package becomes unavailable, you must contact the Event Host directly. Event Parcel is not responsible for issuing refunds.
        </p>
        <p className="mb-4">
          <strong>Order Cancellation:</strong> Event Parcel reserves the right to cancel or reject any order at any time prior to payment processing for any reason.
        </p>
        <p className="mb-6">
          <strong>Resale Prohibited:</strong> Purchased Packages are non-transferable and may not be resold. Resold Packages may be voided at the discretion of the Event Host without refund.
        </p>

        {/* IV. Guest Information & Privacy */}
        <h3 className="text-xl font-semibold mb-2">IV. Guest Information &amp; Privacy</h3>
        <p className="mb-6">
          Your use of Event Parcel’s platform is subject to our [Privacy Policy]. In cases where information sharing is required, this will be stated clearly at the point of purchase. By proceeding with a purchase, you authorize Event Parcel to share the specified information with the Event Host. While we facilitate the collection and transfer of guest data where necessary, Event Parcel is not responsible for how Event Hosts use or protect such data.
        </p>

        {/* V. General Terms */}
        <h3 className="text-xl font-semibold mb-2">V. General Terms</h3>
        <p className="mb-4">
          <strong>Waiver:</strong> Any failure by either party to enforce any provision of these Terms shall not constitute a waiver of that provision.
        </p>
        <p className="mb-4">
          <strong>Assignment:</strong> These Terms may not be assigned or transferred by you without written consent from Event Parcel.
        </p>
        <p className="mb-4">
          <strong>Binding Effect:</strong> These Terms bind both parties and their successors or permitted assigns.
        </p>
        <p className="mb-4">
          <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force.
        </p>
        <p className="mb-4">
          <strong>Entire Agreement:</strong> These Terms, including any linked policies, represent the full agreement between you and Event Parcel.
        </p>
        <p className="mb-4">
          <strong>Amendments:</strong> We may update these Terms at any time. Your continued use of the platform after any update constitutes acceptance of the new Terms.
        </p>
        <p className="mb-6">
          <strong>Disclaimer of Warranty:</strong> Services are provided “as is.” Event Parcel makes no warranties about uptime, availability, or fitness for a particular purpose and is not liable for interruptions due to internet outages, third-party failures, or other external factors.
        </p>

        {/* VI. Disputes */}
        <h3 className="text-xl font-semibold mb-2">VI. Disputes</h3>
        <p className="mb-4">
          <strong>Arbitration Clause (Nigeria Jurisdiction):</strong> Any dispute or claim arising out of or in connection with your use of our platform or these Terms shall first be resolved through good-faith negotiations between the parties. If the parties are unable to resolve the dispute within fifteen (15) days of written notice of the dispute, the matter shall be submitted to final and binding arbitration in Nigeria.
        </p>
        <p className="mb-4">
          The arbitration shall be conducted in accordance with the provisions of the Arbitration and Mediation Act 2023 of Nigeria (or any successor legislation), by a sole arbitrator appointed in accordance with the rules of a recognized arbitral institution in Nigeria, unless the parties mutually agree otherwise.
        </p>
        <p className="mb-4">
          <strong>Arbitration Costs:</strong> Arbitration costs shall be shared equally unless the arbitrator rules otherwise. Each party will bear its own legal costs unless the arbitrator finds a claim to be frivolous.
        </p>

        {/* Pricing Schedule */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing Schedule</h2>
        <table className="table-auto w-full border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Service Type</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Fee Charged</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Guest Package Purchase (Naira)</td>
              <td className="border px-4 py-2">Includes Aso Ebi, kits, or bundles paid in Naira</td>
              <td className="border px-4 py-2">3.5% per transaction</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border px-4 py-2">Guest Package Purchase (USD)</td>
              <td className="border px-4 py-2">Includes Aso Ebi, kits, or bundles paid in USD</td>
              <td className="border px-4 py-2">5.5% per transaction</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Host Payout Processing</td>
              <td className="border px-4 py-2">Transfers to host after guest payments are collected</td>
              <td className="border px-4 py-2">₦0 (included in fees)</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border px-4 py-2">Group Creation</td>
              <td className="border px-4 py-2">Creating Private or General guest groups</td>
              <td className="border px-4 py-2">Free</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Link Sharing Management</td>
              <td className="border px-4 py-2">Personalized or public link generation</td>
              <td className="border px-4 py-2">Free</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border px-4 py-2">Platform Support</td>
              <td className="border px-4 py-2">Support for hosts and guests</td>
              <td className="border px-4 py-2">Free</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Refund Processing</td>
              <td className="border px-4 py-2">Manual processing if host approves refund</td>
              <td className="border px-4 py-2">₦500 or $1 per transaction</td>
            </tr>
          </tbody>
        </table>
        <p className="mb-6">
          <strong>Please note:</strong> Fees are automatically deducted from guest payments before host payouts. All fees are inclusive of applicable taxes and payment gateway charges. USD transactions are processed via PayPal; Naira transactions via Paystack. Hosts receive payouts within 3–5 business days or as per payout schedule.
        </p>
      </div>
    </HeaderLayout>
  );
};

export default TermsAndConditions;

























// import HeaderLayout from "@/components/layout/HeaderLayout";
// import React from "react";

// const TermsAndConditions = () => {
//   return (
//     <HeaderLayout>
//     <div className="p-8 max-w-3xl mx-auto leading-relaxed font-sans mt-12">
//       <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
//       <p className="mb-4"><strong>Effective Date:</strong> January 1, 2025</p>

//       <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
//       <p className="mb-4">
//         These Terms and Conditions govern your use of [Your Project Name] (&quot;Service&quot;). By accessing or using our service, you agree to be bound by these terms. If you do not agree with these terms, please do not use our Service.
//       </p>

//       <h2 className="text-2xl font-semibold mb-2">Use of the Service</h2>
//       <ul className="list-disc list-inside mb-4">
//         <li className="mb-2">
//           <strong>Eligibility:</strong> You must be at least 13 years old (or the minimum age required by your jurisdiction) to use our Service.
//         </li>
//         <li className="mb-2">
//           <strong>Account Registration:</strong> When registering for an account, you must provide accurate and complete information. You are responsible for safeguarding your account details.
//         </li>
//         <li className="mb-2">
//           <strong>User Responsibilities:</strong> You agree not to use the Service for any unlawful purposes or in a way that may harm our users or the Service.
//         </li>
//       </ul>

//       <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
//       <p className="mb-4">
//         All content and materials provided through the Service are the intellectual property of [Your Project Name] or its licensors. You are granted a limited, non-exclusive, non-transferable license to access and use the content for personal, non-commercial use only.
//       </p>

//       <h2 className="text-2xl font-semibold mb-2">Disclaimers</h2>
//       <ul className="list-disc list-inside mb-4">
//         <li className="mb-2">
//           <strong>Service &quot;As Is&quot;:</strong> The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind.
//         </li>
//         <li className="mb-2">
//           <strong>No Guarantee:</strong> We do not guarantee that the Service will always be safe, secure, or error-free.
//         </li>
//         <li className="mb-2">
//           <strong>Limitation of Liability:</strong> In no event shall [Your Project Name] be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Service.
//         </li>
//       </ul>

//       <h2 className="text-2xl font-semibold mb-2">Termination</h2>
//       <p className="mb-4">
//         We reserve the right to suspend or terminate your access to the Service at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.
//       </p>

//       <h2 className="text-2xl font-semibold mb-2">Modifications</h2>
//       <p className="mb-4">
//         We may modify these Terms at any time. Updated terms will be posted on this page with a new effective date. Your continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.
//       </p>

//       <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
//       <p className="mb-4">
//         These Terms shall be governed by the laws of [Your Jurisdiction], without regard to its conflict of law principles.
//       </p>

//       <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
//       <p className="mb-4">
//         For any questions about these Terms and Conditions, please contact us at: <a href="mailto:your-email@example.com" className="text-blue-500 underline">your-email@example.com</a>
//       </p>
//     </div>
//     </HeaderLayout>
//   );
// };

// export default TermsAndConditions;



