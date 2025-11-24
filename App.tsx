import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AmbulanceView from './components/AmbulanceView';
import HospitalView from './components/HospitalView';
import TollView from './components/TollView';
import { ViewMode, Hospital, ActiveTrip, PatientData, TriageResult, TollAlert } from './types';

// Mock Data Configuration
const MOCK_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Central City Medical Center', distanceKm: 4.2, etaMinutes: 12, specialties: ['Trauma L1', 'Cardiology', 'Neurology'], capacity: 400, occupied: 85 },
  { id: 'h2', name: 'St. Mary’s Emergency', distanceKm: 8.5, etaMinutes: 18, specialties: ['Pediatrics', 'General Surgery'], capacity: 250, occupied: 45 },
  { id: 'h3', name: 'Westside Heart Institute', distanceKm: 12.1, etaMinutes: 24, specialties: ['Cardiology', 'Vascular'], capacity: 150, occupied: 60 },
];

const MOCK_TOLLS = ['Skyline Bridge Toll', 'Downtown Tunnel Gate', 'Highway 101 Express'];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.AMBULANCE);
  
  // Shared Application State
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
  const [tollAlerts, setTollAlerts] = useState<TollAlert[]>([]);

  // Simulate incoming trips from other ambulances occasionally
  useEffect(() => {
    // This is just to make the "Hospital View" look alive even if the user hasn't added anything yet
    if (activeTrips.length === 0) {
      // Intentionally left empty for now so the user starts fresh, 
      // but in a real demo we might populate one sample.
    }
  }, [activeTrips.length]);

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
      etaMinutes: hospital.etaMinutes,
      status: 'EN_ROUTE'
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

    // Optional: Auto switch to Hospital view to show the result? 
    // No, better to keep them in Ambulance view to confirm trip started.
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {currentView === ViewMode.AMBULANCE && (
        <AmbulanceView 
          onStartTrip={handleStartTrip}
          mockHospitals={MOCK_HOSPITALS}
        />
      )}
      
      {currentView === ViewMode.HOSPITAL && (
        <HospitalView 
          incomingTrips={activeTrips}
        />
      )}
      
      {currentView === ViewMode.TOLL && (
        <TollView 
          alerts={tollAlerts}
        />
      )}
    </Layout>
  );
};

export default App;