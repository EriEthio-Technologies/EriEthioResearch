const handleSubmit = async (formData: FormData) => {
  try {
    // ... existing reset logic
  } catch (error) {
    console.error('Password reset failed:', error instanceof Error ? error.message : 'Unknown error');
    setError('Failed to reset password. Please try again.');
  }
}; 