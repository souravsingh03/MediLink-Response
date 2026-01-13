import React from 'react';
import { ViewMode } from '../types';
import { Ambulance, Hospital, Activity, CreditCard, LogOut } from 'lucide-react';

interface LayoutProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  children: React.ReactNode;
  onLogout: () => void;
  userRole?: string;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, onLogout, userRole }) => {
  // Determine which views are authorized for the current user
  const getAuthorizedViews = () => {
    switch (userRole) {
      case 'PARAMEDIC':
        return [ViewMode.AMBULANCE];
      case 'HOSPITAL_ADMIN':
        return [ViewMode.HOSPITAL];
      case 'TOLL_OPERATOR':
        return [ViewMode.TOLL];
      default:
        // Fallback safety
        return [ViewMode.AMBULANCE, ViewMode.HOSPITAL, ViewMode.TOLL];
    }
  };

  const authorizedViews = getAuthorizedViews();
  // Only show navigation if the user has access to more than one view
  const showNav = authorizedViews.length > 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-safe-bottom">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-medical-900 p-2 rounded-lg text-white shadow-sm">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">MediLink</h1>
                <p className="text-xs text-medical-600 font-bold uppercase tracking-wide">
                  {userRole === 'PARAMEDIC' ? 'Ambulance Unit' : 
                   userRole === 'HOSPITAL_ADMIN' ? 'Hospital Admin' : 
                   userRole === 'TOLL_OPERATOR' ? 'Toll Control' : 'Response System'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Desktop Navigation - Only show if multiple views allowed */}
              {showNav && (
                <nav className="hidden md:flex space-x-1">
                  {authorizedViews.includes(ViewMode.AMBULANCE) && (
                    <NavButton 
                      active={currentView === ViewMode.AMBULANCE} 
                      onClick={() => setView(ViewMode.AMBULANCE)}
                      icon={<Ambulance size={18} />}
                      label="Ambulance"
                    />
                  )}
                  {authorizedViews.includes(ViewMode.HOSPITAL) && (
                    <NavButton 
                      active={currentView === ViewMode.HOSPITAL} 
                      onClick={() => setView(ViewMode.HOSPITAL)}
                      icon={<Hospital size={18} />}
                      label="Hospital"
                    />
                  )}
                  {authorizedViews.includes(ViewMode.TOLL) && (
                    <NavButton 
                      active={currentView === ViewMode.TOLL} 
                      onClick={() => setView(ViewMode.TOLL)}
                      icon={<CreditCard size={18} />}
                      label="Toll Plaza"
                    />
                  )}
                </nav>
              )}

              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                title="Logout"
              >
                <span className="hidden sm:inline">Logout</span>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className={`flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 ${showNav ? 'pb-20 md:pb-8' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only show if multiple views allowed */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-3 h-16">
            {authorizedViews.includes(ViewMode.AMBULANCE) && (
              <MobileNavButton 
                active={currentView === ViewMode.AMBULANCE} 
                onClick={() => setView(ViewMode.AMBULANCE)}
                icon={<Ambulance size={24} />}
                label="Ambulance"
              />
            )}
            {authorizedViews.includes(ViewMode.HOSPITAL) && (
              <MobileNavButton 
                active={currentView === ViewMode.HOSPITAL} 
                onClick={() => setView(ViewMode.HOSPITAL)}
                icon={<Hospital size={24} />}
                label="Hospital"
              />
            )}
            {authorizedViews.includes(ViewMode.TOLL) && (
              <MobileNavButton 
                active={currentView === ViewMode.TOLL} 
                onClick={() => setView(ViewMode.TOLL)}
                icon={<CreditCard size={24} />}
                label="Toll Plaza"
              />
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({
  active, onClick, icon, label
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
        : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({
  active, onClick, icon, label
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 h-full w-full transition-colors active:bg-slate-50 ${
      active ? 'text-blue-600' : 'text-slate-400'
    }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Layout;