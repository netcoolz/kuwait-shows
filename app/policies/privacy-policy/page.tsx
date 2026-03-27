const gold = "#bc9b6a";

export default function PrivacyPolicy() {
  return (
    <div className="px-10 py-20 max-w-4xl mx-auto">

      <h1 className="text-4xl mb-8" style={{ color: gold }}>
        Privacy Policy
      </h1>

      <p className="mb-6 text-gray-300">
        Kuwait Shows respects your privacy and is committed to protecting your personal data.
        This Privacy Policy explains how we collect, use, and protect your information when you use our website and mobile application.
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>Information We Collect</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• Personal information such as name, email, phone number</li>
        <li>• Payment information via TAP Payments (we do NOT store card details)</li>
        <li>• Technical data (device, IP, browser)</li>
      </ul>

      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>How We Use Your Information</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• Manage services and registrations</li>
        <li>• Process payments</li>
        <li>• Communicate with users</li>
        <li>• Improve user experience</li>
      </ul>

      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>Payments</h2>
      <p className="text-gray-300">
        All payments are securely processed via TAP Payments.
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>Data Security</h2>
      <p className="text-gray-300">
        We implement strong security measures to protect your data.
      </p>

      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>Your Rights</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• Access your data</li>
        <li>• Request deletion</li>
        <li>• Withdraw consent</li>
      </ul>

      <h2 className="text-xl mt-8 mb-3" style={{ color: gold }}>Contact</h2>
      <p className="text-gray-300">
        Email: admin@kuwaitshows.com
      </p>

      <p className="mt-10 text-sm text-gray-500">
        Last updated: 2026
      </p>

    </div>
  );
}