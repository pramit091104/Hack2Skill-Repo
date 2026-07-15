import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../config/firebase';

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();

  const handleLogout = () => {
    auth.signOut();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Log Meal', path: '/log', icon: 'restaurant' },
    { name: 'AI Chat', path: '/chat', icon: 'smart_toy' }
  ];

  return (
    <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-surface-container-lowest shadow-sm z-50 py-8 justify-between hidden lg:flex border-r border-outline-variant/10">
      <div className="flex flex-col gap-8">
        <div className="px-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,107,95,0.2)]">
            <span className="material-symbols-outlined text-on-primary">spa</span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">NutriSmart AI</h1>
            <p className="text-label-sm text-outline">AI-Powered Vitality</p>
          </div>
        </div>
        
        <nav className="flex flex-col">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 group ${
                  isActive 
                    ? 'text-primary font-bold border-r-4 border-primary bg-primary-container/5 scale-[1.02]' 
                    : 'text-outline hover:bg-primary-container/5 hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined ${!isActive && 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        {/* Upgrade CTA */}
        <div className="px-6">
          <div className="bg-secondary-container p-4 rounded-2xl relative overflow-hidden group cursor-pointer shadow-[0_4px_15px_rgba(254,208,27,0.15)]">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-on-secondary-container/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <p className="text-on-secondary-container font-bold text-label-md mb-2">Upgrade to Pro</p>
            <p className="text-on-secondary-container/80 text-xs mb-3">Get advanced AI nutrition insights.</p>
            <button className="bg-on-secondary-container text-white px-4 py-1.5 rounded-full text-xs font-bold w-full hover:bg-on-secondary-fixed transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex flex-col border-t border-outline-variant/10 pt-4">
          <a className="text-outline flex items-center gap-3 px-6 py-3 hover:bg-primary-container/10 hover:text-primary transition-all duration-200 cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </a>
          <a className="text-outline flex items-center gap-3 px-6 py-3 hover:bg-primary-container/10 hover:text-primary transition-all duration-200 cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </a>
        </div>

        {/* Profile Snippet */}
        <div className="px-6 mt-4 flex items-center gap-3 bg-surface-container-low mx-4 p-3 rounded-xl border border-outline-variant/20">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shadow-inner">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-on-surface font-bold text-label-sm truncate">{user?.displayName || user?.email || 'User'}</p>
            <p className="text-outline text-xs truncate">Vitality Tier</p>
          </div>
          <button onClick={handleLogout} className="text-outline hover:text-error transition-colors p-1 rounded-md hover:bg-error-container">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
