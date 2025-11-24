import React, { useState } from 'react';
import { Hospital, PatientData, TriageResult, Severity } from '../types';
import { triagePatient } from '../services/geminiService';
import { MapPin, Navigation, Siren, CheckCircle, AlertTriangle, Activity, Stethoscope } from 'lucide-react';

interface AmbulanceViewProps {
  onStartTrip: (hospitalId: string, patientData: PatientData, triage: TriageResult) => void;
  mockHospitals: Hospital[];
}

const AmbulanceView: React.FC<AmbulanceViewProps> = ({ onStartTrip, mockHospitals }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [patientData, setPatientData] = useState<PatientData>({
    age: 0,
    gender: 'Male',
    symptoms: '',
    vitals: ''
  });

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!patientData.symptoms || !patientData.vitals) return;
    
    setIsAnalyzing(true);
    const result = await triagePatient(patientData);
    setTriageResult(result);
    setIsAnalyzing(false);
    setStep(2);
  };

  const handleStartTrip = () => {
    if (selectedHospital && triageResult) {
      onStartTrip(selectedHospital, patientData, triageResult);
      setStep(3);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPatientData({ age: 0, gender: 'Male', symptoms: '', vitals: '' });
    setTriageResult(null);
    setSelectedHospital(null);
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Navigation size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">En Route to Hospital</h2>
        <p className="text-slate-600 mb-8 text-lg">
          Trip started. Tolls have been notified to clear lanes. Hospital has received patient data.
        </p>
        <button 
          onClick={resetForm}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Start New Trip
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Left Column: Form & Triage */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
            <Stethoscope className="text-slate-500" size={20} />
            <h2 className="font-semibold text-slate-800">Patient Assessment</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={patientData.age || ''}
                  onChange={e => setPatientData({...patientData, age: parseInt(e.target.value) || 0})}
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={patientData.gender}
                  onChange={e => setPatientData({...patientData, gender: e.target.value as any})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vitals (BP, HR, SpO2)</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 140/90, HR 110, SpO2 92%"
                value={patientData.vitals}
                onChange={e => setPatientData({...patientData, vitals: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms & Notes</label>
              <textarea 
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                placeholder="Describe patient condition, visible injuries, complaints..."
                value={patientData.symptoms}
                onChange={e => setPatientData({...patientData, symptoms: e.target.value})}
              ></textarea>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !patientData.symptoms}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <>Analyzing Condition...</>
              ) : (
                <>
                  <Activity size={18} />
                  Analyze Severity (Gemini AI)
                </>
              )}
            </button>
          </div>
        </div>

        {triageResult && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
            <div className={`px-6 py-4 flex items-center justify-between border-b ${
              triageResult.severity === Severity.CRITICAL ? 'bg-red-50 border-red-100' : 
              triageResult.severity === Severity.MODERATE ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'
            }`}>
              <div className="flex items-center gap-3">
                {triageResult.severity === Severity.CRITICAL ? <AlertTriangle className="text-red-600" /> : <CheckCircle className="text-green-600" />}
                <h3 className={`font-bold ${
                   triageResult.severity === Severity.CRITICAL ? 'text-red-700' : 
                   triageResult.severity === Severity.MODERATE ? 'text-orange-700' : 'text-green-700'
                }`}>
                  {triageResult.severity} CONDITION
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Summary</h4>
                <p className="text-slate-800 leading-relaxed">{triageResult.summary}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Specialists</h4>
                  <div className="flex flex-wrap gap-2">
                    {triageResult.recommended_specialists.map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium border border-slate-200">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Equipment Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {triageResult.equipment_needed.map(e => (
                      <span key={e} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium border border-slate-200">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Hospital Selection */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-slate-500" size={20} />
              <h2 className="font-semibold text-slate-800">Nearby Hospitals</h2>
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">GPS Active</span>
          </div>
          
          <div className="p-4 space-y-3 flex-grow overflow-y-auto max-h-[600px]">
            {mockHospitals.map(hospital => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedHospital === hospital.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{hospital.name}</h3>
                  <span className="font-mono text-sm font-bold text-blue-600">{hospital.etaMinutes} min</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span>{hospital.distanceKm} km away</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${hospital.occupied > 80 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    {hospital.occupied}% Full
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {hospital.specialties.slice(0, 3).map(spec => (
                    <span key={spec} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                      {spec}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
             <button 
              onClick={handleStartTrip}
              disabled={!selectedHospital || !triageResult}
              className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] ${
                !selectedHospital || !triageResult
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emergency-600 hover:bg-emergency-500 text-white'
              }`}
            >
              <Siren className={(!selectedHospital || !triageResult) ? '' : 'animate-pulse'} />
              Start Emergency Transport
            </button>
            {(!selectedHospital || !triageResult) && (
              <p className="text-center text-xs text-slate-400 mt-2">
                Analyze patient & select hospital to proceed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceView;