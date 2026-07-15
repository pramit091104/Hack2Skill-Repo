import React, { useState } from 'react';
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
    <div className="w-full p-6 lg:p-8 space-y-lg animate-in fade-in zoom-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Log Meal</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Track your nutrition with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="space-y-lg">
          {/* Hero Section: Photo Upload */}
          <section className="relative group">
            <div className="aspect-[4/3] w-full rounded-lg bg-primary-container/10 border-2 border-dashed border-primary-container flex flex-col items-center justify-center p-lg text-center cursor-pointer transition-all hover:bg-primary-container/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05)_0%,transparent_70%)]"></div>
              <div className="relative z-10 flex flex-col items-center pointer-events-none">
                <div className="w-24 h-24 mb-md transform group-hover:scale-110 transition-transform duration-500 ease-out flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_a_photo</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Snap your meal</h2>
                <p className="font-body-md text-body-md text-outline max-w-[240px]">AI will automatically recognize and calculate your macros</p>
              </div>
            </div>
          </section>

          {/* Search Bar / Text Input */}
          <section className="relative">
            <form onSubmit={handleAnalyzeText} className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-4 text-primary">search</span>
              <input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-24 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-full font-body-md text-body-md text-on-surface placeholder:text-outline shadow-[0_4px_20px_rgba(45,212,191,0.05)] focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                placeholder="Or describe it (e.g., Apple and oats)..." 
                type="text"
              />
              <button 
                type="submit" 
                disabled={loading || !description.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-full font-label-md hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? '...' : 'Analyze'}
              </button>
            </form>
          </section>

          {/* Contextual Suggestions / Chips */}
          <section className="flex flex-wrap gap-2">
            <button onClick={() => setDescription("Oatmeal with berries")} className="px-4 py-2 rounded-full border border-primary-container/30 text-primary bg-white font-label-md text-label-md hover:bg-primary-container/10 transition-colors active:scale-95">Breakfast</button>
            <button onClick={() => setDescription("Greek yogurt and almonds")} className="px-4 py-2 rounded-full border border-primary-container/30 text-primary bg-white font-label-md text-label-md hover:bg-primary-container/10 transition-colors active:scale-95">Quick Snack</button>
            <button onClick={() => setDescription("Grilled chicken salad")} className="px-4 py-2 rounded-full border border-primary-container/30 text-primary bg-white font-label-md text-label-md hover:bg-primary-container/10 transition-colors active:scale-95">Lunch Ideas</button>
          </section>
        </div>

        <div>
          {/* Analysis Result or Recent Items */}
          {analysisResult ? (
            <div className="bg-surface-container-lowest p-md rounded-2xl shadow-[0_4px_20px_rgba(45,212,191,0.08)] border border-primary/20 space-y-md animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-md">
                <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Analysis Complete</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                <div className="bg-surface p-sm rounded-lg text-center">
                  <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Calories</p>
                  <p className="font-headline-md text-primary">{analysisResult.nutritionSummary.calories}</p>
                </div>
                <div className="bg-surface p-sm rounded-lg text-center">
                  <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Protein</p>
                  <p className="font-headline-md text-on-surface">{analysisResult.nutritionSummary.protein}g</p>
                </div>
                <div className="bg-surface p-sm rounded-lg text-center">
                  <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Carbs</p>
                  <p className="font-headline-md text-on-surface">{analysisResult.nutritionSummary.carbs}g</p>
                </div>
                <div className="bg-surface p-sm rounded-lg text-center">
                  <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Fats</p>
                  <p className="font-headline-md text-on-surface">{analysisResult.nutritionSummary.fat}g</p>
                </div>
              </div>

              <div className="space-y-sm">
                <h4 className="font-label-md text-on-surface-variant uppercase tracking-wider">Detected Items</h4>
                <ul className="space-y-2">
                  {analysisResult.foodItems.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between items-center bg-surface-bright p-sm rounded-lg border border-outline-variant/10">
                      <div>
                        <span className="font-body-md text-on-surface">{item.name}</span>
                        <span className="font-label-sm text-outline ml-2">({item.quantity})</span>
                      </div>
                      <span className="font-label-md text-primary bg-primary-container/20 px-2 py-1 rounded-md">{item.calories} kcal</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={saveMeal} 
                disabled={loading} 
                className="w-full mt-4 bg-primary text-white py-4 rounded-full font-headline-md text-headline-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-lg"
              >
                <span className="material-symbols-outlined">save</span>
                Save to Log
              </button>
            </div>
          ) : (
            <section className="space-y-sm mt-lg lg:mt-0">
              <div className="flex items-center justify-between">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Recently Logged</h3>
                <button className="text-primary font-label-sm text-label-sm hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {/* Recent Item 1 */}
                <div className="bg-surface-container-lowest p-sm rounded-xl flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-outline-variant/10 hover:border-primary-container transition-colors cursor-pointer active:scale-95">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-2xl">
                    🍎
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-label-md text-label-md text-on-surface truncate">Apple</p>
                    <p className="font-label-sm text-label-sm text-outline">95 kcal</p>
                  </div>
                </div>
                {/* Recent Item 2 */}
                <div className="bg-surface-container-lowest p-sm rounded-xl flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-outline-variant/10 hover:border-primary-container transition-colors cursor-pointer active:scale-95">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-2xl">
                    🥣
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-label-md text-label-md text-on-surface truncate">Oatmeal</p>
                    <p className="font-label-sm text-label-sm text-outline">150 kcal</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
