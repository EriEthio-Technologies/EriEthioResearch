'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: 'demo@example.com',
        password: 'demo123',
        redirect: false,
      });

      if (result?.error) {
        setError('Demo login failed. Please try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-neon-magenta hover:text-neon-magenta/80">
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <AlertDescription className="text-green-500">{success}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neon-magenta/30 bg-black/50 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon-magenta focus:border-neon-magenta focus:z-10 sm:text-sm pr-10"
                  placeholder="Enter your password"
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
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-neon-magenta hover:text-neon-magenta/80"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-neon-cyan hover:bg-neon-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-neon-cyan text-sm font-medium rounded-md text-neon-cyan hover:bg-neon-cyan/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Try Demo Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
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

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}