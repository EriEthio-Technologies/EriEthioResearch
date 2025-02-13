import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | EriEthio Research',
  description: 'Learn about EriEthio Research and our mission.'
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          EriEthio Research is a leading research and innovation platform dedicated to advancing knowledge and fostering collaboration between researchers, institutions, and industry partners.
        </p>
        <p className="text-lg mb-4">
          Our mission is to facilitate groundbreaking research, promote knowledge sharing, and drive innovation across various fields of study.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
        <p className="text-lg mb-4">
          To be the premier platform for research collaboration and innovation, connecting brilliant minds and resources to solve global challenges.
        </p>
      </div>
    </div>
  );
} 