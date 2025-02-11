"use client"

import { HeroSection } from '@/components/ui/hero-section';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { FlipCard } from '@/components/ui/FlipCard';
import { useRouter } from 'next/navigation';

const featuredResearch = [
  {
    title: "AI in Healthcare",
    subtitle: "Machine Learning Applications",
    summary: "Exploring innovative applications of artificial intelligence in healthcare diagnostics and treatment planning.",
    tags: ["AI", "Healthcare", "ML"],
    gradient: { from: '#00ff9d', to: '#00ccff' }
  },
  {
    title: "Sustainable Energy",
    subtitle: "Renewable Resources",
    summary: "Research into next-generation sustainable energy solutions and their environmental impact.",
    tags: ["Energy", "Sustainability", "Climate"],
    gradient: { from: '#ff2079', to: '#ff9d00' }
  },
  {
    title: "Quantum Computing",
    subtitle: "Next-Gen Technology",
    summary: "Investigating quantum computing applications in cryptography and complex system simulation.",
    tags: ["Quantum", "Computing", "Technology"],
    gradient: { from: '#7928ca', to: '#ff0080' }
  }
];

const featuredCases = [
  {
    title: "Digital Transformation",
    subtitle: "Healthcare Industry",
    summary: "How a major healthcare provider transformed their operations through digital innovation.",
    tags: ["Healthcare", "Digital", "Innovation"],
    gradient: { from: '#1cc2ff', to: '#ff261b' }
  },
  {
    title: "Supply Chain Evolution",
    subtitle: "Manufacturing Sector",
    summary: "Implementing blockchain technology to enhance supply chain transparency and efficiency.",
    tags: ["Blockchain", "Supply Chain", "Manufacturing"],
    gradient: { from: '#00ff9d', to: '#ff2079' }
  },
  {
    title: "FinTech Revolution",
    subtitle: "Banking Sector",
    summary: "Digital transformation of traditional banking services through innovative fintech solutions.",
    tags: ["FinTech", "Banking", "Innovation"],
    gradient: { from: '#7928ca', to: '#00ccff' }
  }
];

const featuredBlogs = [
  {
    title: "Future of Work",
    subtitle: "Remote Collaboration",
    summary: "Exploring how AI and digital tools are reshaping the future of remote work and collaboration.",
    tags: ["Future", "Work", "Technology"],
    gradient: { from: '#ff9d00', to: '#7928ca' }
  },
  {
    title: "Tech Ethics",
    subtitle: "AI Governance",
    summary: "Discussing ethical considerations in AI development and implementation.",
    tags: ["Ethics", "AI", "Governance"],
    gradient: { from: '#00ccff', to: '#ff2079' }
  },
  {
    title: "Innovation Trends",
    subtitle: "2024 Outlook",
    summary: "Analysis of emerging technology trends and their potential impact on various industries.",
    tags: ["Innovation", "Trends", "Technology"],
    gradient: { from: '#1cc2ff', to: '#00ff9d' }
  }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <HeroSection />
        <FeatureGrid />
        
        {/* Featured Research */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-neon-cyan mb-12 text-center">Featured Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {featuredResearch.map((research, index) => (
              <FlipCard
                key={index}
                {...research}
                onClick={() => router.push('/research')}
              />
            ))}
          </div>
        </section>

        {/* Featured Business Cases */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-neon-cyan mb-12 text-center">Business Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {featuredCases.map((case_, index) => (
              <FlipCard
                key={index}
                {...case_}
                onClick={() => router.push('/cases')}
              />
            ))}
          </div>
        </section>

        {/* Featured Blogs */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-neon-cyan mb-12 text-center">Latest Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {featuredBlogs.map((blog, index) => (
              <FlipCard
                key={index}
                {...blog}
                onClick={() => router.push('/blog')}
              />
            ))}
          </div>
        </section>

        <div className="text-center mt-16 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-neon-magenta/20">
          <p className="text-neon-magenta text-sm">
            Note: Some features are temporarily under maintenance
          </p>
        </div>
      </div>
    </div>
  );
}