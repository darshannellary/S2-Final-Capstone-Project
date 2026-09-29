import { CURATED_DESTINATIONS, HotelCatalogItem, ActivityCatalogItem } from '../data/curatedCatalog';

export interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalBudgetINR: number;
  travellerComposition: {
    type: 'solo' | 'couple' | 'family' | 'group';
    adults: number;
    hasKids: boolean;
    hasSeniors: boolean;
    kidsCount?: number;
    seniorsCount?: number;
  };
  interests: ('adventure' | 'relaxation' | 'culture' | 'food' | 'nature')[];
  mode: 'standard' | 'surprise_me' | 'offbeat';
}

export interface DaySlotActivity {
  slot: 'morning' | 'afternoon' | 'evening';
  catalogActivityId: string;
  title: string;
  description: string;
  costINR: number;
  estimatedDuration: string;
  isOffbeat: boolean;
  reviewCount: number;
  interests: string[];
  travelTip?: string;
}

export interface DayPlan {
  dayNumber: number;
  dateStr: string;
  theme: string;
  hotel: {
    catalogHotelId: string;
    name: string;
    category: string;
    locationArea: string;
    pricePerNightINR: number;
    reviewCount: number;
    isOffbeat: boolean;
    tagline: string;
    amenities: string[];
  };
  morning: DaySlotActivity;
  afternoon: DaySlotActivity;
  evening: DaySlotActivity;
  totalDayEstimatedCostINR: number;
  isRegenerated?: boolean;
}

export interface TripItinerary {
  id?: string;
  userId: string;
  title: string;
  destination: string;
  preferences: TripPreferences;
  days: DayPlan[];
  totalEstimatedCostINR: number;
  budgetCeilingINR: number;
  budgetUtilizationPercent: number;
  offbeatPercentage: number;
  heavyReviewedPercentage: number;
  whyThisItinerary: string;
  whyStatus: 'pending' | 'ready';
  createdAt: string;
  updatedAt: string;
}

export interface CandidatePool {
  hotels: HotelCatalogItem[];
  morningActivities: ActivityCatalogItem[];
  afternoonActivities: ActivityCatalogItem[];
  eveningActivities: ActivityCatalogItem[];
}

export function filterCandidateCatalog(prefs: TripPreferences): CandidatePool {
  const destData = CURATED_DESTINATIONS[prefs.destination] || CURATED_DESTINATIONS['Goa'];
  const maxNightlyHotelBudget = Math.floor((prefs.totalBudgetINR * 0.55) / Math.max(1, prefs.durationDays));

  // 1. Hard budget ceiling filter for hotels
  let eligibleHotels = destData.hotels.filter(h => h.pricePerNightINR <= maxNightlyHotelBudget);
  if (eligibleHotels.length === 0) {
    // If user's budget is exceptionally tight, pick the lowest priced in catalog
    const sorted = [...destData.hotels].sort((a, b) => a.pricePerNightINR - b.pricePerNightINR);
    eligibleHotels = [sorted[0]];
  }

  // 2. Filter activities by suitability (kids/seniors) and budget ceiling
  const maxDailyActivityBudget = Math.floor((prefs.totalBudgetINR * 0.45) / Math.max(1, prefs.durationDays));
  const maxSingleSlotCost = Math.max(800, Math.floor(maxDailyActivityBudget / 2.5));

  let eligibleActivities = destData.activities.filter(a => {
    if (prefs.travellerComposition.hasKids && !a.suitability.kids) return false;
    if (prefs.travellerComposition.hasSeniors && !a.suitability.seniors) return false;
    if (a.costINR > maxSingleSlotCost * 1.5) return false;
    return true;
  });

  if (eligibleActivities.length < 3) {
    // Fallback if suitability filter was too restrictive
    eligibleActivities = destData.activities;
  }

  return {
    hotels: eligibleHotels,
    morningActivities: eligibleActivities.filter(a => a.slot === 'morning'),
    afternoonActivities: eligibleActivities.filter(a => a.slot === 'afternoon'),
    eveningActivities: eligibleActivities.filter(a => a.slot === 'evening')
  };
}

export function calculateBiasMetrics(days: DayPlan[]) {
  let totalItems = 0;
  let offbeatItems = 0;
  let heavyReviewedItems = 0;

  days.forEach(d => {
    // hotel
    totalItems++;
    if (d.hotel.isOffbeat) offbeatItems++;
    if (d.hotel.reviewCount > 2500) heavyReviewedItems++;

    // 3 activities
    [d.morning, d.afternoon, d.evening].forEach(act => {
      totalItems++;
      if (act.isOffbeat) offbeatItems++;
      if (act.reviewCount > 2500) heavyReviewedItems++;
    });
  });

  const offbeatPercentage = totalItems > 0 ? Math.round((offbeatItems / totalItems) * 100) : 0;
  const heavyReviewedPercentage = totalItems > 0 ? Math.round((heavyReviewedItems / totalItems) * 100) : 0;

  return { offbeatPercentage, heavyReviewedPercentage };
}
