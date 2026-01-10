export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>Terms of Service</h1>
        <p className="lead">
          Last updated: January 6, 2026
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using TrustPay SEA ("the Service"), you agree to be bound by these 
          Terms of Service. If you do not agree to these terms, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          TrustPay SEA is a milestone-based escrow platform that enables secure transactions 
          between clients and freelancers. The Service uses blockchain technology to hold funds 
          in escrow until work milestones are approved.
        </p>

        <h2>3. User Responsibilities</h2>
        <h3>3.1 Account Security</h3>
        <p>
          You are responsible for maintaining the security of your wallet and private keys. 
          TrustPay SEA does not have access to your private keys and cannot recover them if lost.
        </p>

        <h3>3.2 Accurate Information</h3>
        <p>
          You agree to provide accurate information when creating deals and to fulfill your 
          obligations as outlined in each deal agreement.
        </p>

        <h3>3.3 Legal Compliance</h3>
        <p>
          You agree to comply with all applicable laws and regulations in your jurisdiction 
          when using the Service.
        </p>

        <h2>4. Escrow and Payments</h2>
        <h3>4.1 Smart Contract</h3>
        <p>
          Funds are held in a smart contract on the blockchain. Release of funds is governed 
          by the smart contract code and requires explicit approval from the designated parties.
        </p>

        <h3>4.2 Platform Fees</h3>
        <p>
          TrustPay SEA charges a platform fee of 1-2% on each transaction. This fee is collected 
          when the deal is funded and is non-refundable.
        </p>

        <h3>4.3 Dispute Resolution</h3>
        <p>
          In case of disputes, both parties can submit evidence. A designated mediator will 
          make the final decision on fund distribution. AI analysis is provided as advisory 
          only and does not determine outcomes.
        </p>

        <h2>5. AI Advisory Services</h2>
        <p>
          The AI features in TrustPay SEA are advisory only. AI never controls funds or makes 
          final decisions. All financial decisions require human approval. You should not rely 
          solely on AI recommendations when making decisions.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          TrustPay SEA is provided "as is" without warranties. We are not liable for:
        </p>
        <ul>
          <li>Loss of funds due to user error or compromised private keys</li>
          <li>Smart contract vulnerabilities</li>
          <li>Blockchain network issues or delays</li>
          <li>Disputes between users</li>
          <li>Accuracy of AI recommendations</li>
        </ul>

        <h2>7. Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the Service 
          after changes constitutes acceptance of the new terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these Terms, please contact us at legal@trustpay.sea
        </p>
      </div>
    </div>
  );
}
