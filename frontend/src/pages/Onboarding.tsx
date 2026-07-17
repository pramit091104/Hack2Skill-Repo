import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

type Goal = 'Lose Weight' | 'Maintain' | 'Build Muscle';
type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
type Diet = 'None' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Paleo';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    goal: '' as Goal | '',
    gender: 'male',
    age: 30,
    weight: 70, // kg
    height: 170, // cm
    activityLevel: '' as ActivityLevel | '',
    diet: 'None' as Diet
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculateMacros = () => {
    // Basic Mifflin-St Jeor Equation
    let bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age;
    bmr += formData.gender === 'male' ? 5 : -161;

    const activityMultipliers = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725
    };

    let tdee = bmr * (activityMultipliers[formData.activityLevel as ActivityLevel] || 1.2);

    let targetCalories = tdee;
    if (formData.goal === 'Lose Weight') targetCalories -= 500;
    if (formData.goal === 'Build Muscle') targetCalories += 300;

    // Macros: 30% Protein, 35% Carbs, 35% Fats (General split)
    const targetProtein = Math.round((targetCalories * 0.3) / 4);
    const targetCarbs = Math.round((targetCalories * 0.35) / 4);
    const targetFats = Math.round((targetCalories * 0.35) / 9);

    return {
      targetCalories: Math.round(targetCalories),
      targetProtein,
      targetCarbs,
      targetFats
    };
  };

  const submitProfile = async () => {
    setLoading(true);
    const goals = calculateMacros();

    try {
      await api.put('/users/profile', {
        displayName: user?.email?.split('@')[0] || 'User',
        personalInfo: {
          gender: formData.gender,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          activityLevel: formData.activityLevel,
          diet: formData.diet
        },
        goals
      });
      // Add a slight delay for smooth UX transition
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
      setLoading(false);
    }
  };

  // Auto-submit when reaching the final step
  if (step === 5 && !loading) {
    submitProfile();
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-surface-container-highest fixed top-0 left-0 z-50">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 lg:px-8 pt-12 pb-24 z-10">
        
        <div className="flex items-center gap-2 mb-12">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
          <span className="font-headline-md text-xl font-bold text-primary tracking-tight">NutriSmart AI</span>
        </div>

        <div className="flex-1 flex flex-col justify-center w-full relative">
          
          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h1 className="font-headline-lg text-4xl text-text-primary mb-4 leading-tight">What brings you here?</h1>
              <p className="text-text-secondary text-lg mb-10">Select your primary goal to help our AI build your plan.</p>
              
              <div className="space-y-4">
                {[
                  { id: 'Lose Weight', icon: 'trending_down', desc: 'Burn fat and get leaner' },
                  { id: 'Maintain', icon: 'balance', desc: 'Stay healthy at my current weight' },
                  { id: 'Build Muscle', icon: 'fitness_center', desc: 'Bulk up and gain strength' }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => { updateForm('goal', g.id); setTimeout(handleNext, 300); }}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-6 group ${
                      formData.goal === g.id 
                        ? 'border-primary bg-primary-container/10' 
                        : 'border-border-subtle bg-white hover:border-primary/40 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                      formData.goal === g.id ? 'bg-primary text-white' : 'bg-surface-container-high text-text-secondary group-hover:text-primary group-hover:bg-primary-container/20'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">{g.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-xl text-text-primary font-medium">{g.id}</h3>
                      <p className="text-text-secondary">{g.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h1 className="font-headline-lg text-4xl text-text-primary mb-4 leading-tight">Tell us about yourself</h1>
              <p className="text-text-secondary text-lg mb-10">We use this to calculate your metabolic rate accurately.</p>
              
              <div className="space-y-8 bg-white p-6 lg:p-8 rounded-2xl border border-border-subtle shadow-sm">
                
                <div>
                  <label className="block font-label-md text-text-primary mb-3">Biological Sex</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => updateForm('gender', 'male')} className={`py-4 rounded-xl border-2 transition-all font-button ${formData.gender === 'male' ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-input bg-surface text-text-secondary'}`}>Male</button>
                    <button onClick={() => updateForm('gender', 'female')} className={`py-4 rounded-xl border-2 transition-all font-button ${formData.gender === 'female' ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-input bg-surface text-text-secondary'}`}>Female</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-label-md text-text-primary mb-2">Age</label>
                    <input 
                      type="number" min="13" max="120"
                      value={formData.age} onChange={e => updateForm('age', Number(e.target.value))}
                      className="w-full p-4 rounded-xl border border-border-input bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-lg text-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-text-primary mb-2">Weight (kg)</label>
                    <input 
                      type="number" min="30" max="300"
                      value={formData.weight} onChange={e => updateForm('weight', Number(e.target.value))}
                      className="w-full p-4 rounded-xl border border-border-input bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-lg text-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-text-primary mb-2">Height (cm)</label>
                    <input 
                      type="number" min="100" max="250"
                      value={formData.height} onChange={e => updateForm('height', Number(e.target.value))}
                      className="w-full p-4 rounded-xl border border-border-input bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-lg text-lg text-text-primary"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Step 3: Activity Level */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h1 className="font-headline-lg text-4xl text-text-primary mb-4 leading-tight">How active are you?</h1>
              <p className="text-text-secondary text-lg mb-10">This helps us calculate your daily caloric burn.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'Sedentary', desc: 'Little to no exercise, desk job' },
                  { id: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                  { id: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                  { id: 'Very Active', desc: 'Heavy exercise 6-7 days/week' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { updateForm('activityLevel', a.id); setTimeout(handleNext, 300); }}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex flex-col gap-2 group ${
                      formData.activityLevel === a.id 
                        ? 'border-primary bg-primary-container/10' 
                        : 'border-border-subtle bg-white hover:border-primary/40 hover:shadow-sm'
                    }`}
                  >
                    <h3 className={`font-headline-sm text-xl font-medium ${formData.activityLevel === a.id ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>{a.id}</h3>
                    <p className="text-text-secondary text-sm">{a.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Diet */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h1 className="font-headline-lg text-4xl text-text-primary mb-4 leading-tight">Any dietary preferences?</h1>
              <p className="text-text-secondary text-lg mb-10">We'll adapt meal suggestions to your lifestyle.</p>
              
              <div className="flex flex-wrap gap-4">
                {['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'].map(d => (
                  <button
                    key={d}
                    onClick={() => updateForm('diet', d)}
                    className={`px-8 py-4 rounded-full border-2 transition-all font-button text-lg ${
                      formData.diet === d 
                        ? 'border-primary bg-primary text-white shadow-md' 
                        : 'border-border-input bg-white text-text-secondary hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Processing */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center text-center justify-center h-full">
              <div className="w-24 h-24 relative mb-8">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-4xl text-primary animate-pulse">auto_awesome</span>
              </div>
              <h1 className="font-headline-lg text-3xl text-text-primary mb-4">Building Your Plan...</h1>
              <p className="text-text-secondary max-w-sm">NutriSmart AI is crunching the numbers to generate your personalized nutrition targets.</p>
            </div>
          )}

        </div>

        {/* Footer Navigation (hidden on processing step) */}
        {step < 5 && (
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-border-subtle shrink-0">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="text-text-secondary hover:text-primary font-button px-4 py-2 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span> Back
              </button>
            ) : <div></div>}
            
            <button 
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.goal) || 
                (step === 3 && !formData.activityLevel)
              }
              className="bg-primary text-white px-8 py-3 rounded-full font-button text-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {step === 4 ? 'Complete Profile' : 'Continue'} <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
