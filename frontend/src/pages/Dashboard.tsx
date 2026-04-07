import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Activity, Flame, Droplets, Camera } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Mon', calories: 1800 },
  { name: 'Tue', calories: 2100 },
  { name: 'Wed', calories: 1950 },
  { name: 'Thu', calories: 2400 },
  { name: 'Fri', calories: 2000 },
  { name: 'Sat', calories: 2600 },
  { name: 'Sun', calories: 2200 },
];

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.email?.split('@')[0] || 'User'}. Here's your weekly summary.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Calories Today" value="1,850" target="/ 2,200" icon={<Flame className="h-4 w-4 text-orange-500" />} />
        <MetricCard title="Protein" value="110g" target="/ 150g" icon={<Activity className="h-4 w-4 text-emerald-500" />} />
        <MetricCard title="Water" value="1.5L" target="/ 2.5L" icon={<Droplets className="h-4 w-4 text-blue-500" />} />
        <MetricCard title="Meals Logged" value="3" subtitle="Today" icon={<Camera className="h-4 w-4 text-purple-500" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 max-h-[400px]">
          <CardHeader>
            <CardTitle>Calorie Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <InsightItem text="You are consistently hitting your protein goals this week! Great job." type="success" />
              <InsightItem text="Consider reducing sodium intake during dinner based on yesterday's log." type="warning" />
              <InsightItem text="You've drank 20% less water than average over the past 3 days." type="info" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, target, subtitle, icon }: any) {
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

function InsightItem({ text, type }: any) {
  const colors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  return (
    <div className={`p-4 rounded-lg border text-sm ${colors[type as keyof typeof colors]}`}>
      {text}
    </div>
  );
}
