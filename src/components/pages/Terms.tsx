import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="lead">
          Welcome to the JU Research Portal. By using our service, you agree to these terms and conditions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the JU Research Portal, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
        <p>
          Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post, including its legality, reliability, and appropriateness.
        </p>
        <p>
          By posting content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service. You retain any and all of your rights to any content you submit, post or display on or through the service and you are responsible for protecting those rights.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Academic Integrity</h2>
        <p>
          The JU Research Portal is designed to facilitate legitimate academic research connections. Users are expected to maintain high standards of academic integrity and honesty. Misrepresentation of credentials, plagiarism, or other violations of academic integrity may result in termination of your account.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Privacy Policy</h2>
        <p>
          Your use of the JU Research Portal is also governed by our Privacy Policy, which is incorporated by reference into these Terms and Conditions. Please review our Privacy Policy to understand our practices.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
        <p>
          In no event shall the JU Research Portal, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at support@juresearchportal.edu.
        </p>
      </div>
      
      <div className="mt-10 flex justify-center">
        <Button asChild>
          <Link to="/signup">Return to Sign Up</Link>
        </Button>
      </div>
    </div>
  );
} 