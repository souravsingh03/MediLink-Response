import React from 'react';
import { ViewMode } from '../types';
import { Ambulance, Hospital, Activity } from 'lucide-react';

interface LayoutProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emergency-600 p-2 rounded-lg text-white">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">MediLink <span className="text-emergency-600">Response</span></h1>
                <p className="text-xs text-slate-500 font-medium">Emergency Coordination System</p>
              </div>
            </div>
            
            <nav className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setView(ViewMode.AMBULANCE)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === ViewMode.AMBULANCE
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Ambulance size={18} />
                <span className="hidden sm:inline">Ambulance</span>
              </button>
              <button
                onClick={() => setView(ViewMode.HOSPITAL)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === ViewMode.HOSPITAL
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Hospital size={18} />
                <span className="hidden sm:inline">Hospital</span>
              </button>
              <button
                onClick={() => setView(ViewMode.TOLL)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === ViewMode.TOLL
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
                  <span className="block w-2 h-0.5 bg-current"></span>
                </div>
                <span className="hidden sm:inline">Toll Plaza</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;