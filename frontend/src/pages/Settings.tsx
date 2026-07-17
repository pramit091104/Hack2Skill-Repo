import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [goals, setGoals] = useState({
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFats: 65,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      const data = res.data.data;
      if (data) {
        if (data.displayName) setDisplayName(data.displayName);
        if (data.goals) {
          setGoals({
            targetCalories: data.goals.targetCalories || 2000,
            targetProtein: data.goals.targetProtein || 150,
            targetCarbs: data.goals.targetCarbs || 200,
            targetFats: data.goals.targetFats || 65,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', {
        displayName,
        goals: {
          targetCalories: Number(goals.targetCalories),
          targetProtein: Number(goals.targetProtein),
          targetCarbs: Number(goals.targetCarbs),
          targetFats: Number(goals.targetFats),
        }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 space-y-lg animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your account and goals</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-md lg:p-lg rounded-2xl shadow-[0_4px_20px_rgba(45,212,191,0.08)] border border-primary/20 space-y-md">
        <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/20 pb-2">Profile Information</h2>
        <div className="space-y-sm">
          <div>
            <label className="block font-label-md text-on-surface-variant mb-1">Email Address (Read-only)</label>
            <input 
              type="text" 
              disabled 
              value={auth.currentUser?.email || ''} 
              className="w-full p-3 bg-surface-container/50 border border-outline-variant/30 rounded-lg text-outline cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface-variant mb-1">Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 bg-white border border-outline-variant/50 rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
              placeholder="Your Name"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-md lg:p-lg rounded-2xl shadow-[0_4px_20px_rgba(45,212,191,0.08)] border border-primary/20 space-y-md">
        <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/20 pb-2">Nutritional Goals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <label className="block font-label-md text-on-surface-variant mb-1">Daily Calories (kcal)</label>
            <input 
              type="number" 
              required
              min="500"
              value={goals.targetCalories} 
              onChange={(e) => setGoals({...goals, targetCalories: parseInt(e.target.value) || 0})}
              className="w-full p-3 bg-white border border-outline-variant/50 rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface-variant mb-1">Protein (g)</label>
            <input 
              type="number" 
              required
              min="10"
              value={goals.targetProtein} 
              onChange={(e) => setGoals({...goals, targetProtein: parseInt(e.target.value) || 0})}
              className="w-full p-3 bg-white border border-outline-variant/50 rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface-variant mb-1">Carbs (g)</label>
            <input 
              type="number" 
              required
              min="10"
              value={goals.targetCarbs} 
              onChange={(e) => setGoals({...goals, targetCarbs: parseInt(e.target.value) || 0})}
              className="w-full p-3 bg-white border border-outline-variant/50 rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface-variant mb-1">Fats (g)</label>
            <input 
              type="number" 
              required
              min="10"
              value={goals.targetFats} 
              onChange={(e) => setGoals({...goals, targetFats: parseInt(e.target.value) || 0})}
              className="w-full p-3 bg-white border border-outline-variant/50 rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-headline-sm text-headline-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <div className="bg-error/5 p-md lg:p-lg rounded-2xl border border-error/20 space-y-sm flex flex-col items-center">
        <p className="font-body-md text-on-surface-variant text-center mb-2">Want to switch accounts or exit?</p>
        <button 
          onClick={handleSignOut}
          className="px-8 py-3 bg-error text-white rounded-full font-label-lg hover:bg-error/90 transition-colors active:scale-95 shadow-md"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
