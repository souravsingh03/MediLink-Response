import React, { useState } from 'react';
import { Activity, ArrowRight, Lock, User, Shield } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: string) => void;
}

type RoleType = 'PARAMEDIC' | 'HOSPITAL_ADMIN' | 'TOLL_OPERATOR';

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>('PARAMEDIC');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employeeId || !password) {
      setError('Please enter your Employee ID and Password');
      return;
    }

    setLoading(true);
    
    // Simulate API authentication delay
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 1000);
  };

  const roles: { id: RoleType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'PARAMEDIC', label: 'Ambulance', icon: <Activity size={18} />, color: 'blue' },
    { id: 'HOSPITAL_ADMIN', label: 'Hospital', icon: <User size={18} />, color: 'emerald' },
    { id: 'TOLL_OPERATOR', label: 'Toll Plaza', icon: <Shield size={18} />, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-medical-900 rounded-b-[3rem] shadow-lg"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fade-in">
        <div className="p-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-sm border border-blue-100">
            <Activity size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">MediLink Response</h1>
          <p className="text-slate-500 text-sm">Secure Emergency Access</p>
        </div>

        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
          
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all ${
                    selectedRole === role.id
                      ? `bg-${role.color}-50 border-${role.color}-500 text-${role.color}-700 ring-1 ring-${role.color}-500`
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className={selectedRole === role.id ? `text-${role.color}-600` : 'text-slate-400'}>
                    {role.icon}
                  </div>
                  <span className="text-[10px] font-bold">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employee ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  placeholder="e.g. AMB-882"
                />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                Login to System <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        
        <div className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-center gap-2">
           <Shield size={10} /> Secure Govt. Network v2.4.0
        </div>
      </div>
    </div>
  );
};

export default LoginView;