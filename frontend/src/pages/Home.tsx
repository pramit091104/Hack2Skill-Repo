import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm h-20 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-lg max-w-container-max mx-auto h-full">
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
            NutriSmart AI
          </div>
          <div className="hidden md:flex items-center gap-lg">
            <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md hover:text-primary hover:scale-105 transition-all" href="#">Features</a>
            <a className="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary hover:scale-105 transition-all" href="#">How it Works</a>
            <a className="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary hover:scale-105 transition-all" href="#">Science</a>
          </div>
          <div className="flex items-center gap-md">
            <Link to="/login" className="hidden lg:block text-primary font-bold font-label-md transition-all duration-200 ease-in-out active:scale-95 hover:text-secondary">Login</Link>
            <Link to="/login" className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-md shadow-lg shadow-primary/20 transition-all duration-200 ease-in-out active:scale-95 hover:scale-105">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section: Split-screen */}
        <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(45,212,191,0.15)_0%,rgba(45,212,191,0)_70%)] z-0 filter blur-[40px] top-[-10%] left-[-10%]"></div>
          <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(254,208,27,0.1)_0%,rgba(254,208,27,0)_70%)] z-0 filter blur-[40px] bottom-[10%] right-[10%]"></div>
          
          {/* Left: Typography */}
          <div className="flex-1 w-full px-lg lg:pl-xl lg:pr-md flex flex-col justify-center py-xl z-10 animate-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-primary-container/10 text-on-primary-container px-md py-xs rounded-full w-fit mb-md">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-label-sm uppercase tracking-wider">Next-Gen Wellness</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl lg:text-[72px] lg:leading-[80px] mb-lg max-w-2xl text-on-surface">
              AI-Powered <span className="text-primary italic">Nutrition</span>, Reimagined.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-xl">
              Stop guessing. Start thriving. Our intelligent engine analyzes your body's unique bio-rhythms to deliver a personalized nutrition experience that feels like magic.
            </p>
            <div className="flex flex-wrap gap-md">
              <Link to="/login" className="bg-primary text-on-primary px-lg py-md rounded-full font-label-md flex items-center gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Get Started
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <button className="bg-white text-primary border-2 border-primary/20 px-lg py-md rounded-full font-label-md transition-all hover:bg-primary/5 active:scale-95">
                Watch Demo
              </button>
            </div>
            <div className="mt-xl flex items-center gap-lg grayscale opacity-60">
              <span className="font-label-sm">TRUSTED BY 200,000+ USERS</span>
            </div>
          </div>
          
          {/* Right: Interactive UI Collage */}
          <div className="flex-1 w-full h-[600px] lg:h-screen flex items-center justify-center p-md relative overflow-visible z-10 animate-in slide-in-from-right-8 duration-1000">
            <div className="relative w-full max-w-lg aspect-[4/5] flex items-center justify-center mt-12 lg:mt-0">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/20 to-transparent rounded-full blur-3xl scale-75 opacity-60"></div>
              
              {/* Base Person Image */}
              <img 
                src="/images/hero_person.png" 
                alt="Healthy Lifestyle" 
                className="absolute bottom-0 w-full h-[90%] object-contain object-bottom z-10 drop-shadow-2xl"
              />

              {/* Floating Scanner Card */}
              <div className="absolute -left-4 lg:-left-20 top-12 w-48 sm:w-64 h-64 sm:h-72 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-[0_20px_40px_rgba(0,107,95,0.15)] z-20 overflow-hidden flex flex-col p-4 animate-float group cursor-pointer">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="font-label-sm text-on-surface font-bold">Analyze...</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">document_scanner</span>
                </div>
                
                <div className="relative flex-1 rounded-xl overflow-hidden bg-surface-container-lowest">
                  {/* Salad Image */}
                  <img src="/images/hero_salad.png" alt="Food scanning" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                  
                  {/* Crosshairs */}
                  <div className="absolute inset-2 border-2 border-primary/50 opacity-50 z-10">
                    <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-4 border-r-4 border-primary"></div>
                  </div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_2px_rgba(0,107,95,0.6)] z-20 animate-scan"></div>
                </div>
              </div>

              {/* Floating Calorie Badge */}
              <div className="absolute -right-2 lg:-right-12 bottom-32 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-30 animate-float" style={{ animationDelay: '1s' }}>
                <img src="/images/hero_salad.png" className="w-10 h-10 rounded-full object-cover border-2 border-primary-container" alt="Salad" />
                <div>
                  <p className="font-label-sm font-bold text-on-surface leading-tight">Superfood Bowl</p>
                  <p className="font-label-sm text-primary">320 kcal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-xl px-lg max-w-container-max mx-auto">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg mb-sm">Wellness Without the Work</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Our technology handles the complexity so you can focus on enjoying your meals and feeling your best.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="p-lg rounded-2xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(45,212,191,0.08)] border-b-4 border-primary transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-md hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[32px]">photo_camera</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">Smart Photo Logging</h3>
              <p className="text-on-surface-variant font-body-md">Snap a photo, let AI do the rest. Our neural networks identify ingredients and volumes instantly with 98% accuracy.</p>
            </div>
            
            <div className="p-lg rounded-2xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(45,212,191,0.08)] border-b-4 border-secondary transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-secondary-container/10 rounded-2xl flex items-center justify-center mb-md hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-[32px]">biotech</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">Precision Macros</h3>
              <p className="text-on-surface-variant font-body-md">Scientific accuracy for every meal. Get deep insights into bio-availability and micronutrient density effortlessley.</p>
            </div>
            
            <div className="p-lg rounded-2xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(45,212,191,0.08)] border-b-4 border-tertiary transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-tertiary-container/10 rounded-2xl flex items-center justify-center mb-md hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary text-[32px]">support_agent</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">AI Coaching</h3>
              <p className="text-on-surface-variant font-body-md">24/7 personalized dietary guidance. Your pocket coach knows when you need a boost or when to suggest a recovery meal.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-xl bg-primary relative overflow-hidden mt-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] border-[40px] border-white rounded-full"></div>
          </div>
          <div className="relative z-10 px-lg max-w-container-max mx-auto text-center flex flex-col items-center">
            <h2 className="font-headline-xl text-on-primary mb-md lg:text-[56px] leading-tight">Ready to transform your health?</h2>
            <p className="text-on-primary/80 max-w-2xl text-body-lg mb-lg">Join thousands of people who have already optimized their life with NutriSmart AI. Your journey to peak vitality starts with one tap.</p>
            <div className="flex flex-col sm:flex-row gap-md">
              <Link to="/login" className="bg-white text-primary px-xl py-md rounded-full font-headline-md shadow-2xl transition-all hover:scale-105 active:scale-95">Join the Revolution</Link>
              <button className="bg-transparent border-2 border-white/40 text-on-primary px-xl py-md rounded-full font-headline-md transition-all hover:bg-white/10 active:scale-95">Explore Pricing</button>
            </div>
            <div className="mt-lg flex items-center gap-md text-on-primary/60 font-label-sm">
              <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">check_circle</span> 14-day free trial</span>
              <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">check_circle</span> No credit card required</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-lg">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg max-w-container-max mx-auto">
          <div className="mb-lg md:mb-0 text-center md:text-left">
            <div className="font-headline-md text-headline-md font-bold text-primary mb-sm">NutriSmart AI</div>
            <p className="font-label-sm text-on-surface-variant max-w-xs">© 2024 NutriSmart AI. Your energetic health companion.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-lg mb-lg md:mb-0">
            <a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm" href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
