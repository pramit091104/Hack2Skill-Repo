import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

interface Meal {
  id: string;
  timestamp: string;
  nutritionSummary?: { calories: number; protein: number; carbs: number; fat: number };
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get today's date string for local storage key
  const todayStr = new Date().toDateString();
  const waterKey = `water_${todayStr}`;
  const [waterGlasses, setWaterGlasses] = useState(parseInt(localStorage.getItem(waterKey) || '0', 10));

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get('/meals/history').catch(() => ({ data: { data: [] } })),
      api.get('/users/profile').catch(() => ({ data: { data: null } }))
    ]).then(([mealsRes, profileRes]) => {
      setMeals(mealsRes.data.data || []);
      setProfile(profileRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);

  const caloriesToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.calories || 0), 0);
  const proteinToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.protein || 0), 0);
  const carbsToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.carbs || 0), 0);
  const fatsToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.fat || 0), 0);

  const targetCalories = profile?.goals?.targetCalories || 2200;
  const targetProtein = profile?.goals?.targetProtein || 120;
  const targetCarbs = profile?.goals?.targetCarbs || 250;
  const targetFats = profile?.goals?.targetFats || 70;

  const calPercent = Math.min((caloriesToday / targetCalories) * 100, 100);

  // Dynamic Suggestion based on time
  const currentHour = new Date().getHours();
  let suggestion = { title: "Avocado Toast", type: "Breakfast", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&q=80&w=2072" };
  if (currentHour >= 11 && currentHour <= 15) {
    suggestion = { title: "Quinoa Power Bowl", type: "Lunch", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2070" };
  } else if (currentHour > 15 && currentHour <= 18) {
    suggestion = { title: "Greek Yogurt & Berries", type: "Snack", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1974" };
  } else if (currentHour > 18) {
    suggestion = { title: "Grilled Salmon Asparagus", type: "Dinner", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1974" };
  }

  const handleWaterToggle = (index: number) => {
    let newCount = waterGlasses;
    if (waterGlasses === index + 1) {
      newCount = index; // Deselect
    } else {
      newCount = index + 1;
    }
    setWaterGlasses(newCount);
    localStorage.setItem(waterKey, newCount.toString());
  };

  return (
    <div className="w-full p-4 lg:p-8 space-y-md lg:space-y-lg animate-in fade-in zoom-in duration-500">
      
      {/* Hero Section */}
      <section className="mt-4 lg:mt-lg">
        <div className="bg-primary-container/10 p-md lg:p-lg rounded-lg ambient-glow relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline-md text-headline-md text-on-primary-container mb-xs">
              Great morning, {user?.email?.split('@')[0] || 'Alex'}! 🌟
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              You're {Math.round(calPercent)}% to your daily calorie goal.
            </p>
          </div>
          {/* Abstract decorative element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl lg:w-64 lg:h-64"></div>
        </div>
      </section>

      {/* Main Grid for Desktop (Bento Pattern) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:gap-lg">
        
        {/* Left Column: Calories & Water */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-md flex-1">
            
            <div className="bg-surface-container-lowest p-md lg:p-lg rounded-lg ambient-glow flex flex-col items-center justify-center text-center space-y-md border border-outline-variant/10">
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

            <div className="flex flex-col gap-md">
              <div className="bg-surface p-md rounded-lg ambient-glow border border-outline-variant/10 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface-variant">Hydration</h4>
                    <p className="font-headline-md text-headline-md text-primary">{waterGlasses}/8 glasses</p>
                  </div>
                  <span className="material-symbols-outlined text-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                </div>
                <div className="flex gap-2 mt-sm flex-wrap">
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <button 
                      key={i} 
                      onClick={() => handleWaterToggle(i)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                        i < waterGlasses ? 'bg-primary-container shadow-md' : 'bg-surface-container-high'
                      }`}
                    >
                      {i < waterGlasses && <span className="material-symbols-outlined text-sm text-white">check</span>}
                    </button>
                  ))}
                </div>
              </div>

              <Link to="/food-logger" className="w-full py-md px-lg bg-tertiary-container rounded-lg text-on-tertiary-container font-label-md flex items-center justify-center gap-sm squishy-btn transition-all ambient-glow">
                <span className="material-symbols-outlined">add_circle</span>
                Log a Meal
              </Link>
            </div>
          </section>

          {/* Macronutrient Section spanning the left column bottom */}
          <section className="space-y-md">
            <h3 className="font-headline-md text-headline-md text-on-surface px-xs">Macronutrients</h3>
            <div className="grid grid-cols-3 gap-sm">
              <MacroCard title="Protein" amount={Math.round(proteinToday)} target={targetProtein} color="text-primary-container" labelColor="text-primary" />
              <MacroCard title="Carbs" amount={Math.round(carbsToday)} target={targetCarbs} color="text-secondary-container" labelColor="text-secondary" />
              <MacroCard title="Fats" amount={Math.round(fatsToday)} target={targetFats} color="text-tertiary-container" labelColor="text-tertiary" />
            </div>
          </section>
        </div>

        {/* Right Column: Suggestions & Extra Insights */}
        <div className="flex flex-col gap-lg">
          <section className="space-y-md h-full flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface px-xs">Daily Suggestion</h3>
            <div onClick={() => navigate('/food-logger')} className="relative group rounded-lg overflow-hidden flex-1 min-h-[250px] ambient-glow cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                   style={{ backgroundImage: `url('${suggestion.img}')` }}>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-md glass-card flex justify-between items-center m-2 rounded-lg">
                <div>
                  <p className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Recommended {suggestion.type}</p>
                  <h4 className="font-headline-md text-headline-md text-on-surface">{suggestion.title}</h4>
                </div>
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center squishy-btn shrink-0">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function MacroCard({ title, amount, target, color, labelColor }: { title: string, amount: number, target: number, color: string, labelColor: string }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  
  const percentage = Math.min((amount / target) * 100, 100);
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
        <div className="absolute inset-0 flex items-center justify-center font-label-sm text-xs">{Math.round(percentage)}%</div>
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant">{title}</span>
      <span className={`font-body-md text-body-md font-bold ${labelColor}`}>{amount}g <span className="text-xs text-outline font-normal">/ {target}g</span></span>
    </div>
  );
}
