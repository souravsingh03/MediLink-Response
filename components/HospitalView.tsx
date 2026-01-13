import React from 'react';
import { ActiveTrip, Severity } from '../types';
import { Clock, AlertCircle, Ambulance, User, CheckSquare, Heart, Activity, MapPin } from 'lucide-react';

interface HospitalViewProps {
  incomingTrips: ActiveTrip[];
}

const HospitalView: React.FC<HospitalViewProps> = ({ incomingTrips }) => {
  if (incomingTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 p-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Ambulance size={40} className="opacity-40" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">No Incoming Traffic</h3>
        <p className="text-sm">Emergency bay is clear.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-slate-900">Incoming ({incomingTrips.length})</h2>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emergency-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
          <span className="w-2 h-2 bg-emergency-600 rounded-full animate-pulse"></span>
          LIVE
        </span>
      </div>

      <div className="grid gap-4">
        {incomingTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
            {/* Mobile Header / Left Panel */}
            <div className="p-5 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {trip.ambulanceId}
                </span>
                <div className="flex items-center gap-1.5 text-emergency-600 font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                  <Clock size={14} />
                  <span className="text-sm">{trip.currentEtaMinutes} min</span>
                </div>
              </div>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Patient</div>
                   <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-lg">
                    {trip.patientData.age}
                    <span className="text-sm font-normal text-slate-500">yr</span>
                    <span className="text-sm font-normal text-slate-500">{trip.patientData.gender}</span>
                  </div>
                </div>

                <div className="text-right">
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Status</div>
                   <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                     trip.triageResult.severity === Severity.CRITICAL ? 'bg-red-100 text-red-700' :
                     trip.triageResult.severity === Severity.MODERATE ? 'bg-orange-100 text-orange-700' :
                     'bg-green-100 text-green-700'
                   }`}>
                     {trip.triageResult.severity}
                   </span>
                </div>
              </div>

              {/* LIVE VITALS MONITOR */}
              <div className="bg-slate-900 rounded-xl p-4 text-white shadow-inner">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     Live Monitor
                   </div>
                   <Activity size={14} className="text-slate-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-mono font-bold text-red-400 leading-none">{trip.liveVitals.heartRate}</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-1 uppercase">HR (BPM)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-mono font-bold text-blue-400 leading-none">{trip.liveVitals.spo2}</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-1 uppercase">SpO2 %</div>
                  </div>
                  <div>
                     <div className="text-lg font-mono font-bold text-yellow-400 leading-none pt-1">
                       {trip.liveVitals.bpSystolic}/{trip.liveVitals.bpDiastolic}
                     </div>
                     <div className="text-[9px] text-slate-500 font-bold mt-1 uppercase">BP (mmHg)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Panel */}
            <div className="p-5 lg:w-2/3 flex flex-col justify-between">
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} className="text-blue-600" />
                    AI Assessment
                  </h3>
                  <p className="text-sm text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100 leading-relaxed">
                    {trip.triageResult.summary}
                  </p>
                </div>

                {/* VISUAL ROUTE TRACKER */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Location</h3>
                     <span className="text-xs font-bold text-slate-700">{Math.floor(trip.progress)}% Complete</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-emergency-500 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${trip.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Ambulance size={10} />
                      En Route
                    </div>
                     <div className="flex items-center gap-1 text-[10px] font-medium text-slate-600">
                      <MapPin size={10} />
                      Hospital
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Team</h4>
                    <ul className="space-y-1.5">
                      {trip.triageResult.recommended_specialists.slice(0,3).map((spec, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Equipment</h4>
                    <ul className="space-y-1.5">
                      {trip.triageResult.equipment_needed.slice(0,3).map((eq, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                          {eq}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <CheckSquare size={16} />
                Confirm Arrival Prep
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalView;