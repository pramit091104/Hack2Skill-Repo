import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/Skeleton';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
  const [profile, setProfile] = useState<any>(null);
  const [activeMetric, setActiveMetric] = useState<'calories' | 'protein' | 'carbs' | 'fat'>('calories');

  useEffect(() => {
    Promise.all([
      api.get('/meals/history').catch(() => ({ data: { data: [] } })),
      api.get('/users/profile').catch((err) => {
        if (err.response?.status === 404) {
          navigate('/onboarding');
        }
        return { data: { data: null } };
      })
    ]).then(([mealsRes, profileRes]) => {
      setMeals(mealsRes.data.data || []);
      setProfile(profileRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toDateString();
  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);

  const caloriesToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.calories || 0), 0);
  const proteinToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.protein || 0), 0);
  const carbsToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.carbs || 0), 0);
  const fatsToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.fat || 0), 0);

  const targetCalories = profile?.goals?.targetCalories || 2200;
  const targetProtein = profile?.goals?.targetProtein || 160;
  const targetCarbs = profile?.goals?.targetCarbs || 250;
  const targetFats = profile?.goals?.targetFats || 75;

  const calPercent = Math.min((caloriesToday / targetCalories) * 100, 100);
  const proPercent = Math.min((proteinToday / targetProtein) * 100, 100);
  const carbPercent = Math.min((carbsToday / targetCarbs) * 100, 100);
  const fatPercent = Math.min((fatsToday / targetFats) * 100, 100);

  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const shortDay = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dayMeals = meals.filter(m => {
        const mDate = new Date(m.timestamp);
        mDate.setHours(0, 0, 0, 0);
        return mDate.getTime() === date.getTime();
      });

      const calories = dayMeals.reduce((s, m) => s + (m.nutritionSummary?.calories || 0), 0);
      const protein = dayMeals.reduce((s, m) => s + (m.nutritionSummary?.protein || 0), 0);
      const carbs = dayMeals.reduce((s, m) => s + (m.nutritionSummary?.carbs || 0), 0);
      const fat = dayMeals.reduce((s, m) => s + (m.nutritionSummary?.fat || 0), 0);

      const singleLetterDay = shortDay.charAt(0);

      data.push({
        name: singleLetterDay,
        fullName: shortDay,
        calories,
        protein,
        carbs,
        fat,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  
  const metricConfigs = {
    calories: { label: 'Calories', unit: 'cal', color: '#166534', target: targetCalories },
    protein: { label: 'Protein', unit: 'g', color: '#f59e0b', target: targetProtein },
    carbs: { label: 'Carbs', unit: 'g', color: '#3b82f6', target: targetCarbs },
    fat: { label: 'Fats', unit: 'g', color: '#ef4444', target: targetFats },
  };

  const activeConfig = metricConfigs[activeMetric];
  const weeklyAvg = chartData.reduce((acc, curr) => acc + (curr[activeMetric] as number), 0) / 7;
  const maxInWeek = Math.max(...chartData.map(d => d[activeMetric] as number));
  const yAxisMax = Math.max(activeConfig.target, maxInWeek);

  return (
    <div className="px-4 lg:px-8 py-stack-md max-w-[1200px] mx-auto min-h-screen">
      {/* Greeting */}
      <section className="mb-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
        <h1 className="font-headline-lg text-4xl text-text-primary mb-2">
          {(() => {
            const hour = new Date().getHours();
            let greeting = 'Good evening';
            if (hour >= 5 && hour < 12) greeting = 'Good morning';
            else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
            return `${greeting}, ${profile?.displayName || user?.email?.split('@')[0] || 'Alex'}`;
          })()}
        </h1>
        <p className="text-text-secondary font-body-md text-lg">You've reached {Math.round(calPercent)}% of your daily calorie goal. Keep it up!</p>
      </section>

      {/* Metric Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-gutter mb-stack-lg">
        {/* Calories Card */}
        <div className="bg-surface border border-border-subtle p-6 rounded-lg transition-all hover:border-primary-fixed duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary font-label-md text-sm uppercase tracking-wider font-bold">Calories Today</p>
            <span className="material-symbols-outlined text-primary">local_fire_department</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            {loading ? <Skeleton className="w-16 h-10 inline-block" /> : <span className="text-4xl font-headline-lg text-text-primary font-bold">{Math.round(caloriesToday)}</span>}
            <span className="text-text-secondary text-sm">/ {targetCalories} kcal</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${calPercent}%` }}></div>
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-surface border border-border-subtle p-6 rounded-lg transition-all hover:border-primary-fixed duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary font-label-md text-sm uppercase tracking-wider font-bold">Protein</p>
            <span className="material-symbols-outlined text-primary">fitness_center</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            {loading ? <Skeleton className="w-16 h-10 inline-block" /> : <span className="text-4xl font-headline-lg text-text-primary font-bold">{Math.round(proteinToday)}</span>}
            <span className="text-text-secondary text-sm">/ {targetProtein} g</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${proPercent}%` }}></div>
          </div>
        </div>

        {/* Carbs Card */}
        <div className="bg-surface border border-border-subtle p-6 rounded-lg transition-all hover:border-primary-fixed duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary font-label-md text-sm uppercase tracking-wider font-bold">Carbs</p>
            <span className="material-symbols-outlined text-primary">bakery_dining</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            {loading ? <Skeleton className="w-16 h-10 inline-block" /> : <span className="text-4xl font-headline-lg text-text-primary font-bold">{Math.round(carbsToday)}</span>}
            <span className="text-text-secondary text-sm">/ {targetCarbs} g</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${carbPercent}%` }}></div>
          </div>
        </div>

        {/* Fats Card */}
        <div className="bg-surface border border-border-subtle p-6 rounded-lg transition-all hover:border-primary-fixed duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary font-label-md text-sm uppercase tracking-wider font-bold">Fats</p>
            <span className="material-symbols-outlined text-primary">opacity</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            {loading ? <Skeleton className="w-16 h-10 inline-block" /> : <span className="text-4xl font-headline-lg text-text-primary font-bold">{Math.round(fatsToday)}</span>}
            <span className="text-text-secondary text-sm">/ {targetFats} g</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${fatPercent}%` }}></div>
          </div>
        </div>
      </section>

      {/* 7-Day Trends Graph */}
      <section className="mb-stack-lg">
        <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-border-subtle p-5 lg:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h3 className="font-headline-sm text-lg lg:text-xl text-text-primary font-bold">{activeConfig.label}</h3>
            <button 
              onClick={() => {
                const keys = Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>;
                const currentIndex = keys.indexOf(activeMetric);
                const nextIndex = (currentIndex + 1) % keys.length;
                setActiveMetric(keys[nextIndex]);
              }}
              className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
            </button>
          </div>
          
          <div className="flex flex-row items-end gap-4 lg:gap-8 h-[120px] lg:h-[140px]">
            <div className="flex-shrink-0 pb-1 lg:pb-0">
              <p className="text-text-secondary font-label-md text-xs font-medium mb-1">This week's avg</p>
              <p className="font-headline-lg text-xl lg:text-2xl font-bold text-text-primary">{Math.round(weeklyAvg)} {activeConfig.unit}</p>
            </div>
            
            <div className="flex-1 w-full h-full relative">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : chartData.every(d => d[activeMetric] === 0) ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-3xl mb-2 opacity-50">bar_chart</span>
                  <p className="text-xs">No {activeConfig.label.toLowerCase()} logged.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 600 }} 
                      dy={10} 
                    />
                    <YAxis hide={true} domain={[0, yAxisMax]} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'Inter, sans-serif', padding: '12px 16px' }}
                      labelStyle={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}
                      formatter={(value: number) => [`${value} ${activeConfig.unit}`, activeConfig.label]}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                    />
                    <Bar 
                      dataKey={activeMetric} 
                      fill={activeConfig.color} 
                      radius={[20, 20, 20, 20]} 
                      background={{ fill: '#F3F4F6', radius: 20 }}
                      maxBarSize={14}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Meals Section */}
      <section className="bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
          <h3 className="font-headline-sm text-2xl text-text-primary font-medium">Recent Meals</h3>
          <Link to="/food-logger" className="text-primary font-button font-medium hover:underline">Log Meal</Link>
        </div>
        <div className="divide-y divide-border-subtle">
          {meals.length === 0 && !loading && (
            <div className="p-8 text-center text-text-secondary">No meals logged yet. Log your first meal!</div>
          )}
          {loading && (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-subtle last:border-0">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-6 md:gap-12 self-end md:self-auto">
                  <div className="hidden md:flex gap-4 md:gap-6">
                    <Skeleton className="h-10 w-8" />
                    <Skeleton className="h-10 w-8" />
                    <Skeleton className="h-10 w-8" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))
          )}
          
          {meals.slice(0, 5).map((meal: any, idx) => (
            <div key={idx} className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-surface-container-low transition-colors group gap-4">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest">
                  {meal.imageUrl ? (
                    <img className="w-full h-full object-cover" src={meal.imageUrl} alt="Meal" />
                  ) : (
                    <span className="material-symbols-outlined text-text-secondary w-full h-full flex items-center justify-center text-3xl">restaurant</span>
                  )}
                </div>
                <div>
                  <h4 className="text-text-primary font-body-lg text-lg font-medium">{meal.foodName || 'Meal'}</h4>
                  <p className="text-text-secondary text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {new Date(meal.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-12 text-right self-end md:self-auto">
                <div className="hidden md:flex gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Prot</p>
                    <p className="text-sm font-semibold text-text-primary">{Math.round(meal.nutritionSummary?.protein || 0)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Carb</p>
                    <p className="text-sm font-semibold text-text-primary">{Math.round(meal.nutritionSummary?.carbs || 0)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Fat</p>
                    <p className="text-sm font-semibold text-text-primary">{Math.round(meal.nutritionSummary?.fat || 0)}g</p>
                  </div>
                </div>
                <div className="w-24">
                  <p className="text-xl text-primary font-bold">{Math.round(meal.nutritionSummary?.calories || 0)} kcal</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-stack-lg grid grid-cols-1 md:grid-cols-3 gap-gutter pb-16">
        <div className="md:col-span-2 bg-primary-container/10 border border-primary/20 p-8 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-primary-container/20 transition-all">
          <div>
            <h4 className="text-primary font-headline-sm text-2xl font-bold mb-2">Plan Your Week</h4>
            <p className="text-primary/80 text-sm max-w-md font-medium">Our AI analyzed your recent activity and suggests a high-protein meal plan for the next 7 days.</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary transition-transform group-hover:translate-x-2">arrow_forward</span>
        </div>
        
        <Link to="/food-logger" className="bg-surface border border-border-subtle p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-2xl">add</span>
          </div>
          <p className="font-button text-text-primary font-medium">Log New Meal</p>
        </Link>
      </section>
    </div>
  );
}
