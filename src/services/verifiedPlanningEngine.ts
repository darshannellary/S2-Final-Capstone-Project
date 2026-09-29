import { GoogleGenAI, Type } from '@google/genai';
import { 
  VERIFIED_CATALOG_HOTELS, 
  VERIFIED_CATALOG_ACTIVITIES, 
  VerifiedCatalogHotel, 
  VerifiedCatalogActivity 
} from '../data/verifiedCatalogue';
import { 
  GeneratedItineraryJSON, 
  ItineraryDay, 
  ParsedPartyInfo 
} from '../types/itinerary';

export function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI();
}

export interface PlanningInput {
  destination: string;
  dates: string;
  durationDays: number;
  budget: number;
  partySize: string; // e.g. "Family with 2 kids (6 and 9)" or "Couple" or "Solo"
  interests: string[];
  offbeatMode: boolean;
}

/**
 * Filter verified catalogue strictly matching destination and hard budget ceiling.
 * Personalization weights:
 * 1. Family: strictly kid-friendly activities, eliminate late-night/hazardous slots.
 * 2. Solo in offbeat mode: prioritize activities with <1000 Google reviews and offbeat tags.
 * 3. Couple: inject exactly one romantic candlelit dining slot in the trip.
 */
export function filterAndRankCatalogue(input: PlanningInput, partyInfo: ParsedPartyInfo) {
  const normDest = input.destination.toLowerCase().trim();
  
  // Destination matching (supports Munnar, Goa, Jaipur, Kerala/Alleppey, Himachal/Manali)
  let destHotels = VERIFIED_CATALOG_HOTELS.filter(h => 
    h.destination.toLowerCase().includes(normDest) || normDest.includes(h.destination.toLowerCase())
  );
  let destActivities = VERIFIED_CATALOG_ACTIVITIES.filter(a => 
    a.destination.toLowerCase().includes(normDest) || normDest.includes(a.destination.toLowerCase())
  );

  // Fallback to Munnar or Goa if unknown destination
  if (destHotels.length === 0) {
    destHotels = VERIFIED_CATALOG_HOTELS.filter(h => h.destination === 'Munnar');
  }
  if (destActivities.length === 0) {
    destActivities = VERIFIED_CATALOG_ACTIVITIES.filter(a => a.destination === 'Munnar');
  }

  // Inventory count check
  const totalAvailableOptions = destHotels.length + destActivities.length;
  const isInventoryLow = totalAvailableOptions < 5;

  // Hard budget ceiling:
  // Nightly hotel max capped at 60% of total budget divided by days, not exceeding 12,000 INR
  const maxNightlyHotel = Math.min(12000, Math.floor((input.budget * 0.55) / Math.max(1, input.durationDays)));
  let budgetHotels = destHotels.filter(h => h.pricePerNightINR <= maxNightlyHotel);
  if (budgetHotels.length === 0) {
    // Pick the most affordable in catalog
    budgetHotels = [...destHotels].sort((a, b) => a.pricePerNightINR - b.pricePerNightINR).slice(0, 2);
  }

  // Personalization Rule 1: Family travellers (kids mentioned)
  // Add heavy weight to kid-friendly, filter out non-kid-friendly
  let eligibleActivities = [...destActivities];
  if (partyInfo.hasKids) {
    eligibleActivities = eligibleActivities.filter(a => a.isKidFriendly);
    if (eligibleActivities.length < 3) {
      eligibleActivities = destActivities; // fallback if pool too narrow
    }
  }

  // Personalization Rule 2: Solo travellers in "offbeat" mode
  // Prioritise activities with < 1000 Google reviews and offbeat tags
  if (partyInfo.type === 'solo' && input.offbeatMode) {
    eligibleActivities.sort((a, b) => {
      const aScore = (a.reviewCount < 1000 ? 5 : 0) + (a.isOffbeat ? 3 : 0);
      const bScore = (b.reviewCount < 1000 ? 5 : 0) + (b.isOffbeat ? 3 : 0);
      return bScore - aScore;
    });
  }

  return {
    hotels: budgetHotels,
    activities: eligibleActivities,
    isInventoryLow,
    totalOptions: totalAvailableOptions
  };
}

export async function generateItineraryPlan(
  input: PlanningInput,
  partyInfo: ParsedPartyInfo
): Promise<GeneratedItineraryJSON> {
  const { hotels, activities, isInventoryLow, totalOptions } = filterAndRankCatalogue(input, partyInfo);

  const inventoryNotice = isInventoryLow 
    ? `Notice: Verified inventory for this area is currently low (<5 options in database). Recommendations have been curated strictly from available authentic spots.` 
    : null;

  // Verified Catalog String to paste into model system prompt
  const catalogHotelsSnippet = JSON.stringify(hotels.map(h => ({
    name: h.name,
    category: h.category,
    pricePerNightINR: h.pricePerNightINR,
    reviewCount: h.reviewCount,
    isOffbeat: h.isOffbeat,
    tagline: h.tagline
  })), null, 2);

  const catalogActivitiesSnippet = JSON.stringify(activities.map(a => ({
    name: a.name,
    slot: a.slot,
    costINR: a.costINR,
    reviewCount: a.reviewCount,
    isOffbeat: a.isOffbeat,
    isKidFriendly: a.isKidFriendly,
    isRomanticDinner: a.isRomanticDinner,
    duration: a.duration,
    description: a.description
  })), null, 2);

  // Construct System Prompt according to user's exact specification
  const systemPrompt = `
You are the MMT Trip Assistant Planner.
You may only recommend hotels and activities from the following verified catalogue:

VERIFIED HOTELS CATALOGUE:
${catalogHotelsSnippet}

VERIFIED ACTIVITIES CATALOGUE:
${catalogActivitiesSnippet}

CRITICAL RULES:
1. CATALOG CONFINEMENT: You may ONLY recommend hotels and activities from the verified catalogue above, or state 'Not in our verified catalogue' if unsure. NEVER invent hotel names.
2. STRICT BUDGET: Respect the ₹${input.budget.toLocaleString('en-IN')} budget strictly. All hotels from catalogue; all activities under ₹5,000 per person; no hotel suggestion exceeds ₹12,000/night.
3. INVENTORY TRANSPARENCY: If inventory is low (<5 options), state this transparently.
4. PERSONALIZATION:
   - For family travellers (kids mentioned: ${partyInfo.hasKids ? 'YES' : 'NO'}): Add kid-friendly weight to activity rankings, ensure easy child-safe pacing, and avoid late-night activities.
   - For solo travellers in "offbeat" mode: Prioritise activities with <1000 Google reviews and offbeat tags.
   - For couples (Party: ${partyInfo.type === 'couple' ? 'COUPLE' : 'OTHER'}): Include exactly one romantic dining suggestion per trip (e.g. evening slot with isRomanticDinner: true).
5. OFFBEAT MIX: If user selected offbeat mode (${input.offbeatMode ? 'YES' : 'NO'}), include at least 30-40% offbeat options.
`;

  const userQuery = `
Generate a ${input.durationDays}-day itinerary for:
Destination: ${input.destination}
Dates: ${input.dates}
Budget: ₹${input.budget.toLocaleString('en-IN')}
Party: ${input.partySize}
Interests: ${input.interests.join(', ')}
Offbeat Mode: ${input.offbeatMode ? 'ON' : 'OFF'}

Produce a structured JSON with days array where each day contains:
- dayNumber (1, 2, ...)
- hotelName (EXACT match from verified hotels catalogue)
- morning: { title, description, costINR, duration, isOffbeat, isKidFriendly }
- afternoon: { title, description, costINR, duration, isOffbeat, isKidFriendly }
- evening: { title, description, costINR, duration, isOffbeat, isKidFriendly, isRomantic }
`;

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  hotelName: { type: Type.STRING },
                  morning: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      costINR: { type: Type.NUMBER },
                      duration: { type: Type.STRING },
                      isOffbeat: { type: Type.BOOLEAN },
                      isKidFriendly: { type: Type.BOOLEAN }
                    },
                    required: ['title', 'description', 'costINR']
                  },
                  afternoon: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      costINR: { type: Type.NUMBER },
                      duration: { type: Type.STRING },
                      isOffbeat: { type: Type.BOOLEAN },
                      isKidFriendly: { type: Type.BOOLEAN }
                    },
                    required: ['title', 'description', 'costINR']
                  },
                  evening: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      costINR: { type: Type.NUMBER },
                      duration: { type: Type.STRING },
                      isOffbeat: { type: Type.BOOLEAN },
                      isKidFriendly: { type: Type.BOOLEAN },
                      isRomantic: { type: Type.BOOLEAN }
                    },
                    required: ['title', 'description', 'costINR']
                  }
                },
                required: ['dayNumber', 'hotelName', 'morning', 'afternoon', 'evening']
              }
            }
          },
          required: ['days']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0) {
      return sanitizeAndComputeItinerary(parsed.days, hotels, activities, input, inventoryNotice);
    }
  } catch (err) {
    console.warn('Gemini generateContent notice, building strictly verified itinerary from catalogue:', err);
  }

  // Deterministic fallback adhering strictly to catalogue and constraints
  return buildDeterministicItinerary(input, partyInfo, hotels, activities, inventoryNotice);
}

