import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginView from './components/LoginView';
import AmbulanceView from './components/AmbulanceView';
import HospitalView from './components/HospitalView';
import TollView from './components/TollView';
import { ViewMode, Hospital, ActiveTrip, PatientData, TriageResult, TollAlert, User } from './types';

// Mock Data Configuration
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
  
  // Shared Application State
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
  const [tollAlerts, setTollAlerts] = useState<TollAlert[]>([]);

  // Simulate Live Updates (Vitals & Location)
  useEffect(() => {
    if (activeTrips.length === 0) return;

    const interval = setInterval(() => {
      setActiveTrips(currentTrips => 
        currentTrips.map(trip => {
          // Simulate decreasing ETA and increasing progress
          const newEta = Math.max(0, trip.currentEtaMinutes - 0.1); 
          const totalTime = trip.initialEtaMinutes;
          const progress = Math.min(100, ((totalTime - newEta) / totalTime) * 100);

          // Simulate fluctuating vitals
          const hrFluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const newHr = Math.min(180, Math.max(40, trip.liveVitals.heartRate + hrFluctuation));

          const spo2Fluctuation = Math.random() > 0.8 ? -1 : (Math.random() > 0.8 ? 1 : 0);
          const newSpo2 = Math.min(100, Math.max(85, trip.liveVitals.spo2 + spo2Fluctuation));

          return {
            ...trip,
            currentEtaMinutes: parseFloat(newEta.toFixed(1)),
            progress: progress,
            liveVitals: {
              ...trip.liveVitals,
              heartRate: newHr,
              spo2: newSpo2,
              lastUpdated: Date.now()
            }
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [activeTrips.length]);

  const handleLogin = (role: string) => {
    setUser({
      id: 'u1',
      name: 'User',
      role: role as any
    });

    // Default view and Restrictions based on role
    if (role === 'PARAMEDIC') setCurrentView(ViewMode.AMBULANCE);
    else if (role === 'HOSPITAL_ADMIN') setCurrentView(ViewMode.HOSPITAL);
    else if (role === 'TOLL_OPERATOR') setCurrentView(ViewMode.TOLL);
  };

  const handleLogout = () => {
    setUser(null);
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
        heartRate: Math.floor(Math.random() * (120 - 80) + 80),
        spo2: 98,
        bpSystolic: 120,
        bpDiastolic: 80,
        lastUpdated: Date.now()
      }
    };

    setActiveTrips(prev => [newTrip, ...prev]);

    // Simulate Toll Alerts generating based on the route
    const newTollAlert: TollAlert = {
      id: Math.random().toString(36).substr(2, 9),
      tollName: MOCK_TOLLS[Math.floor(Math.random() * MOCK_TOLLS.length)],
      ambulanceId: newTrip.ambulanceId,
      lane: `Lane ${Math.floor(Math.random() * 5) + 1}`,
      timestamp: Date.now(),
      cleared: true
    };

    setTollAlerts(prev => [newTollAlert, ...prev]);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      onLogout={handleLogout}
      userRole={user.role}
    >
      {/* Conditionally render views based on role */}
      {currentView === ViewMode.AMBULANCE && user.role === 'PARAMEDIC' && (
        <AmbulanceView 
          onStartTrip={handleStartTrip}
          mockHospitals={MOCK_HOSPITALS}
        />
      )}
      
      {currentView === ViewMode.HOSPITAL && user.role === 'HOSPITAL_ADMIN' && (
        <HospitalView 
          incomingTrips={activeTrips}
        />
      )}
      
      {currentView === ViewMode.TOLL && user.role === 'TOLL_OPERATOR' && (
        <TollView 
          alerts={tollAlerts}
        />
      )}

      {/* Fallback for unauthorized access attempt (though navigation prevents this) */}
      {((currentView === ViewMode.AMBULANCE && user.role !== 'PARAMEDIC') ||
        (currentView === ViewMode.HOSPITAL && user.role !== 'HOSPITAL_ADMIN') ||
        (currentView === ViewMode.TOLL && user.role !== 'TOLL_OPERATOR')) && (
          <div className="flex items-center justify-center h-full text-slate-400">
             Access Restricted
          </div>
      )}
    </Layout>
  );
};

export default App;