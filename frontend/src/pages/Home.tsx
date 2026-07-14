import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { ArrowRight, Bot, Apple, Activity, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';

// 3D Smart Apple Component (Nutrition + AI Theme)
const SmartApple = () => {
  const groupRef = useRef<any>();
  const ringRef = useRef<any>();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
    if (ringRef.current) {
      // Fast spinning data ring
      ringRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef}>
        {/* Apple Body (Slightly squashed sphere) */}
        <mesh position={[0, -0.2, 0]} scale={[1.4, 1.2, 1.4]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial 
            color="#10b981" 
            roughness={0.1} 
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Apple Stem */}
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.04, 0.06, 0.6, 16]} />
          <meshStandardMaterial color="#065f46" />
        </mesh>

        {/* Apple Leaf */}
        <mesh position={[0.4, 1.2, 0]} rotation={[0.2, 0, -0.6]} scale={[1, 0.2, 0.5]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#34d399" />
        </mesh>

        {/* AI "Data Ring" orbiting the apple */}
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[2, 0.02, 16, 100]} />
          <meshStandardMaterial color="#6ee7b7" emissive="#6ee7b7" emissiveIntensity={2} />
        </mesh>
        
        {/* Second orbiting ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.01, 16, 100]} />
          <meshStandardMaterial color="#a7f3d0" emissive="#a7f3d0" emissiveIntensity={1} />
        </mesh>
      </group>
    </Float>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="p-8 rounded-2xl bg-white/50 backdrop-blur-xl border border-slate-200 shadow-xl hover:shadow-emerald-100 transition-shadow"
  >
    <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      <SEO />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200/40 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/40 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between">
          
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 pt-12 lg:pt-0 z-10"
          >
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-700">NutriSmart AI is Live</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              Eat Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Live Better.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
              Your personal AI nutrition coach. Instantly log meals with computer vision, track your macros, and build healthy habits effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/login"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg hover:shadow-emerald-200 transition-all transform hover:-translate-y-1"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a 
                href="#features"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* 3D Canvas */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2 h-[500px] lg:h-[700px] mt-12 lg:mt-0 relative"
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <SmartApple />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Everything you need to hit your goals
            </h2>
            <p className="text-lg text-slate-600">
              Powered by advanced Google Gemini AI, NutriSmart takes the guesswork out of healthy eating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Apple}
              title="Instant Meal Logging"
              description="Just snap a photo. Our AI identifies your food and instantly estimates calories, protein, carbs, and fats."
              delay={0.1}
            />
            <FeatureCard 
              icon={Bot}
              title="AI Nutrition Coach"
              description="Chat with your personal AI dietician. Ask for healthy recipes, macro adjustments, or motivation."
              delay={0.2}
            />
            <FeatureCard 
              icon={Activity}
              title="Smart Analytics"
              description="Visualize your progress over time. See trends in your caloric intake and macro distribution."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-emerald-600/10 rounded-l-full blur-[120px]" />
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your diet?
          </h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have revolutionized their health with the power of artificial intelligence.
          </p>
          <Link 
            to="/login"
            className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
