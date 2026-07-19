import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/useAuthStore';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Skeleton } from './components/Skeleton';

// Lazy loading pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FoodLogger = React.lazy(() => import('./pages/FoodLogger'));
const Chatbot = React.lazy(() => import('./pages/Chatbot'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));

// Protected Route Wrapper with Sidebar Layout
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden lg:flex w-72 flex-col bg-white border-r border-border-subtle p-6">
          <Skeleton className="h-10 w-40 mb-12" />
          <Skeleton className="h-12 w-full mb-4 rounded-xl" />
          <Skeleton className="h-12 w-full mb-4 rounded-xl" />
          <Skeleton className="h-12 w-full mb-4 rounded-xl" />
        </div>
        <main className="flex-1 p-4 lg:p-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </main>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar hidden on mobile, visible on lg screens */}
      <Sidebar />
      {/* Main content takes full width on mobile, and margin-left on desktop to accommodate sidebar */}
      <main className="flex-1 lg:ml-72 w-full max-w-[100vw] pb-20 lg:pb-0">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div className="flex min-h-screen bg-slate-50 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-48 rounded-md" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      }>
        <Routes>
          {/* Public Routes - these handle their own navigation if any */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Protected Routes wrapped in Sidebar layout */}
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/log" element={<ProtectedLayout><FoodLogger /></ProtectedLayout>} />
          <Route path="/chat" element={<ProtectedLayout><Chatbot /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
