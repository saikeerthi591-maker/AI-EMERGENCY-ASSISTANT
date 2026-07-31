export type Language =
  | "English"
  | "Kannada"
  | "Hindi"
  | "Tamil"
  | "Telugu"
  | "Malayalam"
  | "Marathi"
  | "Bengali"
  | "Gujarati"
  | "Spanish"
  | "French";

export interface DisasterAlert {
  id: string;
  title: string;
  rawText: string;
  disasterType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  affectedAreas: string[];
  importantSafetyInstructions: string[];
  summaryText: string;
  timestamp: string;
  source: string;
  translatedText?: string;
  language?: Language;
}

export interface SafeShelter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  medicalAvailable: boolean;
  foodAvailable: boolean;
  waterSupplyDays: number;
  contactPhone: string;
  shelterType: "Community Hall" | "School/College" | "Stadium" | "Hospital Wing" | "Relief Camp";
  district?: string;
  city?: string;
  distanceKm?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  email: string;
  phone: string;
  isPrimary?: boolean;
}

export interface RescueRequest {
  id: string;
  requesterName: string;
  headcount: number;
  elderly: boolean;
  children: boolean;
  pregnant: boolean;
  disabilities: boolean;
  medicalEmergencies: boolean;
  trappedStatus: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  priority: "High" | "Medium" | "Low";
  priorityScore: number;
  reasoningExplanation: string;
  status: "Pending" | "Dispatched" | "Rescued" | "Cancelled";
  timestamp: string;
  contactPhone: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  category: "Flood" | "Fire" | "Road Block" | "Landslide" | "Fallen Tree" | "Building Collapse" | "Power Failure";
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  location: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  timestamp: string;
  reportedBy: string;
  status: "Unverified" | "Verified" | "Resolved";
  isOfflineQueued?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
  emergencyDoList: string[];
  emergencyDontList: string[];
  icon: string;
  beforeList?: string[];
  duringList?: string[];
  afterList?: string[];
  emergencySteps?: string[];
  burnTypes?: { minor: string[]; severe: string[] };
  warningSigns?: string[];
  cprVariants?: Array<{
    title: string;
    target: string;
    ratio: string;
    instructions: string[];
  }>;
  severeWarnings?: string[];
}

export interface SOSLog {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  address: string;
  contactsNotified: string[];
  nearestSheltersNotified: string[];
  status: "Sent" | "Pending_Sync" | "Failed";
  mapsLink: string;
}

export interface DamageAssessment {
  id: string;
  title: string;
  damageSeverityPercent: number;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  structuralIntegrityStatus: string;
  detectedHazards: string[];
  estimatedRepairUrgency: string;
  recommendedAction: string;
  timestamp: string;
}

export interface ResourcePrediction {
  drinkingWaterDays: number;
  foodRationsDays: number;
  medicalSuppliesRisk: "Adequate" | "Moderate Shortage" | "Critical Shortage";
  predictedShortages: Array<{
    item: string;
    timeframeHours: number;
    action: string;
  }>;
  resourceSummary: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: {
    address: string;
    city: string;
    district?: string;
    state: string;
    country?: string;
    pincode?: string;
    lat: number;
    lng: number;
    lastUpdatedTime?: string;
  };
  accountStatus: string;
  gpsStatus?: "Active" | "Not Activated";
  emergencyId: string;
  avatarUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  medicalInfo?: string;
  preferredLanguage?: string;
  sosContacts?: string[];
}

export interface NotificationSettings {
  disasterAlerts: boolean;
  weatherAlerts: boolean;
  communityReports: boolean;
  browserNotifications: boolean;
  sosStatusUpdates: boolean;
}

export interface AccessibilitySettings {
  voiceNavigation: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  highContrastMode: boolean;
  largeText: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  phone: string;
  location: string;
  lat: number;
  lng: number;
  status: "Available" | "Assigned" | "Off-Duty";
  distanceKm?: number;
}
