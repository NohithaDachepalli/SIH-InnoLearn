import React from 'react';
import { BookOpen, Code, Play, Home } from 'lucide-react';
type PageType = 'home' | 'visualization' | 'practice';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home' as PageType, label: 'Home', icon: Home },
    { id: 'visualization' as PageType, label: 'Visualizations', icon: BookOpen },
    { id: 'practice' as PageType, label: 'Practice', icon: Code },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img src='/logo1.png' 
            style={{height:"60px", width:"60px"}}/>
            <span className="text-xl font-bold text-slate-800">Algo Verse</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === id
                    ? 'bg-[#0097a7] text-white shadow-md border-2 border-[#0097a7]'
                    : 'text-slate-600 hover:bg-[#0097a7] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;