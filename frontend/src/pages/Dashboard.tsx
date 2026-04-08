import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Activity, Flame, Droplets, Camera } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Meal {
  id: string;
  timestamp: string;
  nutritionSummary?: { calories: number; protein: number; carbs: number; fat: number };
}

interface DayCalories { name: string; calories: number; }

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

  // Today's meals
  const todayStr = new Date().toDateString();
  const todayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);

  const caloriesToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.calories || 0), 0);
  const proteinToday = todayMeals.reduce((s, m) => s + (m.nutritionSummary?.protein || 0), 0);
  const mealsLogged = todayMeals.length;

  // Last 7 days calorie trend
  const trendData: DayCalories[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === dayStr);
    const calories = dayMeals.reduce((s, m) => s + (m.nutritionSummary?.calories || 0), 0);
    return { name: d.toLocaleDateString('en', { weekday: 'short' }), calories };
  });

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.email?.split('@')[0] || 'User'}. Here's your summary.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Calories Today" value={loading ? '—' : caloriesToday.toLocaleString()} target="kcal" icon={<Flame className="h-4 w-4 text-orange-500" />} />
        <MetricCard title="Protein" value={loading ? '—' : `${Math.round(proteinToday)}g`} icon={<Activity className="h-4 w-4 text-emerald-500" />} />
        <MetricCard title="Water" value="—" target="track manually" icon={<Droplets className="h-4 w-4 text-blue-500" />} />
        <MetricCard title="Meals Logged" value={loading ? '—' : String(mealsLogged)} subtitle="Today" icon={<Camera className="h-4 w-4 text-purple-500" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 max-h-[400px]">
          <CardHeader>
            <CardTitle>Calorie Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} itemStyle={{ color: '#0f172a' }} />
                <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Today's Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500">Loading...</p>
            ) : todayMeals.length === 0 ? (
              <p className="text-sm text-slate-500">No meals logged today. Start by logging a meal!</p>
            ) : (
              <div className="space-y-3">
                {todayMeals.map(m => (
                  <div key={m.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-600">{new Date(m.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-medium">{m.nutritionSummary?.calories || 0} kcal</span>
                    <span className="text-slate-500">{m.nutritionSummary?.protein || 0}g protein</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, target, subtitle, icon }: { title: string; value: string; target?: string; subtitle?: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} <span className="text-sm text-slate-500 font-normal">{target}</span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
