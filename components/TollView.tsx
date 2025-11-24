import React from 'react';
import { TollAlert } from '../types';
import { ShieldCheck, Truck, Check } from 'lucide-react';

interface TollViewProps {
  alerts: TollAlert[];
}

const TollView: React.FC<TollViewProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <ShieldCheck size={48} className="opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600">All Lanes Operational</h3>
        <p>No emergency clearance requests at this time.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <ShieldCheck className="text-green-600" />
        Toll Gate Emergency Override System
      </h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white border border-l-4 border-l-green-500 rounded-lg shadow-sm p-6 flex items-center justify-between animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-700">
                <Truck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-lg">{alert.tollName}</h3>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Emergency Priority</span>
                </div>
                <p className="text-slate-600">
                  Requesting rapid clearance for <span className="font-semibold text-slate-900">{alert.ambulanceId}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()} • Assigned Lane: <span className="font-mono font-bold text-slate-900">{alert.lane}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                <Check size={20} />
                <span>LANE OPENED</span>
              </div>
              <span className="text-xs text-slate-400 mt-2">Auto-acknowledged by System</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TollView;