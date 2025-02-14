'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  Lock, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Headphones, 
  Code,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface LearningPathProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isOfficial: boolean;
  requiresSubscription: boolean;
  progress?: {
    completed: number;
    total: number;
    status: 'not_started' | 'in_progress' | 'completed';
  };
  items: {
    type: 'course' | 'podcast' | 'assignment' | 'quiz';
    title: string;
    completed?: boolean;
  }[];
  isSubscribed?: boolean;
  onClick?: () => void;
}

const itemIcons = {
  course: BookOpen,
  podcast: Headphones,
  assignment: Code,
  quiz: Award
};

const difficultyColors = {
  beginner: 'text-green-500',
  intermediate: 'text-yellow-500',
  advanced: 'text-red-500'
};

export default function LearningPathCard({
  id,
  title,
  description,
  thumbnail,
  estimatedDuration,
  difficulty,
  isOfficial,
  requiresSubscription,
  progress,
  items,
  isSubscribed,
  onClick
}: LearningPathProps) {
  const isLocked = requiresSubscription && !isSubscribed;
  const progressPercentage = progress 
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden transition-all ${
        isLocked ? 'opacity-75' : 'hover:border-neon-cyan/50'
      }`}
    >
      {/* Header */}
      <div className="relative aspect-video">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {isOfficial && (
            <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan text-sm rounded-full border border-neon-cyan/50 flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Official</span>
            </span>
          )}
          <span className={`px-2 py-1 text-sm rounded-full border ${
            difficultyColors[difficulty]
          } bg-black/50 border-current`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        {/* Lock/Progress */}
        <div className="absolute bottom-4 right-4">
          {isLocked ? (
            <div className="px-3 py-1 bg-black/80 text-neon-magenta rounded-full border border-neon-magenta flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Premium</span>
            </div>
          ) : progress ? (
            <div className="px-3 py-1 bg-black/80 text-neon-cyan rounded-full border border-neon-cyan flex items-center space-x-2">
              <div className="w-4 h-4 relative">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${progressPercentage}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs">
                  {progressPercentage}%
                </span>
              </div>
              <span>{progress.status}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-neon-cyan mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{items.length} items</span>
          </div>
        </div>

        {/* Items Preview */}
        <div className="space-y-2">
          {items.slice(0, 3).map((item, index) => {
            const Icon = itemIcons[item.type];
            return (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-neon-cyan/10 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-neon-magenta" />
                  <span className="text-gray-300">{item.title}</span>
                </div>
                {item.completed && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            );
          })}
          {items.length > 3 && (
            <div className="text-sm text-gray-400 text-center">
              +{items.length - 3} more items
            </div>
          )}
        </div>

        {/* Action */}
        {isLocked ? (
          <Link
            href="/pricing"
            className="block w-full px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors text-center"
          >
            Upgrade to Access
          </Link>
        ) : (
          <button
            onClick={onClick}
            className="w-full px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors flex items-center justify-center space-x-2"
          >
            <span>
              {progress?.status === 'not_started'
                ? 'Start Learning'
                : progress?.status === 'completed'
                ? 'View Certificate'
                : 'Continue Learning'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
} 