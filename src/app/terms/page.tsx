import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | EriEthio Research',
  description: 'Terms of Service and usage guidelines for EriEthio Research platform.'
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-lg mb-4">
            By accessing and using the EriEthio Research platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-lg mb-4">
            Permission is granted to temporarily access the materials on EriEthio Research's platform for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-lg mb-4">
            The materials on EriEthio Research's platform are provided on an 'as is' basis. EriEthio Research makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>
      </div>
    </div>
  );
} 