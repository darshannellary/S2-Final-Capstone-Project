import { VERIFIED_CATALOG_HOTELS, VERIFIED_CATALOG_ACTIVITIES, VerifiedCatalogHotel, VerifiedCatalogActivity } from '../data/verifiedCatalogue';

export interface DayItinerarySlot {
  title: string;
  description: string;
  costINR: number;
  duration?: string;
  isOffbeat?: boolean;
  reviewCount?: number;
  isKidFriendly?: boolean;
  isRomantic?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  morning: DayItinerarySlot;
  afternoon: DayItinerarySlot;
  evening: DayItinerarySlot;
  hotelName: string;
  hotelCostPerNightINR: number;
  estimatedCost: number; // total day cost in INR
}

export interface GeneratedItineraryJSON {
  destination: string;
  totalEstimatedCost: number;
  budgetCeiling: number;
  days: ItineraryDay[];
  inventoryWarning?: string | null;
  offbeatPercentage: number;
  heavyReviewedPercentage: number;
}

export interface ItineraryRecordDoc {
  id?: string;
  uid: string;
  destination: string;
  dates: string;
  budget: number;
  partySize: string;
  interests: string[];
  generatedItinerary: GeneratedItineraryJSON;
  explanationText: string;
  explanationStatus: 'pending' | 'ready';
  createdAt: string;
  offbeatMode: boolean;
  totalEstimatedCost: number;
}

export interface UserProfileDoc {
  uid: string;
  email: string;
  createdAt: string;
  displayName?: string;
  photoURL?: string;
}

export interface ParsedPartyInfo {
  type: 'solo' | 'couple' | 'family' | 'group';
  hasKids: boolean;
  kidsAges?: string;
  hasSeniors: boolean;
  adultsCount: number;
}
