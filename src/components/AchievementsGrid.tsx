'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Share2, 
  Lock, 
  ExternalLink, 
  Download,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Badge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  points: number;
  earnedAt?: string;
  criteria: any;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'learning_path' | 'achievement';
  imageUrl: string;
  issuedAt: string;
  expiresAt?: string;
  verificationCode: string;
}

interface AchievementsGridProps {
  badges: Badge[];
  certificates: Certificate[];
  onShare?: (item: Badge | Certificate) => void;
}

export default function AchievementsGrid({
  badges,
  certificates,
  onShare
}: AchievementsGridProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates'>('badges');
  const [selectedItem, setSelectedItem] = useState<Badge | Certificate | null>(null);

  const handleShare = async (item: Badge | Certificate) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: `Check out my ${
            'points' in item ? 'badge' : 'certificate'
          } from EriEthio Research!`,
          url: window.location.origin + `/verify/${item.id}`
        });
      } else {
        onShare?.(item);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const downloadCertificate = (certificate: Certificate) => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading certificate:', certificate);
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-neon-cyan/20">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
            activeTab === 'badges'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          Badges ({badges.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
            activeTab === 'certificates'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          Certificates ({certificates.length})
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'badges'
          ? badges.map((badge) => (
              <motion.div
                key={badge.id}
                layoutId={badge.id}
                onClick={() => setSelectedItem(badge)}
                whileHover={{ scale: 1.02 }}
                className={`bg-black/30 backdrop-blur-sm rounded-lg border ${
                  badge.earnedAt
                    ? 'border-neon-cyan/20 hover:border-neon-cyan/50'
                    : 'border-gray-800 opacity-50'
                } overflow-hidden cursor-pointer transition-all`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={badge.imageUrl}
                    alt={badge.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain p-8"
                  />
                  {!badge.earnedAt && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4 text-center border-t border-neon-cyan/20">
                  <h3 className="text-lg font-semibold text-neon-cyan mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-gray-400">{badge.points} points</p>
                  {badge.earnedAt && (
                    <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Earned {new Date(badge.earnedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          : certificates.map((certificate) => (
              <motion.div
                key={certificate.id}
                layoutId={certificate.id}
                onClick={() => setSelectedItem(certificate)}
                whileHover={{ scale: 1.02 }}
                className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 overflow-hidden cursor-pointer transition-all"
              >
                <div className="aspect-video relative">
                  <Image
                    src={certificate.imageUrl}
                    alt={certificate.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-12 h-12 text-neon-magenta" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neon-cyan mb-1">
                    {certificate.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {certificate.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Issued {new Date(certificate.issuedAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(certificate);
                        }}
                        className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadCertificate(certificate);
                        }}
                        className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/verify/${certificate.verificationCode}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Verify"
                        target="_blank"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'badges' && badges.length === 0) ||
        (activeTab === 'certificates' && certificates.length === 0)) && (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-gray-500">
            Complete courses and earn achievements to collect {activeTab}
          </p>
          <Link
            href="/education"
            className="inline-block mt-4 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            layoutId={selectedItem.id}
            className="bg-black/90 backdrop-blur-sm rounded-lg border border-neon-cyan/20 max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {'points' in selectedItem ? (
              // Badge Details
              <div className="p-8">
                <div className="aspect-square w-48 mx-auto mb-6">
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-neon-cyan mb-2 text-center">
                  {selectedItem.title}
                </h2>
                <p className="text-gray-300 mb-4 text-center">
                  {selectedItem.description}
                </p>
                <div className="space-y-4 text-sm text-gray-400">
                  <div>
                    <span className="font-medium">Category:</span> {selectedItem.category}
                  </div>
                  <div>
                    <span className="font-medium">Points:</span> {selectedItem.points}
                  </div>
                  {selectedItem.earnedAt && (
                    <div>
                      <span className="font-medium">Earned:</span>{' '}
                      {new Date(selectedItem.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Criteria:</span>
                    <ul className="mt-2 list-disc list-inside">
                      {Object.entries(selectedItem.criteria).map(([key, value]) => (
                        <li key={key}>
                          {key}: {String(value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              // Certificate Details
              <div>
                <div className="aspect-video relative">
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-16 h-16 text-neon-magenta" />
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-neon-cyan mb-2">
                    {selectedItem.title}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {selectedItem.description}
                  </p>
                  <div className="space-y-4 text-sm text-gray-400">
                    <div>
                      <span className="font-medium">Type:</span>{' '}
                      {selectedItem.type.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Issued:</span>{' '}
                      {new Date(selectedItem.issuedAt).toLocaleDateString()}
                    </div>
                    {selectedItem.expiresAt && (
                      <div>
                        <span className="font-medium">Expires:</span>{' '}
                        {new Date(selectedItem.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Verification Code:</span>{' '}
                      {selectedItem.verificationCode}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => handleShare(selectedItem)}
                      className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => downloadCertificate(selectedItem)}
                      className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 