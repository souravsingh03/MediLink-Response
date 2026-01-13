export enum ViewMode {
  AMBULANCE = 'AMBULANCE',
  HOSPITAL = 'HOSPITAL',
  TOLL = 'TOLL'
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  MODERATE = 'MODERATE',
  STABLE = 'STABLE'
}

export interface PatientData {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  symptoms: string;
  vitals: string;
}

export interface TriageResult {
  severity: Severity;
  summary: string;
  recommended_specialists: string[];
  equipment_needed: string[];
}

export interface Hospital {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  specialties: string[];
  capacity: number;
  occupied: number;
}

export interface LiveVitals {
  heartRate: number;
  spo2: number;
  bpSystolic: number;
  bpDiastolic: number;
  lastUpdated: number;
}

export interface ActiveTrip {
  id: string;
  ambulanceId: string;
  hospitalId: string;
  patientData: PatientData;
  triageResult: TriageResult;
  startTime: number;
  initialEtaMinutes: number;
  currentEtaMinutes: number;
  progress: number; // 0 to 100
  status: 'EN_ROUTE' | 'ARRIVED';
  liveVitals: LiveVitals;
}

export interface TollAlert {
  id: string;
  tollName: string;
  ambulanceId: string;
  lane: string;
  timestamp: number;
  cleared: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'PARAMEDIC' | 'HOSPITAL_ADMIN' | 'TOLL_OPERATOR';
}