'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@supabase/supabase-js';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  maxSize?: number; // in MB
  aspectRatio?: number;
  className?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  aspectRatio,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemove = async () => {
    try {
      if (value) {
        // Extract file path from URL
        const filePath = value.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('images')
            .remove([`uploads/${filePath}`]);
        }
      }
      onChange('');
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-lg"
              style={aspectRatio ? { aspectRatio } : undefined}
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8
              flex flex-col items-center justify-center
              cursor-pointer transition-colors
              ${isDragActive ? 'border-neon-cyan bg-neon-cyan/10' : 'border-gray-300'}
              ${error ? 'border-red-500' : ''}
            `}
            style={aspectRatio ? { aspectRatio } : undefined}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Upload className="w-8 h-8 text-gray-400" />
              </motion.div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  {isDragActive
                    ? 'Drop the image here'
                    : `Drag & drop an image here, or click to select`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max size: {maxSize}MB
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
} 