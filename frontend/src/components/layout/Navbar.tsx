import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { Leaf, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link to="/" className="flex items-center space-x-2 text-emerald-600">
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900">NutriSmart AI</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/log" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Log Meal
              </Link>
              <Link to="/chat" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                AI Coach
              </Link>
              <button 
                onClick={handleLogout} 
                className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-red-600 transition-colors rounded-md"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Log in
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
              >
                Start for Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
