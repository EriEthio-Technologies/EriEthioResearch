'use client';

import { useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export function MediaUploader({
  label,
  onUpload,
  initialValue
}: {
  label: string;
  onUpload: (url: string) => void;
  initialValue?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialValue || '');

  const { data: session } = useSession();
  if (session?.user.role !== 'admin') {
    return null;
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabaseAdmin.storage
      .from('public-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Upload error:', error);
    } else if (data) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-media/${data.path}`;
      setPreview(url);
      onUpload(url);
    }
    
    setUploading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
      <Label>{label}</Label>
      
      {preview && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image 
            src={preview} 
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleUpload}
          disabled={uploading}
          className="bg-gray-900 border-neon-cyan/20"
        />
        {uploading && <Progress value={0} className="w-[100px]" />}
      </div>
    </div>
  );
} 