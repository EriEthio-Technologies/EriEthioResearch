"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart, Sparkles } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function HomePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    researchers: 0,
    publications: 0,
    projects: 0,
    collaborations: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [researchers, publications, projects] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact' }),
          supabase.from('publications').select('*', { count: 'exact' }),
          supabase.from('research_projects').select('*', { count: 'exact' })
        ]);

        setStats({
          researchers: researchers.count || 0,
          publications: publications.count || 0,
          projects: projects.count || 0,
          collaborations: Math.floor((projects.count || 0) * 1.5) // Example calculation
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-16 px-4 relative overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan mb-6"
            variants={fadeIn}
          >
            EriEthio Research
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl"
            variants={fadeIn}
          >
            Pioneering research collaboration between Eritrea and Ethiopia. 
            Join our community of innovators shaping the future.
          </motion.p>
          <motion.div 
            className="flex flex-wrap gap-4"
            variants={fadeIn}
          >
            <Link
              href="/research"
              className="group relative px-8 py-4 bg-neon-cyan/20 rounded-lg overflow-hidden transition-all hover:bg-neon-cyan/30"
            >
              <span className="relative z-10 flex items-center gap-2 text-neon-cyan group-hover:text-white transition-colors">
                Explore Research
                <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-magenta opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            <Link
              href="/publications"
              className="group relative px-8 py-4 bg-neon-magenta/20 rounded-lg overflow-hidden transition-all hover:bg-neon-magenta/30"
            >
              <span className="relative z-10 flex items-center gap-2 text-neon-magenta group-hover:text-white transition-colors">
                View Publications
                <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
          </motion.div>
        </div>

        {/* Animated background elements */}
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
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {[
              { label: 'Researchers', value: stats.researchers, icon: Users, color: 'neon-cyan' },
              { label: 'Publications', value: stats.publications, icon: BookOpen, color: 'neon-magenta' },
              { label: 'Projects', value: stats.projects, icon: BarChart, color: 'neon-cyan' },
              { label: 'Collaborations', value: stats.collaborations, icon: Sparkles, color: 'neon-magenta' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group relative bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-current transition-colors duration-300"
                variants={fadeIn}
              >
                <div className={`text-${stat.color}`}>
                  <stat.icon className="w-8 h-8 mb-4" />
                  <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r from-${stat.color}/0 to-${stat.color}/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Research Section */}
      <motion.section 
        className="py-16 px-4 relative"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-neon-cyan mb-8"
            variants={fadeIn}
          >
            Featured Research
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                className="group bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-neon-cyan transition-colors duration-300"
                variants={fadeIn}
              >
                <div className="h-40 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-lg mb-4" />
                <h3 className="text-xl font-semibold text-neon-magenta mb-2">Research Project {index + 1}</h3>
                <p className="text-gray-400 mb-4">
                  Innovative research project exploring new frontiers in technology and science.
                </p>
                <Link
                  href="/research"
                  className="inline-flex items-center text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-16 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-6">
            Ready to Join Our Research Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with researchers, access resources, and contribute to groundbreaking research.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}