import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';

interface Meal {
  id: string;
  timestamp: string;
  nutritionSummary?: { calories: number; protein: number; carbs: number; fat: number };
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/meals/history')
      .then(res => setMeals(res.data.data || []))
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toDateString();
  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);

  const caloriesToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.calories || 0), 0);
  const proteinToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.protein || 0), 0);
  const carbsToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.carbs || 0), 0);
  const fatsToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.fat || 0), 0);

  const targetCalories = 2200;
  const calPercent = Math.min((caloriesToday / targetCalories) * 100, 100);

  return (
    <div className="w-full max-w-container-max mx-auto px-md pb-32 space-y-lg animate-in fade-in zoom-in duration-500">
      
      {/* Hero Section */}
      <section className="mt-lg">
        <div className="bg-primary-container/10 p-lg rounded-lg ambient-glow relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline-md text-headline-md text-on-primary-container mb-xs">
              Great morning, {user?.email?.split('@')[0] || 'Alex'}! 🌟
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              You're {Math.round(calPercent)}% to your daily goal.
            </p>
          </div>
          {/* Abstract decorative element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Main Calorie Card (Bento Pattern) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-surface-container-lowest p-lg rounded-lg ambient-glow flex flex-col items-center justify-center text-center space-y-md border border-outline-variant/10">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90 origin-center">
              <circle className="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
              <circle 
                className="text-primary-container transition-all duration-1000 ease-out" 
                cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" 
                strokeDasharray="440" 
                strokeDashoffset={440 - (440 * calPercent) / 100} 
                strokeLinecap="round" strokeWidth="12">
              </circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg text-headline-lg text-primary">{loading ? '...' : caloriesToday}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">kcal</span>
            </div>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Daily Calorie Goal</h3>
            <p className="font-body-md text-body-md text-outline">Target: {targetCalories} kcal</p>
          </div>
        </div>

        {/* Side Bento Column */}
        <div className="flex flex-col gap-md">
          {/* Activity/Water Card */}
          <div className="bg-surface p-md rounded-lg ambient-glow border border-outline-variant/10 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-label-md text-label-md text-on-surface-variant">Hydration</h4>
                <p className="font-headline-md text-headline-md text-primary">5/8 glasses</p>
              </div>
              <span className="material-symbols-outlined text-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            </div>
            <div className="flex gap-2 mt-sm flex-wrap">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-white">check</span>
                </div>
              ))}
              {[1,2,3].map(i => (
                <div key={`e-${i}`} className="w-8 h-8 rounded-full bg-surface-container-high"></div>
              ))}
            </div>
          </div>

          {/* Add Log quick action */}
          <button className="w-full py-md px-lg bg-tertiary-container rounded-lg text-on-tertiary-container font-label-md flex items-center justify-center gap-sm squishy-btn transition-all ambient-glow">
            <span className="material-symbols-outlined">add_circle</span>
            Log Today's Lunch
          </button>
        </div>
      </section>

      {/* Macronutrient Section */}
      <section className="space-y-md">
        <h3 className="font-headline-md text-headline-md text-on-surface px-xs">Macronutrients</h3>
        <div className="grid grid-cols-3 gap-sm">
          {/* Protein */}
          <MacroCard title="Protein" amount={Math.round(proteinToday)} color="text-primary-container" labelColor="text-primary" percentage={60} />
          {/* Carbs */}
          <MacroCard title="Carbs" amount={Math.round(carbsToday)} color="text-secondary-container" labelColor="text-secondary" percentage={45} />
          {/* Fats */}
          <MacroCard title="Fats" amount={Math.round(fatsToday)} color="text-tertiary-container" labelColor="text-tertiary" percentage={30} />
        </div>
      </section>

      {/* Insights / Food Recommendation */}
      <section className="space-y-md">
        <h3 className="font-headline-md text-headline-md text-on-surface px-xs">Daily Suggestion</h3>
        <div className="relative group rounded-lg overflow-hidden h-48 ambient-glow cursor-pointer">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop')" }}>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-md glass-card flex justify-between items-center">
            <div>
              <p className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Recommended Lunch</p>
              <h4 className="font-headline-md text-headline-md text-on-surface">Quinoa Power Bowl</h4>
            </div>
            <button className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center squishy-btn">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MacroCard({ title, amount, color, labelColor, percentage }: { title: string, amount: number, color: string, labelColor: string, percentage: number }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-sm rounded-lg ambient-glow flex flex-col items-center gap-xs text-center border border-outline-variant/10">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90 origin-center">
          <circle className="text-surface-container-high" cx="32" cy="32" fill="transparent" r={radius} stroke="currentColor" strokeWidth="6"></circle>
          <circle 
            className={color + " transition-all duration-1000 ease-out"} 
            cx="32" cy="32" fill="transparent" r={radius} stroke="currentColor" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round" strokeWidth="6">
          </circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-label-sm text-xs">{percentage}%</div>
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant">{title}</span>
      <span className={`font-body-md text-body-md font-bold ${labelColor}`}>{amount}g</span>
    </div>
  );
}
