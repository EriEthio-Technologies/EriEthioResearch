"use client"

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FlipCard } from '@/components/ui/FlipCard';

// Move animations outside component to prevent recreation
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }
};

// Extract static data
const STATS_CONFIG = [
  { label: 'Researchers', key: 'researchers', icon: Users, color: 'neon-cyan' },
  { label: 'Publications', key: 'publications', icon: BookOpen, color: 'neon-magenta' },
  { label: 'Projects', key: 'projects', icon: BarChart, color: 'neon-cyan' },
  { label: 'Collaborations', key: 'collaborations', icon: Sparkles, color: 'neon-magenta' }
];

const RESEARCH_CARDS = [
  {
    title: "AI Ethics Research",
    subtitle: "Ethical AI Development",
    summary: "Exploring the ethical implications of AI in healthcare, finance, and social systems. Our research focuses on developing frameworks for responsible AI deployment.",
    tags: ['Ethics', 'AI', 'Healthcare'],
    gradient: { from: '#00ffff', to: '#ff00ff' },
    path: '/research/ai-ethics'
  },
  {
    title: "Data Privacy & Security",
    subtitle: "African Digital Infrastructure",
    summary: "Investigating data protection frameworks and cybersecurity measures specific to African contexts, focusing on building robust digital infrastructure for cross-border collaboration.",
    tags: ['Privacy', 'Security', 'Infrastructure'],
    gradient: { from: '#ff00ff', to: '#00ffff' },
    path: '/research/data-privacy'
  },
  {
    title: "Indigenous Knowledge Systems",
    subtitle: "Traditional Wisdom in Modern Research",
    summary: "Bridging traditional knowledge systems with modern research methodologies, preserving and integrating cultural wisdom into contemporary scientific frameworks.",
    tags: ['Culture', 'Knowledge', 'Integration'],
    gradient: { from: '#00ffff', to: '#ff1493' },
    path: '/research/indigenous-knowledge'
  },  
  {
    title: "Healthcare Innovation",
    subtitle: "Medical Technology Solutions",
    summary: "Developing affordable and accessible healthcare technologies tailored to East African communities, combining local resources with cutting-edge medical innovations.",
    tags: ['Healthcare', 'Technology', 'Innovation'],
    gradient: { from: '#ff1493', to: '#00ffff' },
    path: '/research/healthcare-tech'
  },
  {
    title: "Agricultural Technology",
    subtitle: "Smart Farming Solutions",
    summary: "Researching climate-resilient agricultural practices and implementing IoT solutions for sustainable farming in arid and semi-arid regions of East Africa.",
    tags: ['Agriculture', 'IoT', 'Sustainability'],
    gradient: { from: '#00ffff', to: '#ff8c00' },
    path: '/research/agri-tech'
  }
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    researchers: 0,
    publications: 0,
    projects: 0,
    collaborations: 0
  });

  // Memoize fetchStats to prevent recreation on each render
  const fetchStats = useCallback(async () => {
    try {
      const queries = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('publications').select('*', { count: 'exact', head: true }),
        supabase.from('research_projects').select('*', { count: 'exact', head: true })
      ]);

      const [researchers, publications, projects] = queries;

      setStats({
        researchers: researchers.count || 0,
        publications: publications.count || 0,
        projects: projects.count || 0,
        collaborations: Math.floor((projects.count || 0) * 1.5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Extract UI sections into separate components for better organization
  const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: React.ElementType, color: string } ) => (
    <motion.div
      className="group relative bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-current transition-colors duration-300"
      variants={animations.fadeIn}
    >
      <div className={`text-${color}`}>
        <Icon className="w-8 h-8 mb-4" />
        <h3 className="text-4xl font-bold mb-2">{value}</h3>
        <p className="text-gray-400">{label}</p>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r from-${color}/0 to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg`} />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-16 px-4 relative overflow-hidden"
        initial="initial"
        animate="animate"
        variants={animations.staggerContainer}
      >
        {/* Hero content */}
        <div className="max-w-7xl mx-auto relative z-10">
          {/* ... Hero content remains the same ... */}
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_70%)]" />
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1)_0%,transparent_70%)] animate-pulse" />
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={animations.staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={animations.staggerContainer}
          >
            {STATS_CONFIG.map(({ label, key, icon, color }) => (
              <StatCard
                key={label}
                label={label}
                value={stats[key as keyof typeof stats]}
                icon={icon}
                color={color}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Research Section with optimized card rendering */}
      <motion.section 
        className="py-16 px-4 relative"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={animations.staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
            variants={animations.staggerContainer}
          >
            {RESEARCH_CARDS.map(card => (
              <FlipCard
                key={card.title}
                {...card}
                onClick={() => router.push(card.path)}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section remains the same */}
    </div>
  );
}