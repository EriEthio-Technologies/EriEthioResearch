'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
import { Lock, Play, Pause, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  requiresAuth: boolean;
  videoUrl?: string;
}

export default function EducationPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  const publicCourses = courses.filter(course => !course.requiresAuth);
  const premiumCourses = courses.filter(course => course.requiresAuth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section with Video */}
      <div className="relative h-[80vh] overflow-hidden">
        <video
          src="/intro-video.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay={isPlaying}
          loop
          muted
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-neon-cyan mb-6"
          >
            Learn & Grow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
          >
            Discover our comprehensive learning paths and expert-led courses
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-4"
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 px-6 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Video</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play Video</span>
                </>
              )}
            </button>
            <Link
              href="/auth/signin"
              className="flex items-center space-x-2 px-6 py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Public Courses */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neon-cyan mb-8">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
              >
                <div className="aspect-video relative">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-sm text-gray-300">
                    {course.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neon-cyan mb-2">{course.title}</h3>
                  <p className="text-gray-300 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Level: {course.level}</span>
                    <Link
                      href={`/education/${course.id}`}
                      className="flex items-center space-x-1 text-neon-magenta hover:text-neon-magenta/80 transition-colors"
                    >
                      <span>Learn More</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Courses */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-neon-magenta">Premium Courses</h2>
            {!session && (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Sign in to Access</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-neon-magenta/20 hover:border-neon-magenta/50 transition-all ${
                  !session ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="aspect-video relative">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-sm text-gray-300">
                    {course.duration}
                  </div>
                  {!session && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Lock className="w-8 h-8 text-neon-magenta" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neon-magenta mb-2">{course.title}</h3>
                  <p className="text-gray-300 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Level: {course.level}</span>
                    {session && (
                      <Link
                        href={`/education/${course.id}`}
                        className="flex items-center space-x-1 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                      >
                        <span>Start Learning</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!session && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neon-cyan mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-300 mb-8">
              Join our community of learners and get access to premium courses, expert guidance, and more.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            >
              <span>Sign Up Now</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
} 