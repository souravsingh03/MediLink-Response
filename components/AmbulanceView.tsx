import React, { useState, useEffect, useRef } from 'react';
import { Hospital, PatientData, TriageResult, Severity } from '../types';
import { triagePatient } from '../services/geminiService';
import { MapPin, Navigation, Siren, CheckCircle, AlertTriangle, Activity, Stethoscope, Mic, MicOff, Star } from 'lucide-react';

interface AmbulanceViewProps {
  onStartTrip: (hospitalId: string, patientData: PatientData, triage: TriageResult) => void;
  mockHospitals: Hospital[];
}

const AmbulanceView: React.FC<AmbulanceViewProps> = ({ onStartTrip, mockHospitals }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [patientData, setPatientData] = useState<PatientData>({
    age: 0,
    gender: 'Male',
    symptoms: '',
    vitals: ''
  });

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [sortedHospitals, setSortedHospitals] = useState<Hospital[]>(mockHospitals);

  // Voice Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPatientData(prev => ({
          ...prev,
          symptoms: prev.symptoms ? `${prev.symptoms} ${transcript}` : transcript
        }));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Smart Hospital Suggestions Logic
  useEffect(() => {
    if (triageResult) {
      // Logic: 
      // 1. Prioritize hospitals with matching specialists
      // 2. Prioritize hospitals with available capacity
      // 3. Sort by ETA
      const sorted = [...mockHospitals].sort((a, b) => {
        const aMatches = triageResult.recommended_specialists.some(spec => 
          a.specialties.some(hSpec => hSpec.toLowerCase().includes(spec.toLowerCase()) || spec.toLowerCase().includes(hSpec.toLowerCase()))
        );
        const bMatches = triageResult.recommended_specialists.some(spec => 
          b.specialties.some(hSpec => hSpec.toLowerCase().includes(spec.toLowerCase()) || spec.toLowerCase().includes(hSpec.toLowerCase()))
        );

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        
        // Critical patients should go to closer hospitals if capacity permits
        if (triageResult.severity === Severity.CRITICAL) {
           return a.etaMinutes - b.etaMinutes;
        }

        return a.etaMinutes - b.etaMinutes;
      });
      setSortedHospitals(sorted);
      // Auto-select the best one
      if (sorted.length > 0) {
        setSelectedHospital(sorted[0].id);
      }
    } else {
      setSortedHospitals(mockHospitals);
    }
  }, [triageResult, mockHospitals]);

  const handleAnalyze = async () => {
    if (!patientData.symptoms || !patientData.vitals) return;
    
    setIsAnalyzing(true);
    const result = await triagePatient(patientData);
    setTriageResult(result);
    setIsAnalyzing(false);
    setStep(2);
    // On mobile, scroll to triage results
    setTimeout(() => {
      document.getElementById('triage-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    setSortedHospitals(mockHospitals);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 animate-fade-in">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Navigation size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Trip Started</h2>
        <p className="text-slate-600 mb-8 max-w-xs mx-auto">
          Live vitals transmitting. Route optimized. Tolls notified. Hospital awaiting patient.
        </p>
        <button 
          onClick={resetForm}
          className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
        >
          Start New Case
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 pb-20 lg:pb-0">
      {/* Left Column: Form & Triage */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center gap-2">
            <Stethoscope className="text-blue-600" size={20} />
            <h2 className="font-bold text-slate-800">Patient Assessment</h2>
          </div>
          
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Age</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={patientData.age || ''}
                  onChange={e => setPatientData({...patientData, age: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none"
                    value={patientData.gender}
                    onChange={e => setPatientData({...patientData, gender: e.target.value as any})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Vitals (Init)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                placeholder="BP, Heart Rate, SpO2..."
                value={patientData.vitals}
                onChange={e => setPatientData({...patientData, vitals: e.target.value})}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Symptoms & Notes</label>
                {recognitionRef.current && (
                  <button 
                    onClick={toggleListening}
                    className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full transition-colors ${
                      isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </button>
                )}
              </div>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none h-32 resize-none"
                placeholder="Describe condition... (Tap Voice Input)"
                value={patientData.symptoms}
                onChange={e => setPatientData({...patientData, symptoms: e.target.value})}
              ></textarea>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !patientData.symptoms}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
              }`}
            >
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Activity size={20} />
                  Analyze Patient
                </>
              )}
            </button>
          </div>
        </div>

        {triageResult && (
          <div id="triage-results" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-slide-up">
            <div className={`px-5 py-4 flex items-center justify-between border-b ${
              triageResult.severity === Severity.CRITICAL ? 'bg-red-50 border-red-100' : 
              triageResult.severity === Severity.MODERATE ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'
            }`}>
              <div className="flex items-center gap-3">
                {triageResult.severity === Severity.CRITICAL ? <AlertTriangle className="text-red-600" /> : <CheckCircle className="text-green-600" />}
                <h3 className={`font-bold tracking-tight ${
                   triageResult.severity === Severity.CRITICAL ? 'text-red-700' : 
                   triageResult.severity === Severity.MODERATE ? 'text-orange-700' : 'text-green-700'
                }`}>
                  {triageResult.severity}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-slate-700 leading-relaxed text-sm">{triageResult.summary}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specialists</h4>
                  <div className="flex flex-wrap gap-2">
                    {triageResult.recommended_specialists.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-semibold border border-slate-200">{s}</span>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-auto lg:h-[calc(100vh-8rem)] sticky top-20">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              <h2 className="font-bold text-slate-800">Select Hospital</h2>
            </div>
            {selectedHospital && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
          </div>
          
          <div className="p-3 space-y-3 flex-grow overflow-y-auto min-h-[300px]">
            {triageResult && (
               <div className="px-1 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                 AI Recommended (Based on Needs)
               </div>
            )}
            {sortedHospitals.map((hospital, index) => {
               // Check if this is a "best match"
               const isBestMatch = triageResult && index === 0;

               return (
                <button
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] relative overflow-hidden ${
                    selectedHospital === hospital.id 
                      ? 'border-blue-500 bg-blue-50 ring-0' 
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {isBestMatch && (
                     <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Best Match
                     </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 leading-tight pr-6">{hospital.name}</h3>
                    <span className="shrink-0 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded ml-2">
                      {hospital.etaMinutes} min
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-2">
                    <span>{hospital.distanceKm} km</span>
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${hospital.occupied > 80 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      {hospital.occupied}% Cap
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 2).map(s => (
                       <span key={s} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {s}
                       </span>
                    ))}
                    {hospital.specialties.length > 2 && <span className="text-[10px] text-slate-400">+{hospital.specialties.length - 2}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <button 
              onClick={handleStartTrip}
              disabled={!selectedHospital || !triageResult}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.96] ${
                !selectedHospital || !triageResult
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-emergency-600 text-white shadow-emergency-600/30'
              }`}
            >
              <Siren className={(!selectedHospital || !triageResult) ? '' : 'animate-pulse'} />
              Start Transport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceView;