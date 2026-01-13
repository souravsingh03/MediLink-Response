import React from 'react';
import { TollAlert } from '../types';
import { ShieldCheck, Truck, Check } from 'lucide-react';

interface TollViewProps {
  alerts: TollAlert[];
}

const TollView: React.FC<TollViewProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 p-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <ShieldCheck size={40} className="opacity-40" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">All Systems Normal</h3>
        <p className="text-sm">No emergency clearance requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-3 mb-6 px-1">
        <ShieldCheck className="text-green-600" size={28} />
        <h2 className="text-xl font-bold text-slate-900 leading-tight">
          Toll Override System
        </h2>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white border-l-4 border-l-green-500 rounded-xl shadow-sm p-5 animate-fade-in relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                 <div className="bg-green-50 p-3 rounded-full text-green-600 h-fit">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{alert.tollName}</h3>
                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                       <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-red-100">Priority</span>
                       <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                         {alert.ambulanceId}
                       </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Open <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1 rounded">{alert.lane}</span> immediately
                    </div>
                  </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
               <span className="text-xs text-slate-400">
                  {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
               <div className="flex items-center gap-1.5 text-green-700 text-xs font-bold uppercase tracking-wide">
                  <Check size={14} />
                  <span>Auto-Cleared</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TollView;