import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Camera, Upload, Send } from 'lucide-react';
import { api } from '../services/api';

export default function FoodLogger() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/ai/analyze/text', { text: description });
      setAnalysisResult(res.data.data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze meal.');
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = async () => {
    if (!analysisResult) return;
    setLoading(true);
    try {
      await api.post('/meals', {
        source: 'ai_text',
        foodItems: analysisResult.foodItems,
        nutritionSummary: analysisResult.nutritionSummary,
        aiConfidencePoint: 95
      });
      alert('Meal saved successfully!');
      setDescription('');
      setAnalysisResult(null);
    } catch (error) {
       console.error(error);
       alert('Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Log a Meal</h1>
        <p className="text-slate-500 mt-1">Use text or upload a photo, and let AI calculate the macros.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Send className="mr-2 h-5 w-5" /> Describe it</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyzeText} className="space-y-4">
              <textarea 
                className="w-full min-h-[120px] rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., I had a grilled chicken salad with olive oil dressing and a cup of black coffee."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit" disabled={loading || !description.trim()} className="w-full">
                {loading ? 'Analyzing...' : 'Analyze Meal'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Camera className="mr-2 h-5 w-5" /> Snap it</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 min-h-[220px]">
             <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
               <Upload className="h-8 w-8" />
             </div>
             <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
             <p className="text-xs text-slate-500">SVG, PNG, JPG (max. 8MB)</p>
             <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
          </CardContent>
        </Card>
      </div>

      {analysisResult && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="text-emerald-800">Analysis Complete</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-sm text-slate-500">Calories</p>
                  <p className="text-2xl font-bold">{analysisResult.nutritionSummary.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Protein</p>
                  <p className="text-xl font-semibold">{analysisResult.nutritionSummary.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Carbs</p>
                  <p className="text-xl font-semibold">{analysisResult.nutritionSummary.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Fats</p>
                  <p className="text-xl font-semibold">{analysisResult.nutritionSummary.fat}g</p>
                </div>
             </div>

             <div className="space-y-2 mb-6">
               <h4 className="font-medium text-sm">Detected Items</h4>
               <ul className="text-sm space-y-1">
                 {analysisResult.foodItems.map((item: any, i: number) => (
                   <li key={i} className="flex justify-between border-b border-slate-100 pb-1">
                     <span>{item.name} <span className="text-slate-400">({item.quantity})</span></span>
                     <span className="font-medium">{item.calories} kcal</span>
                   </li>
                 ))}
               </ul>
             </div>

             <Button onClick={saveMeal} disabled={loading} className="w-full">
               Looks Good — Save Log
             </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
