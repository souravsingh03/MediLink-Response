
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginView from './components/LoginView';
import AmbulanceView from './components/AmbulanceView';
import HospitalView from './components/HospitalView';
import TollView from './components/TollView';
import { ViewMode, Hospital, ActiveTrip, PatientData, TriageResult, TollAlert, User, Severity } from './types';
import { Lock } from 'lucide-react';

const MOCK_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Central City Medical Center', distanceKm: 4.2, etaMinutes: 12, specialties: ['Trauma L1', 'Cardiology', 'Neurology'], capacity: 400, occupied: 85 },
  { id: 'h2', name: 'St. Mary’s Emergency', distanceKm: 8.5, etaMinutes: 18, specialties: ['Pediatrics', 'General Surgery'], capacity: 250, occupied: 45 },
  { id: 'h3', name: 'Westside Heart Institute', distanceKm: 12.1, etaMinutes: 24, specialties: ['Cardiology', 'Vascular'], capacity: 150, occupied: 60 },
  { id: 'h4', name: 'General City Hospital', distanceKm: 2.5, etaMinutes: 8, specialties: ['General Medicine', 'Orthopedics'], capacity: 300, occupied: 92 },
];

const MOCK_TOLLS = ['Skyline Bridge Toll', 'Downtown Tunnel Gate', 'Highway 101 Express'];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.AMBULANCE);
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
  const [tollAlerts, setTollAlerts] = useState<TollAlert[]>([]);

  useEffect(() => {
    if (activeTrips.length === 0) return;

    const interval = setInterval(() => {
      setActiveTrips(currentTrips => 
        currentTrips.map(trip => {
          const newEta = Math.max(0, trip.currentEtaMinutes - (2 / 60)); // Decrementing ETA
          const progress = Math.min(100, ((trip.initialEtaMinutes - newEta) / trip.initialEtaMinutes) * 100);

          // More realistic vital simulation: Critical patients have more volatility
          const isCritical = trip.triageResult.severity === Severity.CRITICAL;
          const volatility = isCritical ? 4 : 2;
          
          const hrDelta = Math.floor(Math.random() * volatility) - (volatility / 2);
          const newHr = Math.min(160, Math.max(50, trip.liveVitals.heartRate + hrDelta));

          const spo2Delta = Math.random() > 0.9 ? -1 : (Math.random() > 0.9 ? 1 : 0);
          const newSpo2 = Math.min(100, Math.max(isCritical ? 80 : 92, trip.liveVitals.spo2 + spo2Delta));

          return {
            ...trip,
            currentEtaMinutes: parseFloat(newEta.toFixed(1)),
            progress,
            liveVitals: {
              ...trip.liveVitals,
              heartRate: Math.round(newHr),
              spo2: Math.round(newSpo2),
              lastUpdated: Date.now()
            },
            status: newEta <= 0 ? 'ARRIVED' : 'EN_ROUTE'
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTrips.length]);

  const handleLogin = (role: string) => {
    setUser({ id: 'u-' + Math.random().toString(36).substr(2, 4), name: 'Staff User', role: role as any });
    if (role === 'PARAMEDIC') setCurrentView(ViewMode.AMBULANCE);
    else if (role === 'HOSPITAL_ADMIN') setCurrentView(ViewMode.HOSPITAL);
    else if (role === 'TOLL_OPERATOR') setCurrentView(ViewMode.TOLL);
  };

  const handleStartTrip = (hospitalId: string, patientData: PatientData, triage: TriageResult) => {
    const hospital = MOCK_HOSPITALS.find(h => h.id === hospitalId);
    if (!hospital) return;

    const newTrip: ActiveTrip = {
      id: Math.random().toString(36).substr(2, 9),
      ambulanceId: `AMB-${Math.floor(Math.random() * 900) + 100}`,
      hospitalId,
      patientData,
      triageResult: triage,
      startTime: Date.now(),
      initialEtaMinutes: hospital.etaMinutes,
      currentEtaMinutes: hospital.etaMinutes,
      progress: 0,
      status: 'EN_ROUTE',
      liveVitals: {
        heartRate: triage.severity === Severity.CRITICAL ? 110 : 85,
        spo2: triage.severity === Severity.CRITICAL ? 92 : 98,
        bpSystolic: 120,
        bpDiastolic: 80,
        lastUpdated: Date.now()
      }
    };

    setActiveTrips(prev => [newTrip, ...prev]);

    setTollAlerts(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      tollName: MOCK_TOLLS[Math.floor(Math.random() * MOCK_TOLLS.length)],
      ambulanceId: newTrip.ambulanceId,
      lane: 'Emergency Lane 1',
      timestamp: Date.now(),
      cleared: true
    }, ...prev]);
  };

  if (!user) return <LoginView onLogin={handleLogin} />;

  const isAuthorized = () => {
    if (currentView === ViewMode.AMBULANCE) return user.role === 'PARAMEDIC';
    if (currentView === ViewMode.HOSPITAL) return user.role === 'HOSPITAL_ADMIN';
    if (currentView === ViewMode.TOLL) return user.role === 'TOLL_OPERATOR';
    return false;
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} onLogout={() => setUser(null)} userRole={user.role}>
      {isAuthorized() ? (
        <>
          {currentView === ViewMode.AMBULANCE && <AmbulanceView onStartTrip={handleStartTrip} mockHospitals={MOCK_HOSPITALS} />}
          {currentView === ViewMode.HOSPITAL && <HospitalView incomingTrips={activeTrips} />}
          {currentView === ViewMode.TOLL && <TollView alerts={tollAlerts} />}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-fade-in">
          <div className="bg-slate-100 p-8 rounded-full mb-6 text-slate-300">
            <Lock size={64} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="max-w-xs text-center text-sm">Your credentials do not permit access to this department module.</p>
        </div>
      )}
    </Layout>
  );
};

export default App;
