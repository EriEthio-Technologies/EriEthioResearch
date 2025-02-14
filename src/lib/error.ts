export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly context: Record<string, unknown> = {},
    public readonly severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message);
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    console.error(`[${error.severity.toUpperCase()}] ${error.message}`, error.context);
    return error;
  }
  
  const unknownError = new AppError(
    'Unknown error occurred',
    { originalError: error },
    'high'
  );
  
  console.error('[CRITICAL] Unhandled error', unknownError);
  return unknownError;
}; 