'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/auth/signin?registered=true');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20">
        <div className="relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 text-gray-400 hover:text-neon-cyan transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neon-cyan">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-neon-magenta hover:text-neon-magenta/80">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neon-magenta/30 bg-black/50 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon-magenta focus:border-neon-magenta focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neon-magenta/30 bg-black/50 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon-magenta focus:border-neon-magenta focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neon-magenta/30 bg-black/50 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon-magenta focus:border-neon-magenta focus:z-10 sm:text-sm pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-neon-magenta"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Must be at least 8 characters
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neon-magenta/30 bg-black/50 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon-magenta focus:border-neon-magenta focus:z-10 sm:text-sm pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-neon-magenta"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I accept the{' '}
              <Link href="/terms" className="text-neon-magenta hover:text-neon-magenta/80">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-neon-cyan hover:bg-neon-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn('google')}
                className="flex justify-center items-center py-2 px-4 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
              >
                <Image
                  src="/google-icon.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="h-5 w-5 mr-2"
                />
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn('github')}
                className="flex justify-center items-center py-2 px-4 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
              >
                <Image
                  src="/github-icon.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="h-5 w-5 mr-2"
                />
                GitHub
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}