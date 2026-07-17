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
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-border-input border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-stack-md min-h-screen">
      <div className="mb-8 mt-8 border-b border-border-subtle pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-4xl text-text-primary tracking-tight mb-2">Settings</h1>
          <p className="font-body-md text-text-secondary text-lg">Manage your personal details and dietary targets.</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="px-6 py-2 border border-error/50 text-error rounded font-button text-sm hover:bg-error/5 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-lg border border-border-subtle shadow-sm space-y-6">
            <h2 className="font-headline-sm text-xl text-text-primary font-medium">Profile Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block font-label-md text-text-secondary text-sm font-medium mb-2">Email Address</label>
                <input 
                  type="text" 
                  disabled 
                  value={auth.currentUser?.email || ''} 
                  className="w-full p-3 bg-surface border border-border-input rounded-md text-text-secondary cursor-not-allowed outline-none" 
                />
              </div>
              <div>
                <label className="block font-label-md text-text-secondary text-sm font-medium mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 bg-white border border-border-input rounded-md text-text-primary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="Your Name"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-border-subtle shadow-sm space-y-6">
            <h2 className="font-headline-sm text-xl text-text-primary font-medium">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <p className="font-label-md text-text-primary font-medium">Push Notifications</p>
                  <p className="font-body-sm text-text-secondary text-sm mt-1">Receive daily logging reminders</p>
                </div>
                <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-label-md text-text-primary font-medium">Weekly Report</p>
                  <p className="font-body-sm text-text-secondary text-sm mt-1">Email summary of nutrition trends</p>
                </div>
                <div className="w-11 h-6 bg-surface-container-high border border-border-input rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-outline rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Goals Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-lg border border-border-subtle shadow-sm space-y-8">
            <h2 className="font-headline-sm text-xl text-text-primary font-medium border-b border-border-subtle pb-4">Nutritional Goals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-md text-text-secondary text-sm font-medium mb-2">Daily Calories (kcal)</label>
                <input 
                  type="number" 
                  required
                  min="500"
                  value={goals.targetCalories} 
                  onChange={(e) => setGoals({...goals, targetCalories: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-white border border-border-input rounded-md text-text-primary font-medium text-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block font-label-md text-text-secondary text-sm font-medium mb-2">Protein Target (g)</label>
                <input 
                  type="number" 
                  required
                  min="10"
                  value={goals.targetProtein} 
                  onChange={(e) => setGoals({...goals, targetProtein: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-white border border-border-input rounded-md text-text-primary font-medium text-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block font-label-md text-text-secondary text-sm font-medium mb-2">Carbs Target (g)</label>
                <input 
                  type="number" 
                  required
                  min="10"
                  value={goals.targetCarbs} 
                  onChange={(e) => setGoals({...goals, targetCarbs: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-white border border-border-input rounded-md text-text-primary font-medium text-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block font-label-md text-text-secondary text-sm font-medium mb-2">Fats Target (g)</label>
                <input 
                  type="number" 
                  required
                  min="10"
                  value={goals.targetFats} 
                  onChange={(e) => setGoals({...goals, targetFats: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-white border border-border-input rounded-md text-text-primary font-medium text-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border-subtle">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-primary text-white py-4 rounded-md font-button text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
