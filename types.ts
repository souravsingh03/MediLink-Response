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

export interface ActiveTrip {
  id: string;
  ambulanceId: string;
  hospitalId: string;
  patientData: PatientData;
  triageResult: TriageResult;
  startTime: number;
  etaMinutes: number;
  status: 'EN_ROUTE' | 'ARRIVED';
}

export interface TollAlert {
  id: string;
  tollName: string;
  ambulanceId: string;
  lane: string;
  timestamp: number;
  cleared: boolean;
}