import { useState } from 'react';
import { z, ZodSchema } from 'zod';
import { handleError } from '@/lib/error';

export const useAdminForm = <T extends ZodSchema>(schema: T) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = async (data: unknown) => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(newErrors);
      }
      throw error;
    }
  };

  return { isLoading, errors, validate, setIsLoading };
}; 