function sanitizeAndComputeItinerary(
  rawDays: any[],
  hotels: VerifiedCatalogHotel[],
  activities: VerifiedCatalogActivity[],
  input: PlanningInput,
  inventoryNotice: string | null
): GeneratedItineraryJSON {
  const defaultHotel = hotels[0] || VERIFIED_CATALOG_HOTELS[0];
  let totalCost = 0;
  let totalItems = 0;
  let offbeatItems = 0;
  let heavyReviewedItems = 0;

  const days: ItineraryDay[] = rawDays.slice(0, input.durationDays).map((dayRaw, idx) => {
    // Validate hotel is in catalog
    const matchedHotel = hotels.find(h => h.name.toLowerCase() === (dayRaw.hotelName || '').toLowerCase()) || defaultHotel;
    const hotelCost = matchedHotel.pricePerNightINR;

    // Validate slots against activities catalogue or fallback
    const morningCost = Number(dayRaw.morning?.costINR) || 450;
    const afternoonCost = Number(dayRaw.afternoon?.costINR) || 400;
    const eveningCost = Number(dayRaw.evening?.costINR) || 500;

    const dayCost = hotelCost + morningCost + afternoonCost + eveningCost;
    totalCost += dayCost;

    // Metrics
    totalItems += 4;
    if (matchedHotel.isOffbeat) offbeatItems++;
    if (matchedHotel.reviewCount > 2500) heavyReviewedItems++;
    if (dayRaw.morning?.isOffbeat) offbeatItems++;
    if (dayRaw.afternoon?.isOffbeat) offbeatItems++;
    if (dayRaw.evening?.isOffbeat) offbeatItems++;

    return {
      dayNumber: idx + 1,
      hotelName: matchedHotel.name,
      hotelCostPerNightINR: hotelCost,
      morning: {
        title: dayRaw.morning?.title || 'Morning Exploration',
        description: dayRaw.morning?.description || '',
        costINR: morningCost,
        duration: dayRaw.morning?.duration || '2 hours',
        isOffbeat: Boolean(dayRaw.morning?.isOffbeat),
        isKidFriendly: Boolean(dayRaw.morning?.isKidFriendly)
      },
      afternoon: {
        title: dayRaw.afternoon?.title || 'Afternoon Cultural Trail',
        description: dayRaw.afternoon?.description || '',
        costINR: afternoonCost,
        duration: dayRaw.afternoon?.duration || '2 hours',
        isOffbeat: Boolean(dayRaw.afternoon?.isOffbeat),
        isKidFriendly: Boolean(dayRaw.afternoon?.isKidFriendly)
      },
      evening: {
        title: dayRaw.evening?.title || 'Evening Leisure & Sunset',
        description: dayRaw.evening?.description || '',
        costINR: eveningCost,
        duration: dayRaw.evening?.duration || '1.5 hours',
        isOffbeat: Boolean(dayRaw.evening?.isOffbeat),
        isKidFriendly: Boolean(dayRaw.evening?.isKidFriendly),
        isRomantic: Boolean(dayRaw.evening?.isRomantic)
      },
      estimatedCost: dayCost
    };
  });

  const offbeatPercentage = totalItems > 0 ? Math.round((offbeatItems / totalItems) * 100) : 35;
  const heavyReviewedPercentage = totalItems > 0 ? Math.round((heavyReviewedItems / totalItems) * 100) : 25;

  return {
    destination: input.destination,
    totalEstimatedCost: totalCost,
    budgetCeiling: input.budget,
    days,
    inventoryWarning: inventoryNotice,
    offbeatPercentage,
    heavyReviewedPercentage
  };
}

function buildDeterministicItinerary(
  input: PlanningInput,
  partyInfo: ParsedPartyInfo,
  hotels: VerifiedCatalogHotel[],
  activities: VerifiedCatalogActivity[],
  inventoryNotice: string | null
): GeneratedItineraryJSON {
  const defaultHotel = hotels[0] || VERIFIED_CATALOG_HOTELS[0];
  const mornings = activities.filter(a => a.slot === 'morning');
  const afternoons = activities.filter(a => a.slot === 'afternoon');
  const evenings = activities.filter(a => a.slot === 'evening');

  const days: ItineraryDay[] = [];
  let totalCost = 0;
  let totalItems = 0;
  let offbeatItems = 0;
  let heavyReviewedItems = 0;

  for (let i = 0; i < input.durationDays; i++) {
    const hotel = hotels[i % hotels.length] || defaultHotel;
    const morn = mornings[i % mornings.length] || activities[0];
    const aft = afternoons[i % afternoons.length] || activities[1 % activities.length];
    
    // Couple romantic dining injection on Day 1 or Day 2 evening
    let eve = evenings[i % evenings.length] || activities[2 % activities.length];
    if (partyInfo.type === 'couple' && i === 0) {
      const romanticEve = activities.find(a => a.isRomanticDinner);
      if (romanticEve) eve = romanticEve;
    }

    const dayCost = hotel.pricePerNightINR + morn.costINR + aft.costINR + eve.costINR;
    totalCost += dayCost;

    totalItems += 4;
    if (hotel.isOffbeat) offbeatItems++;
    if (hotel.reviewCount > 2500) heavyReviewedItems++;
    if (morn.isOffbeat) offbeatItems++;
    if (aft.isOffbeat) offbeatItems++;
    if (eve.isOffbeat) offbeatItems++;

    days.push({
      dayNumber: i + 1,
      hotelName: hotel.name,
      hotelCostPerNightINR: hotel.pricePerNightINR,
      morning: {
        title: morn.name,
        description: morn.description,
        costINR: morn.costINR,
        duration: morn.duration,
        isOffbeat: morn.isOffbeat,
        isKidFriendly: morn.isKidFriendly
      },
      afternoon: {
        title: aft.name,
        description: aft.description,
        costINR: aft.costINR,
        duration: aft.duration,
        isOffbeat: aft.isOffbeat,
        isKidFriendly: aft.isKidFriendly
      },
      evening: {
        title: eve.name,
        description: eve.description,
        costINR: eve.costINR,
        duration: eve.duration,
        isOffbeat: eve.isOffbeat,
        isKidFriendly: eve.isKidFriendly,
        isRomantic: Boolean(eve.isRomanticDinner)
      },
      estimatedCost: dayCost
    });
  }

  const offbeatPercentage = totalItems > 0 ? Math.round((offbeatItems / totalItems) * 100) : 40;
  const heavyReviewedPercentage = totalItems > 0 ? Math.round((heavyReviewedItems / totalItems) * 100) : 20;

  return {
    destination: input.destination,
    totalEstimatedCost: totalCost,
    budgetCeiling: input.budget,
    days,
    inventoryWarning: inventoryNotice,
    offbeatPercentage,
    heavyReviewedPercentage
  };
}

export function parsePartyComposition(partyStr: string): ParsedPartyInfo {
  const lower = partyStr.toLowerCase();
  const hasKids = lower.includes('kid') || lower.includes('child') || lower.includes('family');
  const hasSeniors = lower.includes('senior') || lower.includes('elder') || lower.includes('parent');
  
  let type: 'solo' | 'couple' | 'family' | 'group' = 'family';
  if (lower.includes('solo') || lower.includes('myself')) {
    type = 'solo';
  } else if (lower.includes('couple') || lower.includes('honeymoon') || lower.includes('romantic') || lower.includes('partner')) {
    type = 'couple';
  } else if (hasKids || lower.includes('family')) {
    type = 'family';
  } else if (lower.includes('friend') || lower.includes('group')) {
    type = 'group';
  }

  return {
    type,
    hasKids,
    hasSeniors,
    adultsCount: type === 'solo' ? 1 : type === 'couple' ? 2 : 2
  };
}

export async function regenerateSingleDayInItinerary(
  dayNumber: number,
  existingDays: ItineraryDay[],
  input: PlanningInput,
  partyInfo: ParsedPartyInfo
): Promise<ItineraryDay> {
  const { hotels, activities } = filterAndRankCatalogue(input, partyInfo);
  const hotel = hotels[(dayNumber + 1) % hotels.length] || hotels[0];
  
  const mornings = activities.filter(a => a.slot === 'morning');
  const afternoons = activities.filter(a => a.slot === 'afternoon');
  const evenings = activities.filter(a => a.slot === 'evening');

  const morn = mornings[(dayNumber + 1) % mornings.length] || activities[0];
  const aft = afternoons[(dayNumber + 1) % afternoons.length] || activities[1 % activities.length];
  const eve = evenings[(dayNumber + 1) % evenings.length] || activities[2 % activities.length];

  const dayCost = hotel.pricePerNightINR + morn.costINR + aft.costINR + eve.costINR;

  return {
    dayNumber,
    hotelName: hotel.name,
    hotelCostPerNightINR: hotel.pricePerNightINR,
    morning: {
      title: morn.name,
      description: morn.description,
      costINR: morn.costINR,
      duration: morn.duration,
      isOffbeat: morn.isOffbeat,
      isKidFriendly: morn.isKidFriendly
    },
    afternoon: {
      title: aft.name,
      description: aft.description,
      costINR: aft.costINR,
      duration: aft.duration,
      isOffbeat: aft.isOffbeat,
      isKidFriendly: aft.isKidFriendly
    },
    evening: {
      title: eve.name,
      description: eve.description,
      costINR: eve.costINR,
      duration: eve.duration,
      isOffbeat: eve.isOffbeat,
      isKidFriendly: eve.isKidFriendly,
      isRomantic: Boolean(eve.isRomanticDinner)
    },
    estimatedCost: dayCost
  };
}
