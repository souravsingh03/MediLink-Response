import React from 'react';
import { ActiveTrip, Severity } from '../types';
import { Clock, AlertCircle, Ambulance, User } from 'lucide-react';

interface HospitalViewProps {
  incomingTrips: ActiveTrip[];
}

const HospitalView: React.FC<HospitalViewProps> = ({ incomingTrips }) => {
  if (incomingTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Ambulance size={48} className="opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600">No Incoming Ambulances</h3>
        <p>The emergency bay is currently clear.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Incoming Emergencies ({incomingTrips.length})</h2>
        <span className="animate-pulse flex items-center gap-2 text-sm font-medium text-emergency-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
          <span className="w-2 h-2 bg-emergency-600 rounded-full"></span>
          Live Updates Active
        </span>
      </div>

      <div className="grid gap-6">
        {incomingTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-md border-l-4 border-l-emergency-500 overflow-hidden flex flex-col md:flex-row">
            {/* Left Info Panel */}
            <div className="p-6 md:w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {trip.ambulanceId}
                  </span>
                  <div className="flex items-center gap-1 text-emergency-600 font-bold">
                    <Clock size={16} />
                    <span>ETA: {trip.etaMinutes} min</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Patient Info</div>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <User size={16} />
                    {trip.patientData.age}yo {trip.patientData.gender}
                  </div>
                </div>

                <div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Severity</div>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     trip.triageResult.severity === Severity.CRITICAL ? 'bg-red-100 text-red-800' :
                     trip.triageResult.severity === Severity.MODERATE ? 'bg-orange-100 text-orange-800' :
                     'bg-green-100 text-green-800'
                   }`}>
                     {trip.triageResult.severity}
                   </span>
                </div>
              </div>
            </div>

            {/* Right Detailed Panel */}
            <div className="p-6 md:w-2/3">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <AlertCircle size={20} className="text-blue-600" />
                  AI Medical Summary
                </h3>
                <p className="text-slate-700 bg-blue-50 p-4 rounded-lg border border-blue-100 leading-relaxed">
                  {trip.triageResult.summary}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                    Prepare Team
                  </h4>
                  <ul className="space-y-2">
                    {trip.triageResult.recommended_specialists.map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                   <h4 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                    Prepare Equipment
                  </h4>
                  <ul className="space-y-2">
                    {trip.triageResult.equipment_needed.map((eq, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        {eq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                 <button className="text-sm text-slate-500 hover:text-slate-900 font-medium px-4 py-2">
                   View Full History
                 </button>
                 <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm">
                   Acknowledge Arrival
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalView;