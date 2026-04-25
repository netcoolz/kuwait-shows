const gold = "#bc9b6a";

export default function RefundPolicy() {
  return (
    <div className="px-10 py-20 max-w-4xl mx-auto">

      <h1 className="text-4xl mb-6" style={{ color: gold }}>
        Refund & Cancellation Policy
      </h1>

      <p className="mb-6 text-gray-300">
        At Kuwait Shows, we are committed to providing transparent and fair policies related to event registrations and payments.
      </p>

      <p className="mb-10 text-gray-400 text-sm">
        This policy applies to all registrations and payments made through https://kuwaitshows.com and the Kuwait Shows mobile application.
      </p>

      {/* SECTION */}
      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>
        Event Registration Fees
      </h2>

      <ul className="space-y-2 text-gray-300">
        <li>• All registration fees paid for participation in Arabian horse championships are related to real-world events and services.</li>
        <li>• Once a registration is completed and payment is successfully processed, the registration fee is generally non-refundable.</li>
      </ul>

      {/* SECTION */}
      <h2 className="text-xl mt-10 mb-3" style={{ color: gold }}>
        Cancellations
      </h2>

      <ul className="space-y-2 text-gray-300">
        <li>• Cancellations requested by participants after successful registration are subject to the specific rules of each championship.</li>
        <li>• Kuwait Shows reserves the right to approve or decline cancellation requests based on event timelines, preparations, and organizational commitments.</li>
      </ul>

      {/* SECTION */}
      <h2 className="text-xl mt-10 mb-3" style={{ color: gold }}>
        Event Cancellation or Changes
      </h2>

      <ul className="space-y-2 text-gray-300">
        <li>• In the event that a championship is canceled or significantly changed by the organizer, Kuwait Shows may, at its discretion:</li>
        <li>• Offer a full or partial refund, or</li>
        <li>• Transfer the registration to a future event</li>
      </ul>

      {/* SECTION */}
      <h2 className="text-xl mt-10 mb-3" style={{ color: gold }}>
        Payment Processing
      </h2>

      <ul className="space-y-2 text-gray-300">
        <li>• All payments are securely processed through Tap Payment Gateway.</li>
        <li>• Kuwait Shows does not store or process payment card details directly.</li>
        <li>• Any approved refund will be returned to the original payment method used at the time of registration.</li>
      </ul>

      {/* SECTION */}
      <h2 className="text-xl mt-10 mb-3" style={{ color: gold }}>
        Refund Processing Time
      </h2>

      <ul className="space-y-2 text-gray-300">
        <li>• Approved refunds may take 7–14 business days to be processed.</li>
        <li>• Processing time may vary depending on the bank or payment provider.</li>
      </ul>

      {/* SECTION */}
      <h2 className="text-xl mt-10 mb-3" style={{ color: gold }}>
        Non-Refundable Circumstances
      </h2>

      <ul className="space-y-2 text-gray-300">
        <li>• Failure to attend the event</li>
        <li>• Disqualification due to incomplete or incorrect registration information</li>
        <li>• Late withdrawal after the registration deadline</li>
      </ul>

      {/* CONTACT */}
      <h2 className="text-xl mt-10 mb-3" style={{ color: gold }}>
        Contact Us
      </h2>

      <p className="text-gray-300">
        For any questions regarding this Refund & Cancellation Policy, please contact us at:
      </p>

      <p className="text-gray-400 mt-2">
        admin@kuwaitshows.com
      </p>

    </div>
  );
}