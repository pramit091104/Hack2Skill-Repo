import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Optimistic UI: Immediately navigate to dashboard.
      // Profile existence and routing will be handled there.
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      // Optimistic UI: Immediately navigate to dashboard.
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex font-body-md overflow-hidden">
      {/* Left Column: Branding / Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-container-low items-center justify-center p-12 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.1)_0%,transparent_70%)]"></div>
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
            <span className="font-headline-md text-3xl font-bold text-primary">NutriSmart AI</span>
          </div>
          <h1 className="font-headline-lg text-5xl leading-tight text-text-primary mb-6">
            Your journey to better health starts here.
          </h1>
          <p className="font-body-lg text-lg text-text-secondary">
            Join thousands of users who are transforming their lives through AI-powered personalized nutrition and smart tracking.
          </p>
          
          <div className="mt-16 flex items-center gap-4">
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-2 border-surface-container-low" src="https://i.pravatar.cc/100?img=1" alt="User" />
              <img className="w-12 h-12 rounded-full border-2 border-surface-container-low" src="https://i.pravatar.cc/100?img=2" alt="User" />
              <img className="w-12 h-12 rounded-full border-2 border-surface-container-low" src="https://i.pravatar.cc/100?img=3" alt="User" />
              <img className="w-12 h-12 rounded-full border-2 border-surface-container-low" src="https://i.pravatar.cc/100?img=4" alt="User" />
            </div>
            <div className="text-sm font-medium text-text-secondary">
              Trusted by 10,000+ users
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <Link to="/" className="absolute top-8 right-8 text-text-secondary hover:text-primary transition-colors flex items-center gap-2 font-label-md">
          <span className="material-symbols-outlined">close</span>
        </Link>
        
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Only Branding */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
            <span className="font-headline-md text-2xl font-bold text-primary">NutriSmart AI</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-headline-lg text-4xl text-text-primary mb-3">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-text-secondary text-body-md">
              {isLogin ? 'Enter your details to sign in.' : 'Enter your details to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm border border-error/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-error">error</span>
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-label-md text-text-primary">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border-input bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-label-md text-text-primary">Password</label>
                {isLogin && (
                  <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border-input bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-button text-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
            >
              {loading ? <Skeleton className="h-6 w-24 bg-white/50" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            
            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-border-subtle"></div>
              <span className="flex-shrink-0 mx-4 text-text-secondary text-sm">or</span>
              <div className="flex-grow border-t border-border-subtle"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-border-input text-text-primary py-4 rounded-lg font-button text-lg hover:bg-surface transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="text-center mt-8">
              <button
                type="button"
                className="text-text-secondary hover:text-primary transition-colors font-medium text-sm"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
