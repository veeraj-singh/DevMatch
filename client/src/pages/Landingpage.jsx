import React from 'react';
import { ArrowRight, Code, Users, Boxes, GitBranch, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GuestButton from '../components/guestuser';

const LandingPage = () => {
  const navigate = useNavigate() ;
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-emerald-400">DevMatch</div>
            <div className="flex gap-4">
              <button onClick={()=>{navigate(`auth`)}} className="px-4 py-2 text-gray-300 hover:text-white">Sign In</button>
              <GuestButton/>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold tracking-tight mb-8">
            Connect. Create. Collaborate.
            <span className="block text-emerald-400 mt-4">Build Better Together.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Join a community of developers, create powerful projects, and find your perfect collaborators all in one place.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <GuestButton/>
            <button onClick={()=>{navigate(`auth`)}} className="px-8 py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-semibold">
              Sign In
            </button>
          </div>
          
          {/* Scroll Indicator */}
          <button 
            onClick={scrollToFeatures}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            aria-label="Scroll to features"
          >
            <ChevronDown className="w-8 h-8 text-emerald-400" />
          </button>
        </div>

        {/* Background Grid Effect */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emerald-400">Why DevMatch?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Boxes />}
              title="Project Workspaces"
              description="Create dedicated spaces for your projects with all the tools and integrations you need."
            />
            <FeatureCard 
              icon={<Users />}
              title="Team Collaboration"
              description="Find and connect with developers who share your vision and complement your skills."
            />
            <FeatureCard 
              icon={<GitBranch />}
              title="Version Control"
              description="Seamlessly integrate with your favorite version control systems and track changes."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Building?</h2>
          <p className="text-gray-300 mb-8">
            Join thousands of developers already creating amazing projects on DevMatch.
          </p>
          <button onClick={()=>{navigate(`auth`)}} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold flex items-center gap-2 mx-auto">
            Create Account <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-lg bg-gray-900 border border-gray-700">
    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default LandingPage;