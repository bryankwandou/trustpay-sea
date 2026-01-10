export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>Privacy Policy</h1>
        <p className="lead">
          Last updated: January 6, 2026
        </p>

        <h2>1. Introduction</h2>
        <p>
          TrustPay SEA ("we", "our", or "us") respects your privacy and is committed to 
          protecting your personal data. This privacy policy explains how we collect, use, 
          and protect your information when you use our platform.
        </p>

        <h2>2. Information We Collect</h2>
        
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li>Wallet address (public blockchain address)</li>
          <li>Deal details (project descriptions, milestone information)</li>
          <li>Communication content in disputes</li>
          <li>Evidence submitted for disputes</li>
        </ul>

        <h3>2.2 Information Collected Automatically</h3>
        <ul>
          <li>Transaction history on the blockchain (public by nature)</li>
          <li>Device information and browser type</li>
          <li>IP address and location data</li>
          <li>Usage patterns and analytics</li>
        </ul>

        <h3>2.3 Information We Do NOT Collect</h3>
        <ul>
          <li>Private keys - we never have access to your private keys</li>
          <li>Personal identification documents (for basic users)</li>
          <li>Banking information</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Facilitate escrow transactions between users</li>
          <li>Provide AI-powered recommendations and analysis</li>
          <li>Resolve disputes when requested</li>
          <li>Improve our services and user experience</li>
          <li>Prevent fraud and abuse</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Blockchain Transparency</h2>
        <p>
          Please note that blockchain transactions are public by design. Transaction amounts, 
          wallet addresses, and deal metadata stored on-chain are visible to anyone. We cannot 
          delete or modify blockchain data once recorded.
        </p>

        <h2>5. Data Sharing</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Other parties in a deal (limited to deal-related information)</li>
          <li>Mediators during dispute resolution</li>
          <li>Service providers who assist our operations</li>
          <li>Law enforcement when legally required</li>
        </ul>

        <h2>6. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. However, 
          you are responsible for securing your wallet and private keys. We recommend using 
          hardware wallets and enabling all available security features.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of off-chain data</li>
          <li>Object to processing of your data</li>
          <li>Export your data</li>
        </ul>

        <h2>8. Cookies</h2>
        <p>
          We use cookies to improve your experience and analyze usage. You can disable cookies 
          in your browser settings, but some features may not work properly.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Our Service is not intended for users under 18 years of age. We do not knowingly 
          collect information from children.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of significant 
          changes through the platform or via email if provided.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          For privacy-related questions or requests, please contact us at:
          <br />
          Email: privacy@trustpay.sea
        </p>
      </div>
    </div>
  );
}
