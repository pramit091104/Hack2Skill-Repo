import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function FoodLogger() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/meals/history')
      .then(res => setRecentMeals(res.data.data || []))
      .catch(console.error);
  }, [analysisResult]);

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setLoading(true);
    setImagePreview(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setLoading(true);
      try {
        const res = await api.post('/ai/analyze/image', { base64Image: base64String });
        setAnalysisResult(res.data.data);
      } catch (error) {
        console.error(error);
        alert('Failed to analyze image. Please try again.');
        setImagePreview(null);
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
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
      setImagePreview(null);
    } catch (error) {
       console.error(error);
       alert('Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-margin-page py-stack-md max-w-[1200px] mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline-lg text-4xl text-text-primary tracking-tight">Log Meal</h1>
          <p className="font-body-md text-text-secondary mt-2">Track your nutrition with AI precision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div className="space-y-stack-md">
          {/* Hero Section: Photo Upload */}
          <section className="relative group bg-white border border-border-subtle rounded-lg p-6 shadow-sm">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              disabled={loading}
            />
            <div 
              onClick={() => !loading && fileInputRef.current?.click()}
              className="aspect-video w-full rounded-lg bg-surface border-2 border-dashed border-border-input flex flex-col items-center justify-center p-lg text-center cursor-pointer transition-all hover:border-primary/50 overflow-hidden relative group-hover:bg-surface-container-low"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0 z-10" />
              ) : (
                <>
                  <div className="relative z-10 flex flex-col items-center pointer-events-none">
                    <div className="w-16 h-16 mb-4 rounded-full bg-primary-container/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                    </div>
                    <h2 className="font-headline-sm text-xl text-text-primary font-medium mb-1">Upload Meal Photo</h2>
                    <p className="font-body-sm text-text-secondary max-w-[240px]">Drag and drop or click to upload. AI will calculate macros instantly.</p>
                  </div>
                </>
              )}
              {loading && imagePreview && (
                <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 border-4 border-border-input border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </section>

          {/* Search Bar / Text Input */}
          <section className="bg-white border border-border-subtle rounded-lg p-6 shadow-sm">
            <h3 className="font-headline-sm text-lg text-text-primary mb-4 font-medium">Or log manually</h3>
            <form onSubmit={handleAnalyzeText} className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-4 text-text-secondary">search</span>
              <input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-28 py-3 bg-surface border border-border-input rounded-lg font-body-md text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="Describe your meal (e.g., Avocado Toast)" 
                type="text"
              />
              <button 
                type="submit" 
                disabled={loading || !description.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white rounded font-button text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? '...' : 'Analyze'}
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setDescription("Oatmeal with berries")} className="px-3 py-1 rounded-full border border-border-subtle text-text-secondary hover:text-primary hover:border-primary/50 text-sm transition-colors">Breakfast</button>
              <button onClick={() => setDescription("Greek yogurt and almonds")} className="px-3 py-1 rounded-full border border-border-subtle text-text-secondary hover:text-primary hover:border-primary/50 text-sm transition-colors">Quick Snack</button>
            </div>
          </section>
        </div>

        <div>
          {/* Analysis Result or Recent Items */}
          {analysisResult ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-border-subtle space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                <h3 className="font-headline-sm text-2xl text-text-primary">Analysis Complete</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                <div className="bg-surface p-4 rounded-lg text-center border border-border-subtle">
                  <p className="font-label-sm text-text-secondary uppercase tracking-wider mb-1">Calories</p>
                  <p className="font-headline-md text-primary font-bold">{analysisResult.nutritionSummary.calories}</p>
                </div>
                <div className="bg-surface p-4 rounded-lg text-center border border-border-subtle">
                  <p className="font-label-sm text-text-secondary uppercase tracking-wider mb-1">Protein</p>
                  <p className="font-headline-md text-text-primary font-medium">{analysisResult.nutritionSummary.protein}g</p>
                </div>
                <div className="bg-surface p-4 rounded-lg text-center border border-border-subtle">
                  <p className="font-label-sm text-text-secondary uppercase tracking-wider mb-1">Carbs</p>
                  <p className="font-headline-md text-text-primary font-medium">{analysisResult.nutritionSummary.carbs}g</p>
                </div>
                <div className="bg-surface p-4 rounded-lg text-center border border-border-subtle">
                  <p className="font-label-sm text-text-secondary uppercase tracking-wider mb-1">Fats</p>
                  <p className="font-headline-md text-text-primary font-medium">{analysisResult.nutritionSummary.fat}g</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-label-md text-text-primary uppercase tracking-wider text-sm font-bold">Detected Items</h4>
                <ul className="space-y-2">
                  {analysisResult.foodItems.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border-subtle">
                      <div>
                        <span className="font-body-md text-text-primary font-medium">{item.name}</span>
                        <span className="text-sm text-text-secondary ml-2">({item.quantity})</span>
                      </div>
                      <span className="text-sm font-medium text-primary bg-primary-container/10 px-2 py-1 rounded">{item.calories} kcal</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={saveMeal} 
                disabled={loading} 
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-button text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined">save</span>
                Save to Log
              </button>
            </div>
          ) : (
            <section className="bg-white border border-border-subtle rounded-lg shadow-sm overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-border-subtle bg-surface flex items-center justify-between">
                <h3 className="font-label-md text-text-primary uppercase tracking-wider font-bold">Recently Logged</h3>
              </div>
              <div className="divide-y divide-border-subtle max-h-[600px] overflow-y-auto">
                {recentMeals.length > 0 ? recentMeals.map((meal, index) => (
                  <div key={meal.id || index} className="p-4 flex items-center gap-4 hover:bg-surface transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-2xl shrink-0">
                      {meal.imageUrl ? <img src={meal.imageUrl} className="w-full h-full object-cover rounded-lg" alt="meal"/> : "🥗"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-body-md text-text-primary truncate font-medium group-hover:text-primary transition-colors">
                        {meal.foodItems?.map((i: any) => i.name).join(', ') || 'AI Logged Meal'}
                      </p>
                      <p className="text-sm text-text-secondary">{meal.nutritionSummary?.calories || 0} kcal • {new Date(meal.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-text-secondary font-body-md">
                    No meals logged yet. Snap a photo to get started.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
