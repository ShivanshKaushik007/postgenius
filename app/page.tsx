"use client";

import { Wand2, Image as ImageIcon, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="bg-dark text-light font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}

// Header Component
const Header = () => (
  <header className="fixed top-0 left-0 w-full bg-dark/80 backdrop-blur-lg border-b border-secondary z-50">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Image 
  src="/logo.png" 
  alt="PostGenius Logo" 
  width={48}     // or actual width of logo
  height={48}    // or actual height
  className="h-12 w-auto" 
/>
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-muted hover:text-light transition-colors">Home</Link>
        <Link href="#features" className="text-muted hover:text-light transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-muted hover:text-light transition-colors">About</Link>
        <Link href='/generator' >
        <button className="bg-accent hover:bg-accent-hover text-white font-semibold bg-[#5227ff]  py-2 px-5 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-accent">
          Get Started
        </button>
        </Link>
      </div>
    </nav>
  </header>
);

// Hero Section Component
const HeroSection = () => (
  <section id="hero" className="container mx-auto px-6 min-h-screen flex flex-col md:flex-row items-center justify-center pt-24 md:pt-0">
    <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
        Turn Reviews into Stunning Social Posts, <span className="text-accent">Instantly</span>.
      </h1>
      <p className="text-lg text-muted mb-8 max-w-lg mx-auto md:mx-0">
        Stop manually creating social media content from reviews. PostGenius automates the entire process, helping you build brand trust with beautiful, shareable content.
      </p>
      <Link href='/generator' >
      <button className="bg-accent hover:bg-accent-hover text-white bg-[#5227ff] font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-accent" >
        Launch Generator
      </button>
     </Link>
    </div>
    <div className="md:w-1/2 flex justify-center">
      <div className="[perspective:1000px]">
        <div className="transition-transform duration-500 ease-in-out hover:[transform:rotateY(0deg)_rotateX(0deg)] [transform:rotateY(-20deg)_rotateX(10deg)]">
          <Image 
            src="/hero.png" 
            alt="Generated social media post"
            className="rounded-2xl  shadow-2xl w-full max-w-md"
             width={400}     // or actual width of logo
  height={280}
          />
        </div>
      </div>
    </div>
  </section>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
  <div className="bg-primary border border-secondary rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-accent">
    <div className="mb-4 inline-block p-4 bg-secondary rounded-full">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-muted">{description}</p>
  </div>
);

// Features Section Component
const FeaturesSection = () => (
  <section id="features" className="py-20">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-12">Why You will Love PostGenius</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Wand2 size={32} className="text-accent"/>} 
          title="AI-Powered Snippets"
          description="Our smart algorithm finds the most impactful sentence in any review, saving you time."
        />
        <FeatureCard 
          icon={<ImageIcon size={32} className="text-accent"/>}
          title="Beautiful Templates"
          description="Choose from multiple professionally designed templates that make your brand look amazing."
        />
        <FeatureCard 
          icon={<Zap size={32} className="text-accent"/>}
          title="Blazing Fast"
          description="Go from raw review text to a downloadable image in under five seconds. It's that simple."
        />
      </div>
    </div>
  </section>
);

// How It Works Section Component
const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">Three Simple Steps</h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 md:space-x-8">
                <StepCard number="1" title="Input Review" description="Paste the review text, customer's name, and product name into our simple form." />
                <div className="text-accent text-4xl font-bold hidden md:block">→</div>
                <StepCard number="2" title="Click Generate" description="Our service instantly extracts the best quote and crafts your social media image." />
                <div className="text-accent text-4xl font-bold hidden md:block">→</div>
                <StepCard number="3" title="Download & Share" description="Your beautiful post is ready to download and share with the world." />
            </div>
        </div>
    </section>
);

// Step Card Component
const StepCard = ({ number, title, description }: { number: string; title: string; description: string; }) => (
    <div className="flex-1">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center bg-[#5227ff] border-2 border-accent text-accent rounded-full text-2xl font-bold">
            {number}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted">{description}</p>
    </div>
);

// Footer Component
const Footer = () => (
  <footer className="border-t border-secondary py-8">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      <p className="text-muted mb-4 md:mb-0">&copy; Designed & Developed by Shivansh</p>
      <div className="flex space-x-6">
        <a href="https://github.com/ShivanshKaushik007" className="text-muted hover:text-accent transition-colors">Github</a>
        <a href="https://www.linkedin.com/in/shivansh-kaushik-b3165827a/" className="text-muted hover:text-accent transition-colors">LinkedIn</a>
      </div>
    </div>
  </footer>
);