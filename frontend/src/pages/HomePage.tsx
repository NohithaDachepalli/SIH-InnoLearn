import React from 'react';
import { BookOpen, Code, Zap, Target } from 'lucide-react';
import Navbar from '../pages/Navbar';
import { useNavigate } from 'react-router-dom';


type PageType = 'home' | 'visualization' | 'practice';


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState<PageType>('home');
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Visualizations',
      description: 'Learn data structures through beautiful, interactive visual representations',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Code,
      title: 'Multi-Language Support',
      description: 'Practice coding in C, Java, and Python with real-time feedback',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Zap,
      title: 'Real-Time Execution',
      description: 'See your code come to life with synchronized visual outputs',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Target,
      title: 'Step-by-Step Learning',
      description: 'Understand each operation with detailed explanations and code snippets',
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  // Navigation handler for tabs
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    if (page === 'home') navigate('/');
    if (page === 'visualization') navigate('/visualization');
    if (page === 'practice') navigate('/practice');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16">
        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
          Master Data Structures
          <span className="block text-emerald-600">Through Visualization</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Experience interactive learning with visual representations, real-time code execution, 
          and comprehensive explanations. Perfect for students, developers, and coding enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleNavigate('visualization')}
            className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Learning
          </button>
          <button
            onClick={() => handleNavigate('practice')}
            className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold text-lg hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Practice Coding
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
            <div className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center mb-6`}>
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Data Structures List */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Supported Data Structures</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Linked Lists', 'Binary Trees', 'Arrays', 'Stacks', 'Queues', 'Graphs', 'Hash Tables', 'Heaps'].map((structure, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors duration-200 cursor-pointer">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                {structure.charAt(0)}
              </div>
              <span className="font-medium text-gray-800">{structure}</span>
              <span className="font-medium text-slate-800">{structure}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of students mastering data structures through interactive visualization</p>
        <button
          onClick={() => handleNavigate('visualization')}
          className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Begin Your Journey
        </button>
      </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;