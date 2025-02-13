import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | EriEthio Research',
  description: 'Privacy Policy and data handling practices for EriEthio Research platform.'
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-lg mb-4">
            We collect information that you provide directly to us, including when you create an account, update your profile, or communicate with us. This may include your name, email address, and professional information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-lg mb-4">
            We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="text-lg mb-4">
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
          <p className="text-lg mb-4">
            You have the right to access, correct, or delete your personal information. You may also have additional rights depending on your jurisdiction.
          </p>
        </section>
      </div>
    </div>
  );
} 