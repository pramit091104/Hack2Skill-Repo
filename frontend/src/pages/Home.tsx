import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-surface text-text-primary overflow-x-hidden min-h-screen font-body-md">
      <nav className="fixed top-0 w-full z-50 bg-surface border-b border-border-subtle">
<div className="max-w-[1200px] mx-auto px-margin-page py-4 flex justify-between items-center">

<div className="font-headline-sm text-headline-sm font-bold text-primary">
                NutriSmart AI
            </div>

<div className="hidden md:flex gap-gutter items-center">
<Link className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1 transition-colors duration-200" to="/login">Features</Link>
<Link className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors duration-200" to="/login">How it Works</Link>
<Link className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors duration-200" to="/login">Pricing</Link>
<Link className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors duration-200" to="/login">Blog</Link>
</div>

<div className="flex items-center gap-4">
<Link to="/login"  className="bg-primary text-on-primary px-6 py-2 rounded-[6px] font-button text-button hover:opacity-90 transition-opacity">Get Started</Link>
</div>
</div>
</nav>
<main className="pt-24">

<section className="max-w-[1200px] mx-auto px-margin-page py-stack-lg flex flex-col md:flex-row items-center gap-stack-lg overflow-hidden">
<div className="w-full md:w-1/2 space-y-stack-md fade-in" style={{ animationDelay: '0.1s' }}>
<h1 className="font-headline-lg text-[48px] md:text-[64px] leading-tight text-text-primary">
                    Your Personal <br/>
<span className="text-primary font-bold">AI Nutritionist</span>
</h1>
<p className="font-body-lg text-body-lg text-text-secondary max-w-lg">
                    Unlock your vitality with precision AI-driven nutrition tracking and personalized insights. The future of mindful eating is here.
                </p>
<div className="pt-stack-sm flex gap-4">
<Link to="/login"  className="bg-primary text-on-primary px-10 py-4 rounded-[6px] font-button text-button hover:opacity-90 transition-opacity">Get Started</Link>
<button className="bg-surface border border-border-subtle text-text-primary px-10 py-4 rounded-[6px] font-button text-button hover:bg-surface-container transition-colors">
                        Learn More
                    </button>
</div>
</div>
<div className="w-full md:w-1/2 relative fade-in" style={{ animationDelay: '0.3s' }}>
<div className="rounded-xl overflow-hidden border border-border-subtle bg-white p-4">
<img className="w-full h-auto object-cover rounded-lg" data-alt="A clean and modern high-angle shot of a minimalist workspace. A laptop sits open on a white desk displaying a vibrant, data-rich user interface for NutriSmart AI with green and white accents. Next to the laptop is a ceramic bowl filled with colorful fresh berries and a glass of infused water. The lighting is bright, airy, and soft, emphasizing a healthy and intelligent lifestyle." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUaUK58nK4R3lQy5uNXfyAgZVDU5QWqR_pVlNuAW8yTIcsrJEItZOIpZEgcTR616x9Qa2JL7LEmlDwD3l4DdM1QKxAXZyGBAIfwI67GRmTiBE9i45pqPt5TIJT7MLtJleb1EQ2VrtT2EvTtKZM8CBv8Q65J5eNd-vIhwbvKJ_mT1qwwrMWe8zKS8IeLXARJ3uP90YmWwqfX4hkLzJT9a_1QVZuoK433wO7QCOpJa65fW03jsFiQUwcPJHef8cTtfSQKZSChBol5thZ"/>
</div>

<div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg border border-border-subtle hidden lg:block">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
<div>
<p className="font-label-md text-label-md text-text-primary">Daily Goal Met</p>
<p className="text-[12px] text-text-secondary">AI Optimization Active</p>
</div>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-low py-stack-lg">
<div className="max-w-[1200px] mx-auto px-margin-page">
<div className="text-center mb-stack-lg">
<h2 className="font-headline-lg text-headline-lg text-text-primary mb-stack-sm">Intelligence in Every Bite</h2>
<p className="text-text-secondary max-w-2xl mx-auto">Our AI engine works silently in the background to provide the most accurate nutritional guidance available today.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">

<div className="bg-white p-8 rounded-[6px] border border-border-subtle flex flex-col gap-4 hover:border-primary/30 transition-colors group">
<div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-primary text-2xl" data-icon="photo_camera">photo_camera</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-text-primary">Photo Logging</h3>
<p className="text-text-secondary text-body-md leading-relaxed">
                            Snap a photo of your meal for instant tracking. No manual entry required—our vision AI identifies ingredients and estimates portion sizes in seconds.
                        </p>
<div className="mt-auto pt-4">
<Link className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all" to="/login">
                                Try It Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>

<div className="bg-white p-8 rounded-[6px] border border-border-subtle flex flex-col gap-4 hover:border-primary/30 transition-colors group">
<div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-primary text-2xl" data-icon="insights">insights</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-text-primary">AI Analysis</h3>
<p className="text-text-secondary text-body-md leading-relaxed">
                            Get deep insights into your micro and macronutrient intake. Understand patterns in your eating habits that affect your energy levels and focus.
                        </p>
<div className="mt-auto pt-4">
<Link className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all" to="/login">
                                View Demo <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>

<div className="bg-white p-8 rounded-[6px] border border-border-subtle flex flex-col gap-4 hover:border-primary/30 transition-colors group">
<div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-primary text-2xl" data-icon="track_changes">track_changes</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-text-primary">Personalized Goals</h3>
<p className="text-text-secondary text-body-md leading-relaxed">
                            Experience adaptive plans that evolve with your progress. NutriSmart AI adjusts your targets based on activity levels and physiological feedback.
                        </p>
<div className="mt-auto pt-4">
<Link className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all" to="/login">
                                Customize <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>
</div>
</div>
</section>

<section className="max-w-[1200px] mx-auto px-margin-page py-stack-lg">
<div className="flex flex-col md:flex-row items-center gap-stack-lg">
<div className="w-full md:w-1/3">
<div className="p-8 border-l-4 border-primary bg-white">
<span className="text-[56px] font-bold text-text-primary leading-none">98%</span>
<p className="font-label-md text-label-md mt-2 text-text-secondary">ACCURACY RATE</p>
<p className="mt-4 text-body-md">Verified by independent nutritionists for meal recognition and nutrient density estimation.</p>
</div>
</div>
<div className="w-full md:w-2/3 grid grid-cols-2 gap-gutter">
<div className="p-6 bg-surface border border-border-subtle rounded-lg">
<p className="text-primary font-bold text-headline-md">10k+</p>
<p className="text-text-secondary">Active Monthly Users</p>
</div>
<div className="p-6 bg-surface border border-border-subtle rounded-lg">
<p className="text-primary font-bold text-headline-md">250m</p>
<p className="text-text-secondary">Meals Logged</p>
</div>
</div>
</div>
</section>

<section className="max-w-[1200px] mx-auto px-margin-page pb-stack-lg">
<div className="relative overflow-hidden bg-primary rounded-xl py-16 px-8 text-center text-on-primary">

<div className="absolute inset-0 opacity-10 pointer-events-none">
<div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
</div>
<div className="relative z-10 space-y-6">
<h2 className="font-headline-lg text-[32px] md:text-[40px]">Ready to transform your health?</h2>
<p className="text-on-primary/80 max-w-xl mx-auto font-body-lg">Join thousands of health-conscious individuals who are using NutriSmart AI to make smarter food choices every day.</p>
<div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
<button className="bg-white text-primary px-10 py-4 rounded-[6px] font-button text-button shadow-sm hover:bg-surface-bright transition-colors">
                            Download on App Store
                        </button>
<Link to="/login"  className="bg-primary-container border border-on-primary text-on-primary px-10 py-4 rounded-[6px] font-button text-button hover:bg-on-primary-container transition-colors">Try Web Dashboard</Link>
</div>
</div>
</div>
</section>
</main>

<footer className="bg-surface-container-low border-t border-border-subtle">
<div className="max-w-[1200px] mx-auto py-stack-lg px-margin-page flex flex-col md:flex-row justify-between items-center gap-gutter">
<div className="flex flex-col items-center md:items-start gap-4">
<div className="font-headline-sm text-headline-sm font-bold text-primary">
                    NutriSmart AI
                </div>
<p className="text-text-secondary font-body-sm text-body-sm text-center md:text-left">
                    © 2024 NutriSmart AI. Healthy living through intelligence.
                </p>
</div>
<div className="flex flex-wrap justify-center gap-gutter text-body-sm">
<Link className="text-text-secondary hover:text-primary transition-all duration-200" to="/login">Privacy Policy</Link>
<Link className="text-text-secondary hover:text-primary transition-all duration-200" to="/login">Terms of Service</Link>
<Link className="text-text-secondary hover:text-primary transition-all duration-200" to="/login">Contact Us</Link>
<Link className="text-text-secondary hover:text-primary transition-all duration-200" to="/login">Twitter</Link>
<Link className="text-text-secondary hover:text-primary transition-all duration-200" to="/login">Instagram</Link>
</div>
</div>
</footer>
    </div>
  );
}
