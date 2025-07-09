import React from 'react';
import { Search, BookOpen, Brain, BarChart3, LogOut } from 'lucide-react';

const Header = ({ user, currentView, setCurrentView, savedWordsCount, onLogout }) => {
  const navItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'collection', label: `My Words (${savedWordsCount})`, icon: BookOpen },
    { id: 'learn', label: 'Learn', icon: Brain },
    { id: 'stats', label: 'Stats', icon: BarChart3 }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">WordWise</h1>
          </div>
          
          <nav className="flex items-center gap-6">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === item.id 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-8 h-8 rounded-full border-2 border-gray-200" 
            />
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;