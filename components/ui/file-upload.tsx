'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/db';
import { Button } from './button';
import { Progress } from './progress';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  bucket: string;
  path: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
}

export function FileUpload({
  bucket,
  path,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  onUploadComplete,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!multiple && files.length + acceptedFiles.length > 1) {
        setError('Only one file can be uploaded');
        return;
      }
      setFiles((prev) => [...prev, ...acceptedFiles]);
      setError(null);
    },
    [files.length, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setUploading(true);
    setProgress(0);
    const urls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${path}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        urls.push(publicUrl);
        setProgress(((i + 1) / files.length) * 100);
      }

      onUploadComplete(urls);
      setFiles([]);
      setError(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const isImage = (file: File) =>
    file.type.startsWith('image/');

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>
                Drag & drop files here, or click to select files
                <br />
                <span className="text-xs text-muted-foreground">
                  Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {isImage(file) && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {uploading ? (
            <Progress value={progress} />
          ) : (
            <Button onClick={uploadFiles}>
              Upload {files.length} file{files.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 